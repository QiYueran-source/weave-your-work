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

// A spec's body answers Matt's seven sections. The first three say what the
// problem is and for whom; the rest say what was decided, what is handed over,
// and what was left out.
const SPEC_SECTIONS = [
  'Problem Statement',
  'Solution',
  'User Stories',
  'Implementation Decisions',
  'Acceptance',
  'Out of Scope',
]

// A spec written before `Testing Decisions` was renamed still names the older
// section. The rename is recorded in `weave-your-work/to-spec/SKILL.md`.
const SPEC_SECTION_RENAMES = { 'Testing Decisions': 'Acceptance' }

function checkSpec(file, fm, body) {
  const parts = sections(body)
  const present = Object.keys(parts)
  for (const [oldName, newName] of Object.entries(SPEC_SECTION_RENAMES)) {
    if (present.includes(oldName) && !present.includes(newName))
      add(file, `spec names ## ${oldName}, renamed to ## ${newName}`)
  }
  for (const name of SPEC_SECTIONS) {
    if (!parts[name] && !(name === 'Acceptance' && present.includes('Testing Decisions')))
      add(file, `spec has no ## ${name} section`)
  }
}

// A ticket's body opens with the identifier of the spec it came from, then says
// what to do, what counts as done, what was left behind, and what blocks it.
// The result is filled in when the ticket is finished, so a closed ticket must
// have one and an open ticket need not.
function checkTicket(file, fm, body) {
  const parts = sections(body)
  // The opening line names the spec this ticket came from, which is the only
  // relation between the two. A line that opens with an identifier is a bare
  // identifier; `Part of wm-...` is the same statement in a sentence. A ticket
  // written while the tree still existed names its spec in a `parent` field
  // instead, which says the same thing and is read as such.
  const opening = (body.split(/\r?\n/).find((line) => line.trim()) ?? '').trim()
  const specId = opening.match(/(?:^|\s)(wm-[a-z0-9]+)$/)?.[1] ?? fm.parent
  if (!specId) add(file, 'ticket does not name the spec it came from')
  else if (items.get(specId)?.fm.category !== 'spec')
    add(file, `ticket names ${specId}, which is not a spec`)

  if (!parts['What to do'] && !parts['What to build'])
    add(file, 'ticket has no ## What to do section')
  if (!parts['Acceptance criteria']) add(file, 'ticket has no ## Acceptance criteria section')
  if (fm.status === 'closed' && !parts['The result'] && !parts.Result)
    add(file, 'closed ticket has no ## The result section')

  const dependencies = Array.isArray(fm.dependencies) ? fm.dependencies : []
  for (const dependency of dependencies) {
    if (items.get(dependency)?.fm.category !== 'ticket')
      add(file, `blocked by ${dependency}, which is not a ticket`)
  }
}

function checkTestimony(file, fm) {
  const body = read(file)
  const parts = sections(parseTicket(body)?.body ?? body)
  if (!parts.Subject) add(file, 'testimony has no ## Subject section')
  // A testimony records a discussion. The fields a project declares describe
  // work, and a discussion has none of them to carry.
  if (fm.custom.needs_human !== undefined) add(file, 'testimony carries the needs_human field')

  // A question block is `- **Qn**` followed by its indented fields. The ones
  // under `## Rounds` are the discussion; a block elsewhere is prose.
  const rounds = parts.Rounds
  if (rounds !== undefined) {
    const blocks = rounds.split(/^- \*\*/m).slice(1)
    if (fm.status === 'closed') {
      for (const block of blocks) {
        const id = block.match(/^([^*]+)\*\*/)?.[1]?.trim()
        if (!/\n\s+- Answer:/.test(`\n${block}`))
          add(file, `closed testimony holds ${id ?? 'a question'} with no Answer`)
      }
    }
  }

  // A settled line records what was decided and the question that settled it.
  // Where it lands is the caller's to decide, so a landing named here is a line
  // the record should not carry. The question is stripped first, because a
  // question id is not a landing.
  for (const line of (parts.Settled ?? '').split(/\r?\n/)) {
    const entry = line.match(/^- (.+)$/)
    if (!entry) continue
    if (entry[1].trim() === '(none)') continue
    if (!/\(from Q[^)]+\)/.test(entry[1]))
      add(file, `settled line names no question: ${entry[1].trim()}`)
    if (/→|\b(glossary|adr|ticket|spec)\b/.test(entry[1].replace(/\(from Q[^)]+\)/g, '')))
      add(file, `settled line names a landing: ${entry[1].trim()}`)
  }
}

const items = new Map()
for (const category of ['spec', 'ticket', 'testimony']) {
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
    if (category === 'spec') checkSpec(file, fm, body)
    if (category === 'ticket') checkTicket(file, fm, body)
    if (category === 'testimony') checkTestimony(file, fm)
  }
}

// Relations that need the whole project. A record naming a dependency that does
// not exist, or depending on itself, cannot be worked in the order it asks for.
for (const [id, { file, fm }] of items) {
  const dependencies = Array.isArray(fm.dependencies) ? fm.dependencies : []
  for (const dependency of dependencies) {
    if (dependency === id) add(file, 'a record that blocks itself')
    else if (!items.has(dependency)) add(file, `dependency ${dependency} does not exist`)
  }
  // A spec and its tickets are separate records with no relation between them.
  // The retired tree recorded the relation as a `parent` on the child, and a
  // record written then still carries it; what no category has is a parent that
  // is not a spec.
  if (fm.parent !== undefined) {
    const parent = items.get(fm.parent)
    if (!parent) add(file, `parent ${fm.parent} does not exist`)
    else if (parent.fm.category !== 'spec') add(file, `parent ${fm.parent} is not a spec`)
  }
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
