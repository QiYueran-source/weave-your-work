// The event file: a pull request opening and a pull request merge or a push to
// the default branch, recorded one JSON object per line, newest N kept, and
// nobody warned. Each test starts a real listener against a temporary checkout,
// sends an event over HTTP, and reads the file back. GitHub is a fake `gh` on
// PATH, the same seam the startup scan uses.
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
import { formatEvent, parseEvents, readEvents, trimEvents } from '../events.mjs'

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

// The fake `gh` answers the four reads the listener makes: the open-issue
// listing from `pages/1.json`, a single issue from `issues/<n>.json`, a single
// pull request from `pulls/<n>.json`, and the collaborator listing from
// `collaborators.json`. A missing file is what GitHub answers for a record that
// is not there. A `fail-<name>` file makes the read print an error and exit 1,
// the way `gh` reports a failed request.
const fakeGh = `#!${process.execPath}
const fs = require('node:fs')
const path = require('node:path')
const args = process.argv.slice(2)
if (process.cwd() !== process.env.FAKE_ROOT) { console.error('gh ran outside the project root'); process.exit(2) }
fs.appendFileSync(process.env.FAKE_CALLS, JSON.stringify(args) + '\\n')
const expected = ['api', '--hostname', 'github.com', '--method', 'GET']
const target = args[5]
if (JSON.stringify(args.slice(0, 5)) !== JSON.stringify(expected)) {
  console.error('Unexpected gh arguments: ' + JSON.stringify(args)); process.exit(2)
}
const answer = (file, openFile) => {
  if (fs.existsSync(openFile)) { console.error('fake GitHub failure'); process.exit(1) }
  if (!fs.existsSync(file)) { console.error('gh: Not Found (HTTP 404)'); process.exit(1) }
  process.stdout.write(fs.readFileSync(file))
}
const single = /^repos\\/example\\/project\\/(issues|pulls)\\/([1-9][0-9]*)$/.exec(target || '')
if (target === 'repos/example/project/issues') {
  answer(path.join(process.env.FAKE_PAGES, '1.json'), path.join(process.env.FAKE_PAGES, 'fail-1'))
} else if (target === 'repos/example/project/collaborators' && args.length === 6) {
  answer(path.join(process.env.FAKE_ROOT, 'collaborators.json'), path.join(process.env.FAKE_ROOT, 'fail-collaborators'))
} else if (single && args.length === 6) {
  const dir = single[1] === 'pulls' ? process.env.FAKE_PULLS : process.env.FAKE_ISSUES
  answer(path.join(dir, single[2] + '.json'), path.join(dir, 'fail-' + single[2]))
} else {
  console.error('Unexpected gh arguments: ' + JSON.stringify(args)); process.exit(2)
}
`

async function fixture(t, { extraHandles = '', roster = '', collaborators = DEFAULT_COLLABORATORS } = {}) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'issue-events-'))
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
    assert.ok(path.basename(root).startsWith('issue-events-'))
    await fs.rm(root, { recursive: true, force: true })
  })
  const tools = path.join(root, '.work-weave/runtime/issue')
  const bin = path.join(root, 'bin')
  const pages = path.join(root, 'pages')
  const issues = path.join(root, 'issues')
  const pulls = path.join(root, 'pulls')
  await Promise.all([
    fs.mkdir(tools, { recursive: true }),
    fs.mkdir(path.join(root, '.work-weave/issue'), { recursive: true }),
    fs.mkdir(path.join(root, '.work-weave/local'), { recursive: true }),
    fs.mkdir(path.join(root, '.waymark'), { recursive: true }),
    fs.mkdir(bin),
    fs.mkdir(pages),
    fs.mkdir(issues),
    fs.mkdir(pulls),
  ])
  for (const name of ['listener.mjs', 'events.mjs', 'queue.mjs', 'lock.mjs', 'project-root.cjs']) {
    await fs.copyFile(path.join(source, name), path.join(tools, name))
  }
  const localModules = path.join(source, 'node_modules')
  await fs.symlink(await exists(localModules) ? localModules : fallbackModules, path.join(tools, 'node_modules'), 'dir')
  await fs.writeFile(path.join(tools, 'package.json'), '{ "type": "module" }\n')
  await fs.writeFile(path.join(root, '.waymark/config.toml'), 'schema = 1\n')
  await fs.writeFile(path.join(bin, 'gh'), fakeGh, { mode: 0o755 })
  // The startup scan lists no open issues unless a test stages some.
  await fs.writeFile(path.join(pages, '1.json'), '[]\n')
  if (collaborators !== null) await fs.writeFile(path.join(root, 'collaborators.json'), JSON.stringify(collaborators))
  await fs.writeFile(path.join(root, '.work-weave/issue/handles.toml'),
    `[handles]\nalice = "alice-handle"\nbob = "bob-handle"\ncarol = "carol-handle"\n${extraHandles}[pending]\npath = ".work-weave/personal/communication/pending.jsonl"\n${roster}`)
  await fs.writeFile(path.join(root, '.work-weave/local/issue-listener.env'), 'REPOSITORY=example/project\n')
  git(root, 'init', '--quiet')
  git(root, 'config', 'user.name', 'alice')
  git(root, 'remote', 'add', 'origin', 'https://github.com/example/project.git')
  return {
    root, tools, bin, pages, issues, pulls, children,
    queue: path.join(root, '.work-weave/personal/communication/pending.jsonl'),
    events: path.join(root, '.work-weave/personal/communication/events.jsonl'),
    calls: path.join(root, 'calls'),
  }
}

