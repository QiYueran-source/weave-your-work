'use strict'

const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { test } = require('node:test')

const migration = path.join(__dirname, 'migrate-layout.cjs')

function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'work-weave-migrate-'))
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  return dir
}

function write(root, relative, content = `${relative}\n`) {
  const file = path.join(root, relative)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, content)
}

// A checkout written under the old internal layout, with one file in every
// directory the new shape moves.
function oldLayout(root) {
  write(root, '.work-weave/config/tracker.md')
  write(root, '.work-weave/issue/handles.toml', '[handles]\nfrank = "QiYueran-source"\n')
  write(root, '.work-weave/glossary/frank.jsonl')
  write(root, '.work-weave/glossary/_header.md')
  write(root, '.work-weave/adr/frank.jsonl')
  write(root, '.work-weave/local/issue-listener.env', 'REPOSITORY="example/project"\n')
  write(root, '.work-weave/local/work-weave-issue-abc12345.service', '[Service]\n')
  write(root, '.work-weave/runtime/issue/listener.mjs')
  write(root, '.work-weave/runtime/glossary/server.js')
  write(root, '.work-weave/runtime/adr/adr.js')
  write(root, '.work-weave/pending/pending-communications.md')
  write(root, '.work-weave/pending/.lock')
  write(root, '.work-weave/.gitignore', '# Checkout-local state.\npending/\nruntime/\nlocal/\n')
  return root
}

// A checkout already in the new shape, with one file in every directory.
function newLayout(root) {
  write(root, '.work-weave/shared/tracker.md')
  write(root, '.work-weave/shared/handles.toml')
  write(root, '.work-weave/shared/glossary/frank.jsonl')
  write(root, '.work-weave/shared/adr/frank.jsonl')
  write(root, '.work-weave/personal/issue/listener.mjs')
  write(root, '.work-weave/personal/adr/adr.js')
  write(root, '.work-weave/personal/issue-listener.env')
  write(root, '.work-weave/personal/work-weave-issue-abc12345.service')
  write(root, '.work-weave/personal/communication/pending-communications.md')
  write(root, '.work-weave/.gitignore', '# Personal state; `shared/` is committed.\npersonal/\n')
  return root
}

// Every file under dir, relative to dir, with its content.
function snapshot(dir) {
  const files = {}
  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name)
      if (entry.isDirectory()) walk(full)
      else files[path.relative(dir, full).split(path.sep).join('/')] = fs.readFileSync(full, 'utf8')
    }
  }
  if (fs.existsSync(dir)) walk(dir)
  return files
}

function run(root) {
  return spawnSync(process.execPath, [migration, root], { encoding: 'utf8' })
}

test('moves an old checkout into shared and personal', (t) => {
  const root = oldLayout(fixture(t))
  const before = snapshot(path.join(root, '.work-weave'))
  const result = run(root)
  assert.equal(result.status, 0, result.stderr)

  const weave = path.join(root, '.work-weave')
  for (const relative of [
    'shared/tracker.md',
    'shared/handles.toml',
    'shared/glossary/frank.jsonl',
    'shared/glossary/_header.md',
    'shared/adr/frank.jsonl',
    'personal/issue/listener.mjs',
    'personal/adr/adr.js',
    'personal/glossary/server.js',
    'personal/issue-listener.env',
    'personal/work-weave-issue-abc12345.service',
    'personal/communication/pending-communications.md',
    'personal/communication/.lock',
  ]) {
    assert.ok(fs.existsSync(path.join(weave, relative)), `missing ${relative}`)
  }
  for (const old of ['config', 'issue', 'glossary', 'adr', 'local', 'runtime', 'pending']) {
    assert.equal(fs.existsSync(path.join(weave, old)), false, `${old}/ should be gone`)
  }

  // Every new path holds the bytes of the file that was moved into it.
  const moved = snapshot(weave)
  const source = {
    'shared/tracker.md': 'config/tracker.md',
    'shared/handles.toml': 'issue/handles.toml',
    'shared/glossary/frank.jsonl': 'glossary/frank.jsonl',
    'shared/glossary/_header.md': 'glossary/_header.md',
    'shared/adr/frank.jsonl': 'adr/frank.jsonl',
    'personal/issue/listener.mjs': 'runtime/issue/listener.mjs',
    'personal/adr/adr.js': 'runtime/adr/adr.js',
    'personal/glossary/server.js': 'runtime/glossary/server.js',
    'personal/issue-listener.env': 'local/issue-listener.env',
    'personal/work-weave-issue-abc12345.service': 'local/work-weave-issue-abc12345.service',
    'personal/communication/pending-communications.md': 'pending/pending-communications.md',
    'personal/communication/.lock': 'pending/.lock',
  }
  for (const [to, from] of Object.entries(source)) {
    assert.equal(moved[to], before[from], `${to} should hold what ${from} held`)
  }

  // Nothing but the ignore file and the moved files is left behind.
  assert.deepEqual(Object.keys(moved).sort(), [...Object.keys(source), '.gitignore'].sort())
})

