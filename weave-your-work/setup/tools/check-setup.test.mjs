import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { compareVersions, findSkillRoots, parseHandles } from './check-setup.mjs'

const cli = path.join(import.meta.dirname, 'check-setup.mjs')
const gitEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_')))

function git(cwd, ...args) {
  return execFileSync('git', args, { cwd, env: gitEnv, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
}

function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'work-weave-check-'))
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  return dir
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, content)
}

function skill(root, name) {
  write(path.join(root, '.agents', 'skills', name, 'SKILL.md'), `---\nname: ${name}\ndescription: "${name}"\n---\n`)
}

function project(t) {
  const root = fixture(t)
  git(root, 'init', '-q')
  git(root, 'config', 'user.name', 'Test User')
  git(root, 'config', 'user.email', 'test@example.test')
  for (const name of ['setup', 'waymark', 'map', 'task', 'glossary', 'issue']) skill(root, name)
  write(path.join(root, '.agents', 'skills', 'setup', 'rules', 'rules-demo.md'), '# Demo rule\n')
  write(path.join(root, '.agents', 'rules', 'rules-demo.md'), '# Demo rule\n')
  write(path.join(root, 'AGENTS.md'), '# Follow .agents/rules/*.md\n')
  write(path.join(root, '.gitignore'), 'node_modules/\n/GLOSSARY.md\n/ADR.md\n.work-weave/personal/\n')
  write(path.join(root, '.work-weave', '.gitignore'), 'personal/\n')
  write(path.join(root, '.waymark', 'config.toml'), 'version = "1.1"\nstorage_root = "tickets"\n')
  write(path.join(root, '.work-weave', 'shared', 'handles.toml'), '[handles]\nfrank = "someone"\n')
  git(root, 'add', '-A')
  git(root, 'commit', '-q', '-m', 'fixture')
  return root
}

test('compares version numbers as numbers', () => {
  assert.equal(compareVersions('22.20.0', '22.20.0'), 0)
  assert.equal(compareVersions('22.20.1', '22.20.0'), 1)
  assert.equal(compareVersions('22.9.0', '22.20.0'), -1)
  assert.equal(compareVersions('23.0.0', '22.20.0'), 1)
  assert.equal(compareVersions('22.20.0-rc.1', '22.20.0'), -1)
})

test('reads only the handles table', () => {
  const text = [
    '[handles]',
    'frank = "QiYueran-source"',
    '"front.end" = "x"',
    '# comment',
    'empty = "a#b"',
    '',
    '[other]',
    'ignored = "y"',
    '',
  ].join('\n')
  assert.deepEqual(parseHandles(text), ['frank', 'front.end', 'empty'])
  assert.deepEqual(parseHandles('[handles]\n'), [])
  assert.deepEqual(parseHandles('[handles]\nfrank = "x" # note\n'), ['frank'])
})

test('finds a skills root at any name and skips node_modules and .git', t => {
  const root = fixture(t)
  write(path.join(root, 'skills', 'setup', 'SKILL.md'), '')
  write(path.join(root, 'skills', 'task', 'SKILL.md'), '')
  write(path.join(root, 'node_modules', 'skills', 'ignored', 'SKILL.md'), '')
  write(path.join(root, '.git', 'skills', 'ignored', 'SKILL.md'), '')
  const roots = findSkillRoots(root)
  const found = roots.find(item => item.label === 'skills')
  assert.ok(found)
  assert.deepEqual(found.names, ['setup', 'task'])
  assert.ok(!roots.some(item => item.label.includes('node_modules')))
  assert.ok(!roots.some(item => item.label.includes('.git')))
})

test('all checks run on a configured fixture', t => {
  const root = project(t)
  const home = fixture(t)
  const result = spawnSync(process.execPath, [cli, '--all', '--json'], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, HOME: home, USERPROFILE: home },
  })
  assert.equal(result.status, 1, result.stderr)
  const payload = JSON.parse(result.stdout)
  assert.equal(payload.checks.length, 17)
  assert.ok(!payload.checks.some(check => /operator.*roster|roster.*operator/i.test(check.name)))
  const byNumber = new Map(payload.checks.map(check => [check.number, check]))
  for (const number of [1, 6, 7, 12, 13, 14, 18]) {
    assert.equal(byNumber.get(number).status, 'ok', `${number}: ${byNumber.get(number).message}`)
  }
  assert.match(byNumber.get(12).message, /missing: none/)
})

