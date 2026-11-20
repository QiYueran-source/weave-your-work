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
// A listener is a separate process, and how long it takes to say "listening on"
// depends on what else the machine is doing. A fixed short wait turns a slow
// machine into a failed test without anything being wrong, so the wait is long
// and a check that passes returns at once.
const timeout = 60000

async function waitFor(check, description, output = () => '') {
  const deadline = performance.now() + timeout
  while (performance.now() < deadline) {
    if (await check()) return
    await delay(25)
  }
  throw new Error(`Timed out waiting for ${description} after ${timeout}ms: ${output()}`)
}

async function exists(file) {
  try { await fs.access(file); return true } catch (error) {
    if (error.code === 'ENOENT') return false
    throw error
  }
}

function git(root, ...args) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' })
  assert.equal(result.status, 0, `git ${args.join(' ')}: ${result.stderr}`)
}

// The fake `gh` answers the three reads the listener makes: the open-issue
// listing, one page at a time from `pages/<n>.json`, a single issue from
// `issues/<n>.json`, and the collaborator listing from `collaborators.json`. A
// missing file is what GitHub answers for an issue that is not there. A
// `fail-<name>` file makes the read print an error and exit 1, the way `gh`
// reports a failed request.
const fakeGh = `#!${process.execPath}
const fs = require('node:fs')
const path = require('node:path')
const args = process.argv.slice(2)
if (process.cwd() !== process.env.FAKE_ROOT) { console.error('gh ran outside the project root'); process.exit(2) }
fs.appendFileSync(process.env.FAKE_CALLS, JSON.stringify(args) + '\\n')
const expected = ['api', '--hostname', 'github.com', '--method', 'GET']
const target = args[5]
const prefix = JSON.stringify(expected)
if (JSON.stringify(args.slice(0, 5)) !== prefix) {
  console.error('Unexpected gh arguments: ' + JSON.stringify(args)); process.exit(2)
}
const answer = (file, openFile) => {
  if (fs.existsSync(openFile)) { console.error('fake GitHub failure'); process.exit(1) }
  if (!fs.existsSync(file)) { console.error('gh: Not Found (HTTP 404)'); process.exit(1) }
  process.stdout.write(fs.readFileSync(file))
}
const single = /^repos\\/example\\/project\\/issues\\/([1-9][0-9]*)$/.exec(target || '')
if (target === 'repos/example/project/issues') {
  const pageArgs = ['-f', 'state=open', '-F', 'per_page=100', '-F']
  const page = args[11]
  if (JSON.stringify(args.slice(6, 11)) !== JSON.stringify(pageArgs) || !/^page=[1-9][0-9]*$/.test(page || '') || args.length !== 12) {
    console.error('Unexpected listing arguments: ' + JSON.stringify(args)); process.exit(2)
  }
  const number = page.slice(5)
  fs.writeFileSync(path.join(process.env.FAKE_PAGES, 'started-' + number), '')
  const run = () => answer(path.join(process.env.FAKE_PAGES, number + '.json'), path.join(process.env.FAKE_PAGES, 'fail-' + number))
  if (fs.existsSync(path.join(process.env.FAKE_PAGES, 'block-' + number))) {
    const timer = setInterval(() => {
      if (fs.existsSync(path.join(process.env.FAKE_PAGES, 'release-' + number))) { clearInterval(timer); run() }
    }, 20)
  } else run()
} else if (single && args.length === 6) {
  answer(path.join(process.env.FAKE_ISSUES, single[1] + '.json'), path.join(process.env.FAKE_ISSUES, 'fail-' + single[1]))
} else if (target === 'repos/example/project/collaborators' && args.length === 6) {
  answer(path.join(process.env.FAKE_ROOT, 'collaborators.json'), path.join(process.env.FAKE_ROOT, 'fail-collaborators'))
} else {
  console.error('Unexpected gh arguments: ' + JSON.stringify(args)); process.exit(2)
}
`