test('the ignore file names personal/ and nothing else', (t) => {
  const root = oldLayout(fixture(t))
  assert.equal(run(root).status, 0)
  const lines = fs.readFileSync(path.join(root, '.work-weave', '.gitignore'), 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
  assert.deepEqual(lines, ['personal/'])
})

test('the migration prints what it moved', (t) => {
  const root = oldLayout(fixture(t))
  const result = run(root)
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /\.work-weave\/config\/tracker\.md -> \.work-weave\/shared\/tracker\.md/)
  assert.match(result.stdout, /\.work-weave\/issue\/handles\.toml -> \.work-weave\/shared\/handles\.toml/)
  assert.match(result.stdout, /\.work-weave\/glossary\/ -> \.work-weave\/shared\/glossary\//)
  assert.match(result.stdout, /\.work-weave\/runtime\/issue\/ -> \.work-weave\/personal\/issue\//)
  assert.match(result.stdout, /\.work-weave\/pending\/ -> \.work-weave\/personal\/communication\//)
  assert.equal(result.stderr, '')
})

test('a destination that already exists stops it and names both paths', (t) => {
  const root = oldLayout(fixture(t))
  write(root, '.work-weave/shared/tracker.md', 'kept\n')
  const before = snapshot(path.join(root, '.work-weave'))
  const result = run(root)
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /\.work-weave\/config\/tracker\.md/)
  assert.match(result.stderr, /\.work-weave\/shared\/tracker\.md/)
  assert.deepEqual(snapshot(path.join(root, '.work-weave')), before, 'nothing should change')
})

test('a directory whose destination exists stops it before anything moves', (t) => {
  const root = oldLayout(fixture(t))
  write(root, '.work-weave/personal/communication/old-message.md', 'kept\n')
  const before = snapshot(path.join(root, '.work-weave'))
  const result = run(root)
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /\.work-weave\/pending/)
  assert.match(result.stderr, /\.work-weave\/personal\/communication/)
  assert.deepEqual(snapshot(path.join(root, '.work-weave')), before, 'nothing should change')
})

test('a checkout already in the new shape is left unchanged', (t) => {
  const root = newLayout(fixture(t))
  const before = snapshot(root)
  const result = run(root)
  assert.equal(result.status, 0, result.stderr)
  assert.deepEqual(snapshot(root), before)
  assert.match(result.stdout, /already/)
})

test('the new shape with the ignore file still naming the old directories loses only those lines', (t) => {
  const root = newLayout(fixture(t))
  write(root, '.work-weave/.gitignore', 'pending/\nruntime/\nlocal/\n')
  const result = run(root)
  assert.equal(result.status, 0, result.stderr)
  const lines = fs.readFileSync(path.join(root, '.work-weave', '.gitignore'), 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
  assert.deepEqual(lines, ['personal/'])
})

test('a second run is a no-op', (t) => {
  const root = oldLayout(fixture(t))
  assert.equal(run(root).status, 0)
  const moved = snapshot(root)
  const again = run(root)
  assert.equal(again.status, 0, again.stderr)
  assert.deepEqual(snapshot(root), moved)
})

test('an absent .work-weave is an error that names the path', (t) => {
  const root = fixture(t)
  const before = snapshot(root)
  const result = run(root)
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /\.work-weave/)
  assert.deepEqual(snapshot(root), before)
})

test('a checkout with neither old nor new directories gets the new directories', (t) => {
  const root = fixture(t)
  fs.mkdirSync(path.join(root, '.work-weave'))
  const result = run(root)
  assert.equal(result.status, 0, result.stderr)
  const weave = path.join(root, '.work-weave')
  assert.ok(fs.statSync(path.join(weave, 'shared')).isDirectory())
  assert.ok(fs.statSync(path.join(weave, 'personal')).isDirectory())
  const lines = fs.readFileSync(path.join(weave, '.gitignore'), 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
  assert.deepEqual(lines, ['personal/'])
})

test('rejects a bad command line and reports it on stderr', () => {
  for (const args of [['--project'], ['--project', '/tmp'], ['', 'extra']]) {
    const result = spawnSync(process.execPath, [migration, ...args], { encoding: 'utf8' })
    assert.notEqual(result.status, 0, JSON.stringify(args))
    assert.equal(result.stdout, '')
    assert.match(result.stderr, /Usage/)
  }
})

test('the project root defaults to the working directory', (t) => {
  const root = oldLayout(fixture(t))
  const result = spawnSync(process.execPath, [migration], { cwd: root, encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  assert.ok(fs.existsSync(path.join(root, '.work-weave/shared/tracker.md')))
})

test('an ignore comment naming several paths keeps the patterns it still describes', (t) => {
  const root = oldLayout(fixture(t))
  write(root, '.work-weave/.gitignore', 'node_modules/\n# The queue, the installed copies, and the local settings.\npending/\nruntime/\nlocal/\n/GLOSSARY.md\n')
  const result = run(root)
  assert.equal(result.status, 0, result.stderr)
  const text = fs.readFileSync(path.join(root, '.work-weave', '.gitignore'), 'utf8')
  assert.match(text, /node_modules\//)
  assert.match(text, /\/GLOSSARY\.md/)
  assert.match(text, /^personal\/$/m)
  assert.match(text, /The queue, the installed copies, and the local settings\./)
})

test('an ignore comment about one old directory goes with it', (t) => {
  const root = oldLayout(fixture(t))
  write(root, '.work-weave/.gitignore', '# Checkout settings and the unit live in local/.\nlocal/\n')
  const result = run(root)
  assert.equal(result.status, 0, result.stderr)
  const text = fs.readFileSync(path.join(root, '.work-weave', '.gitignore'), 'utf8')
  assert.doesNotMatch(text, /Checkout settings/)
  assert.match(text, /^personal\/$/m)
})
