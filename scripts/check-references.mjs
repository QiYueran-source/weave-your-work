#!/usr/bin/env node
// Check the set's structure: every skill declares itself in readable front
// matter, a skill links only into its own folder, each record definition names
// the check that decides each of its assertions, and no skill calls itself in a
// circle. Read-only. Usage: node scripts/check-references.mjs [repo-root] [--json]
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'

const args = process.argv.slice(2)
const json = args.includes('--json')
const root = resolve(args.find((a) => !a.startsWith('--')) ?? '.')
const setDir = join(root, 'weave-your-work')
const findings = []
const add = (file, message) => findings.push({ file: relative(root, file), message })

function read(file) {
  try {
    return readFileSync(file, 'utf8')
  } catch {
    return null
  }
}

function statSafe(dir) {
  try {
    return statSync(dir).isDirectory()
  } catch {
    return false
  }
}

function walk(dir, out = []) {
  if (!statSafe(dir)) return out
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

// A record's definition is one Markdown file at the root of a skill folder. The
// `agents/` folder and toolkit files beside it are not record definitions.
const DEFINITION = /^[A-Z][A-Z-]*FORMAT\.md$/
function definitionFiles(skill) {
  return readdirSync(join(setDir, skill), { withFileTypes: true })
    .filter((entry) => entry.isFile() && DEFINITION.test(entry.name))
    .map((entry) => join(setDir, skill, entry.name))
    .sort()
}

// Every check an assertion may name. `check-records` and `check-skills` are
// scripts beside this one; the rest are the skills that decide by reading.
const scriptChecks = new Set(
  readdirSync(join(root, 'scripts'))
    .filter((name) => name.endsWith('.mjs'))
    .map((name) => name.slice(0, -'.mjs'.length))
)
const skillChecks = new Set(
  readdirSync(setDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && read(join(setDir, entry.name, 'SKILL.md')))
    .map((entry) => entry.name)
)
const deciders = new Set([...scriptChecks, ...skillChecks])

const skills = readdirSync(setDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && read(join(setDir, entry.name, 'SKILL.md')))
  .map((entry) => entry.name)
  .sort()
const skillSet = new Set(skills)

function frontMatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return null
  const fields = {}
  for (const line of match[1].split(/\r?\n/)) {
    const flat = line.match(/^([a-z][a-z-]*):\s*(.*)$/)
    if (flat) fields[flat[1]] = flat[2].replace(/^["']|["']$/g, '')
  }
  return fields
}

// 1. Front matter names the skill and says what triggers it.
for (const skill of skills) {
  const file = join(setDir, skill, 'SKILL.md')
  const fields = frontMatter(read(file) ?? '')
  if (!fields) {
    add(file, 'no front matter')
    continue
  }
  if (fields.name !== skill) add(file, `name "${fields.name}" does not match the folder "${skill}"`)
  if (!fields.description) add(file, 'no description')
  else if (fields.description.length < 20) add(file, 'description is too short to trigger anything')
}

// 2. No file in one skill links into another skill's folder. The table in
//    UPSTREAM.md names an upstream path for each skill this set copied, so a
//    pointer into another folder stops working when that skill moves.
for (const skill of skills) {
  for (const file of walk(join(setDir, skill))) {
    const text = read(file) ?? ''
    for (const match of text.matchAll(/\]\(([^)\s]+)\)/g)) {
      const target = match[1]
      if (/^[a-z][a-z+.-]*:/i.test(target) || target.startsWith('#') || target.startsWith('/')) continue
      const resolved = resolve(dirname(file), target.split('#')[0])
      if (!resolved.startsWith(`${setDir}/`)) continue
      const owner = relative(setDir, resolved).split('/')[0]
      if (owner !== skill && skillSet.has(owner)) add(file, `links into the ${owner} folder: ${target}`)
    }
  }
}

// 3. A record's definition defines; it does not run. It carries no numbered
//    procedure, and every assertion under it names the check that decides it.
//    An assertion may wrap across lines; the tag sits on its last line.
const formats = skills.flatMap(definitionFiles)
if (!formats.length) add(setDir, 'no record definition; a definition is <NAME>-FORMAT.md at the root of its skill')
for (const file of formats) {
  const text = read(file) ?? ''
  if (/^## (Steps|Process|Procedure)\s*$/m.test(text))
    add(file, 'resource holds a step procedure; procedures belong to an action')
  const assertions = text.split(/^## Assertions\s*$/m)[1]
  if (!assertions) {
    add(file, 'no ## Assertions section')
    continue
  }
  let open = null
  const close = assertion => {
    const tag = assertion.match(/\[([a-z][a-z-]*)\]\s*$/)
    if (!tag) add(file, `assertion names no check: ${assertion.trim().slice(0, 60)}`)
    else if (!deciders.has(tag[1])) add(file, `assertion names a check that does not exist: ${tag[1]}`)
    open = null
  }
  for (const raw of assertions.split(/\r?\n/)) {
    if (!raw.trim() || raw.startsWith('#')) {
      if (open) close(open)
      continue
    }
    open = open ? `${open}\n${raw}` : raw
    if (/\[([a-z][a-z-]*)\]\s*$/.test(raw.trim())) close(open)
  }
  if (open) close(open)
}

// 4. Each record definition sits beside the skill that acts on it.
for (const file of formats) {
  const owner = relative(setDir, file).split('/')[0]
  if (!skillSet.has(owner)) add(file, 'a record definition lives beside the skill that acts on it')
}

// 5. No cycles in the call graph. A call is a line that tells the run to go to
//    another skill now ("call `x`", "calls `x`", "go to `x`"). A hand-off names
//    where the result goes and stops, so it carries no edge.
const VERBS = '(?:call|calls|calling|go to|goes to|reach|reaches)'
const calls = new Map()
for (const skill of skills) {
  const text = read(join(setDir, skill, 'SKILL.md')) ?? ''
  const found = new Set()
  for (const match of text.matchAll(new RegExp(`\\b${VERBS} (?:the )?(?:Skill tool with )?\`([a-z][a-z-]*)\``, 'g'))) {
    if (skillSet.has(match[1]) && match[1] !== skill) found.add(match[1])
  }
  calls.set(skill, found)
}
const state = new Map()
const stack = []
function visit(skill) {
  if (state.get(skill) === 'done') return
  if (state.get(skill) === 'open') {
    const start = stack.indexOf(skill)
    add(join(setDir, skill, 'SKILL.md'), `call cycle: ${[...stack.slice(start), skill].join(' -> ')}`)
    return
  }
  state.set(skill, 'open')
  stack.push(skill)
  for (const next of calls.get(skill) ?? []) visit(next)
  stack.pop()
  state.set(skill, 'done')
}
for (const skill of skills) visit(skill)

// 6. Installable parts live under setup, not under a skill of their own.
for (const skill of skills) {
  if (skill === 'setup') continue
  if (read(join(setDir, skill, 'bundle', 'setup.md'))) add(join(setDir, skill), 'carries a bundle; installs belong under setup')
}

if (json) {
  process.stdout.write(`${JSON.stringify({ findings, ok: findings.length === 0 }, null, 2)}\n`)
} else {
  for (const finding of findings) console.log(`${finding.file}: ${finding.message}`)
  console.log(`\n${findings.length} finding${findings.length === 1 ? '' : 's'} across ${skills.length} skills`)
}
process.exit(findings.length === 0 ? 0 : 1)
