#!/usr/bin/env node
// Check the record assertions in weave-your-work/ASSERTIONS.md against the
// project's tickets. Read-only: it prints findings and exits 1 when it finds
// any. Usage: node scripts/check-records.mjs [project-root] [--json]
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const args = process.argv.slice(2)
const json = args.includes('--json')
const root = args.find((a) => !a.startsWith('--')) ?? '.'
const ticketsRoot = join(root, 'tickets')
const findings = []
const add = (file, message) => findings.push({ file, message })

function read(file) {
  try {
    return readFileSync(file, 'utf8')
  } catch {
    return null
  }
}

// A ticket's front matter is hand-written YAML: flat keys, one nested
// `custom_fields:` map, and list values either inline or as `- item` lines.
function parseTicket(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return null
  const fm = {}
  const custom = {}
  let listKey = null
  for (const raw of match[1].split(/\r?\n/)) {
    if (!raw.trim()) continue
    const nested = raw.match(/^ {2}([a-z_]+):\s*(.*)$/)
    if (nested && listKey) {
      if (listKey === 'custom_fields') custom[nested[1]] = nested[2].replace(/^["']|["']$/g, '')
      else fm[listKey].push(nested[2].trim())
      continue
    }
    const item = raw.match(/^ {2}- (.*)$/)
    if (item && listKey) {
      fm[listKey].push(item[1].trim())
      continue
    }
    const flat = raw.match(/^([a-z_]+):\s*(.*)$/)
    if (!flat) continue
    const [, key, value] = flat
    if (key === 'custom_fields') {
      listKey = 'custom_fields'
      continue
    }
    listKey = null
    const trimmed = value.trim()
    if (trimmed === '') {
      fm[key] = []
      listKey = key
    } else if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      fm[key] = trimmed
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
    } else {
      fm[key] = trimmed.replace(/^["']|["']$/g, '')
    }
  }
  fm.custom = custom
  return { fm, body: match[2] }
}

function sections(body) {
  const found = {}
  const parts = body.split(/^## /m)
  for (const part of parts.slice(1)) {
    const newline = part.indexOf('\n')
    const name = (newline === -1 ? part : part.slice(0, newline)).trim()
    found[name] = newline === -1 ? '' : part.slice(newline + 1)
  }
  return found
}

const VERDICTS = ['passed', 'needs changes', 'needs discussion', 'wrong direction']
const MAP_FIELDS = ['split_as']
const TASK_FIELDS = ['task_kind', 'reversibility', 'needs_human', 'waiting_on']

function firstVerdict(review) {
  const line = review.split(/\r?\n/).find((l) => l.trim() && !l.startsWith('~~'))
  if (!line) return null
  const text = line.trim()
  return VERDICTS.find((verdict) => text.startsWith(verdict)) ?? null
}

function checkMap(file, fm, body) {
  const parts = sections(body)
  if (!parts.Target) add(file, 'map has no ## Target section')
  if (!parts['Acceptance direction']) add(file, 'map has no ## Acceptance direction section')
  else if (!/Review point:/.test(parts['Acceptance direction']))
    add(file, 'map Acceptance direction has no Review point line')
  if (!parts['Not yet specified']) add(file, 'map has no ## Not yet specified section')
  if (parts.Children || parts['Sub-maps']) add(file, 'map body lists its children')

  const fog = parts['Not yet specified'] ?? ''
  const lines = fog.split(/\r?\n/)
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    if (!line.startsWith('- ')) continue
    // An entry runs from its `- ` line to the next one; a struck entry is
    // resolved only when its own block says so.
    const block = [line]
    let end = i + 1
    while (end < lines.length && !lines[end].startsWith('- ') && !lines[end].startsWith('## ')) {
      block.push(lines[end])
      end += 1
    }
    const text = block.join('\n')
    if (line.startsWith('- ~~')) {
      if (!/Resolved on \d{4}-\d{2}-\d{2}/.test(text))
        add(file, `struck fog entry has no Resolved on date: ${line.slice(0, 60)}`)
      i = end - 1
      continue
    }
    if (!/^- [A-Z][A-Za-z ]+:/.test(line)) continue
    if (!/^\s+(Why it matters|If wrong):/m.test(text))
      add(file, `fog entry has no second line: ${line.slice(0, 60)}`)
    i = end - 1
  }

  if (fm.status === 'closed') {
    if (!parts.Review) add(file, 'closed map has no ## Review section')
    else {
      const verdict = firstVerdict(parts.Review)
      if (!verdict) add(file, 'map Review has no verdict')
      else if (verdict === 'needs changes' || verdict === 'needs discussion')
        add(file, `closed map carries verdict "${verdict}"`)
    }
  }

  if (fm.custom.outcome === 'failed' && parts.Review) {
    const verdict = firstVerdict(parts.Review)
    if (verdict !== 'wrong direction') add(file, 'outcome=failed without verdict "wrong direction"')
  }
}

function checkTask(file, fm, body) {
  const parts = sections(body)
  if (!parts.Action) add(file, 'task has no ## Action section')
  if (!parts['Acceptance signal']) add(file, 'task has no ## Acceptance signal section')

  const { task_kind, reversibility, needs_human } = fm.custom
  if (!['delivery', 'probe'].includes(task_kind ?? '')) add(file, `task_kind is "${task_kind ?? 'missing'}"`)
  if (!['one_way', 'two_way'].includes(reversibility ?? ''))
    add(file, `reversibility is "${reversibility ?? 'missing'}"`)
  if (!['true', 'false'].includes(needs_human ?? '')) add(file, `needs_human is "${needs_human ?? 'missing'}"`)

  if (task_kind === 'delivery' && reversibility === 'one_way' && !parts['Failure recovery'])
    add(file, 'one_way delivery has no ## Failure recovery section')
  if (task_kind === 'probe' && !parts['Next step']) add(file, 'probe has no ## Next step section')

  if (fm.status === 'closed' && !parts.Result) add(file, 'closed task has no ## Result section')
  if (fm.custom.outcome === 'failed' && parts.Review) {
    const verdict = firstVerdict(parts.Review)
    if (verdict !== 'wrong direction') add(file, 'outcome=failed without verdict "wrong direction"')
  }

  const dependencies = Array.isArray(fm.dependencies) ? fm.dependencies : []
  if (dependencies.length) add(file, 'task carries a dependency edge')
  if (!fm.parent) add(file, 'task has no parent')
}

function checkTestimony(file, fm) {
  const body = read(file)
  const parts = sections(parseTicket(body)?.body ?? body)
  if (!parts.Subject) add(file, 'testimony has no ## Subject section')
  for (const field of [...MAP_FIELDS, ...TASK_FIELDS]) {
    if (fm.custom[field] !== undefined) add(file, `testimony carries the ${field} field`)
  }
}

const items = new Map()
for (const category of ['map', 'task', 'testimony']) {
  const dir = join(ticketsRoot, category)
  let names = []
  try {
    names = readdirSync(dir).filter((name) => name.endsWith('.md'))
  } catch {
    continue
  }
  for (const name of names) {
    const file = join(dir, name)
    const text = read(file)
    if (!text) continue
    const parsed = parseTicket(text)
    if (!parsed) {
      add(file, 'no front matter')
      continue
    }
    const { fm, body } = parsed
    items.set(fm.id ?? name.replace(/\.md$/, ''), { file, fm, body })
    if (fm.category !== category) add(file, `category "${fm.category}" sits in tickets/${category}/`)
    if (category === 'map') checkMap(file, fm, body)
    if (category === 'task') checkTask(file, fm, body)
    if (category === 'testimony') checkTestimony(file, fm)
  }
}

// Relations that need the whole project.
for (const [id, { file, fm }] of items) {
  const parent = fm.parent
  if (parent && !items.has(parent)) add(file, `parent ${parent} does not exist`)
  const dependencies = Array.isArray(fm.dependencies) ? fm.dependencies : []
  for (const dependency of dependencies) {
    if (!items.has(dependency)) add(file, `dependency ${dependency} does not exist`)
    if (dependency === parent) add(file, 'dependency edge to its own parent')
  }
  if (fm.category === 'task' && parent && items.has(parent)) {
    if (items.get(parent).fm.category !== 'map') add(file, `parent ${parent} is not a map`)
  }
}

// Children of one map share one category, and a map with children carries split_as.
const byParent = new Map()
for (const [, { fm }] of items) {
  if (!fm.parent) continue
  if (!byParent.has(fm.parent)) byParent.set(fm.parent, [])
  byParent.get(fm.parent).push(fm)
}
for (const [parentId, children] of byParent) {
  const parent = items.get(parentId)
  if (!parent) continue
  const kinds = new Set(children.map((child) => child.category))
  if (kinds.size > 1) add(parent.file, `children are mixed: ${[...kinds].join(', ')}`)
  const expected = { submap: 'map', task: 'task' }
  const declared = parent.fm.custom.split_as
  if (!declared) add(parent.file, 'map has children but no split_as')
  else if (expected[declared] !== [...kinds][0])
    add(parent.file, `split_as is "${declared}" but children are ${[...kinds][0]}`)
}

// Glossary sources: one JSONL line per term, each with a term and a definition.
const glossaryDir = join(root, '.work-weave', 'glossary')
try {
  for (const name of readdirSync(glossaryDir).filter((file) => file.endsWith('.jsonl'))) {
    const file = join(glossaryDir, name)
    for (const [index, line] of (read(file) ?? '').split(/\r?\n/).entries()) {
      if (!line.trim()) continue
      try {
        const entry = JSON.parse(line)
        if (!entry.term || !entry.definition) add(file, `line ${index + 1} has no term or definition`)
      } catch {
        add(file, `line ${index + 1} is not a JSON object`)
      }
    }
  }
} catch {
  // No glossary in this project is normal.
}

// ADRs: NNNN-slug.md, numbers unique and starting at one.
const adrDir = join(root, 'docs', 'adr')
try {
  const numbers = readdirSync(adrDir)
    .filter((name) => name.endsWith('.md'))
    .map((name) => {
      const match = name.match(/^(\d{4})-[a-z0-9-]+\.md$/)
      if (!match) add(join(adrDir, name), 'ADR file name is not NNNN-slug.md')
      return match ? Number(match[1]) : null
    })
    .filter((number) => number !== null)
    .sort((a, b) => a - b)
  if (numbers.length) {
    for (let i = 0; i < numbers.length; i += 1) {
      if (numbers[i] !== i + 1) {
        add(adrDir, `ADR numbers skip or repeat at ${String(numbers[i]).padStart(4, '0')}`)
        break
      }
    }
  }
} catch {
  // No ADRs yet is normal.
}

// The pending queue: one JSON object per line.
const queueFile = join(root, '.work-weave', 'pending', 'pending-communications.md')
const queue = read(queueFile)
if (queue) {
  for (const [index, line] of queue.split(/\r?\n/).entries()) {
    if (!line.trim() || !line.startsWith('- ')) continue
    try {
      JSON.parse(line.slice(2))
    } catch {
      add(queueFile, `line ${index + 1} is not a JSON object`)
    }
  }
}

// The generated glossary view is never hand-edited; it carries its own header.
const glossary = join(root, 'GLOSSARY.md')
try {
  if (statSync(glossary)) {
    const text = read(glossary) ?? ''
    if (!/_Source_|generated/i.test(text)) add(glossary, 'GLOSSARY.md has no generated marker')
  }
} catch {
  // Absent is normal.
}

// A record written before an assertion existed fails it, and would keep the
// check red until the whole tree is migrated. A baseline records those known
// findings: the run reports them and fails only on a finding not in the file.
const fingerprint = (finding) =>
  `${finding.file.replace(/^.*\/tickets\//, 'tickets/')}|${finding.message.replace(/"[^"]*"/g, 'X').replace(/\d+/g, 'N')}`

const baselineIndex = args.indexOf('--baseline')
const baselinePath = baselineIndex === -1 ? null : args[baselineIndex + 1]
const writeIndex = args.indexOf('--write-baseline')
const writePath = writeIndex === -1 ? null : args[writeIndex + 1]

if (writePath) {
  const known = [...new Set(findings.map(fingerprint))].sort()
  const { writeFileSync } = await import('node:fs')
  writeFileSync(writePath, `${JSON.stringify({ findings: known }, null, 2)}\n`)
  console.log(`wrote ${known.length} known findings to ${writePath}`)
  process.exit(0)
}

let known = new Set()
if (baselinePath) {
  try {
    known = new Set(JSON.parse(read(baselinePath) ?? '{}').findings ?? [])
  } catch {
    console.error(`${baselinePath}: not a baseline file`)
    process.exit(2)
  }
}
const fresh = findings.filter((finding) => !known.has(fingerprint(finding)))

if (json) {
  process.stdout.write(
    `${JSON.stringify({ root, findings: fresh, known: findings.length - fresh.length, ok: fresh.length === 0 }, null, 2)}\n`
  )
} else {
  for (const finding of fresh) console.log(`${finding.file}: ${finding.message}`)
  const knownNote = known.size ? `, ${findings.length - fresh.length} known` : ''
  console.log(
    `\n${fresh.length} new finding${fresh.length === 1 ? '' : 's'} across ${items.size} records${knownNote}`
  )
}
process.exit(fresh.length === 0 ? 0 : 1)