async function fixture(t, { remote = true } = {}) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'issue-catchup-'))
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
    assert.ok(path.basename(root).startsWith('issue-catchup-'))
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
  for (const name of ['listener.mjs', 'events.mjs', 'queue.mjs', 'lock.mjs', 'project-root.cjs']) {
    await fs.copyFile(path.join(source, name), path.join(tools, name))
  }
  const localModules = path.join(source, 'node_modules')
  await fs.symlink(await exists(localModules) ? localModules : fallbackModules, path.join(tools, 'node_modules'), 'dir')
  await fs.writeFile(path.join(root, '.waymark/config.toml'), 'schema = 1\n')
  await fs.writeFile(path.join(root, '.work-weave/shared/handles.toml'), '[handles]\nalice = "alice-handle"\nbob = "bob-handle"\n[pending]\npath = ".work-weave/personal/communication/pending.jsonl"\n')
  await fs.writeFile(path.join(root, '.work-weave/personal/issue-listener.env'), 'REPOSITORY=example/project\n')
  await fs.writeFile(path.join(tools, 'package.json'), '{ "type": "module" }\n')
  await fs.writeFile(path.join(bin, 'gh'), fakeGh, { mode: 0o755 })
  // The repository's collaborators, as the listener reads them for a pull
  // request. alice can merge; bob can only read.
  await fs.writeFile(path.join(root, 'collaborators.json'), JSON.stringify([
    { login: 'alice-handle', role_name: 'admin', permissions: { admin: true, maintain: true, push: true, triage: true, pull: true } },
    { login: 'bob-handle', role_name: 'read', permissions: { admin: false, maintain: false, push: false, triage: false, pull: true } },
  ]))
  git(root, 'init', '--quiet')
  git(root, 'config', 'user.name', 'alice')
  if (remote) git(root, 'remote', 'add', 'origin', 'https://github.com/example/project.git')
  return {
    root, tools, bin, pages, issues, children,
    queue: path.join(root, '.work-weave/personal/communication/pending.jsonl'),
    calls: path.join(root, 'calls'),
  }
}

async function stage(f, page, records) {
  await fs.writeFile(path.join(f.pages, `${page}.json`), typeof records === 'string' ? records : JSON.stringify(records))
}

// Stages what GitHub answers for one issue read back from the webhook.
async function single(f, number, record) {
  await fs.writeFile(path.join(f.issues, `${number}.json`), typeof record === 'string' ? record : JSON.stringify(record))
}

async function freePort() {
  const server = net.createServer()
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const { port } = server.address()
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  return port
}

// Binding to port 0 and closing gives a number another suite may take a moment
// later, so a listener that finds it in use takes another rather than failing.
const PORT_IN_USE = /EADDRINUSE/

async function start(f) {
  for (let attempt = 0; attempt < 10; attempt++) {
    const port = await freePort()
    const env = {
      ...process.env, PORT: String(port), SMEE_URL: '', PATH: `${f.bin}${path.delimiter}${process.env.PATH}`,
      FAKE_PAGES: f.pages, FAKE_ISSUES: f.issues, FAKE_CALLS: f.calls, FAKE_ROOT: f.root,
    }
    delete env.WEBHOOK_SECRET
    delete env.REPOSITORY
    const child = spawn(process.execPath, [path.join(f.tools, 'listener.mjs')], { cwd: f.root, env, stdio: ['ignore', 'pipe', 'pipe'] })
    f.children.add(child)
    let output = ''
    child.stdout.on('data', (chunk) => { output += chunk })
    child.stderr.on('data', (chunk) => { output += chunk })
    await waitFor(() => output.includes('listening on') || child.exitCode !== null, 'listener startup', () => output)
    if (child.exitCode === null) return { child, port, output: () => output }
    if (PORT_IN_USE.test(output)) continue
    assert.fail(output)
  }
  throw new Error('no port the listener could take')
}

async function stop(listener) {
  if (listener.child.exitCode === null && listener.child.signalCode === null) {
    const exited = once(listener.child, 'exit')
    listener.child.kill()
    await exited
  }
}

async function finish(listener, outcome = 'complete') {
  await waitFor(() => listener.output().includes(`Catch-up ${outcome}:`), `catch-up ${outcome}`, listener.output)
}

const messageBody = '{ kind: communicate, category: request }'

// One issue record as GitHub returns it to the listing and to a single read.
function issue(number, {
  title = `Issue ${number}`, body, category = 'request',
  author = 'alice-handle', assignee = 'alice-handle', state = 'open', ...extra
} = {}) {
  return {
    number,
    html_url: `https://github.com/example/project/issues/${number}`,
    title,
    state,
    body: body ?? `---\n${messageBody.replace('request', category)}\n---\nBody`,
    user: { login: author },
    assignee: assignee === null ? null : { login: assignee },
    ...extra,
  }
}

async function queue(f) {
  try { return await fs.readFile(f.queue, 'utf8') } catch (error) {
    if (error.code === 'ENOENT') return ''
    throw error
  }
}