test('reads the glossary server from its personal path', t => {
  const root = project(t)
  write(path.join(root, '.work-weave', 'personal', 'glossary', 'server.js'), '')
  const home = fixture(t)
  const result = spawnSync(process.execPath, [cli, '--all', '--json'], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, HOME: home, USERPROFILE: home },
  })
  const payload = JSON.parse(result.stdout)
  const check = payload.checks.find(item => item.number === 16)
  assert.notEqual(check.status, 'not-applicable')
  assert.doesNotMatch(check.message, /missing from/, check.message)
})

test('reports a setup rule that differs from its copy', t => {
  const root = project(t)
  write(path.join(root, '.agents', 'rules', 'rules-demo.md'), '# Different rule\n')
  const home = fixture(t)
  const result = spawnSync(process.execPath, [cli, '--starred', '--json'], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, HOME: home, USERPROFILE: home },
  })
  const payload = JSON.parse(result.stdout)
  const check = payload.checks.find(item => item.number === 13)
  assert.equal(check.status, 'fail')
  assert.match(check.message, /rules-demo\.md/)
})

// Check 17 reads the service manager and GitHub. Both are faked on PATH: the
// fake `gh` answers the repository read, the hook listing, and the permission
// read that decides unverified, and the fake `systemctl` reports the fixture's
// unit active in the fixture. The hooks are the ones the check sees.
function fakeTools(t, root, hooks) {
  const bin = fixture(t)
  const listed = hooks.map(entry => JSON.stringify(entry)).join('\n')
  write(path.join(bin, 'gh.mjs'), [
    "import fs from 'node:fs'",
    'const args = process.argv.slice(2)',
    `const hooks = ${JSON.stringify(listed)}`,
    "if (args[0] === 'repo' && args[1] === 'view') { console.log('example/project'); process.exit(0) }",
    "if (args[0] === 'api' && (args[1] || '').endsWith('/hooks')) {",
    "  if (process.env.FAKE_HOOKS_FAIL) { process.stderr.write('gh: Not Found (HTTP 404)\\n'); process.exit(1) }",
    '  const from = process.env.FAKE_HOOKS_FILE ? fs.readFileSync(process.env.FAKE_HOOKS_FILE, "utf8") : hooks',
    '  process.stdout.write(from)',
    '  process.exit(0)',
    '}',
    "if (args[0] === 'api' && (args[3] || '').endsWith('.permissions.admin')) {",
    "  console.log(process.env.FAKE_ADMIN ?? 'true')",
    '  process.exit(0)',
    '}',
    "process.stderr.write('unexpected gh call: ' + JSON.stringify(args) + '\\n')",
    'process.exit(2)',
    '',
  ].join('\n'))
  write(path.join(bin, 'systemctl.mjs'), [
    'const args = process.argv.slice(2)',
    "if (args.includes('is-active')) { console.log('active'); process.exit(0) }",
    "if (args.includes('WorkingDirectory')) { console.log(process.env.FAKE_ROOT); process.exit(0) }",
    'process.exit(2)',
    '',
  ].join('\n'))
  if (process.platform === 'win32') {
    for (const name of ['gh', 'systemctl']) {
      write(path.join(bin, `${name}.cmd`), `@"${process.execPath}" "%~dp0${name}.mjs" %*\r\n`)
    }
  } else {
    for (const name of ['gh', 'systemctl']) {
      const file = path.join(bin, name)
      fs.writeFileSync(file, `#!/bin/sh\nexec "${process.execPath}" "${path.join(bin, `${name}.mjs`)}" "$@"\n`)
      fs.chmodSync(file, 0o755)
    }
  }
  write(path.join(root, '.work-weave', 'personal', 'work-weave-issue-0123abcd.service'), '[Service]\n')
  write(path.join(root, '.work-weave', 'personal', 'issue-listener.env'), 'SMEE_URL="https://smee.io/channel"\n')
  return bin
}

