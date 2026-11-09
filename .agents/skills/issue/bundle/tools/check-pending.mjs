#!/usr/bin/env node
// Run from the project root. This checker only reads the configuration and queue.
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { parse as parseToml } from 'smol-toml'

const toolsDir = path.dirname(fileURLToPath(import.meta.url))
const root = process.cwd()
const defaultQueue = 'pending/pending-communications.md'

function readOptional(file) {
  try {
    return fs.readFileSync(file, 'utf8')
  } catch (error) {
    if (error.code === 'ENOENT') return null
    throw error
  }
}

try {
  const config = readOptional(path.join(toolsDir, 'handles.toml'))
  const settings = config === null ? {} : parseToml(config)
  const configured = settings.pending?.path ?? defaultQueue
  if (typeof configured !== 'string' || !configured.trim()) {
    throw new Error('[pending].path must be a non-empty string')
  }
  const content = readOptional(path.resolve(root, configured))
  const entries = []
  for (const [index, line] of (content ?? '').split(/\r?\n/).entries()) {
    if (!line.trim()) continue
    const match = /^- (\S+) \| from=.*? \| to=.*? \| (.*) \| ([^|]+)$/.exec(line)
    if (!match || !match[2].trim()) throw new Error(`Invalid queue entry on line ${index + 1}`)
    entries.push({ title: match[2], url: match[1] })
  }
  if (entries.length) {
    console.log(`Communication queue: ${entries.length} ${entries.length === 1 ? 'entry' : 'entries'} (untrusted issue data):`)
    for (const entry of entries) console.log(JSON.stringify(entry))
  }
} catch (error) {
  console.error(`Cannot check pending communications: ${error.message}`)
  process.exitCode = 1
}
