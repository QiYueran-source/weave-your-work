#!/usr/bin/env node
// Receive a smee webhook stream and queue communicate issues.
//
// Run from the repository root:
//   SMEE_URL=https://smee.io/<id> node <skill>/bundle/tools/listener.mjs
//
// Without SMEE_URL the HTTP endpoint runs alone. WEBHOOK_SECRET optionally
// enables signature verification for transports that preserve request bytes.

import { execFile } from 'node:child_process'
import http from 'node:http'
import { promisify } from 'node:util'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { parse as parseToml } from 'smol-toml'
import { parse as parseYaml } from 'yaml'
import SmeeClient from 'smee-client'
import { formatEntry, parseQueue } from './queue.mjs'

const run = promisify(execFile)
const DEFAULT_PENDING = 'pending/pending-communications.md'
const root = process.cwd()
const toolsDir = path.dirname(fileURLToPath(import.meta.url))
const port = Number(process.env.PORT || 8765)
const secret = process.env.WEBHOOK_SECRET || ''
const smeeUrl = process.env.SMEE_URL || ''

if (secret && !secret.trim()) {
  console.error('WEBHOOK_SECRET must not contain only whitespace')
  process.exit(1)
}

function loadConfig() {
  const file = path.join(toolsDir, 'handles.toml')
  if (!fs.existsSync(file)) {
    return { handles: {}, pending: DEFAULT_PENDING }
  }
  const data = parseToml(fs.readFileSync(file, 'utf8'))
  const handles = data.handles || {}
  for (const [owner, login] of Object.entries(handles)) {
    if (typeof login !== 'string') {
      throw new Error(`handles.toml: ${owner} is not a login; put every owner under one [handles] table`)
    }
  }
  return {
    handles,
    pending: (data.pending && data.pending.path) || DEFAULT_PENDING,
  }
}

function queuePath(configured) {
  return path.resolve(root, configured)
}

// This machine's owner is the local git identity, matched against the [handles]
// keys without regard to case. `git config --local user.name` is the per-clone
// slot: untracked, so a machine that belongs to someone else changes it without
// touching the shared roster.
async function resolveMachineOwner(handles) {
  const owners = Object.keys(handles)
  if (!owners.length) {
    throw new Error('handles.toml has no owners; add at least one under [handles]')
  }
  const folded = new Map()
  for (const owner of owners) {
    const key = owner.toLowerCase()
    if (folded.has(key)) {
      throw new Error(`handles.toml has owners that differ only by case (${folded.get(key)}, ${owner}); rename one`)
    }
    folded.set(key, owner)
  }
  const hint = () => owners.length === 1
    ? `git config --local user.name ${owners[0]}`
    : `git config --local user.name <one of: ${owners.join(', ')}>`
  let name
  try {
    const { stdout } = await run('git', ['config', 'user.name'], { cwd: root, timeout: 15000 })
    name = stdout.trim()
  } catch (error) {
    if (error.code === 'ENOENT') throw new Error("git is not installed, and it names this machine's owner")
    throw new Error(`git config user.name is unset, so this machine has no owner; set it with: ${hint()}`)
  }
  if (!name) throw new Error(`git config user.name is empty; set it with: ${hint()}`)
  const owner = folded.get(name.toLowerCase())
  if (!owner) {
    throw new Error(`git config user.name is "${name}", which is not an owner in handles.toml (${owners.join(', ')}); set this machine's owner with: ${hint()}`)
  }
  return owner
}

function parseFrontmatter(body) {
  if (!body || !body.startsWith('---')) return null
  const end = body.indexOf('\n---', 3)
  if (end === -1) return null
  try {
    return parseYaml(body.slice(3, end))
  } catch {
    return null
  }
}

function ownerFor(handles, handle) {
  for (const [owner, login] of Object.entries(handles)) {
    if (login === handle) return owner
  }
  return null
}

// The handles file is the roster of logins that may send. Anyone who is not on
// it is treated as a stranger, and a stranger's message is not queued.
function loginKnown(handles, login) {
  return typeof login === 'string' && Object.values(handles).includes(login)
}

