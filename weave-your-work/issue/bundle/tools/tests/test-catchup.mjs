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
const fallbackModules = path.resolve(source, '../../../../.agents/skills/issue/bundle/tools/node_modules')
const timeout = 8000

async function waitFor(check, description, output = () => '') {
  const deadline = performance.now() + timeout
  while (performance.now() < deadline) {
    if (await check()) return
    await delay(25)
  }
  throw new Error(`Timed out waiting for ${description}: ${output()}`)
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
  const tools = path.join(root, '.work-weave/runtime/issue')
  const bin = path.join(root, 'bin')
  const pages = path.join(root, 'pages')
  await Promise.all([
    fs.mkdir(tools, { recursive: true }),
    fs.mkdir(path.join(root, '.work-weave/issue'), { recursive: true }),
    fs.mkdir(path.join(root, '.work-weave/local'), { recursive: true }),
    fs.mkdir(path.join(root, '.waymark'), { recursive: true }),
    fs.mkdir(bin),
    fs.mkdir(pages),
  ])
  for (const name of ['listener.mjs', 'queue.mjs', 'project-root.cjs']) {
    await fs.copyFile(path.join(source, name), path.join(tools, name))
  }
  const localModules = path.join(source, 'node_modules')
  await fs.symlink(await exists(localModules) ? localModules : fallbackModules, path.join(tools, 'node_modules'), 'dir')
  await fs.writeFile(path.join(root, '.waymark/config.toml'), 'schema = 1\n')
  await fs.writeFile(path.join(root, '.work-weave/issue/handles.toml'), '[handles]\nalice = "alice-handle"\nbob = "bob-handle"\n[pending]\npath = ".work-weave/pending/pending-communications.md"\n')
  await fs.writeFile(path.join(root, '.work-weave/local/issue-listener.env'), 'REPOSITORY=example/project\n')
  await fs.writeFile(path.join(tools, 'package.json'), '{ "type": "module" }\n')
  const fake = `#!${process.execPath}\n` + String.raw`
const fs = require('node:fs')
const path = require('node:path')
const args = process.argv.slice(2)
if (process.cwd() !== process.env.FAKE_ROOT) { console.error('gh ran outside the project root'); process.exit(2) }
fs.appendFileSync(process.env.FAKE_CALLS, JSON.stringify(args) + '\n')
const expected = ['api', '--hostname', 'github.com', '--method', 'GET', 'repos/example/project/issues', '-f', 'state=open', '-F', 'per_page=100', '-F']
if (JSON.stringify(args.slice(0, -1)) !== JSON.stringify(expected) || !/^page=[1-9][0-9]*$/.test(args.at(-1))) {
  console.error('Unexpected gh arguments: ' + JSON.stringify(args)); process.exit(2)
}
const page = args.at(-1).slice(5)
fs.writeFileSync(path.join(process.env.FAKE_PAGES, 'started-' + page), '')
const run = () => {
  const failure = path.join(process.env.FAKE_PAGES, 'fail-' + page)
  if (fs.existsSync(failure)) { console.error('fake GitHub failure'); process.exit(1) }
  const file = path.join(process.env.FAKE_PAGES, page + '.json')
  if (!fs.existsSync(file)) { console.error('Unexpected page ' + page); process.exit(1) }
  process.stdout.write(fs.readFileSync(file))
}
if (fs.existsSync(path.join(process.env.FAKE_PAGES, 'block-' + page))) {
  const timer = setInterval(() => {
    if (fs.existsSync(path.join(process.env.FAKE_PAGES, 'release-' + page))) { clearInterval(timer); run() }
  }, 20)
} else run()
`
  await fs.writeFile(path.join(bin, 'gh'), fake, { mode: 0o755 })
  git(root, 'init', '--quiet')
  git(root, 'config', 'user.name', 'alice')
  if (remote) git(root, 'remote', 'add', 'origin', 'https://github.com/example/project.git')
  return { root, tools, bin, pages, children, queue: path.join(root, '.work-weave/pending/pending-communications.md'), calls: path.join(root, 'calls') }
}

async function stage(f, page, records) {
  await fs.writeFile(path.join(f.pages, `${page}.json`), typeof records === 'string' ? records : JSON.stringify(records))
}

async function freePort() {
  const server = net.createServer()
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const { port } = server.address()
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  return port
}

