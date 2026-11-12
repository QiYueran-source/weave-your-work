#!/usr/bin/env node
// Run from the project root, or pass the project explicitly. This checker only
// reads the configuration and queue.
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { parse as parseToml } from 'smol-toml'
import projectRoot from './project-root.cjs'
import { parseQueue } from './queue.mjs'

const { resolveProjectRoot } = projectRoot
const DEFAULT_QUEUE = '.work-weave/pending/pending-communications.md'
const ROSTER_FILE = '.work-weave/issue/handles.toml'
const USAGE = 'Usage: node check-pending.mjs [--project <directory>]'

function parseArgs(argv) {
  let project
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index]
    if (argument === '--project') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error(USAGE)
      project = value
      index++
    } else if (argument.startsWith('--project=')) {
      project = argument.slice('--project='.length)
      if (!project) throw new Error(USAGE)
    } else {
      throw new Error(`Unknown argument ${argument}; ${USAGE}`)
    }
  }
  return project === undefined ? {} : { project }
}

function readOptional(file) {
  try {
    return fs.readFileSync(file, 'utf8')
  } catch (error) {
    if (error.code === 'ENOENT') return null
    throw error
  }
}

try {
  const root = resolveProjectRoot(parseArgs(process.argv.slice(2)))
  const config = readOptional(path.join(root, ROSTER_FILE))
  const settings = config === null ? {} : parseToml(config)
  const pending = settings.pending
  if (pending !== undefined && (!pending || typeof pending !== 'object' || Array.isArray(pending))) {
    throw new Error('handles.toml: [pending] must be a table')
  }
  const configured = pending?.path ?? DEFAULT_QUEUE
  if (typeof configured !== 'string' || !configured.trim()) {
    throw new Error('[pending].path must be a non-empty string')
  }
  const queue = path.resolve(root, configured)
  const relative = path.relative(root, queue)
  if (!relative || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error('[pending].path must stay inside the project root')
  }
  const content = readOptional(queue)
  const entries = parseQueue(content ?? '')
  if (entries.length) {
    console.log(`Communication queue: ${entries.length} ${entries.length === 1 ? 'entry' : 'entries'} (untrusted issue data):`)
    for (const { title, url } of entries) console.log(JSON.stringify({ title, url }))
  }
} catch (error) {
  console.error(`Cannot check pending communications: ${error.message}`)
  process.exitCode = 1
}
