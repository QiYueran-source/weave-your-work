import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { once } from 'node:events'
import { promises as fs } from 'node:fs'
import http from 'node:http'
import net from 'node:net'
import os from 'node:os'
import path from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const source = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const fallbackModules = path.resolve(source, '../../../../.work-weave/personal/issue/node_modules')

async function modulesDir() {
  try {
    await fs.access(path.join(source, 'node_modules'))
    return path.join(source, 'node_modules')
  } catch (error) {
    if (error.code === 'ENOENT') return fallbackModules
    throw error
  }
}

async function writeFiles(root, files) {
  for (const [name, content] of Object.entries(files)) {
    const file = path.join(root, name)
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(file, content)
  }
}

async function git(root, ...args) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' })
  assert.equal(result.status, 0, `git ${args.join(' ')}: ${result.stderr}`)
}

async function externalTools(t) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'issue-tools-'))
  t.after(async () => {
    assert.equal(path.dirname(dir), os.tmpdir())
    await fs.rm(dir, { recursive: true, force: true })
  })
  for (const name of ['listener.mjs', 'events.mjs', 'check-pending.mjs', 'queue.mjs', 'lock.mjs', 'project-root.cjs']) {
    await fs.copyFile(path.join(source, name), path.join(dir, name))
  }
  await fs.writeFile(path.join(dir, 'package.json'), '{ "type": "module" }\n')
  await fs.symlink(await modulesDir(), path.join(dir, 'node_modules'), 'dir')
  return dir
}

// Each fixture is a complete project root: markers, roster, settings, runtime,
// and a Git checkout. The listener and checker live under .work-weave/runtime,
// so a roster beside the tools can never be the one they read.
async function project(t, {
  owner = 'alice',
  handles = '[handles]\nalice = "alice-handle"\nbob = "bob-handle"\n',
  repository = 'example/project',
  pending = '.work-weave/personal/communication/pending.jsonl',
  settings = `REPOSITORY=${repository}\n`,
  remote = repository,
} = {}) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'issue-project-'))
  const children = new Set()
  t.after(async () => {
    for (const child of children) {
      if (child.exitCode === null && child.signalCode === null) {
        const exited = once(child, 'exit')
        child.kill()
        await exited
      }
    }
    assert.equal(path.dirname(root), os.tmpdir())
    assert.ok(path.basename(root).startsWith('issue-project-'))
    await fs.rm(root, { recursive: true, force: true })
  })
  const tools = path.join(root, '.work-weave/personal/issue')
  await fs.mkdir(tools, { recursive: true })
  for (const name of ['listener.mjs', 'events.mjs', 'check-pending.mjs', 'queue.mjs', 'lock.mjs', 'project-root.cjs']) {
    await fs.copyFile(path.join(source, name), path.join(tools, name))
  }
  await fs.writeFile(path.join(tools, 'package.json'), '{ "type": "module" }\n')
  await fs.symlink(await modulesDir(), path.join(tools, 'node_modules'), 'dir')
  const bin = path.join(root, 'bin')
  const issues = path.join(root, 'issues')
  await fs.mkdir(bin, { recursive: true })
  await fs.mkdir(issues, { recursive: true })
  // The fake `gh` answers the listing with an empty page and every single issue
  // read with the issue the event described, so an event queues exactly what it
  // says GitHub holds.
  await fs.writeFile(path.join(bin, 'gh'), `#!${process.execPath}
const fs = require('node:fs')
const path = require('node:path')
const args = process.argv.slice(2)
const target = args[5]
if (target === 'repos/' + process.env.FAKE_REPO + '/issues') process.stdout.write('[]')
else {
  const file = path.join(process.env.FAKE_ISSUES, target.split('/').pop() + '.json')
  if (!fs.existsSync(file)) { console.error('gh: Not Found (HTTP 404)'); process.exit(1) }
  process.stdout.write(fs.readFileSync(file))
}
`, { mode: 0o755 })
  await writeFiles(root, {
    '.waymark/config.toml': 'schema = 1\n',
    '.work-weave/shared/handles.toml': `${handles}${handles.endsWith('\n') ? '' : '\n'}${pending === null ? '' : `[pending]\npath = ${JSON.stringify(pending)}\n`}`,
  })
  if (settings !== undefined && settings !== null) {
    await writeFiles(root, { '.work-weave/personal/issue-listener.env': settings })
  }
  await git(root, 'init', '--quiet')
  await git(root, 'config', 'user.name', owner)
  if (remote) await git(root, 'remote', 'add', 'origin', `https://github.com/${remote}.git`)
  return {
    root,
    tools,
    bin,
    children,
    repository,
    issues,
    queue: path.resolve(root, pending ?? '.work-weave/personal/communication/pending.jsonl'),
    roster: path.join(root, '.work-weave/shared/handles.toml'),
  }
}