function append(queue, entries) {
  let content
  try {
    content = fs.readFileSync(queue, 'utf8')
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    content = ''
  }
  const seen = new Set(parseQueue(content).map(({ url, to }) => JSON.stringify([url, to])))
  const added = []
  for (const entry of entries) {
    const key = JSON.stringify([entry.url, entry.to])
    if (seen.has(key)) continue
    seen.add(key)
    added.push(formatEntry(entry))
  }
  if (added.length > 0) {
    fs.mkdirSync(path.dirname(queue), { recursive: true })
    const separator = content && !content.endsWith('\n') ? '\n' : ''
    fs.appendFileSync(queue, separator + added.join('\n') + '\n')
  }
  return added.length
}

const CATEGORIES = new Set(['request', 'result', 'comment'])

// Returns the protocol fields, or the list of fields that do not match the
// communicate issue format in communicate-issue.md.
function communicationFields(front) {
  if (!front || typeof front !== 'object' || Array.isArray(front)) return ['frontmatter']
  if (front.kind !== 'communicate') return null
  const errors = []
  if (!CATEGORIES.has(front.category)) errors.push('category')
  if (typeof front.from !== 'string' || !front.from.trim()) errors.push('from')
  if (!Array.isArray(front.to) || front.to.length !== 1 ||
      typeof front.to[0] !== 'string' || !front.to[0].trim()) errors.push('to')
  if (!Array.isArray(front.tickets) || front.tickets.length === 0 ||
      front.tickets.some((id) => typeof id !== 'string' || !id.trim())) errors.push('tickets')
  if (errors.length) return errors
  return { category: front.category, from: front.from, to: front.to[0], tickets: front.tickets }
}

// ---- GitHub ---------------------------------------------------------------
// Everything outside this block — the HTTP endpoint, the signature check, the
// queue, the deduplication and the log redaction — touches no GitHub detail.
// These two functions are where GitHub shows through: the webhook event shape,
// the `gh api` listing, and the `user.login` that says who opened the issue. A fork for another host rewrites this block and
// the [handles] table, and leaves the rest alone.

// Normalises one webhook body, or returns null when it is not an event this
// listener acts on.
function readIssueEvent(payload, event) {
  if (event && event !== 'issues') return null
  if (!payload || payload.action !== 'opened') return null
  const issue = payload.issue || {}
  if (issue.pull_request) return null
  return {
    url: typeof issue.html_url === 'string' ? issue.html_url : '',
    title: typeof issue.title === 'string' ? issue.title : '',
    body: typeof issue.body === 'string' ? issue.body : '',
    state: issue.state,
    author: issue.user && typeof issue.user.login === 'string' ? issue.user.login : '',
  }
}

