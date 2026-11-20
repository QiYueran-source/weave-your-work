import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { createHmac } from 'node:crypto'
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
const secret = 'integration-test-secret'

async function modulesDir() {
  try {
    await fs.access(path.join(source, 'node_modules'))
    return path.join(source, 'node_modules')
  } catch (error) {
    if (error.code === 'ENOENT') return fallbackModules
    throw error
  }
}

// A machine belongs to one owner, named by its local git identity. Every fixture
// records that identity, so the listener resolves the same way it does here.
function setName(root, name) {
  const result = spawnSync('git', ['config', 'user.name', name], { cwd: root, encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
}

// The fake `gh` answers the listener's two reads. A single issue comes from
// `issues/<n>.json`, the open-issue listing from `pages/1.json`; a file that is
// absent is an issue or a listing GitHub reports as not found.
const fakeGh = `#!${process.execPath}
const fs = require('node:fs')
const path = require('node:path')
const args = process.argv.slice(2)
if (process.cwd() !== process.env.FAKE_ROOT) { console.error('gh ran outside the project root'); process.exit(2) }
fs.appendFileSync(process.env.FAKE_CALLS, JSON.stringify(args) + '\\n')
const expected = ['api', '--hostname', 'github.com', '--method', 'GET']
if (JSON.stringify(args.slice(0, 5)) !== JSON.stringify(expected)) {
  console.error('Unexpected gh arguments: ' + JSON.stringify(args)); process.exit(2)
}
const read = (file) => {
  if (!fs.existsSync(file)) { console.error('gh: Not Found (HTTP 404)'); process.exit(1) }
  process.stdout.write(fs.readFileSync(file))
}
const target = args[5]
const single = /^repos\\/example\\/project\\/issues\\/([1-9][0-9]*)$/.exec(target || '')
if (single && args.length === 6) read(path.join(process.env.FAKE_ISSUES, single[1] + '.json'))
else if (target === 'repos/example/project/issues') read(path.join(process.env.FAKE_PAGES, '1.json'))
else { console.error('Unexpected gh arguments: ' + JSON.stringify(args)); process.exit(2) }
`

async function fixture(t, { owner = 'alice' } = {}) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'issue-security-'))
  t.after(async () => {
    assert.equal(path.dirname(root), os.tmpdir())
    assert.ok(path.basename(root).startsWith('issue-security-'))
    await fs.rm(root, { recursive: true, force: true })
  })
  const tools = path.join(root, '.work-weave/personal/issue')
  const bin = path.join(root, 'bin')
  const pages = path.join(root, 'pages')
  const issues = path.join(root, 'issues')
  await Promise.all([
    fs.mkdir(tools, { recursive: true }),
    fs.mkdir(path.join(root, '.work-weave/shared'), { recursive: true }),
    fs.mkdir(path.join(root, '.work-weave/personal'), { recursive: true }),
    fs.mkdir(path.join(root, '.waymark'), { recursive: true }),
    fs.mkdir(bin),
    fs.mkdir(pages),
    fs.mkdir(issues),
  ])
  for (const name of ['listener.mjs', 'events.mjs', 'check-pending.mjs', 'queue.mjs', 'lock.mjs', 'project-root.cjs']) {
    await fs.copyFile(path.join(source, name), path.join(tools, name))
  }
  // Use installed dependencies without copying credentials or configuration.
  await fs.symlink(await modulesDir(), path.join(tools, 'node_modules'), 'dir')
  await fs.writeFile(path.join(tools, 'package.json'), '{ "type": "module" }\n')
  await fs.writeFile(path.join(root, '.waymark/config.toml'), 'schema = 1\n')
  await fs.writeFile(path.join(bin, 'gh'), fakeGh, { mode: 0o755 })
  await fs.writeFile(path.join(pages, '1.json'), '[]\n')
  const roster = path.join(root, '.work-weave/shared/handles.toml')
  await fs.writeFile(roster, '[handles]\nalice = "alice-handle"\nbob = "bob-handle"\n[pending]\npath = ".work-weave/personal/communication/pending.jsonl"\n')
  await fs.writeFile(path.join(root, '.work-weave/personal/issue-listener.env'), 'REPOSITORY=example/project\n')
  const init = spawnSync('git', ['init', '--quiet'], { cwd: root, encoding: 'utf8' })
  assert.equal(init.status, 0, init.stderr)
  const remote = spawnSync('git', ['remote', 'add', 'origin', 'https://github.com/example/project.git'], { cwd: root, encoding: 'utf8' })
  assert.equal(remote.status, 0, remote.stderr)
  setName(root, owner)
  return {
    root, tools, roster, bin, pages, issues,
    queue: path.join(root, '.work-weave/personal/communication/pending.jsonl'),
  }
}