function environment(extra = {}) {
  const env = { ...process.env, SMEE_URL: '', FAKE_REPO: 'example/project', ...extra }
  if (!('REPOSITORY' in extra)) delete env.REPOSITORY
  if (!('WEBHOOK_SECRET' in extra)) delete env.WEBHOOK_SECRET
  return env
}

// Binding to port 0 and closing gives a number the kernel is free to hand to
// the next suite running at the same moment, so two listeners race for it. Each
// listener therefore retries on EADDRINUSE instead of failing the test.
async function freePort() {
  const server = net.createServer()
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const { port } = server.address()
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  return port
}
// A listener is a separate process, and a busy machine delays it. The wait is
// long so a slow machine is not read as a failure; a passing check returns at once.
async function waitFor(check, description, output = () => '') {
  const deadline = performance.now() + 60000
  while (performance.now() < deadline) {
    if (await check()) return
    await delay(20)
  }
  throw new Error(`Timed out waiting for ${description} after 60000ms: ${output()}`)
}

const PORT_IN_USE = /EADDRINUSE/

async function startListener(t, f, { cwd = f.root, args = [], env = {} } = {}) {
  for (let attempt = 0; attempt < 10; attempt++) {
    const port = await freePort()
    const child = spawn(process.execPath, [path.join(f.tools, 'listener.mjs'), ...args], {
      cwd,
      env: environment({
        PATH: `${f.bin}${path.delimiter}${process.env.PATH}`, PORT: String(port),
        FAKE_REPO: f.repository, FAKE_ISSUES: f.issues, ...env,
      }),
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    f.children.add(child)
    let output = ''
    child.stdout.on('data', (chunk) => { output += chunk })
    child.stderr.on('data', (chunk) => { output += chunk })
    const outcome = await new Promise((resolve) => {
      const timer = setTimeout(() => resolve('timeout'), 60000)
      const done = () => {
        if (output.includes('listening on')) {
          clearTimeout(timer)
          resolve('listening')
        }
      }
      child.stdout.on('data', done)
      child.once('exit', (code) => {
        clearTimeout(timer)
        resolve({ code })
      })
    })
    if (outcome === 'listening') return { child, port, output: () => output }
    if (outcome !== 'timeout' && PORT_IN_USE.test(output)) continue
    throw new Error(`Listener did not start: ${output}`)
  }
  throw new Error('no port the listener could take')
}

// The event, and the issue the fake `gh` answers with when the listener re-reads
// it. `assignee` is the recipient; `author` is the account that opened it.
function message({ number = 1, assignee = 'alice-handle', author = 'alice-handle', repository = 'example/project', title = 'A message' } = {}) {
  const issue = {
    number,
    html_url: `https://github.com/${repository}/issues/${number}`,
    title,
    state: 'open',
    body: '---\nkind: communicate\ncategory: request\n---\nBody',
    user: { login: author },
    assignee: assignee === null ? null : { login: assignee },
  }
  return {
    action: 'opened',
    repository: { full_name: repository },
    issue,
    sender: { login: author },
  }
}

// Stages what `gh` answers for the issue an event describes, then posts it.
// The listener reads every event back from GitHub, so an event is only as good
// as the answer GitHub gives for it.
async function send(f, port, payload, changed = {}) {
  await fs.writeFile(path.join(f.issues, `${payload.issue.number}.json`), JSON.stringify({ ...payload.issue, ...changed }))
  return webhook(port, payload)
}

async function webhook(port, payload) {
  const raw = JSON.stringify(payload)
  return new Promise((resolve, reject) => {
    const req = http.request({
      host: '127.0.0.1', port, path: '/webhook', method: 'POST',
      headers: { 'content-type': 'application/json', 'x-github-event': 'issues' },
    }, (res) => {
      let body = ''
      res.on('data', (chunk) => { body += chunk })
      res.on('end', () => resolve({ status: res.statusCode, body }))
      res.on('error', reject)
    })
    req.on('error', reject)
    req.end(raw)
  })
}

async function queueText(f) {
  try { return await fs.readFile(f.queue, 'utf8') } catch (error) {
    if (error.code === 'ENOENT') return ''
    throw error
  }
}

function checker(f, { cwd = f.root, args = [], env = {} } = {}) {
  return spawnSync(process.execPath, [path.join(f.tools, 'check-pending.mjs'), ...args], {
    cwd, env: environment(env), encoding: 'utf8', timeout: 60000,
  })
}

test('two project roots keep separate rosters and queues', async (t) => {
  const alpha = await project(t, {
    owner: 'alice',
    handles: '[handles]\nalice = "alice-handle"\n',
    repository: 'example/alpha',
  })
  const beta = await project(t, {
    owner: 'carol',
    handles: '[handles]\ncarol = "carol-handle"\n',
    repository: 'example/beta',
  })
  const a = await startListener(t, alpha)
  const b = await startListener(t, beta)

  assert.deepEqual(await send(alpha, a.port, message({
    repository: 'example/alpha', number: 1, assignee: 'alice-handle', author: 'alice-handle', title: 'For alpha',
  })), { status: 202, body: 'queued 1\n' })
  assert.deepEqual(await send(beta, b.port, message({
    repository: 'example/beta', number: 2, assignee: 'carol-handle', author: 'carol-handle', title: 'For beta',
  })), { status: 202, body: 'queued 1\n' })

  // A repository event meant for the other checkout is rejected before routing.
  assert.deepEqual(await send(alpha, a.port, message({
    repository: 'example/beta', number: 3, assignee: 'alice-handle', author: 'alice-handle', title: 'Beta event at alpha',
  })), { status: 202, body: 'queued 0\n' })
  // An author from the other roster is a stranger here.
  assert.deepEqual(await send(alpha, a.port, message({
    repository: 'example/alpha', number: 4, assignee: 'alice-handle', author: 'carol-handle', title: 'Beta author at alpha',
  })), { status: 202, body: 'queued 0\n' })
  // A handle from the other roster is not a recipient here.
  assert.deepEqual(await send(beta, b.port, message({
    repository: 'example/beta', number: 5, assignee: 'alice-handle', author: 'carol-handle', title: 'Alpha handle at beta',
  })), { status: 202, body: 'queued 0\n' })

  await waitFor(() => a.output().includes('example/beta is not example/alpha'), 'repository mismatch log', a.output)
  const alphaQueue = await queueText(alpha)
  const betaQueue = await queueText(beta)
  assert.deepEqual(alphaQueue.trimEnd().split('\n').filter(Boolean).map((line) => JSON.parse(line).title), ['For alpha'])
  assert.deepEqual(betaQueue.trimEnd().split('\n').filter(Boolean).map((line) => JSON.parse(line).title), ['For beta'])
  assert.ok(!alphaQueue.includes('example/beta'))
  assert.ok(!betaQueue.includes('example/alpha'))
})

test('an explicit --project root wins over the working directory', async (t) => {
  const f = await project(t)
  const outside = await fs.mkdtemp(path.join(os.tmpdir(), 'issue-outside-'))
  t.after(async () => {
    assert.equal(path.dirname(outside), os.tmpdir())
    await fs.rm(outside, { recursive: true, force: true })
  })
  const listener = await startListener(t, f, { cwd: outside, args: ['--project', f.root] })
  assert.deepEqual(await send(f, listener.port, message({ number: 6, title: 'Explicit root' })), { status: 202, body: 'queued 1\n' })
  assert.match(await queueText(f), /Explicit root/)

  const result = checker(f, { cwd: outside, args: ['--project', f.root] })
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /Communication queue: 1 open thread/)
  assert.match(result.stdout, /"title":"Explicit root"/)
})

test('a working directory below the root discovers it without --project', async (t) => {
  const f = await project(t)
  const nested = path.join(f.root, 'nested', 'deeper')
  await fs.mkdir(nested, { recursive: true })
  const listener = await startListener(t, f, { cwd: nested })
  assert.deepEqual(await send(f, listener.port, message({ number: 7, title: 'Discovered root' })), { status: 202, body: 'queued 1\n' })
  assert.match(await queueText(f), /Discovered root/)
  assert.equal(await queueText({ queue: path.join(nested, '.work-weave/personal/communication/pending.jsonl') }), '')

  const result = checker(f, { cwd: nested })
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /Communication queue: 1 open thread/)
})

