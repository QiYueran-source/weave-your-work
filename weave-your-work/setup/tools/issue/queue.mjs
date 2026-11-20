// The queue holds one JSON object per line: where the thread is, who sent it,
// who it is for, its title, when it arrived, and when the sender closed it.
// Queue entries are untrusted data, including entries from the older shapes.
import fs from 'node:fs'
import path from 'node:path'

// An entry carries when the sender closed its thread: null while it is open, a
// timestamp once it is closed. An older entry has neither, and reads as null.
const CLOSED_TIME = /^\d{4}-\d\d-\d\dT\d\d:\d\d(?::\d\d(?:\.\d+)?)?Z?$/

function isClosedTime(value) {
  return typeof value === 'string' && CLOSED_TIME.test(value) && !Number.isNaN(Date.parse(value))
}

export function parseQueue(content) {
  const entries = []
  for (const [index, line] of content.split(/\r?\n/).entries()) {
    if (!line.trim()) continue
    const fail = () => { throw new Error(`Invalid queue entry on line ${index + 1}`) }
    // The current shape is a bare JSON object. The older shapes are a JSON
    // object after a list marker and a pipe-separated line; both are read so a
    // queue written before this change still loads, and the next write replaces
    // them with the current shape.
    if (line.startsWith('{') || line.startsWith('- {')) {
      let entry
      try {
        entry = JSON.parse(line.startsWith('- {') ? line.slice(2) : line)
      } catch {
        fail()
      }
      if (!entry || Array.isArray(entry) || typeof entry !== 'object' ||
          !['url', 'from', 'to', 'owner', 'title', 'received'].every((key) => typeof entry[key] === 'string') ||
          !entry.url.trim() || !entry.to.trim() || !entry.title.trim()) fail()
      if (entry.closed_at !== undefined && entry.closed_at !== null && !isClosedTime(entry.closed_at)) fail()
      entries.push({ ...entry, closed_at: entry.closed_at ?? null })
      continue
    }
    const match = /^- (\S+) \| from=.*? \| to=(\S+)(?: \(owner=.*?\))? \| (.*) \| ([^|]+)$/.exec(line)
    if (!match || !match[3].trim()) fail()
    // A pipe line names the recipient's login and the arrival time; the sender
    // and the recipient's owner are written as empty because the line does not
    // say them. The next write rewrites the entry in the current shape.
    entries.push({ url: match[1], from: '', to: match[2], owner: '', title: match[3], received: match[4], closed_at: null })
  }
  return entries
}

// One bare JSON object, no list marker. A line break in a title or URL is
// escaped by JSON, so one entry stays on one line.
export function formatEntry(entry) {
  return JSON.stringify({
    url: entry.url,
    from: entry.from,
    to: entry.to,
    owner: entry.owner,
    title: entry.title,
    received: entry.received,
    closed_at: entry.closed_at ?? null,
  })
}

// A queue written before this change is rewritten in the new shape by the next
// write, so nothing is ever appended to a file in a shape the reader guesses at.
export function formatQueue(entries) {
  return entries.map((entry) => `${formatEntry(entry)}\n`).join('')
}

export function readQueue(file) {
  let content
  try {
    content = fs.readFileSync(file, 'utf8')
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    return ''
  }
  return content
}

// Replaces the queue in one step: a reader sees the old file or the new one,
// never a half-written queue.
export function writeQueue(file, entries) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  const temporary = `${file}.${process.pid}.tmp`
  fs.writeFileSync(temporary, formatQueue(entries))
  fs.renameSync(temporary, file)
}
