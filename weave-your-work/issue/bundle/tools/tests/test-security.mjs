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
const fallbackModules = path.resolve(source, '../../../../.agents/skills/issue/bundle/tools/node_modules')
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

async function fixture(t, { owner = 'alice' } = {}) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'issue-security-'))
  t.after(async () => {
    assert.equal(path.dirname(root), os.tmpdir())
    assert.ok(path.basename(root).startsWith('issue-security-'))
    await fs.rm(root, { recursive: true, force: true })
  })
  const tools = path.join(root, '.work-weave/runtime/issue')
  await Promise.all([
    fs.mkdir(tools, { recursive: true }),
    fs.mkdir(path.join(root, '.work-weave/issue'), { recursive: true }),
    fs.mkdir(path.join(root, '.work-weave/local'), { recursive: true }),
    fs.mkdir(path.join(root, '.waymark'), { recursive: true }),
  ])
  for (const name of ['listener.mjs', 'check-pending.mjs', 'queue.mjs', 'lock.mjs', 'project-root.cjs']) {
    await fs.copyFile(path.join(source, name), path.join(tools, name))
  }
  // Use installed dependencies without copying credentials or configuration.
  await fs.symlink(await modulesDir(), path.join(tools, 'node_modules'), 'dir')
  await fs.writeFile(path.join(tools, 'package.json'), '{ "type": "module" }\n')
  await fs.writeFile(path.join(root, '.waymark/config.toml'), 'schema = 1\n')
  const roster = path.join(root, '.work-weave/issue/handles.toml')
  await fs.writeFile(roster, '[handles]\nalice = "alice-handle"\nbob = "bob-handle"\n[pending]\npath = ".work-weave/pending/pending-communications.md"\n')
  await fs.writeFile(path.join(root, '.work-weave/local/issue-listener.env'), 'REPOSITORY=example/project\n')
  const init = spawnSync('git', ['init', '--quiet'], { cwd: root, encoding: 'utf8' })
  assert.equal(init.status, 0, init.stderr)
  setName(root, owner)
  return { root, tools, roster, queue: path.join(root, '.work-weave/pending/pending-communications.md') }
}