function environment(f, extra = {}) {
  const env = { ...process.env, ...extra, SMEE_URL: '' }
  delete env.REPOSITORY
  delete env.WEBHOOK_SECRET
  if (extra.WEBHOOK_SECRET !== undefined) env.WEBHOOK_SECRET = extra.WEBHOOK_SECRET
  if (f) {
    env.PATH = `${f.bin}${path.delimiter}${process.env.PATH}`
    env.FAKE_ROOT = f.root
    env.FAKE_PAGES = f.pages
    env.FAKE_ISSUES = f.issues
    env.FAKE_CALLS = path.join(f.root, 'calls')
  }
  return env
}

async function freePort() {
  const server = net.createServer()
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const { port } = server.address()
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  return port
}

// A listener is a separate process that says "listening on" when the machine
// gets to it; a slow machine is not a failure, so the wait is long and a
// listener that starts returns at once. EADDRINUSE costs a port, not a run.
const PORT_IN_USE = /EADDRINUSE/

async function startListener(t, f, webhookSecret = secret) {
  for (let attempt = 0; attempt < 10; attempt++) {
    const port = await freePort()
    const child = spawn(process.execPath, [path.join(f.tools, 'listener.mjs')], {
      cwd: f.root, env: environment(f, { WEBHOOK_SECRET: webhookSecret ?? undefined, PORT: String(port) }),
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let output = ''
    child.stdout.on('data', (chunk) => { output += chunk })
    child.stderr.on('data', (chunk) => { output += chunk })
    t.after(async () => {
      if (child.exitCode === null && child.signalCode === null) {
        child.kill()
        await once(child, 'exit')
      }
    })
    const outcome = await new Promise((resolve) => {
      const limit = 60000
      const timer = setTimeout(() => resolve('timeout'), limit)
      const onData = () => {
        if (output.includes('listening on')) {
          clearTimeout(timer)
          child.stdout.off('data', onData)
          resolve('listening')
        }
      }
      child.stdout.on('data', onData)
      child.once('exit', (code) => {
        clearTimeout(timer)
        resolve({ code })
      })
    })
    if (outcome === 'listening') return { port, output: () => output, f }
    if (outcome !== 'timeout' && PORT_IN_USE.test(output)) continue
    throw new Error(outcome === 'timeout' ? `Listener did not start in 60000ms: ${output}` : `Listener exited (${outcome.code}): ${output}`)
  }
  throw new Error('no port the listener could take')
}

// The issue number in the URL is what the listener re-reads from GitHub, so the
// fake has to be able to answer for it.
const BASE = 'https://github.com/example/project/issues'

function number(url) {
  const match = /(\d+)$/.exec(url)
  return match ? match[1] : '42'
}

function record({ url = `${BASE}/42`, title = 'A title', category = 'request', author = 'alice-handle', assignee = 'alice-handle', state = 'open', body } = {}) {
  return {
    number: Number(number(url)),
    html_url: url,
    title,
    state,
    body: body ?? `---\nkind: communicate\ncategory: ${category}\n---\nBody`,
    user: { login: author },
    assignee: assignee === null ? null : { login: assignee },
  }
}

// An `issues` webhook. `gh` answers for the issue named in it with `confirmed`,
// which defaults to the same record, so a test changes one side at a time.
function issue({ url = `${BASE}/42`, from, to, title, category, author, assignee, state, body } = {}) {
  const item = record({ url, title, category, author, assignee, state, body })
  return {
    action: 'opened',
    repository: { full_name: 'example/project' },
    issue: item,
    sender: { login: item.user.login },
  }
}

async function confirm(f, payload, changed = {}) {
  const item = { ...payload.issue, ...changed }
  await fs.writeFile(path.join(f.issues, `${number(item.html_url)}.json`), JSON.stringify(item))
  return payload
}

async function calls(f) {
  try { return (await fs.readFile(path.join(f.root, 'calls'), 'utf8')).trim().split('\n').filter(Boolean).map(JSON.parse) } catch (error) {
    if (error.code === 'ENOENT') return []
    throw error
  }
}

// The startup scan runs after the port opens, so a test that reads what the
// scan wrote waits for it to say it is done.
async function scanDone(listener) {
  const deadline = performance.now() + 60000
  while (performance.now() < deadline) {
    if (listener.output().includes('Catch-up complete') || listener.output().includes('Catch-up failed')) {
      return queueText(listener.f)
    }
    await delay(25)
  }
  throw new Error(`The startup scan did not finish: ${listener.output()}`)
}

function checker(f) {
  return spawnSync(process.execPath, [path.join(f.tools, 'check-pending.mjs')], {
    cwd: f.root, env: environment(f), encoding: 'utf8', timeout: 60000,
  })
}

async function request(port, payload, { signature = 'valid', splitAt, signedRaw } = {}) {
  const raw = Buffer.from(JSON.stringify(payload))
  const headers = { 'content-type': 'application/json', 'x-github-event': 'issues', 'content-length': raw.length }
  if (signature === 'valid') headers['x-hub-signature-256'] = 'sha256=' + createHmac('sha256', secret).update(signedRaw ?? raw).digest('hex')
  if (signature === 'bad') headers['x-hub-signature-256'] = 'sha256=' + '0'.repeat(64)
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port, path: '/webhook', method: 'POST', headers }, (res) => {
      const chunks = []
      res.on('data', (chunk) => chunks.push(chunk))
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString() }))
      res.on('error', reject)
    })
    req.on('error', reject)
    if (splitAt === undefined) req.end(raw)
    else {
      req.write(raw.subarray(0, splitAt))
      delay(50).then(() => req.end(raw.subarray(splitAt)), reject)
    }
  })
}

