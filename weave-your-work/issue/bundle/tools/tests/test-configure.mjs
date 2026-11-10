import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import net from 'node:net'
import { once } from 'node:events'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const tools = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const configure = path.join(tools, 'configure.mjs')

function fixture(t, { remote = 'git@github.com:example/project.git', listener = true, name = 'project' } = {}) {
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), 'issue-configure-'))
  t.after(() => fs.rmSync(parent, { recursive: true, force: true }))
  const root = path.join(parent, name)
  fs.mkdirSync(root)
  spawnSync('git', ['init', '--quiet'], { cwd: root })
  if (remote) spawnSync('git', ['remote', 'add', 'origin', remote], { cwd: root })
  fs.mkdirSync(path.join(root, '.waymark'))
  fs.writeFileSync(path.join(root, '.waymark', 'config.toml'), 'schema = 1\n')
  fs.mkdirSync(path.join(root, '.work-weave'))
  if (listener) {
    fs.mkdirSync(path.join(root, '.work-weave/runtime/issue'), { recursive: true })
    fs.writeFileSync(path.join(root, '.work-weave/runtime/issue/listener.mjs'), '// fixture\n')
  }
  return root
}

function run(root, ...args) {
  return spawnSync(process.execPath, [configure, '--project', root, ...args], {
    cwd: root,
    encoding: 'utf8',
  })
}

function expectedUnit(root) {
  const hash = createHash('sha256').update(fs.realpathSync(root)).digest('hex').slice(0, 8)
  return path.join(root, '.work-weave/local', `work-weave-issue-${hash}.service`)
}

test('writes one settings file and one hashed unit per root', (t) => {
  const first = fixture(t)
  const second = fixture(t, { remote: 'https://github.com/example/other.git', name: 'other' })
  for (const root of [first, second]) {
    const result = run(root)
    assert.equal(result.status, 0, result.stderr)
    assert.ok(fs.existsSync(path.join(root, '.work-weave/local/issue-listener.env')))
    assert.ok(fs.existsSync(expectedUnit(root)))
    const unit = fs.readFileSync(expectedUnit(root), 'utf8')
    assert.match(unit, /WorkingDirectory=/)
    assert.match(unit, /EnvironmentFile=/)
    assert.match(unit, /ExecStart=/)
    assert.match(unit, /Restart=on-failure/)
  }
  assert.notEqual(expectedUnit(first), expectedUnit(second))
  assert.match(fs.readFileSync(path.join(first, '.work-weave/local/issue-listener.env'), 'utf8'), /example\/project/)
  assert.match(fs.readFileSync(path.join(second, '.work-weave/local/issue-listener.env'), 'utf8'), /example\/other/)
})

test('a second run reuses the port and reports unchanged files', (t) => {
  const root = fixture(t)
  assert.equal(run(root).status, 0)
  const before = fs.readFileSync(path.join(root, '.work-weave/local/issue-listener.env'), 'utf8')
  const result = run(root)
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /"envChanged": false/)
  assert.match(result.stdout, /"unitChanged": false/)
  assert.equal(fs.readFileSync(path.join(root, '.work-weave/local/issue-listener.env'), 'utf8'), before)
})

test('an occupied port stops before writing settings', async (t) => {
  const root = fixture(t)
  const server = net.createServer()
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const { port } = server.address()
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve))
  })
  const result = run(root, '--port', String(port))
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /occupied/)
  assert.equal(fs.existsSync(path.join(root, '.work-weave/local/issue-listener.env')), false)
  assert.equal(fs.existsSync(expectedUnit(root)), false)
})

test('a missing origin stops before writing', (t) => {
  const root = fixture(t, { remote: null })
  const result = run(root)
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /origin/)
  assert.equal(fs.existsSync(path.join(root, '.work-weave/local/issue-listener.env')), false)
})

test('a project path with spaces still verifies as a unit', (t) => {
  const root = fixture(t, { name: 'project with space' })
  const result = run(root)
  assert.equal(result.status, 0, result.stderr)
  const unit = fs.readFileSync(expectedUnit(root), 'utf8')
  assert.match(unit, /WorkingDirectory=.*\\x20/)
  const analysis = spawnSync('systemd-analyze', ['verify', expectedUnit(root)], { encoding: 'utf8' })
  if (analysis.error && analysis.error.code === 'ENOENT') {
    t.skip('systemd-analyze is not installed')
    return
  }
  assert.equal(analysis.status, 0, analysis.stderr)
})

test('a missing runtime stops before writing', (t) => {
  const root = fixture(t, { listener: false })
  const result = run(root)
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /install the project runtime first/)
})