// alice can administer the repository, bob can push to it, and carol can only
// read it. All three are in the roster, so only the permission filters them.
// dave can administer it too and is only half in the roster: he is listed under
// a case that differs from his login.
const DEFAULT_COLLABORATORS = [
  { login: 'alice-handle', role_name: 'admin', permissions: { admin: true, maintain: true, push: true, triage: true, pull: true } },
  { login: 'bob-handle', role_name: 'write', permissions: { admin: false, maintain: false, push: true, triage: true, pull: true } },
  { login: 'carol-handle', role_name: 'read', permissions: { admin: false, maintain: false, push: false, triage: false, pull: true } },
  { login: 'dave-handle', role_name: 'admin', permissions: { admin: true, maintain: true, push: true, triage: true, pull: true } },
]

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
      FAKE_PAGES: f.pages, FAKE_ISSUES: f.issues, FAKE_PULLS: f.pulls, FAKE_CALLS: f.calls, FAKE_ROOT: f.root,
    }
    delete env.WEBHOOK_SECRET
    delete env.REPOSITORY
    const child = spawn(process.execPath, [path.join(f.tools, 'listener.mjs')], { cwd: f.root, env, stdio: ['ignore', 'pipe', 'pipe'] })
    f.children.add(child)
    let output = ''
    child.stdout.on('data', (chunk) => { output += chunk })
    child.stderr.on('data', (chunk) => { output += chunk })
    await waitFor(() => output.includes('listening on') || child.exitCode !== null, 'listener startup', () => output)
    if (child.exitCode !== null) {
      if (PORT_IN_USE.test(output)) continue
      assert.fail(output)
    }
    await waitFor(() => output.includes('Catch-up complete:') || output.includes('Catch-up failed:'), 'catch-up', () => output)
    return { child, port, output: () => output }
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