async function queueText(f) {
  try { return await fs.readFile(f.queue, 'utf8') } catch (error) {
    if (error.code === 'ENOENT') return ''
    throw error
  }
}

test('listener without a secret accepts unsigned and reserialized messages', async (t) => {
  const f = await fixture(t)
  const { port } = await startListener(t, f, '')
  const cases = [
    ['https://github.com/example/project/issues/1', 'Unsigned', 'missing'],
    ['https://github.com/example/project/issues/2', 'Invalid signature', 'bad'],
    ['https://github.com/example/project/issues/3', 'Reserialized', 'valid'],
  ]
  for (const [url, title, signature] of cases) {
    const payload = await confirm(f, issue({ url, title }))
    assert.deepEqual(await request(port, payload, { signature }), { status: 202, body: 'queued 1\n' }, title)
  }
  // A transport that re-serialises the body changes the bytes the signature
  // covers, so the signature is not checked, but the issue still is.
  const rewritten = await confirm(f, issue({ url: 'https://github.com/example/project/issues/4', title: 'Rewritten' }))
  const originalBytes = Buffer.from(JSON.stringify(rewritten, null, 2))
  assert.deepEqual(await request(port, rewritten, { signedRaw: originalBytes }), { status: 202, body: 'queued 1\n' })
  assert.equal((await queueText(f)).trimEnd().split('\n').length, 4)
})

test('listener starts when WEBHOOK_SECRET is absent', async (t) => {
  const f = await fixture(t)
  const { port } = await startListener(t, f, null)
  const payload = await confirm(f, issue())
  assert.deepEqual(await request(port, payload, { signature: 'missing' }), { status: 202, body: 'queued 1\n' })
})

test('listener rejects a whitespace-only configured secret', async (t) => {
  const f = await fixture(t)
  const result = spawnSync(process.execPath, [path.join(f.tools, 'listener.mjs')], {
    cwd: f.root, env: environment(f, { WEBHOOK_SECRET: '   ' }), encoding: 'utf8', timeout: 60000,
  })
  assert.equal(result.status, 1, result.stderr)
  assert.match(result.stderr, /WEBHOOK_SECRET.*whitespace/)
  assert.equal(await queueText(f), '')
})

test('listener verifies signatures against the original bytes, including split UTF-8', async (t) => {
  const f = await fixture(t)
  const { port } = await startListener(t, f)
  const payload = await confirm(f, issue({ title: 'Hello 雪' }))
  for (const signature of ['missing', 'bad']) {
    const response = await request(port, payload, { signature })
    assert.equal(response.status, 401)
    assert.equal(await queueText(f), '')
  }
  const originalBytes = Buffer.from(JSON.stringify(payload, null, 2))
  const reserialized = await request(port, payload, { signedRaw: originalBytes })
  assert.equal(reserialized.status, 401)
  assert.equal(await queueText(f), '')
  const raw = Buffer.from(JSON.stringify(payload))
  const splitAt = raw.indexOf(Buffer.from('雪')) + 1
  assert.ok(splitAt > 1)
  const response = await request(port, payload, { splitAt })
  assert.equal(response.status, 202)
  assert.equal(response.body, 'queued 1\n')
  const lines = (await queueText(f)).trimEnd().split('\n')
  assert.equal(lines.length, 1)
  // The queue is one JSON object per line, with no list marker.
  assert.ok(lines[0].startsWith('{'), lines[0])
  const entry = JSON.parse(lines[0])
  assert.deepEqual({ ...entry, received: '<time>' }, {
    url: `${BASE}/42`, from: 'alice', to: 'alice', owner: 'alice', title: 'Hello 雪', received: '<time>', closed_at: null,
  })
  assert.match(entry.received, /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/)
})

