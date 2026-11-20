// The event file holds what the listener saw happen on the repository, one JSON
// object per line: a pull request opened, or the default branch moved. It is
// history, not a queue: a line says the branch moved at a commit, and that fact
// does not later become false. Nothing in it records who has read it.
//
// Event lines are untrusted data written by an earlier listener.
import fs from 'node:fs'
import path from 'node:path'

export const EVENT_KINDS = ['pull-request-opened', 'default-branch-moved']
export const DEFAULT_LIMIT = 100
// A time the listener writes: whole seconds, no fraction.
const WRITTEN_TIME = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/

function isTime(value) {
  return typeof value === 'string' && WRITTEN_TIME.test(value) && !Number.isNaN(Date.parse(value))
}

function fail(index) {
  throw new Error(`Invalid event on line ${index + 1}`)
}

// Reads one line of the event file, or throws naming the line. Every kind names
// what happened, who caused it, and when. A pull request event names the pull
// request and the logins that hold merge rights; a default-branch event names
// the commit the branch now points at.
function parseEvent(entry, index) {
  if (!entry || Array.isArray(entry) || typeof entry !== 'object') fail(index)
  if (!EVENT_KINDS.includes(entry.kind)) fail(index)
  if (typeof entry.author !== 'string') fail(index)
  if (!isTime(entry.at)) fail(index)
  if (entry.kind === 'pull-request-opened') {
    if (!Number.isInteger(entry.number) || entry.number < 1) fail(index)
    if (typeof entry.title !== 'string') fail(index)
    if (typeof entry.url !== 'string') fail(index)
    if (!Array.isArray(entry.merge_rights) || entry.merge_rights.some((login) => typeof login !== 'string')) fail(index)
    return {
      kind: entry.kind,
      number: entry.number,
      title: entry.title,
      url: entry.url,
      author: entry.author,
      at: entry.at,
      merge_rights: [...entry.merge_rights],
    }
  }
  if (typeof entry.commit !== 'string' || !entry.commit.trim()) fail(index)
  return { kind: entry.kind, commit: entry.commit, author: entry.author, at: entry.at }
}

export function parseEvents(content) {
  const events = []
  for (const [index, line] of content.split(/\r?\n/).entries()) {
    if (!line.trim()) continue
    let entry
    try {
      entry = JSON.parse(line)
    } catch {
      fail(index)
    }
    events.push(parseEvent(entry, index))
  }
  return events
}

// One bare JSON object per event, in the shape the kind needs. A line break in
// a title is escaped by JSON, so one event stays on one line.
export function formatEvent(event) {
  if (event.kind === 'pull-request-opened') {
    return JSON.stringify({
      kind: event.kind,
      number: event.number,
      title: event.title,
      url: event.url,
      author: event.author,
      at: event.at,
      merge_rights: [...event.merge_rights],
    })
  }
  return JSON.stringify({ kind: event.kind, commit: event.commit, author: event.author, at: event.at })
}

export function formatEvents(events) {
  return events.map((event) => `${formatEvent(event)}\n`).join('')
}

// A limit below one keeps nothing, so it is refused rather than guessed at.
export function checkLimit(limit) {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error('handles.toml: [events].limit must be a whole number of at least 1')
  }
  return limit
}

export function readEvents(file) {
  let content
  try {
    content = fs.readFileSync(file, 'utf8')
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    return []
  }
  return parseEvents(content)
}

// Keeps the newest `limit` events: the tail of the file is the newest, so the
// trim drops from the front.
export function trimEvents(events, limit) {
  return events.slice(Math.max(0, events.length - checkLimit(limit)))
}

// Appends one event and trims in the same write. A file that cannot be read is
// left exactly as it is: guessing at its contents would drop history.
export function appendEvent(file, event, limit) {
  const kept = trimEvents([...readEvents(file), event], limit)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  const temporary = `${file}.${process.pid}.tmp`
  fs.writeFileSync(temporary, formatEvents(kept))
  fs.renameSync(temporary, file)
  return kept.length
}