async function start(f) {
  const port = await freePort()
  const env = { ...process.env, PORT: String(port), SMEE_URL: '', PATH: `${f.bin}${path.delimiter}${process.env.PATH}`, FAKE_PAGES: f.pages, FAKE_CALLS: f.calls, FAKE_ROOT: f.root }
  delete env.WEBHOOK_SECRET
  delete env.REPOSITORY
  const child = spawn(process.execPath, [path.join(f.tools, 'listener.mjs')], { cwd: f.root, env, stdio: ['ignore', 'pipe', 'pipe'] })
  f.children.add(child)
  let output = ''
  child.stdout.on('data', (chunk) => { output += chunk })
  child.stderr.on('data', (chunk) => { output += chunk })
  await waitFor(() => output.includes('listening on') || child.exitCode !== null, 'listener startup', () => output)
  assert.equal(child.exitCode, null, output)
  return { child, port, output: () => output }
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

function issue(number, { to = 'alice-handle', title = `Issue ${number}`, body, from = 'sender', category = 'request', tickets = ['wm-test'], author = 'alice-handle', ...extra } = {}) {
  return {
    html_url: `https://github.com/example/project/issues/${number}`,
    title,
    state: 'open',
    body: body ?? `---\nkind: communicate\ncategory: ${category}\nfrom: ${JSON.stringify(from)}\nto: [${JSON.stringify(to)}]\ntickets: ${JSON.stringify(tickets)}\n---\nBody`,
    user: { login: author },
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
  return (await queue(f)).trim().split('\n').filter(Boolean).map((line) => JSON.parse(line.slice(2)))
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

test('catch-up paginates, filters and deduplicates mapped recipients across restarts', async (t) => {
  const f = await fixture(t)
  const existing = { url: 'https://github.com/example/project/issues/1', from: 'old', to: 'alice-handle', owner: 'alice', title: 'Already queued', received: '2026-01-01T00:00' }
  await fs.mkdir(path.dirname(f.queue), { recursive: true })
  const original = `- ${JSON.stringify(existing)}\n`
  await fs.writeFile(f.queue, original)
  const first = [
    issue(1, { to: 'bob-handle' }),
    issue(2, { body: '---\nkind: task\nto: alice-handle\n---\n' }),
    issue(3, { pull_request: { url: 'https://api.github.com/repos/example/project/pulls/3' } }),
    issue(4, { body: '---\nkind: communicate\nto: [broken\n---\n' }),
    issue(5, { title: '' }),
    issue(7, { state: 'closed' }),
    issue(8, { body: '---\nkind: communicate\ncategory: request\nfrom: sender\nto: [alice-handle, bob-handle]\ntickets: [wm-test]\n---\n' }),
    issue(9, { body: '---\nkind: communicate\nfrom: sender\nto: [alice-handle]\ntickets: [wm-test]\n---\n' }),
    issue(12, { to: 'unmapped' }),
    issue(14, { author: 'stranger' }),
    null,
    ...Array.from({ length: 89 }, (_, index) => issue(100 + index, { body: 'ordinary issue' })),
  ]
  assert.equal(first.length, 100)
  await stage(f, 1, first)
  await stage(f, 2, [issue(6, { to: 'alice-handle', title: 'Second page' }), issue(1, { to: 'bob-handle' })])
  const listener = await start(f)
  await finish(listener)
  assert.ok((await queue(f)).startsWith(original))
  const found = await entries(f)
  // Issue 1 is addressed to bob, and this machine belongs to alice, so neither
  // its page-1 nor its page-2 copy is queued.
  assert.deepEqual(found.map(({ url, to, owner }) => [url, to, owner]), [
    [existing.url, 'alice-handle', 'alice'],
    ['https://github.com/example/project/issues/6', 'alice-handle', 'alice'],
  ])
  assert.equal(found[1].title, 'Second page')
  assert.ok(!found.some(({ url }) => url.endsWith('/issues/14')), 'a stranger\'s issue was queued')
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
  const live = issue(10, { to: 'alice-handle', title: 'During startup' })
  await stage(f, 1, [live, issue(11, { title: 'Previously open' })])
  await fs.writeFile(path.join(f.pages, 'block-1'), '')
  const listener = await start(f)
  await waitFor(() => exists(path.join(f.pages, 'started-1')), 'blocked GitHub request', listener.output)
  assert.ok(!listener.output().includes('Catch-up complete:'))
  const response = await webhook(listener.port, { action: 'opened', repository: { full_name: 'example/project' }, issue: live })
  assert.deepEqual(response, { status: 202, body: 'queued 1\n' })
  await fs.writeFile(path.join(f.pages, 'release-1'), '')
  await finish(listener)
  const found = await entries(f)
  assert.deepEqual(found.map(({ url, to }) => [url, to]), [
    [live.html_url, 'alice-handle'],
    ['https://github.com/example/project/issues/11', 'alice-handle'],
  ])
})

test('scan failures are reported and do not disable the webhook', async (t) => {
  for (const scenario of ['missing remote', 'gh failure', 'invalid JSON', 'non-array response', 'later page failure']) {
    await t.test(scenario, async (t) => {
      const f = await fixture(t, { remote: scenario !== 'missing remote' })
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
      const response = await webhook(listener.port, { action: 'opened', repository: { full_name: 'example/project' }, issue: issue(99) })
      assert.deepEqual(response, { status: 202, body: 'queued 1\n' })
      assert.equal((await entries(f))[0].url, 'https://github.com/example/project/issues/99')
      if (scenario === 'missing remote') assert.deepEqual(await calls(f), [])
      if (scenario === 'later page failure') assert.deepEqual((await calls(f)).map((args) => args.at(-1)), ['page=1', 'page=2'])
    })
  }
})