async function entries(f) {
  return (await queue(f)).trim().split('\n').filter(Boolean).map((line) => JSON.parse(line))
}

async function calls(f) {
  try { return (await fs.readFile(f.calls, 'utf8')).trim().split('\n').filter(Boolean).map(JSON.parse) } catch (error) {
    if (error.code === 'ENOENT') return []
    throw error
  }
}

async function webhook(port, payload) {
  const raw = JSON.stringify(payload)
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port, path: '/webhook', method: 'POST', headers: { 'content-type': 'application/json', 'x-github-event': 'issues' } }, (res) => {
      let body = ''
      res.on('data', (chunk) => { body += chunk })
      res.on('end', () => resolve({ status: res.statusCode, body }))
      res.on('error', reject)
    })
    req.on('error', reject)
    req.end(raw)
  })
}

// An `issues` webhook for one action on one issue record.
function event(action, record, extra = {}) {
  return {
    action,
    repository: { full_name: 'example/project' },
    issue: record,
    sender: { login: record.user.login },
    ...extra,
  }
}

test('the scan queues a sent issue the queue lacks and marks one it no longer lists', async (t) => {
  const f = await fixture(t)
  const gone = { url: 'https://github.com/example/project/issues/21', from: 'alice', to: 'bob', owner: 'bob', title: 'Already closed', received: '2026-01-01T00:00:00Z', closed_at: null }
  await fs.mkdir(path.dirname(f.queue), { recursive: true })
  await fs.writeFile(f.queue, `${JSON.stringify(gone)}\n`)
  await stage(f, 1, [issue(21, { title: 'Already closed', author: 'alice-handle', assignee: 'bob-handle', state: 'closed' }), issue(22, { title: 'Sent and open', author: 'alice-handle', assignee: 'bob-handle' })])
  const listener = await start(f)
  await finish(listener)
  const found = await entries(f)
  assert.deepEqual(found.map(({ url, from, to, title }) => [url, from, to, title]), [
    ['https://github.com/example/project/issues/21', 'alice', 'bob', 'Already closed'],
    ['https://github.com/example/project/issues/22', 'alice', 'bob', 'Sent and open'],
  ])
  assert.match(found[0].closed_at, /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/)
  assert.equal(found[1].closed_at, null)
})

test('catch-up reconciles the queue with the open issues it lists', async (t) => {
  const f = await fixture(t)
  const keep = { url: 'https://github.com/example/project/issues/1', from: 'bob', to: 'alice', owner: 'alice', title: 'Still open', received: '2026-01-01T00:00:00Z', closed_at: null }
  const stale = { url: 'https://github.com/example/project/issues/7', from: 'bob', to: 'alice', owner: 'alice', title: 'Closed since', received: '2026-01-01T00:00:00Z', closed_at: null }
  const elsewhere = { url: 'https://github.com/other/repo/issues/3', from: 'bob', to: 'alice', owner: 'alice', title: 'Another checkout', received: '2026-01-01T00:00:00Z', closed_at: null }
  await fs.mkdir(path.dirname(f.queue), { recursive: true })
  await fs.writeFile(f.queue, [keep, stale, elsewhere].map((entry) => `${JSON.stringify(entry)}\n`).join(''))
  const first = [
    issue(1, { title: 'Still open' }),
    issue(2, { author: 'bob-handle', assignee: 'bob-handle' }),
    issue(3, { body: '---\nkind: task\n---\n' }),
    issue(4, { pull_request: { url: 'https://api.github.com/repos/example/project/pulls/4' } }),
    issue(6, { title: '' }),
    issue(8, { body: '---\nkind: communicate\n---\n' }),
    issue(9, { body: '---\nkind: communicate\ncategory: notice\n---\n' }),
    issue(10, { body: '---\nkind: communicate\ncategory: request\nbroken [\n---\n' }),
    issue(12, { assignee: 'unmapped' }),
    issue(13, { assignee: null }),
    issue(14, { author: 'stranger' }),
    issue(15, { state: 'closed' }),
    null,
    ...Array.from({ length: 87 }, (_, index) => issue(100 + index, { body: 'ordinary issue' })),
  ]
  assert.equal(first.length, 100)
  await stage(f, 1, first)
  await stage(f, 2, [issue(16, { title: 'Second page' }), issue(2, { author: 'bob-handle', assignee: 'bob-handle' })])
  const listener = await start(f)
  await finish(listener)
  const found = await entries(f)
  // Issue 2 has bob at both ends and this machine belongs to alice, so neither
  // its page-1 nor its page-2 copy is queued. Issue 1 is still open, so its line
  // stays; issue 7 is no longer listed, so its line is marked closed and kept;
  // the other checkout's thread was never listed here, so it is left alone.
  assert.deepEqual(found.map(({ url, from, to }) => [url, from, to]), [
    ['https://github.com/example/project/issues/1', 'bob', 'alice'],
    ['https://github.com/example/project/issues/7', 'bob', 'alice'],
    ['https://github.com/other/repo/issues/3', 'bob', 'alice'],
    ['https://github.com/example/project/issues/16', 'alice', 'alice'],
  ])
  assert.equal(found[0].closed_at, null)
  assert.match(found[1].closed_at, /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/)
  assert.equal(found[2].closed_at, null)
  assert.equal(found[3].title, 'Second page')
  assert.equal(found[3].closed_at, null)
  assert.match(found[3].received, /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/)
  // Every line is the current shape, with no list marker.
  for (const line of (await queue(f)).trimEnd().split('\n')) assert.ok(line.startsWith('{'), line)
  assert.deepEqual((await calls(f)).map((args) => args.at(-1)), ['page=1', 'page=2'])
  const beforeRestart = await queue(f)
  await stop(listener)
  const restarted = await start(f)
  await finish(restarted)
  assert.equal(await queue(f), beforeRestart)
  assert.deepEqual((await calls(f)).map((args) => args.at(-1)), ['page=1', 'page=2', 'page=1', 'page=2'])
})