test('malicious remote values stay on one line and redelivery is deduplicated', async (t) => {
  const f = await fixture(t)
  const { port } = await startListener(t, f)
  const title = 'Title | with\n- forged\r\u0001"quoted" <script>&'
  // The body claims a sender who is not there, and a recipient who is not the
  // assignee; neither can name anyone.
  const payload = await confirm(f, issue({
    url: `${BASE}/5`,
    title,
    body: '---\nkind: communicate\ncategory: request\nfrom: "evil\\n- forged | from=x"\nto: ["bob-handle"]\n---\nBody',
  }))
  assert.deepEqual(await request(port, payload), { status: 202, body: 'queued 1\n' })
  const content = await queueText(f)
  const lines = content.trimEnd().split('\n')
  assert.equal(lines.length, 1)
  assert.ok(lines[0].startsWith('{'))
  // The title keeps every character; JSON escapes what would end the line.
  assert.ok(!lines[0].includes('\n'))
  const entry = JSON.parse(lines[0])
  assert.equal(entry.from, 'alice')
  assert.equal(entry.to, 'alice')
  assert.equal(entry.owner, 'alice')
  assert.equal(entry.url, payload.issue.html_url)
  assert.equal(entry.title, payload.issue.title)
  assert.deepEqual(Object.keys(entry), ['url', 'from', 'to', 'owner', 'title', 'received', 'closed_at'])
  assert.ok(!content.includes('forged |'), content)
  assert.deepEqual(await request(port, payload), { status: 202, body: 'queued 0\n' })
  assert.equal(await queueText(f), content)
  const result = checker(f)
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /Communication queue: 1 open thread/)
  const displayed = result.stdout.trimEnd().split('\n').slice(1).map((line) => JSON.parse(line))
  assert.deepEqual(displayed, [{ title: entry.title, url: entry.url }])
  assert.equal(await queueText(f), content)
})

test('legacy and JSON queue entries are read and rewritten in the current shape', async (t) => {
  const f = await fixture(t)
  const { port } = await startListener(t, f)
  await fs.mkdir(path.dirname(f.queue), { recursive: true })
  const legacy = '- https://example.test/issues/41 | from=old | to=alice-handle (owner=alice) | Legacy title | 2026-01-01T00:00'
  const listed = '- {"url":"https://example.test/issues/99","from":"old","to":"bob-handle","owner":"bob","title":"Existing JSON","received":"2026-01-01T00:00"}'
  await fs.writeFile(f.queue, `${legacy}\n${listed}\n`)
  // Both older lines are read; the next write replaces the file in the shape
  // the listener writes, and the closed thread is not re-queued by the scan.
  const payload = await confirm(f, issue({ url: `${BASE}/7`, title: 'A title' }))
  assert.deepEqual(await request(port, payload), { status: 202, body: 'queued 1\n' })
  const content = await queueText(f)
  const lines = content.trimEnd().split('\n')
  assert.equal(lines.length, 3)
  for (const line of lines) assert.ok(line.startsWith('{'), line)
  const [first, second, third] = lines.map((line) => JSON.parse(line))
  assert.equal(first.title, 'Legacy title')
  assert.equal(first.url, 'https://example.test/issues/41')
  assert.equal(first.closed_at, null)
  assert.equal(first.received, '2026-01-01T00:00')
  assert.equal(second.title, 'Existing JSON')
  assert.equal(second.closed_at, null)
  assert.equal(third.url, `${BASE}/7`)
  const result = checker(f)
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /Communication queue: 3 open threads/)
  const displayed = result.stdout.trimEnd().split('\n').slice(1).map((line) => JSON.parse(line))
  assert.deepEqual(displayed, [
    { title: 'Legacy title', url: 'https://example.test/issues/41' },
    { title: 'Existing JSON', url: 'https://example.test/issues/99' },
    { title: 'A title', url: `${BASE}/7` },
  ])
})

test('messages outside the protocol are not queued', async (t) => {
  const f = await fixture(t)
  const { port } = await startListener(t, f)
  const cases = [
    ['ordinary issue', issue({ url: `${BASE}/1`, title: 'Bug', body: 'A bug report' })],
    ['missing category', issue({ url: `${BASE}/2`, title: 'No category', body: '---\nkind: communicate\n---\n' })],
    ['unknown category', issue({ url: `${BASE}/3`, category: 'notice' })],
    ['no title', issue({ url: `${BASE}/8`, title: ' ' })],
    ['no assignee', issue({ url: `${BASE}/9`, assignee: null })],
    ['assigned outside the roster', issue({ url: `${BASE}/10`, assignee: 'nobody-handle' })],
    ['pull request', { ...issue({ url: `${BASE}/11` }), issue: { ...record({ url: `${BASE}/11` }), pull_request: { url: 'https://github.com/example/project/pulls/11' } } }],
  ]
  for (const [name, payload] of cases) {
    await confirm(f, payload)
    const response = await request(port, payload)
    assert.deepEqual(response, { status: 202, body: 'queued 0\n' }, name)
  }
  assert.equal(await queueText(f), '')
})

test('every category of a valid message is queued once', async (t) => {
  const f = await fixture(t)
  const { port } = await startListener(t, f)
  for (const [index, category] of ['request', 'result', 'comment'].entries()) {
    const payload = await confirm(f, issue({ url: `${BASE}/${20 + index}`, category }))
    assert.deepEqual(await request(port, payload), { status: 202, body: 'queued 1\n' }, category)
  }
  const lines = (await queueText(f)).trimEnd().split('\n')
  assert.equal(lines.length, 3)
  for (const line of lines) assert.ok(line.startsWith('{'), line)
})