function environment(extra = {}) {
  const env = { ...process.env, ...extra, SMEE_URL: '' }
  delete env.REPOSITORY
  delete env.WEBHOOK_SECRET
  if (extra.WEBHOOK_SECRET !== undefined) env.WEBHOOK_SECRET = extra.WEBHOOK_SECRET
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

function issue({ url = 'https://example.test/issues/42', from = 'sender', to = 'alice-handle', title = 'A title', category = 'request', tickets = ['wm-test'], author = 'alice-handle' } = {}) {
  return {
    action: 'opened',
    repository: { full_name: 'example/project' },
    issue: {
      html_url: url,
      title,
      body: `---\nkind: communicate\ncategory: ${category}\nfrom: ${JSON.stringify(from)}\nto: [${JSON.stringify(to)}]\ntickets: ${JSON.stringify(tickets)}\n---\nBody`,
      user: { login: author },
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

test('malicious remote values stay on one line and redelivery is deduplicated', async (t) => {
  const f = await fixture(t)
  const port = await startListener(t, f)
  const payload = issue({
    url: 'https://example.test/evil\n- forged | to=bob',
    from: 'sender\n- forged | from=x',
    title: 'Title | with\n- forged\r\u0001"quoted" <script>&',
  })
  assert.deepEqual(await request(port, payload), { status: 202, body: 'queued 1\n' })
  const content = await queueText(f)
  const lines = content.trimEnd().split('\n')
  assert.equal(lines.length, 1)
  assert.ok(!content.includes('<script>'))
  assert.ok(lines[0].startsWith('- {'))
  const entry = JSON.parse(lines[0].slice(2))
  assert.equal(entry.to, 'alice-handle')
  assert.equal(entry.owner, 'alice')
  assert.equal(entry.url, payload.issue.html_url)
  assert.equal(entry.from, 'sender\n- forged | from=x')
  assert.equal(entry.title, payload.issue.title)
  assert.deepEqual(Object.keys(entry), ['url', 'from', 'to', 'owner', 'title', 'received'])
  assert.deepEqual(await request(port, payload), { status: 202, body: 'queued 0\n' })
  assert.equal(await queueText(f), content)
  const result = checker(f)
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /Communication queue: 1 entry/)
  const displayed = result.stdout.trimEnd().split('\n').slice(1).map((line) => JSON.parse(line))
  assert.deepEqual(displayed, [{ title: entry.title, url: entry.url }])
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
  assert.deepEqual(await request(port, issue({ url: 'https://example.test/issues/7', to: 'alice-handle' })), { status: 202, body: 'queued 1\n' })
  const content = await queueText(f)
  assert.ok(content.startsWith(original + '\n- {'))
  assert.ok(content.endsWith('\n'))
  const lines = content.trimEnd().split('\n')
  assert.equal(lines.length, 3)
  const added = JSON.parse(lines[2].slice(2))
  assert.equal(added.url, 'https://example.test/issues/7')
  assert.equal(added.to, 'alice-handle')
  const result = checker(f)
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /Communication queue: 3 entries/)
  const displayed = result.stdout.trimEnd().split('\n').slice(1).map((line) => JSON.parse(line))
  assert.deepEqual(displayed, [
    { title: 'Legacy title', url: 'https://example.test/issues/42' },
    { title: 'Existing JSON', url: 'https://example.test/issues/99' },
    { title: 'A title', url: 'https://example.test/issues/7' },
  ])
  assert.equal(await queueText(f), content)
})

test('messages outside the protocol are not queued', async (t) => {
  const f = await fixture(t)
  const port = await startListener(t, f)
  const cases = [
    ['ordinary issue', { action: 'opened', repository: { full_name: 'example/project' }, issue: { html_url: 'https://example.test/issues/1', title: 'Bug', body: 'A bug report' } }],
    ['missing category', { action: 'opened', repository: { full_name: 'example/project' }, issue: { html_url: 'https://example.test/issues/2', title: 'No category', body: '---\nkind: communicate\nfrom: sender\nto: [alice-handle]\ntickets: [wm-1]\n---\n' } }],
    ['unknown category', issue({ url: 'https://example.test/issues/3', category: 'notice' })],
    ['several recipients', { action: 'opened', repository: { full_name: 'example/project' }, issue: { html_url: 'https://example.test/issues/4', title: 'Two', body: '---\nkind: communicate\ncategory: request\nfrom: sender\nto: [alice-handle, bob-handle]\ntickets: [wm-1]\n---\n' } }],
    ['string recipient', { action: 'opened', repository: { full_name: 'example/project' }, issue: { html_url: 'https://example.test/issues/5', title: 'One string', body: '---\nkind: communicate\ncategory: request\nfrom: sender\nto: alice-handle\ntickets: [wm-1]\n---\n' } }],
    ['no tickets', issue({ url: 'https://example.test/issues/6', tickets: [] })],
    ['no sender', issue({ url: 'https://example.test/issues/7', from: '' })],
    ['no title', issue({ url: 'https://example.test/issues/8', title: ' ' })],
    ['closed action', { action: 'closed', repository: { full_name: 'example/project' }, issue: issue().issue }],
    ['pull request', { action: 'opened', repository: { full_name: 'example/project' }, issue: { ...issue().issue, pull_request: { url: 'https://example.test/pulls/9' } } }],
  ]
  for (const [name, payload] of cases) {
    const response = await request(port, payload)
    assert.deepEqual(response, { status: 202, body: 'queued 0\n' }, name)
  }
  assert.equal(await queueText(f), '')
})

test('every category of a valid message is queued once', async (t) => {
  const f = await fixture(t)
  const port = await startListener(t, f)
  for (const [index, category] of ['request', 'result', 'comment'].entries()) {
    const payload = issue({ url: `https://example.test/issues/${20 + index}`, category })
    assert.deepEqual(await request(port, payload), { status: 202, body: 'queued 1\n' }, category)
  }
  const lines = (await queueText(f)).trimEnd().split('\n')
  assert.equal(lines.length, 3)
  for (const line of lines) assert.ok(line.startsWith('- {'), line)
})

test('deduplication compares full URLs', async (t) => {
  const f = await fixture(t)
  const port = await startListener(t, f)
  assert.equal((await request(port, issue({ url: 'https://example.test/issues/10' }))).body, 'queued 1\n')
  assert.equal((await request(port, issue({ url: 'https://example.test/issues/1' }))).body, 'queued 1\n')
  assert.equal((await request(port, issue({ url: 'https://example.test/issues/1' }))).body, 'queued 0\n')
  // A prefix of a queued URL is a different issue.
  assert.equal((await request(port, issue({ url: 'https://example.test/issues/1/extra' }))).body, 'queued 1\n')
  assert.equal((await queueText(f)).trimEnd().split('\n').length, 3)
})

test('listener keeps the smee channel URL out of its log', async (t) => {
  const f = await fixture(t)
  const channel = 'http://127.0.0.1:1/channel-secret-value'
  // A free port, because the default 8765 may belong to a real listener.
  const port = await freePort()
  const result = spawnSync(process.execPath, [path.join(f.tools, 'listener.mjs')], {
    cwd: f.root, env: { ...environment(), SMEE_URL: channel, PORT: String(port) },
    encoding: 'utf8', timeout: 15000,
  })
  const output = result.stdout + result.stderr
  assert.ok(!output.includes('channel-secret-value'), output)
  assert.match(output, /Cannot connect to smee/)
})

test('an issue opened by a login outside the handles file is not queued', async (t) => {
  const f = await fixture(t)
  const port = await startListener(t, f)
  assert.deepEqual(await request(port, issue({ author: 'stranger' })), { status: 202, body: 'queued 0\n' })
  assert.equal(await queueText(f), '')
})

test('a known login may file on behalf of another owner', async (t) => {
  const f = await fixture(t)
  const port = await startListener(t, f)
  // The body says bob is the sender; the issue was opened by alice's login, and
  // the message is addressed to alice, whose machine this is.
  const payload = issue({ author: 'alice-handle', from: 'bob', to: 'alice-handle' })
  assert.deepEqual(await request(port, payload), { status: 202, body: 'queued 1\n' })
  const entry = JSON.parse((await queueText(f)).slice(2))
  assert.equal(entry.from, 'bob')
  assert.equal(entry.owner, 'alice')
})

test('a message addressed to another owner is not queued', async (t) => {
  const f = await fixture(t)
  const port = await startListener(t, f)
  assert.deepEqual(await request(port, issue({ to: 'bob-handle' })), { status: 202, body: 'queued 0\n' })
  assert.equal(await queueText(f), '')
})

test('a message addressed to a handle outside the roster is not queued', async (t) => {
  const f = await fixture(t)
  const port = await startListener(t, f)
  assert.deepEqual(await request(port, issue({ to: 'nobody-handle' })), { status: 202, body: 'queued 0\n' })
  assert.equal(await queueText(f), '')
})

test('the machine owner matches the git name without regard to case', async (t) => {
  const f = await fixture(t, { owner: 'Alice' })
  const port = await startListener(t, f)
  assert.deepEqual(await request(port, issue({ to: 'alice-handle' })), { status: 202, body: 'queued 1\n' })
  assert.equal(JSON.parse((await queueText(f)).slice(2)).owner, 'alice')
})

test('a machine whose git name is no owner refuses to start and names the roster', async (t) => {
  const f = await fixture(t, { owner: 'Carol' })
  const result = spawnSync(process.execPath, [path.join(f.tools, 'listener.mjs')], {
    cwd: f.root, env: environment(), encoding: 'utf8', timeout: 5000,
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
    cwd: f.root, env: environment(), encoding: 'utf8', timeout: 5000,
  })
  assert.equal(result.status, 1, result.stderr)
  assert.match(result.stderr, /git config user\.name is empty/)
})

test('owners that differ only by case are rejected', async (t) => {
  const f = await fixture(t)
  await fs.writeFile(f.roster, '[handles]\nalice = "alice-handle"\nAlice = "other-handle"\n[pending]\npath = ".work-weave/pending/pending-communications.md"\n')
  const result = spawnSync(process.execPath, [path.join(f.tools, 'listener.mjs')], {
    cwd: f.root, env: environment(), encoding: 'utf8', timeout: 5000,
  })
  assert.equal(result.status, 1, result.stderr)
  assert.match(result.stderr, /differ only by case/)
})

test('a nested handle table is rejected before the port opens', async (t) => {
  const f = await fixture(t)
  await fs.writeFile(f.roster, '[handles.github]\nalice = "alice-handle"\n[pending]\npath = ".work-weave/pending/pending-communications.md"\n')
  const result = spawnSync(process.execPath, [path.join(f.tools, 'listener.mjs')], {
    cwd: f.root, env: environment(), encoding: 'utf8', timeout: 5000,
  })
  assert.equal(result.status, 1, result.stderr)
  assert.match(result.stderr, /no owners|not a login/)
  assert.ok(!result.stdout.includes('listening on'), result.stdout)
  assert.equal(await queueText(f), '')
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