test('a missing .work-weave stops the listener and checker', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'issue-project-'))
  t.after(async () => {
    assert.equal(path.dirname(root), os.tmpdir())
    await fs.rm(root, { recursive: true, force: true })
  })
  await writeFiles(root, { '.waymark/config.toml': 'schema = 1\n' })
  await git(root, 'init', '--quiet')
  const tools = await externalTools(t)

  const listener = spawnSync(process.execPath, [path.join(tools, 'listener.mjs'), '--project', root], {
    cwd: root, env: environment(), encoding: 'utf8', timeout: 60000,
  })
  assert.equal(listener.status, 1, listener.stderr)
  assert.match(listener.stderr, /\.work-weave/)
  assert.ok(!listener.stdout.includes('listening on'))

  const checked = spawnSync(process.execPath, [path.join(tools, 'check-pending.mjs'), '--project', root], {
    cwd: root, env: environment(), encoding: 'utf8', timeout: 60000,
  })
  assert.equal(checked.status, 1, checked.stderr)
  assert.match(checked.stderr, /Cannot check pending communications: .*\.work-weave/)
  assert.equal(checked.stdout, '')
})

test('a .work-weave marker that is not a directory is rejected', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'issue-project-'))
  t.after(async () => {
    assert.equal(path.dirname(root), os.tmpdir())
    await fs.rm(root, { recursive: true, force: true })
  })
  await writeFiles(root, {
    '.waymark/config.toml': 'schema = 1\n',
    '.work-weave': 'not a directory\n',
  })
  await git(root, 'init', '--quiet')
  const tools = await externalTools(t)
  const listener = spawnSync(process.execPath, [path.join(tools, 'listener.mjs'), '--project', root], {
    cwd: root, env: environment(), encoding: 'utf8', timeout: 60000,
  })
  assert.equal(listener.status, 1, listener.stderr)
  assert.match(listener.stderr, /Expected directory at .*\.work-weave/)
  assert.ok(!listener.stdout.includes('listening on'))

  const checked = spawnSync(process.execPath, [path.join(tools, 'check-pending.mjs'), '--project', root], {
    cwd: root, env: environment(), encoding: 'utf8', timeout: 60000,
  })
  assert.equal(checked.status, 1, checked.stderr)
  assert.match(checked.stderr, /Expected directory at .*\.work-weave/)
})