test('webhook stays available during a delayed scan and does not duplicate its issue', async (t) => {
  const f = await fixture(t)
  const live = issue(10, { title: 'During startup' })
  await stage(f, 1, [live, issue(11, { title: 'Previously open' })])
  await fs.writeFile(path.join(f.pages, 'block-1'), '')
  const listener = await start(f)
  await waitFor(() => exists(path.join(f.pages, 'started-1')), 'blocked GitHub request', listener.output)
  assert.ok(!listener.output().includes('Catch-up complete:'))
  // The scan listed this issue as open before the event arrived and the event
  // was confirmed against GitHub afterwards, so the thread is queued once.
  await single(f, 10, live)
  const response = await webhook(listener.port, event('opened', live))
  assert.deepEqual(response, { status: 202, body: 'queued 1\n' })
  await fs.writeFile(path.join(f.pages, 'release-1'), '')
  await finish(listener)
  const found = await entries(f)
  assert.deepEqual(found.map(({ url, from, to }) => [url, from, to]), [
    [live.html_url, 'alice', 'alice'],
    ['https://github.com/example/project/issues/11', 'alice', 'alice'],
  ])
})

test('a scan that fails changes nothing in the queue', async (t) => {
  for (const scenario of ['missing remote', 'gh failure', 'invalid JSON', 'non-array response', 'later page failure']) {
    await t.test(scenario, async (t) => {
      const f = await fixture(t, { remote: scenario !== 'missing remote' })
      const stale = { url: 'https://github.com/example/project/issues/7', from: 'bob', to: 'alice-handle', owner: 'alice', title: 'Closed since', received: '2026-01-01T00:00:00Z', closed_at: null }
      await fs.mkdir(path.dirname(f.queue), { recursive: true })
      const original = `${JSON.stringify(stale)}\n`
      await fs.writeFile(f.queue, original)
      if (scenario === 'gh failure') await fs.writeFile(path.join(f.pages, 'fail-1'), '')
      else if (scenario === 'invalid JSON') await stage(f, 1, '{broken')
      else if (scenario === 'non-array response') await stage(f, 1, { message: 'not an array' })
      else if (scenario === 'later page failure') {
        await stage(f, 1, Array.from({ length: 100 }, (_, n) => issue(1000 + n, { body: 'ordinary issue' })))
        await fs.writeFile(path.join(f.pages, 'fail-2'), '')
      } else await stage(f, 1, [])
      const listener = await start(f)
      await finish(listener, 'failed')
      assert.ok(!listener.output().includes('Catch-up complete:'), listener.output())
      // Issue 7 is not in the listing either, and a failed scan still leaves it
      // exactly as it was.
      assert.equal(await queue(f), original)
      if (scenario === 'missing remote') assert.deepEqual(await calls(f), [])
      if (scenario === 'later page failure') assert.deepEqual((await calls(f)).map((args) => args.at(-1)), ['page=1', 'page=2'])
    })
  }
})

