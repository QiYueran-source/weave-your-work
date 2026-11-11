'use strict'

const assert = require('node:assert/strict')
const { execFileSync, spawnSync } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { test } = require('node:test')
const { resolveProjectRoot } = require('./project-root.cjs')

const cli = path.join(__dirname, 'project-root-cli.cjs')
const gitEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_')))

function git(cwd, ...args) {
  return execFileSync('git', args, { cwd, env: gitEnv, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
}

function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'work-weave-root-'))
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  return dir
}

function markers(root) {
  fs.mkdirSync(path.join(root, '.work-weave'))
  fs.mkdirSync(path.join(root, '.waymark'))
  fs.writeFileSync(path.join(root, '.waymark', 'config.toml'), '')
}

function project(root) {
  fs.mkdirSync(root, { recursive: true })
  git(root, 'init', '-q')
  markers(root)
}

function runCli(cwd, ...args) {
  return spawnSync(process.execPath, [cli, ...args], { cwd, encoding: 'utf8' })
}

test('discovers the root from itself and a subdirectory', t => {
  const root = fixture(t)
  project(root)
  const child = path.join(root, 'a', 'b')
  fs.mkdirSync(child, { recursive: true })
  assert.equal(resolveProjectRoot({ cwd: root }), fs.realpathSync(root))
  assert.equal(resolveProjectRoot({ cwd: child }), fs.realpathSync(root))
  assert.equal(resolveProjectRoot({ project: root, cwd: child }), fs.realpathSync(root))
})

test('chooses the closest marker and does not fall back if it is invalid', t => {
  const root = fixture(t)
  project(root)
  const nested = path.join(root, 'nested')
  project(nested)
  const child = path.join(nested, 'child')
  fs.mkdirSync(child)
  assert.equal(resolveProjectRoot({ cwd: child }), fs.realpathSync(nested))
  fs.rmSync(path.join(nested, '.waymark', 'config.toml'))
  assert.throws(() => resolveProjectRoot({ cwd: child }), /config\.toml/)
})

test('rejects missing or invalid local markers and invalid input', t => {
  const root = fixture(t)
  assert.throws(() => resolveProjectRoot({ cwd: root }), /\.work-weave/)
  project(root)
  fs.rmSync(path.join(root, '.work-weave'), { recursive: true })
  fs.writeFileSync(path.join(root, '.work-weave'), '')
  assert.throws(() => resolveProjectRoot({ cwd: root }), /\.work-weave/)
  fs.rmSync(path.join(root, '.work-weave'))
  fs.mkdirSync(path.join(root, '.work-weave'))
  fs.rmSync(path.join(root, '.waymark', 'config.toml'))
  fs.mkdirSync(path.join(root, '.waymark', 'config.toml'))
  assert.throws(() => resolveProjectRoot({ cwd: root }), /config\.toml/)
  assert.throws(() => resolveProjectRoot({ project: '' }), /project/i)
  assert.throws(() => resolveProjectRoot({ project: path.join(root, 'missing') }), /project|directory/i)
})

test('explicit paths never search upward, including relative paths', t => {
  const root = fixture(t)
  project(root)
  const child = path.join(root, 'child')
  fs.mkdirSync(child)
  assert.throws(() => resolveProjectRoot({ project: child }), /\.work-weave/)
  assert.throws(() => resolveProjectRoot({ project: 'child', cwd: root }), /\.work-weave/)
  assert.equal(resolveProjectRoot({ project: '.', cwd: root }), fs.realpathSync(root))
})

test('does not use an enclosing Git repository or Waymark configuration', t => {
  const root = fixture(t)
  project(root)
  const nested = path.join(root, 'nested')
  fs.mkdirSync(nested)
  fs.mkdirSync(path.join(nested, '.work-weave'))
  assert.throws(() => resolveProjectRoot({ cwd: nested }), /\.waymark|config\.toml/)
  fs.mkdirSync(path.join(nested, '.waymark'))
  fs.writeFileSync(path.join(nested, '.waymark', 'config.toml'), '')
  assert.throws(() => resolveProjectRoot({ cwd: nested }), /git/i)
  fs.writeFileSync(path.join(nested, '.git'), 'gitdir: missing\n')
  assert.throws(() => resolveProjectRoot({ cwd: nested }), /git/i)
})

