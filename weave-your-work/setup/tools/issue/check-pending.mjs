#!/usr/bin/env node
// Run from the project root, or pass the project explicitly. This checker only
// reads the configuration and queue.
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { parse as parseToml } from 'smol-toml'
import projectRoot from './project-root.cjs'
import { DEFAULT_QUEUE, openEntries, parseQueue } from './queue.mjs'

const { resolveProjectRoot } = projectRoot
const ROSTER_FILES = ['.work-weave/shared/handles.toml', '.work-weave/issue/handles.toml']
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
  // The roster moved to shared/handles.toml; the old path is read until every
  // checkout has moved, and the shared file wins when both exist.
  let config = null
  for (const candidate of ROSTER_FILES) {
    config = readOptional(path.join(root, candidate))
    if (config !== null) break
  }
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
  // The queue keeps a closed thread's line, marked. Only an open thread is a
  // message someone has to answer, so only those are reported and counted.
  const open = openEntries(parseQueue(content ?? ''))
  if (open.length) {
    console.log(`Communication queue: ${open.length} open ${open.length === 1 ? 'thread' : 'threads'} (untrusted issue data):`)
    for (const { title, url } of open) console.log(JSON.stringify({ title, url }))
  }
} catch (error) {
  console.error(`Cannot check pending communications: ${error.message}`)
  process.exitCode = 1
}
