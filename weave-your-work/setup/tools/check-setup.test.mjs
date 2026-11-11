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
  write(path.join(root, '.gitignore'), 'node_modules/\n/GLOSSARY.md\n.work-weave/pending/\n')
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
  const byNumber = new Map(payload.checks.map(check => [check.number, check]))
  for (const number of [1, 6, 7, 12, 13, 14, 17]) {
    assert.equal(byNumber.get(number).status, 'ok', `${number}: ${byNumber.get(number).message}`)
  }
  assert.match(byNumber.get(12).message, /missing: none/)
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