test('missing or mismatched event repositories are logged and append nothing', async (t) => {
  const f = await project(t)
  const listener = await startListener(t, f)
  const missing = message({ number: 8, title: 'No repository' })
  delete missing.repository
  assert.deepEqual(await webhook(listener.port, missing), { status: 202, body: 'queued 0\n' })
  await waitFor(() => listener.output().includes('repository.full_name is missing'), 'missing repository log', listener.output)
  assert.equal(await queueText(f), '')

  assert.deepEqual(await send(f, listener.port, message({ repository: 'other/project', number: 9, title: 'Wrong repository' })), { status: 202, body: 'queued 0\n' })
  await waitFor(() => listener.output().includes('repository other/project is not example/project'), 'mismatched repository log', listener.output)
  assert.equal(await queueText(f), '')

  assert.deepEqual(await send(f, listener.port, message({ number: 10, title: 'Right repository' })), { status: 202, body: 'queued 1\n' })
  assert.match(await queueText(f), /Right repository/)
})

test('REPOSITORY is required at startup and the environment overrides the file', async (t) => {
  const missing = await project(t, { settings: null, remote: null })
  const result = spawnSync(process.execPath, [path.join(missing.tools, 'listener.mjs'), '--project', missing.root], {
    cwd: missing.root, env: environment(), encoding: 'utf8', timeout: 60000,
  })
  assert.equal(result.status, 1, result.stderr)
  assert.match(result.stderr, /REPOSITORY must be set to owner\/repo/)
  assert.ok(!result.stdout.includes('listening on'))

  const f = await project(t, { repository: 'example/alpha' })
  const listener = await startListener(t, f, { env: { REPOSITORY: 'example/override' } })
  assert.deepEqual(await send(f, listener.port, message({
    repository: 'example/alpha', number: 11, title: 'File repository',
  })), { status: 202, body: 'queued 0\n' })
  await waitFor(() => listener.output().includes('example/alpha is not example/override'), 'overridden repository log', listener.output)
  assert.deepEqual(await send(f, listener.port, message({
    repository: 'example/override', number: 12, title: 'Environment repository',
  })), { status: 202, body: 'queued 1\n' })
  assert.match(await queueText(f), /Environment repository/)
  assert.ok(!(await queueText(f)).includes('File repository'))
})