test('a message that still carries from and to in its front matter is queued', async (t) => {
  const f = await fixture(t)
  const { port } = await startListener(t, f)
  const payload = await confirm(f, issue({
    url: `${BASE}/12`,
    body: '---\nkind: communicate\ncategory: result\nfrom: "bob"\nto: ["bob-handle"]\n---\nBody',
  }))
  assert.deepEqual(await request(port, payload), { status: 202, body: 'queued 1\n' })
  // The sender is the account that opened the issue and the recipient is the
  // assignee; the two fields it carries are ignored.
  const [entry] = (await queueText(f)).trimEnd().split('\n').map((line) => JSON.parse(line))
  assert.deepEqual([entry.from, entry.to, entry.owner], ['alice', 'alice', 'alice'])
  assert.equal(entry.title, 'A title')
})

test('deduplication compares full URLs', async (t) => {
  const f = await fixture(t)
  const { port } = await startListener(t, f)
  const ten = await confirm(f, issue({ url: `${BASE}/10` }))
  const one = await confirm(f, issue({ url: `${BASE}/1` }))
  const extra = await confirm(f, issue({ url: `${BASE}/1/extra` }))
  assert.equal((await request(port, ten)).body, 'queued 1\n')
  assert.equal((await request(port, one)).body, 'queued 1\n')
  assert.equal((await request(port, one)).body, 'queued 0\n')
  // A prefix of a queued URL is a different issue.
  assert.equal((await request(port, extra)).body, 'queued 1\n')
  assert.equal((await queueText(f)).trimEnd().split('\n').length, 3)
})

test('listener keeps the smee channel URL out of its log', async (t) => {
  const f = await fixture(t)
  const channel = 'http://127.0.0.1:1/channel-secret-value'
  // A free port, because the default 8765 may belong to a real listener.
  const port = await freePort()
  const result = spawnSync(process.execPath, [path.join(f.tools, 'listener.mjs')], {
    cwd: f.root, env: { ...environment(f), SMEE_URL: channel, PORT: String(port) },
    encoding: 'utf8', timeout: 15000,
  })
  const output = result.stdout + result.stderr
  assert.ok(!output.includes('channel-secret-value'), output)
  assert.match(output, /Cannot connect to smee/)
})

test('an issue opened by a login outside the handles file is not queued', async (t) => {
  const f = await fixture(t)
  const { port } = await startListener(t, f)
  const payload = await confirm(f, issue({ author: 'stranger' }))
  assert.deepEqual(await request(port, payload), { status: 202, body: 'queued 0\n' })
  // The stranger on the other end is not the owner's business either.
  const assignedToStranger = await confirm(f, issue({ url: `${BASE}/29`, author: 'alice-handle', assignee: 'stranger' }))
  assert.deepEqual(await request(port, assignedToStranger), { status: 202, body: 'queued 0\n' })
  assert.equal(await queueText(f), '')
})

test('a roster member cannot sign another member\'s name', async (t) => {
  const f = await fixture(t)
  const { port } = await startListener(t, f)
  // The event claims bob opened it; GitHub says alice-handle did. Only GitHub's
  // answer counts.
  const payload = await confirm(f, issue({ author: 'bob-handle' }), { user: { login: 'alice-handle' } })
  assert.deepEqual(await request(port, payload), { status: 202, body: 'queued 0\n' })
  assert.equal(await queueText(f), '')

  // The other direction: the event claims alice, GitHub says bob.
  const other = await confirm(f, issue({ url: `${BASE}/13`, author: 'alice-handle' }), { user: { login: 'bob-handle' } })
  assert.deepEqual(await request(port, other), { status: 202, body: 'queued 0\n' })
  assert.equal(await queueText(f), '')
})

test('an issue GitHub will not confirm is not queued and is logged once', async (t) => {
  const f = await fixture(t)
  const { port } = await startListener(t, f)
  const payload = issue({ url: `${BASE}/14`, title: 'Not on GitHub' })
  // Nothing is staged for issue 14, so GitHub answers that it does not exist.
  assert.deepEqual(await request(port, payload), { status: 202, body: 'queued 0\n' })
  assert.equal(await queueText(f), '')
  // GitHub was asked for issue 14, whatever the scan was doing at the time.
  assert.ok((await calls(f)).some((args) => args.at(-1) === 'repos/example/project/issues/14'))
})

