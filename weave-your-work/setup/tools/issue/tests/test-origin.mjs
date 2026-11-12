import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { parseRepository, repositoryFromOrigin } from '../origin.mjs'

function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'issue-origin-'))
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  execFileSync('git', ['init', '--quiet'], { cwd: dir })
  return dir
}

test('parses the GitHub remote forms the setup accepts', () => {
  for (const remote of [
    'git@github.com:owner/repo.git',
    'ssh://git@github.com/owner/repo.git',
    'https://github.com/owner/repo.git',
    'https://github.com/owner/repo/',
  ]) {
    assert.equal(parseRepository(remote), 'owner/repo')
  }
})

test('rejects a non-GitHub or ambiguous remote', () => {
  assert.throws(() => parseRepository('https://gitlab.com/owner/repo.git'), /github\.com/)
  assert.throws(() => parseRepository('git@github.com:owner/repo/extra.git'), /github\.com/)
})

test('reads exactly one origin from the checkout', (t) => {
  const root = fixture(t)
  execFileSync('git', ['remote', 'add', 'origin', 'git@github.com:owner/repo.git'], { cwd: root })
  assert.equal(repositoryFromOrigin(root), 'owner/repo')
})

test('stops when origin is missing or duplicated', (t) => {
  const root = fixture(t)
  assert.throws(() => repositoryFromOrigin(root), /origin cannot be read/)
  execFileSync('git', ['remote', 'add', 'origin', 'git@github.com:owner/repo.git'], { cwd: root })
  execFileSync('git', ['remote', 'set-url', '--add', 'origin', 'git@github.com:owner/other.git'], { cwd: root })
  assert.throws(() => repositoryFromOrigin(root), /exactly one fetch URL/)
})