test('an event queues only what GitHub confirms', async (t) => {
  const f = await fixture(t)
  const listener = await start(f)
  const confirmed = issue(2, { title: 'Confirmed' })
  // GitHub reads the issue, and the listing has nothing to add.
  await single(f, 2, confirmed)
  assert.deepEqual(await webhook(listener.port, event('opened', confirmed)), { status: 202, body: 'queued 1\n' })
  const [entry] = await entries(f)
  assert.deepEqual({ ...entry, received: '<time>' }, {
    url: confirmed.html_url, from: 'alice', to: 'alice', owner: 'alice', title: 'Confirmed', received: '<time>', closed_at: null,
  })

  // A second event on the same thread adds nothing.
  assert.deepEqual(await webhook(listener.port, event('assigned', confirmed)), { status: 202, body: 'queued 0\n' })
  assert.deepEqual(await webhook(listener.port, event('opened', confirmed)), { status: 202, body: 'queued 0\n' })
  assert.equal((await entries(f)).length, 1)

  // An issue GitHub will not confirm, with the number the event names.
  const missing = issue(3, { title: 'Not on GitHub' })
  assert.deepEqual(await webhook(listener.port, event('opened', missing)), { status: 202, body: 'queued 0\n' })
  await waitFor(() => listener.output().includes('Skipped issue #3: GitHub would not confirm it: '), 'unconfirmed issue log', listener.output)

  // An issue whose author is not the event's author.
  const forged = issue(4, { title: 'Someone else' })
  await single(f, 4, { ...forged, user: { login: 'bob-handle' } })
  assert.deepEqual(await webhook(listener.port, event('opened', forged)), { status: 202, body: 'queued 0\n' })
  await waitFor(() => listener.output().includes('Skipped issue #4: GitHub says issue #4 was opened by bob-handle, not by alice-handle'), 'author mismatch log', listener.output)

  const lines = (await queue(f)).trimEnd().split('\n')
  assert.equal(lines.length, 1, 'a dropped event wrote a line')
  // Each drop is one line on stderr, and nothing else was said about them.
  const skipped = listener.output().split('\n').filter((line) => line.startsWith('Skipped issue #3:') || line.startsWith('Skipped issue #4:'))
  assert.equal(skipped.length, 2, listener.output())
})

test('an assigned event queues a message opened without an assignee', async (t) => {
  const f = await fixture(t)
  const listener = await start(f)
  const unassigned = issue(5, { title: 'Waiting for an owner', assignee: null })
  await single(f, 5, unassigned)
  assert.deepEqual(await webhook(listener.port, event('opened', unassigned)), { status: 202, body: 'queued 0\n' })
  await waitFor(() => listener.output().includes('Skipped issue #5: no assignee'), 'no assignee log', listener.output)
  assert.equal(await queue(f), '')

  const assigned = issue(5, { title: 'Waiting for an owner' })
  await single(f, 5, assigned)
  assert.deepEqual(await webhook(listener.port, event('assigned', assigned)), { status: 202, body: 'queued 1\n' })
  // The same thread queues once, whichever event came first.
  assert.deepEqual(await webhook(listener.port, event('opened', assigned)), { status: 202, body: 'queued 0\n' })
  const found = await entries(f)
  assert.equal(found.length, 1)
  assert.deepEqual([found[0].from, found[0].to, found[0].title], ['alice', 'alice', 'Waiting for an owner'])
})

test('an issue whose two parties are other members is not queued', async (t) => {
  const f = await fixture(t)
  const listener = await start(f)
  const toBob = issue(17, { title: 'Bob handles this', author: 'bob-handle', assignee: 'bob-handle' })
  await single(f, 17, toBob)
  assert.deepEqual(await webhook(listener.port, event('opened', toBob)), { status: 202, body: 'queued 0\n' })
  await waitFor(() => listener.output().includes('Skipped issue #17: bob to bob does not involve alice'), 'not involved log', listener.output)
  assert.equal(await queue(f), '')

  // An issue alice sent to bob is queued here: the sender is party to it too.
  const fromAlice = issue(18, { title: 'Bob, please', author: 'alice-handle', assignee: 'bob-handle' })
  await single(f, 18, fromAlice)
  assert.deepEqual(await webhook(listener.port, event('opened', fromAlice)), { status: 202, body: 'queued 1\n' })
  const [entry] = await entries(f)
  assert.deepEqual([entry.from, entry.to, entry.owner, entry.title], ['alice', 'bob', 'bob', 'Bob, please'])
  assert.equal(entry.closed_at, null)
})