async function webhook(port, event, payload) {
  const raw = JSON.stringify(payload)
  return new Promise((resolve, reject) => {
    const req = http.request({
      host: '127.0.0.1', port, path: '/webhook', method: 'POST',
      headers: { 'content-type': 'application/json', 'x-github-event': event },
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

// One pull request record as GitHub returns it to a single read.
function pull(number, { title = `Pull ${number}`, state = 'open', merged = false, mergeCommit = null, author = 'alice-handle' } = {}) {
  return {
    number,
    html_url: `https://github.com/example/project/pull/${number}`,
    title,
    state,
    merged,
    merged_at: merged ? '2026-11-20T04:00:00Z' : null,
    merge_commit_sha: mergeCommit,
    user: { login: author },
  }
}

async function stagePull(f, record) {
  await fs.writeFile(path.join(f.pulls, `${record.number}.json`), JSON.stringify(record))
}

// A `pull_request` webhook body for one action on one pull request.
function pullEvent(action, record, extra = {}) {
  return {
    action,
    repository: { full_name: 'example/project' },
    pull_request: record,
    sender: { login: record.user.login },
    ...extra,
  }
}

async function events(f) {
  try {
    return (await fs.readFile(f.events, 'utf8')).trim().split('\n').filter(Boolean).map((line) => JSON.parse(line))
  } catch (error) {
    if (error.code === 'ENOENT') return []
    throw error
  }
}

async function calls(f) {
  try { return (await fs.readFile(f.calls, 'utf8')).trim().split('\n').filter(Boolean).map(JSON.parse) } catch (error) {
    if (error.code === 'ENOENT') return []
    throw error
  }
}

// Every line a listener wrote to stderr that starts with `prefix`.
function stderrLines(listener, prefix) {
  return listener.output().split('\n').filter((line) => line.startsWith(prefix))
}

const TIME = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/

test('a pull request opened event writes one line with the number, title, and merge rights', async (t) => {
  const f = await fixture(t)
  const listener = await start(f)
  const record = pull(7, { title: 'Add the event file' })
  await stagePull(f, record)
  assert.deepEqual(await webhook(listener.port, 'pull_request', pullEvent('opened', record)), { status: 202, body: 'recorded 1\n' })
  const found = await events(f)
  assert.equal(found.length, 1)
  const [line] = found
  assert.match(line.at, TIME)
  assert.deepEqual({ ...line, at: '<time>' }, {
    kind: 'pull-request-opened',
    number: 7,
    title: 'Add the event file',
    url: 'https://github.com/example/project/pull/7',
    author: 'alice-handle',
    at: '<time>',
    // alice and bob can merge; carol can only read; dave is not in the roster.
    merge_rights: ['alice-handle', 'bob-handle'],
  })
  // The file is one bare JSON object per line, with no reader state.
  const raw = await fs.readFile(f.events, 'utf8')
  assert.ok(raw.endsWith('\n'))
  assert.ok(raw.trimEnd().split('\n').every((text) => text.startsWith('{')))
  // Merge rights came from one collaborator listing, and the pull request was
  // read back once.
  const list = (await calls(f)).filter((args) => args.at(-1)?.endsWith('/collaborators'))
  assert.equal(list.length, 1)
  assert.deepEqual(list[0].at(-1), 'repos/example/project/collaborators')
  assert.ok((await calls(f)).some((args) => args.at(-1) === 'repos/example/project/pulls/7'))
  // The event file is the record; the queue is untouched and nobody is warned.
  assert.equal(await exists(f.queue), false)
  assert.deepEqual(stderrLines(listener, 'Skipped'), [])
})

test('a collaborator listing that fails writes no line and logs it', async (t) => {
  const f = await fixture(t)
  const listener = await start(f)
  const record = pull(8, { title: 'Cannot read collaborators' })
  await stagePull(f, record)
  await fs.writeFile(path.join(f.root, 'fail-collaborators'), '')
  assert.deepEqual(await webhook(listener.port, 'pull_request', pullEvent('opened', record)), { status: 202, body: 'ignored' })
  await waitFor(() => stderrLines(listener, 'Skipped pull request #8: cannot read the collaborators:').length === 1,
    'collaborator failure log', listener.output)
  assert.deepEqual(await events(f), [])
  assert.equal(await exists(f.events), false, 'a failed listing created the event file')

  // The listing answers with something that is not a list: the same refusal.
  await fs.rm(path.join(f.root, 'fail-collaborators'))
  await fs.writeFile(path.join(f.root, 'collaborators.json'), JSON.stringify({ message: 'not a list' }))
  assert.deepEqual(await webhook(listener.port, 'pull_request', pullEvent('opened', record)), { status: 202, body: 'ignored' })
  await waitFor(() => listener.output().includes('an invalid collaborator listing'), 'invalid listing log', listener.output)
  assert.deepEqual(await events(f), [])
  assert.equal(stderrLines(listener, 'Skipped pull request #8:').length, 2, listener.output())
})

test('the roster filters the collaborator listing', async (t) => {
  // Dave can administer the repository but is not in the roster, so he holds no
  // merge rights the file can name. Carol is in the roster and in the listing
  // and cannot merge. A login that differs only by case still matches.
  const collaborators = [
    ...DEFAULT_COLLABORATORS,
    { login: 'erin-handle', role_name: 'write', permissions: { push: true } },
    { login: 'frank-handle', role_name: 'maintain', permissions: { maintain: true, push: false } },
  ]
  const f = await fixture(t, { extraHandles: 'erin = "Erin-Handle"\n', collaborators })
  const listener = await start(f)
  const record = pull(9, { title: 'Who can merge' })
  await stagePull(f, record)
  assert.deepEqual(await webhook(listener.port, 'pull_request', pullEvent('opened', record)), { status: 202, body: 'recorded 1\n' })
  const [line] = await events(f)
  assert.deepEqual(line.merge_rights, ['alice-handle', 'bob-handle', 'Erin-Handle'])
  assert.ok(!line.merge_rights.includes('dave-handle'))
  assert.ok(!line.merge_rights.includes('carol-handle'))
  // Maintain is not write or admin; a role name alone says it without
  // permissions, and that is still read as write.
  assert.ok(!line.merge_rights.includes('frank-handle'))
})

test('a merge and a push to the default branch write the same kind and the same commit', async (t) => {
  const f = await fixture(t)
  const listener = await start(f)
  const merged = 'a1b2c3d4e5f60718293a4b5c6d7e8f9012345678'
  const record = pull(10, { title: 'Merged', state: 'closed', merged: true, mergeCommit: merged })
  await stagePull(f, record)
  assert.deepEqual(await webhook(listener.port, 'pull_request', pullEvent('closed', record, {
    sender: { login: 'bob-handle' }, merged_at: '2026-11-20T04:00:00Z',
  })), { status: 202, body: 'recorded 1\n' })

  const pushed = 'f'.repeat(40)
  assert.deepEqual(await webhook(listener.port, 'push', {
    ref: 'refs/heads/main',
    after: pushed,
    before: merged,
    repository: { full_name: 'example/project' },
    pusher: { name: 'alice' },
    sender: { login: 'alice-handle' },
    commits: [],
  }), { status: 202, body: 'recorded 1\n' })

  const found = await events(f)
  assert.equal(found.length, 2)
  const [merge, push] = found
  assert.equal(merge.kind, 'default-branch-moved')
  assert.equal(merge.commit, merged)
  assert.equal(merge.author, 'bob-handle')
  assert.equal(merge.at, '2026-11-20T04:00:00Z')
  assert.equal(push.kind, 'default-branch-moved')
  assert.equal(push.commit, pushed)
  assert.equal(push.author, 'alice-handle')
  assert.match(push.at, TIME)
  assert.deepEqual(Object.keys(push), ['kind', 'commit', 'author', 'at'])
  // A merge reads the pull request back; a push names everything itself.
  assert.ok((await calls(f)).some((args) => args.at(-1) === 'repos/example/project/pulls/10'))
  assert.ok(!(await calls(f)).some((args) => args.at(-1) === 'repos/example/project/pulls/undefined'))
})

test('a push to any other branch writes no line', async (t) => {
  const f = await fixture(t)
  const listener = await start(f)
  for (const ref of ['refs/heads/feat/edge-agent-runtime-discussion', 'refs/heads/mainline', 'refs/tags/v1', 'refs/heads/']) {
    assert.deepEqual(await webhook(listener.port, 'push', {
      ref, after: 'b'.repeat(40), repository: { full_name: 'example/project' }, sender: { login: 'alice-handle' },
    }), { status: 202, body: 'ignored' }, ref)
  }
  await delay(100)
  assert.deepEqual(await events(f), [])
  assert.equal(await exists(f.events), false)
  // An ignored push logs nothing either.
  assert.deepEqual(stderrLines(listener, 'Skipped'), [])
})

test('a push to main that names no commit writes no line and logs it', async (t) => {
  const f = await fixture(t)
  const listener = await start(f)
  // A deleted branch pushes zeros to `after`.
  assert.deepEqual(await webhook(listener.port, 'push', {
    ref: 'refs/heads/main', after: '0'.repeat(40), repository: { full_name: 'example/project' }, sender: { login: 'alice-handle' },
  }), { status: 202, body: 'recorded 1\n' })
  assert.deepEqual(await webhook(listener.port, 'push', {
    ref: 'refs/heads/main', repository: { full_name: 'example/project' }, sender: { login: 'alice-handle' },
  }), { status: 202, body: 'ignored' })
  await waitFor(() => listener.output().includes('Skipped push to main: the event names no commit'), 'missing commit log', listener.output)
  const found = await events(f)
  assert.equal(found.length, 1)
  assert.equal(found[0].commit, '0'.repeat(40))
})

test('an event the listener cannot confirm against GitHub writes no line and logs one', async (t) => {
  const f = await fixture(t)
  const listener = await start(f)
  // Nothing is staged for pull request 11, so GitHub answers that it does not
  // exist.
  const missing = pull(11, { title: 'Not on GitHub' })
  assert.deepEqual(await webhook(listener.port, 'pull_request', pullEvent('opened', missing)), { status: 202, body: 'ignored' })
  await waitFor(() => stderrLines(listener, 'Skipped pull request #11: GitHub would not confirm it:').length === 1,
    'unconfirmed pull request log', listener.output)
  assert.deepEqual(await events(f), [])
  assert.equal(await exists(f.events), false)

  // A pull request whose author is not the event's author.
  const forged = pull(12, { title: 'Someone else' })
  await stagePull(f, { ...forged, user: { login: 'bob-handle' } })
  assert.deepEqual(await webhook(listener.port, 'pull_request', pullEvent('opened', forged)), { status: 202, body: 'ignored' })
  await waitFor(() => listener.output().includes('Skipped pull request #12: GitHub says pull request #12 was opened by bob-handle, not by alice-handle'),
    'author mismatch log', listener.output)

  // A close GitHub says was never merged, and a close the event calls merged
  // that GitHub says is still open.
  const unmerged = pull(13, { title: 'Abandoned', state: 'closed', merged: false })
  await stagePull(f, unmerged)
  assert.deepEqual(await webhook(listener.port, 'pull_request', pullEvent('closed', { ...unmerged, merged: true })), { status: 202, body: 'ignored' })
  await waitFor(() => listener.output().includes('Skipped pull request #13: GitHub says pull request #13 is not merged'), 'unmerged log', listener.output)

  const open = pull(14, { title: 'Still open' })
  await stagePull(f, open)
  assert.deepEqual(await webhook(listener.port, 'pull_request', pullEvent('closed', { ...open, merged: true })), { status: 202, body: 'ignored' })
  await waitFor(() => listener.output().includes('Skipped pull request #14: GitHub says pull request #14 is not merged'), 'not merged log', listener.output)

  assert.deepEqual(await events(f), [])
  // Each drop is exactly one line on stderr.
  assert.equal(stderrLines(listener, 'Skipped pull request #').length, 4, listener.output())
})

test('a pull request closed without a merge, or another action, is not an event', async (t) => {
  const f = await fixture(t)
  const listener = await start(f)
  const record = pull(15, { title: 'Only opened' })
  await stagePull(f, record)
  for (const action of ['closed', 'reopened', 'labeled', 'synchronize', 'ready_for_review']) {
    assert.deepEqual(await webhook(listener.port, 'pull_request', pullEvent(action, { ...record, state: 'closed' })), { status: 202, body: 'ignored' }, action)
  }
  await delay(100)
  assert.deepEqual(await events(f), [])
  // Nothing was read back for an action that is not recorded.
  assert.deepEqual((await calls(f)).filter((args) => args.at(-1)?.startsWith('repos/example/project/pulls/')), [])
})

test('writing past the configured limit keeps exactly the newest events', async (t) => {
  const f = await fixture(t, { roster: '[events]\nlimit = 3\n' })
  const listener = await start(f)
  const commits = ['1'.repeat(40), '2'.repeat(40), '3'.repeat(40), '4'.repeat(40), '5'.repeat(40)]
  for (const [index, commit] of commits.entries()) {
    assert.deepEqual(await webhook(listener.port, 'push', {
      ref: 'refs/heads/main', after: commit, repository: { full_name: 'example/project' }, sender: { login: 'alice-handle' },
    }), { status: 202, body: 'recorded 1\n' }, `push ${index + 1}`)
    // The trim is part of the write: the file never holds more than the limit.
    assert.ok((await events(f)).length <= 3)
  }
  const found = await events(f)
  assert.deepEqual(found.map((line) => line.commit), commits.slice(-3))
  // The newest is last, as history is read.
  assert.equal(found.at(-1).commit, commits.at(-1))
})

test('a file written past the limit is trimmed to the newest on the next write', async (t) => {
  const f = await fixture(t, { roster: '[events]\nlimit = 2\n' })
  const old = [1, 2, 3, 4].map((index) => ({
    kind: 'default-branch-moved', commit: String(index).repeat(40), author: 'alice-handle', at: '2026-01-01T00:00:00Z',
  }))
  await fs.mkdir(path.dirname(f.events), { recursive: true })
  await fs.writeFile(f.events, old.map((line) => `${JSON.stringify(line)}\n`).join(''))
  const listener = await start(f)
  const fresh = '9'.repeat(40)
  assert.deepEqual(await webhook(listener.port, 'push', {
    ref: 'refs/heads/main', after: fresh, repository: { full_name: 'example/project' }, sender: { login: 'bob-handle' },
  }), { status: 202, body: 'recorded 1\n' })
  const found = await events(f)
  assert.deepEqual(found.map((line) => line.commit), ['4'.repeat(40), fresh])
})

test('the default limit is 100 events', async (t) => {
  const f = await fixture(t)
  const listener = await start(f)
  // Ninety-nine older events, as an earlier listener would have left them.
  const old = Array.from({ length: 99 }, (_, index) => ({
    kind: 'default-branch-moved', commit: index.toString(16).padStart(40, '0'), author: 'alice-handle', at: '2026-01-01T00:00:00Z',
  }))
  await fs.mkdir(path.dirname(f.events), { recursive: true })
  await fs.writeFile(f.events, old.map((line) => `${JSON.stringify(line)}\n`).join(''))
  const fresh = '9'.repeat(40)
  assert.deepEqual(await webhook(listener.port, 'push', {
    ref: 'refs/heads/main', after: fresh, repository: { full_name: 'example/project' }, sender: { login: 'alice-handle' },
  }), { status: 202, body: 'recorded 1\n' })
  let found = await events(f)
  assert.equal(found.length, 100)
  assert.equal(found.at(-1).commit, fresh)
  assert.equal(found[0].commit, old[0].commit)
  // The hundred-and-first drops the oldest.
  assert.deepEqual(await webhook(listener.port, 'push', {
    ref: 'refs/heads/main', after: '8'.repeat(40), repository: { full_name: 'example/project' }, sender: { login: 'alice-handle' },
  }), { status: 202, body: 'recorded 1\n' })
  found = await events(f)
  assert.equal(found.length, 100)
  assert.equal(found[0].commit, old[1].commit)
  assert.equal(found.at(-1).commit, '8'.repeat(40))
})

test('the event path comes from the roster and must stay inside the project', async (t) => {
  const f = await fixture(t, { roster: '[events]\npath = ".work-weave/personal/events.log"\nlimit = 100\n' })
  const listener = await start(f)
  await stagePull(f, pull(16, { title: 'Configured path' }))
  assert.deepEqual(await webhook(listener.port, 'pull_request', pullEvent('opened', pull(16))), { status: 202, body: 'recorded 1\n' })
  const configured = path.join(f.root, '.work-weave/personal/events.log')
  const lines = (await fs.readFile(configured, 'utf8')).trim().split('\n')
  assert.equal(lines.length, 1)
  assert.equal(JSON.parse(lines[0]).title, 'Configured path')
  assert.equal(await exists(f.events), false)
  await stop(listener)

  // A path that leaves the checkout stops the listener before it listens.
  const outside = await fixture(t, { roster: '[events]\npath = "../events.jsonl"\n' })
  const result = spawnSync(process.execPath, [path.join(outside.tools, 'listener.mjs')], {
    cwd: outside.root,
    env: { ...process.env, SMEE_URL: '', PATH: `${outside.bin}${path.delimiter}${process.env.PATH}`, FAKE_ROOT: outside.root, FAKE_CALLS: outside.calls, FAKE_PAGES: outside.pages, FAKE_ISSUES: outside.issues, FAKE_PULLS: outside.pulls },
    encoding: 'utf8', timeout: 60000,
  })
  assert.equal(result.status, 1, result.stderr)
  assert.match(result.stderr, /\[events\]\.path must stay inside the project root/)
})

test('a limit below one is refused at startup', async (t) => {
  for (const limit of ['0', '-3', '2.5', '"ten"']) {
    const f = await fixture(t, { roster: `[events]\nlimit = ${limit}\n` })
    const result = spawnSync(process.execPath, [path.join(f.tools, 'listener.mjs')], {
      cwd: f.root,
      env: { ...process.env, SMEE_URL: '', PATH: `${f.bin}${path.delimiter}${process.env.PATH}`, FAKE_ROOT: f.root, FAKE_CALLS: f.calls, FAKE_PAGES: f.pages, FAKE_ISSUES: f.issues, FAKE_PULLS: f.pulls },
      encoding: 'utf8', timeout: 60000,
    })
    assert.equal(result.status, 1, `${limit}: ${result.stderr}`)
    assert.match(result.stderr, /\[events\]\.limit must be a whole number of at least 1/, limit)
    assert.ok(!result.stdout.includes('listening on'), result.stdout)
  }
})

test('the listener starts no child process, sends nothing to a session, and writes only its two files', async (t) => {
  const f = await fixture(t)
  async function tree() {
    const found = new Map()
    async function walk(dir) {
      for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
        if (entry.name === '.git' || entry.name === 'pages' || entry.name === 'issues' || entry.name === 'pulls') continue
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          await walk(full)
          continue
        }
        if (full === f.calls) continue
        const stat = await fs.stat(full)
        found.set(path.relative(f.root, full), `${stat.size}:${stat.mtimeMs}`)
      }
    }
    await walk(f.root)
    return found
  }
  const listener = await start(f)
  // The lock that says one listener owns the queue exists while it runs.
  const before = await tree()
  await stagePull(f, pull(17, { title: 'Only the events' }))
  assert.deepEqual(await webhook(listener.port, 'pull_request', pullEvent('opened', pull(17))), { status: 202, body: 'recorded 1\n' })
  assert.deepEqual(await webhook(listener.port, 'push', {
    ref: 'refs/heads/main', after: 'c'.repeat(40), repository: { full_name: 'example/project' }, sender: { login: 'alice-handle' },
  }), { status: 202, body: 'recorded 1\n' })
  await stop(listener)
  const after = await tree()
  const changed = [...after].filter(([file, stamp]) => before.get(file) !== stamp).map(([file]) => file).sort()
  const created = [...after.keys()].filter((file) => !before.has(file)).sort()
  // The event file is the one file this listener changed or left behind; the
  // lock that says one listener owns the queue was already there and is gone
  // again. The queue was never written because no issue was queued.
  assert.deepEqual(changed, ['.work-weave/personal/communication/events.jsonl'])
  assert.deepEqual(created, ['.work-weave/personal/communication/events.jsonl'])
  assert.equal(await exists(f.queue), false)
  // Nothing read the file back into a notice: no read marker, no second file.
  const content = await fs.readFile(f.events, 'utf8')
  assert.ok(!/seen|read_at|reader/i.test(content), content)
  // The listener wrote no stdout line about the events it recorded, which is
  // what a tool that warned someone would have to do.
  assert.ok(!/warn|notify|notified/i.test(listener.output().split('\n').filter((line) => !line.startsWith('Webhook signatures')).join('\n')), listener.output())
})

test('the event file module reads, writes, and trims one JSON object per line', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'issue-events-module-'))
  t.after(() => fs.rm(root, { recursive: true, force: true }))
  const file = path.join(root, 'nested', 'events.jsonl')
  // No file until an event is written.
  assert.deepEqual(readEvents(file), [])
  assert.equal(await exists(file), false)
  assert.equal(await exists(path.dirname(file)), false)
  const opened = {
    kind: 'pull-request-opened', number: 3, title: 'Line\nbreak "quoted"', url: 'https://github.com/example/project/pull/3',
    author: 'alice-handle', at: '2026-11-20T01:02:03Z', merge_rights: ['alice-handle'],
  }
  const moved = { kind: 'default-branch-moved', commit: 'd'.repeat(40), author: 'bob-handle', at: '2026-11-20T01:03:00Z' }
  const text = `${formatEvent(opened)}\n${formatEvent(moved)}\n`
  const parsed = parseEvents(text)
  assert.deepEqual(parsed, [opened, moved])
  assert.equal(text.trimEnd().split('\n').length, 2, 'an embedded line break split a line')
  assert.deepEqual(trimEvents([opened, moved], 1), [moved])
  assert.deepEqual(trimEvents([opened, moved], 5), [opened, moved])
  // Malformed lines are named, never silently dropped.
  assert.throws(() => parseEvents('{"kind":"pull-request-opened"}\n'), /Invalid event on line 1/)
  assert.throws(() => parseEvents(`${formatEvent(moved)}\n{broken\n`), /Invalid event on line 2/)
  assert.throws(() => parseEvents('{"kind":"push","commit":"x"}\n'), /Invalid event on line 1/)
  assert.throws(() => trimEvents([opened], 0), /at least 1/)
})