test('the tools run under a type module package', async (t) => {
  const f = await project(t)
  const pkg = JSON.parse(await fs.readFile(path.join(f.tools, 'package.json'), 'utf8'))
  assert.equal(pkg.type, 'module')
  const checked = checker(f)
  assert.equal(checked.status, 0, checked.stderr)
  assert.equal(checked.stdout, '')
  const listener = await startListener(t, f)
  assert.deepEqual(await send(f, listener.port, message({ number: 13, title: 'Module package' })), { status: 202, body: 'queued 1\n' })
  assert.match(await queueText(f), /Module package/)
})

test('the checker reports open threads only, not the lines a closed one keeps', async (t) => {
  // The roster names no [pending].path, so the checker falls back to the default
  // the queue module owns, which is the path this fixture writes.
  const f = await project(t, { pending: null })
  const open = { url: 'https://github.com/example/project/issues/20', from: 'bob', to: 'alice', owner: 'alice', title: 'Still open', received: '2026-01-01T00:00:00Z', closed_at: null }
  const closed = { url: 'https://github.com/example/project/issues/21', from: 'bob', to: 'alice', owner: 'alice', title: 'Answered last week', received: '2026-01-01T00:00:00Z', closed_at: '2026-01-02T00:00:00Z' }
  await fs.mkdir(path.dirname(f.queue), { recursive: true })
  await fs.writeFile(f.queue, `${[open, closed].map((entry) => JSON.stringify(entry)).join('\n')}\n`)

  const result = checker(f)
  assert.equal(result.status, 0, result.stderr)
  // Two lines in the file, one open thread: the count is the open ones, and the
  // closed thread is not listed.
  assert.match(result.stdout, /Communication queue: 1 open thread/)
  const listed = result.stdout.trimEnd().split('\n').slice(1).map((line) => JSON.parse(line))
  assert.deepEqual(listed, [{ title: 'Still open', url: open.url }])

  // With every thread closed there is nothing to report and nothing printed.
  await fs.writeFile(f.queue, `${JSON.stringify(closed)}\n`)
  const none = checker(f)
  assert.equal(none.status, 0, none.stderr)
  assert.equal(none.stdout, '')
})

test('a second listener on one queue is rejected before it listens', async (t) => {
  const f = await project(t)
  const first = await startListener(t, f)
  const port = await freePort()
  const second = spawn(process.execPath, [path.join(f.tools, 'listener.mjs')], {
    cwd: f.root,
    env: environment({ PORT: String(port) }),
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  let output = ''
  second.stdout.on('data', (chunk) => { output += chunk })
  second.stderr.on('data', (chunk) => { output += chunk })
  const [code] = await once(second, 'exit')
  assert.notEqual(code, 0)
  assert.match(output, /Another listener holds the queue lock/)

  assert.deepEqual(await send(f, first.port, message({ number: 14, title: 'Only once' })), { status: 202, body: 'queued 1\n' })
  const entries = (await queueText(f)).trim().split('\n').filter(Boolean)
  assert.equal(entries.length, 1)
})
