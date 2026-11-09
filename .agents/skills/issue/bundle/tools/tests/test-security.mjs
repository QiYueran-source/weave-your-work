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
const installedModules = path.join(source, 'node_modules')
const secret = 'integration-test-secret'

async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'issue-security-'))
  t.after(async () => {
    assert.equal(path.dirname(root), os.tmpdir())
    assert.ok(path.basename(root).startsWith('issue-security-'))
    await fs.rm(root, { recursive: true, force: true })
  })
  const tools = path.join(root, 'tools')
  await fs.mkdir(tools)
  for (const name of ['listener.mjs', 'check-pending.mjs', 'queue.mjs']) {
    await fs.copyFile(path.join(source, name), path.join(tools, name))
  }
  // Use installed dependencies without copying credentials or configuration.
  await fs.symlink(installedModules, path.join(tools, 'node_modules'), 'dir')
  await fs.writeFile(path.join(tools, 'handles.toml'), '[handles.github]\nalice = "alice-handle"\nbob = "bob-handle"\n[pending]\npath = "queue/pending.md"\n')
  return { root, tools, queue: path.join(root, 'queue/pending.md') }
}

function environment(extra = {}) {
  const env = { ...process.env, ...extra, SMEE_URL: '' }
  if (extra.WEBHOOK_SECRET === undefined) delete env.WEBHOOK_SECRET
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

async function startListener(t, f, webhookSecret = secret) {
  const port = await freePort()
  const child = spawn(process.execPath, [path.join(f.tools, 'listener.mjs')], {
    cwd: f.root, env: environment({ WEBHOOK_SECRET: webhookSecret ?? undefined, PORT: String(port) }),
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
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Listener did not start: ${output}`)), 5000)
    const onData = () => {
      if (output.includes('listening on')) {
        clearTimeout(timer)
        child.stdout.off('data', onData)
        resolve()
      }
    }
    child.stdout.on('data', onData)
    child.once('exit', (code) => {
      clearTimeout(timer)
      reject(new Error(`Listener exited (${code}): ${output}`))
    })
  })
  return port
}

function issue({ url = 'https://example.test/issues/42', from = 'sender', to = ['alice-handle'], title = 'A title' } = {}) {
  return {
    action: 'opened',
    issue: {
      html_url: url,
      title,
      body: `---\nkind: communicate\nfrom: ${JSON.stringify(from)}\nto: ${JSON.stringify(to)}\n---\nBody`,
    },
  }
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

function checker(f) {
  return spawnSync(process.execPath, [path.join(f.tools, 'check-pending.mjs')], {
    cwd: f.root, env: environment(), encoding: 'utf8', timeout: 5000,
  })
}

test('listener without a secret accepts unsigned and reserialized messages', async (t) => {
  const f = await fixture(t)
  const port = await startListener(t, f, '')
  const missing = issue({ url: 'https://example.test/issues/1', title: 'Unsigned' })
  assert.deepEqual(await request(port, missing, { signature: 'missing' }), { status: 202, body: 'queued 1\n' })
  const bad = issue({ url: 'https://example.test/issues/2', title: 'Invalid signature' })
  assert.deepEqual(await request(port, bad, { signature: 'bad' }), { status: 202, body: 'queued 1\n' })
  const rewritten = issue({ url: 'https://example.test/issues/3', title: 'Reserialized' })
  const originalBytes = Buffer.from(JSON.stringify(rewritten, null, 2))
  assert.deepEqual(await request(port, rewritten, { signedRaw: originalBytes }), { status: 202, body: 'queued 1\n' })
  assert.equal((await queueText(f)).trimEnd().split('\n').length, 3)
})

test('listener starts when WEBHOOK_SECRET is absent', async (t) => {
  const f = await fixture(t)
  const port = await startListener(t, f, null)
  assert.deepEqual(await request(port, issue(), { signature: 'missing' }), { status: 202, body: 'queued 1\n' })
})

test('listener rejects a whitespace-only configured secret', async (t) => {
  const f = await fixture(t)
  const result = spawnSync(process.execPath, [path.join(f.tools, 'listener.mjs')], {
    cwd: f.root, env: environment({ WEBHOOK_SECRET: '   ' }), encoding: 'utf8', timeout: 5000,
  })
  assert.equal(result.status, 1, result.stderr)
  assert.match(result.stderr, /WEBHOOK_SECRET.*whitespace/)
  assert.equal(await queueText(f), '')
})

test('listener verifies signatures against the original bytes, including split UTF-8', async (t) => {
  const f = await fixture(t)
  const port = await startListener(t, f)
  const payload = issue({ title: 'Hello 雪' })
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
  assert.ok(lines[0].startsWith('- '))
  const entry = JSON.parse(lines[0].slice(2))
  assert.deepEqual({ ...entry, received: '<time>' }, {
    url: 'https://example.test/issues/42', from: 'sender', to: 'alice-handle',
    owner: 'alice', title: 'Hello 雪', received: '<time>',
  })
  assert.match(entry.received, /^\d{4}-\d\d-\d\dT\d\d:\d\d$/)
})

test('malicious remote values stay on one line per recipient and redelivery is deduplicated', async (t) => {
  const f = await fixture(t)
  const port = await startListener(t, f)
  const payload = issue({
    url: 'https://example.test/evil\n- forged | to=bob',
    from: 'sender\n- forged | from=x',
    to: ['alice-handle', 'bob-handle', 'alice-handle', 'strange\n- forged'],
    title: 'Title | with\n- forged\r\u0001"quoted" <script>&',
  })
  assert.deepEqual(await request(port, payload), { status: 202, body: 'queued 3\n' })
  const content = await queueText(f)
  const lines = content.trimEnd().split('\n')
  assert.equal(lines.length, 3)
  assert.ok(!content.includes('<script>'))
  const entries = lines.map((line) => {
    assert.ok(line.startsWith('- {'))
    return JSON.parse(line.slice(2))
  })
  assert.deepEqual(entries.map(({ to, owner }) => [to, owner]), [
    ['alice-handle', 'alice'], ['bob-handle', 'bob'], ['strange\n- forged', 'unknown'],
  ])
  for (const entry of entries) {
    assert.equal(entry.url, payload.issue.html_url)
    assert.equal(entry.from, 'sender\n- forged | from=x')
    assert.equal(entry.title, payload.issue.title)
    assert.deepEqual(Object.keys(entry), ['url', 'from', 'to', 'owner', 'title', 'received'])
  }
  assert.deepEqual(await request(port, payload), { status: 202, body: 'queued 0\n' })
  assert.equal(await queueText(f), content)
  const result = checker(f)
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /Communication queue: 3 entries/)
  const displayed = result.stdout.trimEnd().split('\n').slice(1).map((line) => JSON.parse(line))
  assert.deepEqual(displayed, entries.map(({ title, url }) => ({ title, url })))
  assert.equal(await queueText(f), content)
})

test('legacy and JSON queue entries survive an append without a trailing newline', async (t) => {
  const f = await fixture(t)
  const port = await startListener(t, f)
  await fs.mkdir(path.dirname(f.queue), { recursive: true })
  const legacy = '- https://example.test/issues/42 | from=old | to=alice-handle (owner=alice) | Legacy title | 2026-01-01T00:00'
  const existing = '- {"url":"https://example.test/issues/99","from":"old","to":"bob-handle","owner":"bob","title":"Existing JSON","received":"2026-01-01T00:00"}'
  const original = `${legacy}\n${existing}`
  await fs.writeFile(f.queue, original)
  assert.deepEqual(await request(port, issue({ to: ['alice-handle', 'bob-handle'] })), { status: 202, body: 'queued 1\n' })
  const content = await queueText(f)
  assert.ok(content.startsWith(original + '\n- {'))
  assert.ok(content.endsWith('\n'))
  const lines = content.trimEnd().split('\n')
  assert.equal(lines.length, 3)
  const added = JSON.parse(lines[2].slice(2))
  assert.equal(added.url, 'https://example.test/issues/42')
  assert.equal(added.to, 'bob-handle')
  const result = checker(f)
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /Communication queue: 3 entries/)
  const displayed = result.stdout.trimEnd().split('\n').slice(1).map((line) => JSON.parse(line))
  assert.deepEqual(displayed, [
    { title: 'Legacy title', url: 'https://example.test/issues/42' },
    { title: 'Existing JSON', url: 'https://example.test/issues/99' },
    { title: 'A title', url: 'https://example.test/issues/42' },
  ])
  assert.equal(await queueText(f), content)
})

test('deduplication compares full URLs and recipients', async (t) => {
  const f = await fixture(t)
  const port = await startListener(t, f)
  assert.equal((await request(port, issue({ url: 'https://example.test/issues/10', to: ['alice-handle-long'] }))).body, 'queued 1\n')
  assert.equal((await request(port, issue({ url: 'https://example.test/issues/1', to: ['alice-handle-long', 'alice-handle'] }))).body, 'queued 2\n')
  assert.equal((await request(port, issue({ url: 'https://example.test/issues/1', to: ['alice-handle'] }))).body, 'queued 0\n')
  assert.equal((await queueText(f)).trimEnd().split('\n').length, 3)
})

test('listener refuses to append to a malformed queue', async (t) => {
  const f = await fixture(t)
  const port = await startListener(t, f)
  await fs.mkdir(path.dirname(f.queue), { recursive: true })
  const content = '- {broken}\n'
  await fs.writeFile(f.queue, content)
  assert.equal((await request(port, issue())).status, 500)
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