test('a message is queued once, whichever event arrives first', async (t) => {
  const f = await fixture(t)
  const { port } = await startListener(t, f)
  const opened = await confirm(f, issue({ url: `${BASE}/15`, title: 'A message' }))
  assert.deepEqual(await request(port, opened), { status: 202, body: 'queued 1\n' })
  for (const action of ['assigned', 'edited', 'labeled']) {
    const again = { ...opened, action }
    assert.deepEqual(await request(port, again), { status: 202, body: 'queued 0\n' }, action)
  }
  const lines = (await queueText(f)).trimEnd().split('\n')
  assert.equal(lines.length, 1)
  assert.deepEqual([JSON.parse(lines[0]).from, JSON.parse(lines[0]).to], ['alice', 'alice'])
})

test('a message opened without an assignee queues when it is assigned', async (t) => {
  const f = await fixture(t)
  const { port } = await startListener(t, f)
  const unassigned = await confirm(f, issue({ url: `${BASE}/16`, title: 'Waiting' }), { assignee: null })
  assert.deepEqual(await request(port, unassigned), { status: 202, body: 'queued 0\n' })
  assert.equal(await queueText(f), '')
  const assigned = await confirm(f, issue({ url: `${BASE}/16`, title: 'Waiting' }), { assignee: { login: 'alice-handle' } })
  assert.deepEqual(await request(port, { ...assigned, action: 'assigned' }), { status: 202, body: 'queued 1\n' })
  assert.equal((await queueText(f)).trimEnd().split('\n').length, 1)
})

test('a message whose two parties are other members is not queued', async (t) => {
  const f = await fixture(t)
  const { port } = await startListener(t, f)
  // bob opened it and bob holds it; alice is at neither end.
  const payload = await confirm(f, issue({ url: `${BASE}/17`, author: 'bob-handle', assignee: 'bob-handle' }))
  assert.deepEqual(await request(port, payload), { status: 202, body: 'queued 0\n' })
  assert.equal(await queueText(f), '')
})

test('the owner keeps the line for an issue they sent to another owner', async (t) => {
  const f = await fixture(t)
  const { port } = await startListener(t, f)
  const payload = await confirm(f, issue({ url: `${BASE}/28`, title: 'For bob', assignee: 'bob-handle' }))
  assert.deepEqual(await request(port, payload), { status: 202, body: 'queued 1\n' })
  const lines = (await queueText(f)).trimEnd().split('\n')
  assert.equal(lines.length, 1)
  const entry = JSON.parse(lines[0])
  assert.deepEqual([entry.from, entry.to, entry.owner, entry.title], ['alice', 'bob', 'bob', 'For bob'])
  // The recipient cannot close it, so the line stays open for the sender.
  const closed = { ...payload, action: 'closed', closed_at: '2026-11-20T04:00:00Z', closed_by: { login: 'bob-handle' } }
  assert.deepEqual(await request(port, closed), { status: 202, body: 'queued 0\n' })
  assert.equal(JSON.parse((await queueText(f)).trimEnd()).closed_at, null)
})

test('the owner who sent the issue closes the line', async (t) => {
  const f = await fixture(t)
  const { port } = await startListener(t, f)
  const payload = await confirm(f, issue({ url: `${BASE}/30`, title: 'Closed by its sender', assignee: 'bob-handle' }))
  assert.deepEqual(await request(port, payload), { status: 202, body: 'queued 1\n' })
  const lines = (await queueText(f)).trimEnd().split('\n')
  assert.equal(lines.length, 1)
  const entry = JSON.parse(lines[0])
  assert.deepEqual([entry.from, entry.to, entry.owner, entry.title], ['alice', 'bob', 'bob', 'Closed by its sender'])
  // The sender is the author, so their close is the one the listener acts on.
  const closedAt = '2026-11-20T04:00:00Z'
  const closed = { ...payload, action: 'closed', closed_at: closedAt, closed_by: { login: 'alice-handle' } }
  assert.deepEqual(await request(port, closed), { status: 202, body: 'queued 1\n' })
  const after = (await queueText(f)).trimEnd().split('\n')
  assert.equal(after.length, 1)
  assert.equal(JSON.parse(after[0]).closed_at, closedAt)
})

test('a message assigned to a handle outside the roster is not queued', async (t) => {
  const f = await fixture(t)
  const { port } = await startListener(t, f)
  const payload = await confirm(f, issue({ url: `${BASE}/18`, assignee: 'nobody-handle' }))
  assert.deepEqual(await request(port, payload), { status: 202, body: 'queued 0\n' })
  assert.equal(await queueText(f), '')
})

test('closing by the sender marks the line and adds none', async (t) => {
  const f = await fixture(t)
  const { port } = await startListener(t, f)
  const opened = await confirm(f, issue({ url: `${BASE}/19`, title: 'Closes later' }))
  assert.deepEqual(await request(port, opened), { status: 202, body: 'queued 1\n' })
  const closedAt = '2026-11-20T04:00:00Z'
  const closed = { ...opened, action: 'closed', closed_at: closedAt }
  assert.deepEqual(await request(port, closed), { status: 202, body: 'queued 1\n' })
  const lines = (await queueText(f)).trimEnd().split('\n')
  assert.equal(lines.length, 1)
  assert.equal(JSON.parse(lines[0]).closed_at, closedAt)
  // Closing a thread that is not queued adds nothing.
  const other = await confirm(f, issue({ url: `${BASE}/20`, assignee: 'bob-handle' }))
  assert.deepEqual(await request(port, { ...other, action: 'closed', closed_at: closedAt }), { status: 202, body: 'queued 0\n' })
  assert.equal((await queueText(f)).trimEnd().split('\n').length, 1)
})