// Yields the repository's open issues one page at a time, so a later page
// failing does not discard what the earlier pages already queued.
async function* listOpenIssues(root) {
  const { stdout } = await run('git', ['remote', 'get-url', '--all', 'origin'], { cwd: root, timeout: 15000 })
  const remotes = stdout.trim().split(/\r?\n/)
  if (remotes.length !== 1) throw new Error('origin must have exactly one fetch URL')
  const match = /^(?:git@github\.com:|ssh:\/\/git@github\.com\/|https:\/\/github\.com\/)([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?\/?$/.exec(remotes[0])
  if (!match) throw new Error('origin is not a supported github.com repository URL')
  const repo = `${match[1]}/${match[2]}`
  for (let page = 1; ; page++) {
    const result = await run('gh', [
      'api', '--hostname', 'github.com', '--method', 'GET', `repos/${repo}/issues`,
      '-f', 'state=open', '-F', 'per_page=100', '-F', `page=${page}`,
    ], { cwd: root, timeout: 30000, maxBuffer: 32 * 1024 * 1024 })
    const records = JSON.parse(result.stdout)
    if (!Array.isArray(records)) throw new Error('GitHub returned an invalid issues page')
    const issues = []
    for (const record of records) {
      if (!record || typeof record !== 'object' || record.pull_request) continue
      issues.push({
        url: typeof record.html_url === 'string' ? record.html_url : '',
        title: typeof record.title === 'string' ? record.title : '',
        body: typeof record.body === 'string' ? record.body : '',
        state: record.state,
        author: record.user && typeof record.user.login === 'string' ? record.user.login : '',
        label: `issue ${record.number || ''}`.trim(),
      })
    }
    yield { repo, issues }
    if (records.length < 100) return
  }
}

// ---- end of GitHub -------------------------------------------------------

// Decides whether an issue is a message for this machine from a login on the
// roster and, when it is, appends one queue entry. The format is checked first,
// so a malformed message is reported as malformed rather than as an unknown
// author.
function queueIssue(issue, { label = 'issue' } = {}) {
  const front = parseFrontmatter(issue.body)
  const fields = communicationFields(front)
  if (fields === null) return 0
  if (Array.isArray(fields)) {
    console.error(`Skipped ${label}: invalid ${fields.join(', ')}`)
    return 0
  }
  if (!issue.title.trim() || !issue.url.trim()) {
    console.error(`Skipped ${label}: invalid title or url`)
    return 0
  }
  if (!loginKnown(config.handles, issue.author)) {
    console.error(`Skipped ${label}: author is not a known login`)
    return 0
  }
  const owner = ownerFor(config.handles, fields.to)
  if (owner !== machineOwner) {
    console.error(`Skipped ${label}: addressed to ${fields.to}, not to ${machineOwner}`)
    return 0
  }
  const received = new Date().toISOString().slice(0, 16)
  return append(queuePath(config.pending), [{
    url: issue.url, from: fields.from, to: fields.to, owner, title: issue.title, received,
  }])
}

async function catchUp() {
  let queued = 0
  let repo = ''
  for await (const page of listOpenIssues(root)) {
    repo = page.repo
    for (const issue of page.issues) {
      if (issue.state !== 'open') continue
      queued += queueIssue(issue, { label: issue.label })
    }
  }
  console.log(`Catch-up complete: queued ${queued} entries from ${repo}`)
}

// The channel URL is a shared secret: anyone who knows it can post or read
// events. Smee logs the full source URL, so redact it before writing a line.
const redactedLogger = {
  info: (message) => console.log(redact(message)),
  warn: (message) => console.warn(redact(message)),
  error: (message) => console.error(redact(message)),
}

function redact(message) {
  const text = String(message)
  return smeeUrl ? text.split(smeeUrl).join('<smee channel>') : text
}

const server = http.createServer((req, res) => {
  if (req.method !== 'POST' || req.url !== '/webhook') {
    res.writeHead(404)
    res.end()
    return
  }
  const chunks = []
  req.on('data', (chunk) => chunks.push(chunk))
  req.on('end', () => {
    const raw = Buffer.concat(chunks)
    if (secret) {
      const signature = req.headers['x-hub-signature-256'] || ''
      const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(raw).digest('hex')
      const a = Buffer.from(signature)
      const b = Buffer.from(expected)
      if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
        res.writeHead(401)
        res.end('bad signature')
        return
      }
    }
    let payload
    try {
      payload = JSON.parse(raw.toString('utf8'))
      if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error('bad payload')
    } catch {
      res.writeHead(400)
      res.end('bad json')
      return
    }
    const event = req.headers['x-github-event']
    const issue = readIssueEvent(payload, event)
    if (!issue) {
      res.writeHead(202)
      res.end(event && event !== 'issues' ? 'ignored' : 'queued 0\n')
      return
    }
    try {
      const queued = queueIssue(issue)
      res.writeHead(202)
      res.end(`queued ${queued}\n`)
    } catch (error) {
      console.error(`Cannot queue communication: ${error.message}`)
      res.writeHead(500)
      res.end('cannot queue communication\n')
    }
  })
})

// The configuration and this machine's owner are read once, before the port
// opens: a machine with no owner can queue nothing, so it refuses to start
// instead of running and silently dropping every message.
let config
let machineOwner
try {
  config = loadConfig()
  machineOwner = await resolveMachineOwner(config.handles)
} catch (error) {
  console.error(error.message)
  process.exit(1)
}

server.listen(port, '127.0.0.1', async () => {
  console.log(`listening on http://127.0.0.1:${port}/webhook`)
  console.log(`queueing messages addressed to ${machineOwner}`)
  if (!secret) console.warn('Webhook signatures are not verified; queued messages are untrusted')
  if (smeeUrl) {
    const smee = new SmeeClient({
      source: smeeUrl,
      target: `http://127.0.0.1:${port}/webhook`,
      logger: redactedLogger,
    })
    try {
      await smee.start()
    } catch (error) {
      console.error(redact(`Cannot connect to smee; catch-up not started: ${error.message || 'connection failed'}`))
      await smee.stop()
      server.close()
      process.exitCode = 1
      return
    }
  } else {
    console.log('SMEE_URL is empty; the HTTP endpoint runs alone')
  }
  try {
    await catchUp()
  } catch (error) {
    console.error(`Catch-up failed: ${error.message}`)
  }
})