function runCheck17(t, hooks, extra = {}) {
  const root = project(t)
  git(root, 'remote', 'add', 'origin', 'git@github.com:example/project.git')
  const bin = fakeTools(t, root, hooks)
  const home = fixture(t)
  const search = [bin, process.env.PATH || ''].join(path.delimiter)
  const pathext = process.platform === 'win32' ? '.CMD;.EXE;.BAT' : undefined
  const result = spawnSync(process.execPath, [cli, '--all', '--json'], {
    cwd: root,
    encoding: 'utf8',
    env: {
      ...process.env,
      ...(pathext ? { PATHEXT: pathext } : {}),
      HOME: home,
      USERPROFILE: home,
      PATH: search,
      FAKE_ROOT: root,
      ...extra,
    },
  })
  const payload = JSON.parse(result.stdout)
  assert.equal(payload.checks.length, 17)
  return payload.checks.find(item => item.number === 17)
}

const channelHook = events => ({ id: 42, url: 'https://smee.io/channel', events })

test('check 17 asks for the pull request and push subscriptions', { skip: process.platform !== 'linux' }, t => {
  const check = runCheck17(t, [channelHook(['issues'])])
  assert.equal(check.status, 'fail', check.message)
  assert.match(check.message, /missing pull_request, push$/)
  assert.match(check.repair, /hooks\/<id> -X PATCH/)
  assert.match(check.repair, /-F 'events\[\]=pull_request'/)
  assert.match(check.repair, /do not create a second hook/)
})

test('check 17 names the one missing subscription', { skip: process.platform !== 'linux' }, t => {
  const check = runCheck17(t, [channelHook(['issues', 'pull_request'])])
  assert.equal(check.status, 'fail', check.message)
  assert.match(check.message, /missing push$/)
  assert.doesNotMatch(check.message, /pull_request/)
  assert.match(check.repair, /Add `push` to the existing hook/)
})

test('check 17 passes a hook that sends all three events', { skip: process.platform !== 'linux' }, t => {
  const check = runCheck17(t, [channelHook(['issues', 'pull_request', 'push'])])
  assert.equal(check.status, 'ok', check.message)
  assert.match(check.message, /issues, pull_request, push/)
})

test('check 17 still fails a hook on another channel', { skip: process.platform !== 'linux' }, t => {
  const check = runCheck17(t, [{ id: 42, url: 'https://smee.io/other', events: ['issues', 'pull_request', 'push'] }])
  assert.equal(check.status, 'fail', check.message)
  assert.match(check.message, /configured channel/)
})

test('check 17 reads one hook per line', { skip: process.platform !== 'linux' }, t => {
  const file = path.join(fixture(t), 'hooks.jsonl')
  write(file, [
    '{"id":41,"url":"https://smee.io/other","events":["issues","pull_request","push"]}',
    '{"id":42,"url":"https://smee.io/channel","events":["issues"]}',
    '',
  ].join('\n'))
  const check = runCheck17(t, [], { FAKE_HOOKS_FILE: file })
  assert.equal(check.status, 'fail', check.message)
  assert.match(check.message, /missing pull_request, push$/)
})

test('check 17 reads a hook whose events are out of order', { skip: process.platform !== 'linux' }, t => {
  const file = path.join(fixture(t), 'hooks.jsonl')
  write(file, '{"events":["push","issues","pull_request"],"url":"https://smee.io/channel/","id":42}\n')
  const check = runCheck17(t, [], { FAKE_HOOKS_FILE: file })
  assert.equal(check.status, 'ok', check.message)
})

test('check 17 cannot read a hooks listing it does not understand', { skip: process.platform !== 'linux' }, t => {
  const file = path.join(fixture(t), 'hooks.jsonl')
  write(file, '{"id":42,"url":"https://smee.io/channel","events":"issues"}\n')
  const check = runCheck17(t, [], { FAKE_HOOKS_FILE: file })
  assert.equal(check.status, 'fail', check.message)
  assert.match(check.message, /unexpected hooks output/)
})

test('check 17 stays unverified when the account cannot see webhooks', { skip: process.platform !== 'linux' }, t => {
  const check = runCheck17(t, [], { FAKE_HOOKS_FAIL: '1', FAKE_ADMIN: 'false' })
  assert.equal(check.status, 'unverified', check.message)
  assert.match(check.message, /cannot see webhooks/)
})

test('check 17 fails when the account may see webhooks and the read errors', { skip: process.platform !== 'linux' }, t => {
  const check = runCheck17(t, [], { FAKE_HOOKS_FAIL: '1' })
  assert.equal(check.status, 'fail', check.message)
  assert.match(check.message, /cannot read webhooks: gh: Not Found/)
})
