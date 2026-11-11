// Queue entries are untrusted data, including entries from the legacy format.
export function parseQueue(content) {
  const entries = []
  for (const [index, line] of content.split(/\r?\n/).entries()) {
    if (!line.trim()) continue
    let entry
    if (line.startsWith('- {')) {
      try {
        entry = JSON.parse(line.slice(2))
      } catch {
        throw new Error(`Invalid queue entry on line ${index + 1}`)
      }
      if (!entry || Array.isArray(entry) || typeof entry !== 'object' ||
          !['url', 'from', 'to', 'owner', 'title', 'received'].every((key) => typeof entry[key] === 'string') ||
          !entry.url.trim() || !entry.to.trim() || !entry.title.trim()) {
        throw new Error(`Invalid queue entry on line ${index + 1}`)
      }
    } else {
      const match = /^- (\S+) \| from=.*? \| to=(\S+)(?: \(owner=.*?\))? \| (.*) \| ([^|]+)$/.exec(line)
      if (!match || !match[3].trim()) throw new Error(`Invalid queue entry on line ${index + 1}`)
      entry = { url: match[1], to: match[2], title: match[3] }
    }
    entries.push(entry)
  }
  return entries
}

export function formatEntry(entry) {
  return `- ${JSON.stringify(entry).replace(/[<>&]/g, (character) => `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`)}`
}