test('a mention in the body names no recipient', async (t) => {
  const f = await fixture(t)
  const listener = await start(f)
  // The front matter still says `to` and `from`, as a message written before
  // this change does. The assignee is what decides, and it is not alice.
  const legacy = issue(6, {
    title: 'Old shape',
    assignee: null,
    body: '---\nkind: communicate\ncategory: request\nfrom: "sender"\nto: ["alice-handle"]\n---\nHey @alice-handle',
  })
  await single(f, 6, legacy)
  assert.deepEqual(await webhook(listener.port, event('opened', legacy)), { status: 202, body: 'queued 0\n' })
  assert.equal(await queue(f), '')

  const legacyAssigned = issue(6, {
    title: 'Old shape',
    assignee: 'alice-handle',
    body: '---\nkind: communicate\ncategory: request\nfrom: "sender"\nto: ["bob-handle"]\n---\nHey @bob-handle',
  })
  await single(f, 6, legacyAssigned)
  assert.deepEqual(await webhook(listener.port, event('opened', legacyAssigned)), { status: 202, body: 'queued 1\n' })
  const [entry] = await entries(f)
  // The sender is the account that opened it, not the `from` in the body, and
  // the recipient is the assignee, not the `to` in the body.
  assert.deepEqual([entry.from, entry.to, entry.owner], ['alice', 'alice', 'alice'])
})

test('closing marks the thread closed without writing a new line', async (t) => {
  const f = await fixture(t)
  const listener = await start(f)
  const record = issue(7, { title: 'To be closed' })
  await single(f, 7, record)
  assert.deepEqual(await webhook(listener.port, event('opened', record)), { status: 202, body: 'queued 1\n' })
  const [queued] = await entries(f)
  assert.equal(queued.closed_at, null)

  const closedAt = '2026-11-20T03:00:00Z'
  assert.deepEqual(await webhook(listener.port, event('closed', { ...record, state: 'closed' }, { closed_at: closedAt, closed_by: { login: 'alice-handle' } })), { status: 202, body: 'queued 1\n' })
  const found = await entries(f)
  assert.equal(found.length, 1)
  assert.equal(found[0].closed_at, closedAt)
  assert.equal(found[0].title, 'To be closed')

  // A recipient who closes is not the sender, and the line stays open.
  const other = issue(8, { title: 'Closed by its recipient' })
  await single(f, 8, other)
  assert.deepEqual(await webhook(listener.port, event('opened', other)), { status: 202, body: 'queued 1\n' })
  assert.deepEqual(await webhook(listener.port, event('closed', { ...other, state: 'closed' }, { closed_at: closedAt, closed_by: { login: 'bob-handle' } })), { status: 202, body: 'queued 0\n' })
  const lines = await entries(f)
  assert.equal(lines.length, 2)
  assert.equal(lines[1].closed_at, null)

  // A thread never queued is not added by its close.
  const never = issue(9, { title: 'Never queued', assignee: 'bob-handle' })
  assert.deepEqual(await webhook(listener.port, event('closed', { ...never, state: 'closed' }, { closed_at: closedAt })), { status: 202, body: 'queued 0\n' })
  assert.equal((await entries(f)).length, 2)
})

test('the roster is read from the new path when it exists', async (t) => {
  const f = await fixture(t)
  await fs.mkdir(path.join(f.root, '.work-weave/shared'), { recursive: true })
  await fs.writeFile(path.join(f.root, '.work-weave/shared/handles.toml'), '[handles]\nalice = "alice-handle"\ncarol = "carol-handle"\n[pending]\npath = ".work-weave/personal/communication/pending.jsonl"\n')
  const listener = await start(f)
  // bob is only in the old roster, so his login is a stranger here.
  const outsider = issue(11, { title: 'Old roster only', assignee: 'alice-handle', author: 'bob-handle' })
  await single(f, 11, outsider)
  assert.deepEqual(await webhook(listener.port, event('opened', outsider)), { status: 202, body: 'queued 0\n' })
  // carol is only in the new roster, and her message reaches alice.
  const newcomer = issue(12, { title: 'New roster', author: 'carol-handle', assignee: 'alice-handle' })
  await single(f, 12, newcomer)
  assert.deepEqual(await webhook(listener.port, event('opened', newcomer)), { status: 202, body: 'queued 1\n' })
  assert.deepEqual((await entries(f)).map(({ from, to }) => [from, to]), [['carol', 'alice']])
})
