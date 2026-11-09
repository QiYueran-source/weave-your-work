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
  return {
    handles: data.handles || {},
    pending: (data.pending && data.pending.path) || DEFAULT_PENDING,
  }
}

function queuePath(configured) {
  return path.resolve(root, configured)
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
  for (const table of Object.values(handles)) {
    for (const [owner, value] of Object.entries(table)) {
      if (value === handle) return owner
    }
  }
  return null
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

function queuePayload(payload, { mappedGithubOnly = false } = {}) {
  if (payload.action !== 'opened') return 0
  const issue = payload.issue || {}
  const front = parseFrontmatter(typeof issue.body === 'string' ? issue.body : '')
  if (!front || front.kind !== 'communicate') return 0
  const recipients = Array.isArray(front.to) ? front.to : [front.to]
  const sender = front.from || (issue.user && issue.user.login) || 'unknown'
  const title = issue.title || ''
  const url = issue.html_url || ''
  if (typeof sender !== 'string' || typeof title !== 'string' || !title.trim() ||
      typeof url !== 'string' || !url.trim() ||
      !recipients.length || recipients.some((handle) => typeof handle !== 'string' || !handle.trim())) {
    if (mappedGithubOnly) {
      console.error('Catch-up skipped an issue with invalid communicate fields')
      return 0
    }
    throw new Error('Invalid communicate issue fields')
  }
  const received = new Date().toISOString().slice(0, 16)
  const { handles, pending } = loadConfig()
  const githubHandles = handles.github || {}
  const eligible = mappedGithubOnly
    ? recipients.filter((handle) => Object.values(githubHandles).includes(handle))
    : recipients
  const entries = eligible.map((handle) => ({
    url, from: sender, to: handle, owner: ownerFor(mappedGithubOnly ? { github: githubHandles } : handles, handle) || 'unknown', title, received,
  }))
  return append(queuePath(pending), entries)
}

async function catchUp() {
  const { stdout } = await run('git', ['remote', 'get-url', '--all', 'origin'], { cwd: root, timeout: 15000 })
  const remotes = stdout.trim().split(/\r?\n/)
  if (remotes.length !== 1) throw new Error('origin must have exactly one fetch URL')
  const remote = remotes[0]
  const match = /^(?:git@github\.com:|ssh:\/\/git@github\.com\/|https:\/\/github\.com\/)([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?\/?$/.exec(remote)
  if (!match) throw new Error('origin is not a supported github.com repository URL')
  const repo = `${match[1]}/${match[2]}`
  const { handles } = loadConfig()
  if (!handles.github || !Object.keys(handles.github).length) {
    throw new Error('no GitHub handles configured for catch-up')
  }
  let queued = 0
  for (let page = 1; ; page++) {
    const result = await run('gh', [
      'api', '--hostname', 'github.com', '--method', 'GET', `repos/${repo}/issues`,
      '-f', 'state=open', '-F', 'per_page=100', '-F', `page=${page}`,
    ], { cwd: root, timeout: 30000, maxBuffer: 32 * 1024 * 1024 })
    const issues = JSON.parse(result.stdout)
    if (!Array.isArray(issues)) throw new Error('GitHub returned an invalid issues page')
    for (const issue of issues) {
      if (!issue || typeof issue !== 'object' || issue.pull_request || issue.state !== 'open') continue
      queued += queuePayload({ action: 'opened', issue }, { mappedGithubOnly: true })
    }
    if (issues.length < 100) break
  }
  console.log(`Catch-up complete: queued ${queued} entries from ${repo}`)
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
    if (event && event !== 'issues') {
      res.writeHead(202)
      res.end('ignored')
      return
    }
    try {
      const queued = queuePayload(payload)
      res.writeHead(202)
      res.end(`queued ${queued}\n`)
    } catch (error) {
      console.error(`Cannot queue communication: ${error.message}`)
      res.writeHead(500)
      res.end('cannot queue communication\n')
    }
  })
})

server.listen(port, '127.0.0.1', async () => {
  console.log(`listening on http://127.0.0.1:${port}/webhook`)
  if (!secret) console.warn('Webhook signatures are not verified; queued messages are untrusted')
  if (smeeUrl) {
    const smee = new SmeeClient({
      source: smeeUrl,
      target: `http://127.0.0.1:${port}/webhook`,
      logger: console,
    })
    try {
      await smee.start()
    } catch (error) {
      console.error(`Cannot connect to smee; catch-up not started: ${error.message || 'connection failed'}`)
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