test('closing by someone other than the sender leaves the line open', async (t) => {
  const f = await fixture(t)
  const { port } = await startListener(t, f)
  const opened = await confirm(f, issue({ url: `${BASE}/21`, title: 'Not the sender' }))
  assert.deepEqual(await request(port, opened), { status: 202, body: 'queued 1\n' })
  const closed = { ...opened, action: 'closed', closed_at: '2026-11-20T04:00:00Z', closed_by: { login: 'bob-handle' } }
  assert.deepEqual(await request(port, closed), { status: 202, body: 'queued 0\n' })
  const lines = (await queueText(f)).trimEnd().split('\n')
  assert.equal(lines.length, 1)
  assert.equal(JSON.parse(lines[0]).closed_at, null)
})

test('the startup scan does not overwrite a thread an event queued', async (t) => {
  const f = await fixture(t)
  // The listing the scan reads is empty, so the scan has nothing to add; the
  // event that arrives after the scan finished queues the thread once.
  await fs.writeFile(path.join(f.pages, '1.json'), '[]\n')
  const listener = await startListener(t, f)
  await scanDone(listener)
  const payload = await confirm(f, issue({ url: `${BASE}/22`, title: 'After the scan' }))
  assert.deepEqual(await request(listener.port, payload), { status: 202, body: 'queued 1\n' })
  assert.equal((await queueText(f)).trimEnd().split('\n').length, 1)
})

test('the startup scan leaves a thread GitHub lists as open untouched', async (t) => {
  const f = await fixture(t)
  const entry = { url: `${BASE}/23`, from: 'bob', to: 'alice', owner: 'alice', title: 'Open thread', received: '2026-01-01T00:00:00Z', closed_at: null }
  await fs.mkdir(path.dirname(f.queue), { recursive: true })
  await fs.writeFile(f.queue, `${JSON.stringify(entry)}\n`)
  await fs.writeFile(path.join(f.pages, '1.json'), JSON.stringify([record({ url: `${BASE}/23`, title: 'Open thread' })]))
  const scan = await startListener(t, f)
  const lines = (await scanDone(scan)).trimEnd().split('\n')
  assert.equal(lines.length, 1)
  assert.equal(JSON.parse(lines[0]).closed_at, null)
})

test('the startup scan marks a thread GitHub no longer lists', async (t) => {
  const f = await fixture(t)
  const entry = { url: `${BASE}/24`, from: 'bob', to: 'alice', owner: 'alice', title: 'Gone', received: '2026-01-01T00:00:00Z', closed_at: null }
  await fs.mkdir(path.dirname(f.queue), { recursive: true })
  await fs.writeFile(f.queue, `${JSON.stringify(entry)}\n`)
  await fs.writeFile(path.join(f.pages, '1.json'), '[]\n')
  const scan = await startListener(t, f)
  const lines = (await scanDone(scan)).trimEnd().split('\n')
  assert.equal(lines.length, 1)
  const marked = JSON.parse(lines[0])
  assert.equal(marked.title, 'Gone')
  assert.match(marked.closed_at, /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/)
})

test('a startup scan that fails leaves the queue exactly as it was', async (t) => {
  const f = await fixture(t)
  const entry = { url: `${BASE}/25`, from: 'bob', to: 'alice', owner: 'alice', title: 'Still there', received: '2026-01-01T00:00:00Z', closed_at: null }
  await fs.mkdir(path.dirname(f.queue), { recursive: true })
  const original = `${JSON.stringify(entry)}\n`
  await fs.writeFile(f.queue, original)
  // GitHub answers the listing with an error for this fixture.
  await fs.writeFile(path.join(f.pages, '1.json'), 'not JSON at all')
  const { port } = await startListener(t, f)
  await delay(500)
  assert.equal(await queueText(f), original)
  // The webhook keeps working while the scan fails.
  const payload = await confirm(f, issue({ url: `${BASE}/26`, title: 'After the failure' }))
  assert.deepEqual(await request(port, payload), { status: 202, body: 'queued 1\n' })
  assert.equal((await queueText(f)).trimEnd().split('\n').length, 2)
})