test('accepts a linked Git worktree and compares physical paths', t => {
  const dir = fixture(t)
  const main = path.join(dir, 'main')
  project(main)
  git(main, '-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '--allow-empty', '-qm', 'initial')
  const worktree = path.join(dir, 'worktree')
  git(main, 'worktree', 'add', '-q', '-b', 'test-worktree', worktree)
  assert.ok(fs.statSync(path.join(worktree, '.git')).isFile())
  markers(worktree)
  assert.equal(resolveProjectRoot({ project: worktree }), fs.realpathSync(worktree))
  const alias = path.join(dir, 'alias')
  fs.symlinkSync(worktree, alias, process.platform === 'win32' ? 'junction' : 'dir')
  assert.equal(resolveProjectRoot({ project: alias }), fs.realpathSync(worktree))
  assert.equal(resolveProjectRoot({ cwd: alias }), fs.realpathSync(worktree))
})

test('CLI prints only the root on success and reports errors on stderr', t => {
  const root = fixture(t)
  project(root)
  const child = path.join(root, 'child')
  fs.mkdirSync(child)
  for (const args of [[], ['--project', root], ['--project', '.']]) {
    const result = runCli(args.length && args[1] === '.' ? root : child, ...args)
    assert.equal(result.status, 0, result.stderr)
    assert.equal(result.stdout, `${fs.realpathSync(root)}\n`)
    assert.equal(result.stderr, '')
  }
  for (const args of [['--project', child], ['--project'], ['--project', ''], ['--unknown'], ['--project', root, 'extra']]) {
    const result = runCli(root, ...args)
    assert.notEqual(result.status, 0, JSON.stringify(args))
    assert.equal(result.stdout, '')
    assert.notEqual(result.stderr.trim(), '')
  }
})

test('rejects a bare repository even with all markers', t => {
  const dir = fixture(t)
  const root = path.join(dir, 'bare')
  git(dir, 'init', '--bare', '-q', root)
  markers(root)
  fs.writeFileSync(path.join(root, '.git'), 'gitdir: .\n')
  assert.throws(() => resolveProjectRoot({ project: root }), /git/i)
})

test('invalid closest file and dangling symlink markers never fall back', t => {
  const root = fixture(t)
  project(root)
  const child = path.join(root, 'nested')
  fs.mkdirSync(child)
  const marker = path.join(child, '.work-weave')
  fs.writeFileSync(marker, '')
  assert.throws(() => resolveProjectRoot({ cwd: child }), /\.work-weave/)
  fs.rmSync(marker)
  fs.symlinkSync(path.join(child, 'missing'), marker, process.platform === 'win32' ? 'junction' : 'dir')
  assert.throws(() => resolveProjectRoot({ cwd: child }), /\.work-weave/)
})

test('rejects markers that resolve outside the selected project', t => {
  const dir = fixture(t)
  const outer = path.join(dir, 'outer')
  project(outer)
  for (const marker of ['.waymark', '.work-weave', 'config.toml']) {
    const root = path.join(outer, `inner-${marker.replace('.', '')}`)
    fs.mkdirSync(root)
    git(root, 'init', '-q')
    if (marker !== '.work-weave') fs.mkdirSync(path.join(root, '.work-weave'))
    if (marker !== '.waymark') fs.mkdirSync(path.join(root, '.waymark'))
    if (marker === '.waymark') {
      fs.symlinkSync(path.join(outer, '.waymark'), path.join(root, '.waymark'), process.platform === 'win32' ? 'junction' : 'dir')
    } else if (marker === '.work-weave') {
      fs.writeFileSync(path.join(root, '.waymark', 'config.toml'), '')
      fs.symlinkSync(path.join(outer, '.work-weave'), path.join(root, '.work-weave'), process.platform === 'win32' ? 'junction' : 'dir')
    } else {
      if (process.platform === 'win32') continue // File symlinks require privileges on Windows.
      fs.symlinkSync(path.join(outer, '.waymark', 'config.toml'), path.join(root, '.waymark', 'config.toml'))
    }
    assert.throws(() => resolveProjectRoot({ project: root }), /project|marker/i)
  }
})

test('rejects overlapping project marker directories', t => {
  const dir = fixture(t)
  for (const target of ['same', 'nested', 'git']) {
    const root = path.join(dir, target)
    fs.mkdirSync(root)
    git(root, 'init', '-q')
    fs.mkdirSync(path.join(root, '.waymark'))
    fs.writeFileSync(path.join(root, '.waymark', 'config.toml'), '')
    let targetPath
    if (target === 'same') targetPath = path.join(root, '.waymark')
    else if (target === 'nested') {
      targetPath = path.join(root, '.waymark', 'nested')
      fs.mkdirSync(targetPath)
    } else targetPath = path.join(root, '.git')
    fs.symlinkSync(targetPath, path.join(root, '.work-weave'), process.platform === 'win32' ? 'junction' : 'dir')
    assert.throws(() => resolveProjectRoot({ project: root }), /overlap/i)
  }
})

test('preserves spaces and non-ASCII characters in physical paths', t => {
  const dir = fixture(t)
  const root = path.join(dir, process.platform === 'win32' ? '项目 with space' : '项目 with space ')
  project(root)
  assert.equal(resolveProjectRoot({ project: root }), fs.realpathSync(root))
  const result = runCli(root)
  assert.equal(result.status, 0, result.stderr)
  assert.equal(result.stdout, `${fs.realpathSync(root)}\n`)
})

test('module and CLI work under a type=module parent', t => {
  const dir = fixture(t)
  const packageRoot = path.join(dir, 'host')
  const tools = path.join(packageRoot, 'tools')
  fs.mkdirSync(tools, { recursive: true })
  fs.writeFileSync(path.join(packageRoot, 'package.json'), '{"type":"module"}')
  for (const file of ['project-root.cjs', 'project-root-cli.cjs']) {
    fs.copyFileSync(path.join(__dirname, file), path.join(tools, file))
  }
  const root = path.join(dir, 'project')
  project(root)
  const cliResult = spawnSync(process.execPath, [path.join(tools, 'project-root-cli.cjs'), '--project', root], { encoding: 'utf8' })
  assert.equal(cliResult.status, 0, cliResult.stderr)
  assert.equal(cliResult.stdout, `${fs.realpathSync(root)}\n`)
  const moduleResult = spawnSync(process.execPath, ['-e',
    'process.stdout.write(require(process.argv[1]).resolveProjectRoot({ project: process.argv[2] }))',
    path.join(tools, 'project-root.cjs'), root], { encoding: 'utf8' })
  assert.equal(moduleResult.status, 0, moduleResult.stderr)
  assert.equal(moduleResult.stdout, fs.realpathSync(root))
})

test('Git environment variables cannot redirect validation', t => {
  const root = fixture(t)
  project(root)
  const other = path.join(root, 'other')
  fs.mkdirSync(other)
  const keys = ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_COMMON_DIR', 'GIT_CEILING_DIRECTORIES']
  const old = Object.fromEntries(keys.map(key => [key, process.env[key]]))
  process.env.GIT_DIR = path.join(other, 'missing')
  process.env.GIT_WORK_TREE = other
  process.env.GIT_COMMON_DIR = other
  process.env.GIT_CEILING_DIRECTORIES = root
  t.after(() => {
    for (const key of keys) {
      if (old[key] === undefined) delete process.env[key]
      else process.env[key] = old[key]
    }
  })
  assert.equal(resolveProjectRoot({ project: root }), fs.realpathSync(root))
  const result = runCli(root)
  assert.equal(result.status, 0, result.stderr)
  assert.equal(result.stdout, `${fs.realpathSync(root)}\n`)
})
