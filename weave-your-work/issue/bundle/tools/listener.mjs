#!/usr/bin/env node
// Receive a smee webhook stream and queue communicate issues.
//
// Run from the repository root:
//   WEBHOOK_SECRET=<secret> SMEE_URL=https://smee.io/<id> node <skill>/bundle/listener.mjs
//
// Without SMEE_URL the HTTP endpoint runs alone, which is how the local test
// exercises it. The signature is checked before anything is written.

import http from 'node:http'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { parse as parseToml } from 'smol-toml'
import { parse as parseYaml } from 'yaml'
import SmeeClient from 'smee-client'

const DEFAULT_PENDING = '../pending/pending-communications.md'
const root = process.cwd()
const port = Number(process.env.PORT || 8765)
const secret = process.env.WEBHOOK_SECRET || ''
const smeeUrl = process.env.SMEE_URL || ''

function loadConfig() {
  const file = path.join(root, '.waymark', 'handles.toml')
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
  return path.resolve(root, '.waymark', configured)
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

function append(queue, lines) {
  fs.mkdirSync(path.dirname(queue), { recursive: true })
  const existing = fs.existsSync(queue)
    ? fs.readFileSync(queue, 'utf8').split('\n').filter(Boolean)
    : []
  const added = lines.filter((line) => {
    const [head, ...rest] = line.split(' | ')
    const url = head.replace(/^- /, '')
    const to = (rest.find((part) => part.startsWith('to=')) || '').split(' ')[0].slice(3)
    return !existing.some((entry) => entry.includes(url) && entry.includes(`to=${to}`))
  })
  if (added.length > 0) {
    fs.appendFileSync(queue, added.join('\n') + '\n')
  }
  return added.length
}

function queuePayload(payload) {
  if (payload.action !== 'opened') return 0
  const issue = payload.issue || {}
  const front = parseFrontmatter(issue.body || '')
  if (!front || front.kind !== 'communicate') return 0
  const recipients = Array.isArray(front.to) ? front.to : [front.to].filter(Boolean)
  const sender = front.from || (issue.user && issue.user.login) || 'unknown'
  const title = issue.title || ''
  const url = issue.html_url || ''
  const received = new Date().toISOString().slice(0, 16)
  const { handles, pending } = loadConfig()
  const lines = recipients.map((handle) => {
    const owner = ownerFor(handles, handle) || 'unknown'
    return `- ${url} | from=${sender} | to=${handle} (owner=${owner}) | ${title} | ${received}`
  })
  return append(queuePath(pending), lines)
}

const server = http.createServer((req, res) => {
  if (req.method !== 'POST' || req.url !== '/webhook') {
    res.writeHead(404)
    res.end()
    return
  }
  let raw = ''
  req.on('data', (chunk) => {
    raw += chunk
  })
  req.on('end', () => {
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
      payload = JSON.parse(raw)
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
    const queued = queuePayload(payload)
    res.writeHead(202)
    res.end(`queued ${queued}\n`)
  })
})

server.listen(port, '127.0.0.1', () => {
  console.log(`listening on http://127.0.0.1:${port}/webhook`)
  if (smeeUrl) {
    const smee = new SmeeClient({
      source: smeeUrl,
      target: `http://127.0.0.1:${port}/webhook`,
      logger: console,
    })
    smee.start()
    console.log(`forwarding ${smeeUrl}`)
  } else {
    console.log('SMEE_URL is empty; the HTTP endpoint runs alone')
  }
})