test('the listener writes nothing but its queue', async (t) => {
  const f = await fixture(t)
  // What the checkout holds before the listener runs. The request log and Git's
  // own files are outside what this test asks about.
  async function tree() {
    const found = new Map()
    async function walk(dir) {
      for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
        if (entry.name === '.git' || entry.name === 'calls') continue
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          await walk(full)
          continue
        }
        const stat = await fs.stat(full)
        found.set(path.relative(f.root, full), `${stat.size}:${stat.mtimeMs}`)
      }
    }
    await walk(f.root)
    return found
  }
  const before = await tree()
  const listener = await startListener(t, f)
  await scanDone(listener)
  const payload = await confirm(f, issue({ url: `${BASE}/27`, title: 'Only the queue' }))
  assert.deepEqual(await request(listener.port, payload), { status: 202, body: 'queued 1\n' })
  const after = await tree()
  const written = [...after].filter(([file, stamp]) => before.get(file) !== stamp).map(([file]) => file)
  const created = [...after.keys()].filter((file) => !before.has(file) && !file.startsWith('issues'))
  // The queue and the lock that says one listener owns it are the only files
  // the listener writes; the fixture's fake `gh` answers are left out.
  const expected = ['.work-weave/personal/communication/.lock', '.work-weave/personal/communication/pending.jsonl']
  assert.deepEqual(written.filter((file) => !file.startsWith('pages') && !file.startsWith('issues')).sort(), expected)
  assert.deepEqual(created.sort(), expected)
})

test('the machine owner matches the git name without regard to case', async (t) => {
  const f = await fixture(t, { owner: 'Alice' })
  const { port } = await startListener(t, f)
  const payload = await confirm(f, issue())
  assert.deepEqual(await request(port, payload), { status: 202, body: 'queued 1\n' })
  assert.equal(JSON.parse((await queueText(f)).trimEnd()).owner, 'alice')
})

test('a machine whose git name is no owner refuses to start and names the roster', async (t) => {
  const f = await fixture(t, { owner: 'Carol' })
  const result = spawnSync(process.execPath, [path.join(f.tools, 'listener.mjs')], {
    cwd: f.root, env: environment(f), encoding: 'utf8', timeout: 60000,
  })
  assert.equal(result.status, 1, result.stderr)
  assert.match(result.stderr, /"Carol", which is not an owner in handles\.toml \(alice, bob\)/)
  assert.match(result.stderr, /git config --local user\.name/)
  assert.equal(await queueText(f), '')
})

test('a machine with no git name refuses to start', async (t) => {
  const f = await fixture(t)
  setName(f.root, '')
  const result = spawnSync(process.execPath, [path.join(f.tools, 'listener.mjs')], {
    cwd: f.root, env: environment(f), encoding: 'utf8', timeout: 60000,
  })
  assert.equal(result.status, 1, result.stderr)
  assert.match(result.stderr, /git config user\.name is empty/)
})

test('owners that differ only by case are rejected', async (t) => {
  const f = await fixture(t)
  await fs.writeFile(f.roster, '[handles]\nalice = "alice-handle"\nAlice = "other-handle"\n[pending]\npath = ".work-weave/personal/communication/pending.jsonl"\n')
  const result = spawnSync(process.execPath, [path.join(f.tools, 'listener.mjs')], {
    cwd: f.root, env: environment(f), encoding: 'utf8', timeout: 60000,
  })
  assert.equal(result.status, 1, result.stderr)
  assert.match(result.stderr, /differ only by case/)
})

test('a nested handle table is rejected before the port opens', async (t) => {
  const f = await fixture(t)
  await fs.writeFile(f.roster, '[handles.github]\nalice = "alice-handle"\n[pending]\npath = ".work-weave/personal/communication/pending.jsonl"\n')
  const result = spawnSync(process.execPath, [path.join(f.tools, 'listener.mjs')], {
    cwd: f.root, env: environment(f), encoding: 'utf8', timeout: 60000,
  })
  assert.equal(result.status, 1, result.stderr)
  assert.match(result.stderr, /no owners|not a login/)
  assert.ok(!result.stdout.includes('listening on'), result.stdout)
  assert.equal(await queueText(f), '')
})

test('listener refuses to append to a malformed queue', async (t) => {
  const f = await fixture(t)
  const { port } = await startListener(t, f)
  await fs.mkdir(path.dirname(f.queue), { recursive: true })
  const content = '{"url":"https://example.test/issues/1", broken}\n'
  await fs.writeFile(f.queue, content)
  const payload = await confirm(f, issue())
  assert.equal((await request(port, payload)).status, 500)
  assert.equal(await queueText(f), content)
})

test('checker reports malformed queue records without modifying the queue', async (t) => {
  const f = await fixture(t)
  await fs.mkdir(path.dirname(f.queue), { recursive: true })
  const content = '- {"url":"https://example.test", broken}\n'
  await fs.writeFile(f.queue, content)
  const result = checker(f)
  assert.equal(result.status, 1)
  assert.match(result.stderr, /Cannot check pending communications: Invalid queue entry on line 1/)
  assert.equal(result.stdout, '')
  assert.equal(await queueText(f), content)
})
