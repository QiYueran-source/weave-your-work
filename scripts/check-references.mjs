#!/usr/bin/env node
// Check the set's structure: one job per skill, one home per record, one
// router. Read-only. Usage: node scripts/check-references.mjs [repo-root] [--json]
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
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else if (entry.name.endsWith('.md')) out.push(full)
  }
  return out
}

const FAMILIES = ['track', 'setup', 'reach', 'method', 'none']
const INVOCATIONS = ['user', 'model']

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
    const flat = line.match(/^([a-z_]+):\s*(.*)$/)
    if (flat) fields[flat[1]] = flat[2].replace(/^["']|["']$/g, '')
  }
  return fields
}

// 1. Front matter, and the two keys the set requires.
for (const skill of skills) {
  const file = join(setDir, skill, 'SKILL.md')
  const text = read(file) ?? ''
  const fields = frontMatter(text)
  if (!fields) {
    add(file, 'no front matter')
    continue
  }
  if (fields.name !== skill) add(file, `name "${fields.name}" does not match the folder "${skill}"`)
  if (!fields.description) add(file, 'no description')
  else if (fields.description.length < 20) add(file, 'description is too short to trigger anything')
  if (!FAMILIES.includes(fields.family ?? '')) add(file, `family "${fields.family ?? 'missing'}"`)
  if (!INVOCATIONS.includes(fields.invocation ?? '')) add(file, `invocation "${fields.invocation ?? 'missing'}"`)
}

// 2. No file in one skill links into another skill's folder.
for (const skill of skills) {
  for (const file of walk(join(setDir, skill))) {
    const text = read(file) ?? ''
    for (const match of text.matchAll(/\]\(([^)\s]+)\)/g)) {
      const target = match[1]
      if (/^[a-z]+:/i.test(target) || target.startsWith('#')) continue
      const resolved = resolve(dirname(file), target.split('#')[0])
      for (const other of skills) {
        if (other === skill) continue
        const otherDir = join(setDir, other)
        if (resolved === otherDir || resolved.startsWith(`${otherDir}/`)) {
          add(file, `links into the ${other} folder: ${target}`)
        }
      }
    }
  }
}

// 3. A resource defines; it does not run. It holds no numbered procedure,
//    and it stays short enough to read in one pass.
const resFiles = walk(join(setDir, 'waymark', 'res')).concat(
  ...skills
    .filter((skill) => statSafe(join(setDir, skill, 'res')))
    .map((skill) => walk(join(setDir, skill, 'res')))
)
for (const file of new Set(resFiles)) {
  const text = read(file) ?? ''
  if (/^## (Steps|Process|Procedure)\s*$/m.test(text))
    add(file, 'resource holds a step procedure; procedures belong to an action')
  const assertions = text.split(/^## Assertions\s*$/m)[1]
  if (assertions) {
    for (const bullet of assertions.split(/\r?\n/).filter((line) => line.startsWith('- '))) {
      if (!/\[(waymark|check-records|review)\]\s*$/.test(bullet.trim()))
        add(file, `assertion names no check: ${bullet.trim().slice(0, 60)}`)
    }
  }
  const lines = text.split(/\r?\n/).length
  if (lines > 60) add(file, `resource is ${lines} lines; the limit is 60`)
}

// 4. The router names every skill, and names no skill that is gone.
const router = join(setDir, 'ask-me', 'SKILL.md')
const routerText = read(router) ?? ''
const missing = skills.filter(
  (skill) => skill !== 'ask-me' && !new RegExp(`\`${skill}\``).test(routerText)
)
for (const skill of missing) add(router, `router does not name ${skill}`)
for (const match of routerText.matchAll(/\*\*`([a-z][a-z-]*)`\*\*/g)) {
  if (!skillSet.has(match[1])) add(router, `router names ${match[1]}, which is not a skill`)
}

// 5. The mainline names its actions, and each of them exists.
const mainline = join(setDir, 'MAINLINE.md')
const mainlineText = read(mainline)
if (!mainlineText) add(mainline, 'MAINLINE.md is missing')
else {
  // The line is the steps that carry a project from a settled map to a closed
  // one; every skill it runs belongs in its table, and none of them is also
  // listed as auxiliary, which would say two things about one action.
  const mainlineActions = [
    'open-map',
    'open-task',
    'split',
    'fog-explore',
    'advance-task',
    'task-review',
    'map-review',
  ]
  const auxiliary = mainlineText.split(/^## The auxiliary actions\s*$/m)[1] ?? ''
  for (const action of mainlineActions) {
    if (!skillSet.has(action)) add(mainline, `mainline action ${action} has no skill`)
    if (!mainlineText.includes(action)) add(mainline, `MAINLINE.md does not name ${action}`)
    if (auxiliary.split(/\r?\n/).some((line) => line.startsWith(`| \`${action}\` |`)))
      add(mainline, `mainline action ${action} is also listed as auxiliary`)
  }
}

// 6. No cycles in the call graph (PRINCIPLES.md, rule two). A call is a line
//    that tells the run to go to another skill now ("call `x`", "calls `x`").
//    A hand-off names where the result goes and stops; it carries no edge.
const calls = new Map()
for (const skill of skills) {
  const text = read(join(setDir, skill, 'SKILL.md')) ?? ''
  const found = new Set()
  for (const match of text.matchAll(/\b(?:call|calls|calling) (?:the )?`([a-z][a-z-]*)`/g)) {
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

// 7. One writer per record kind. A writer writes one record and decides
//    nothing else: not how many records there are, where they hang, or what
//    they hold. A second writer would let two actions disagree about a
//    record's shape, and a writer that decides is a step in disguise.
const writers = { 'open-map': 'map', 'open-task': 'task', grill: 'testimony' }
for (const [writer, kind] of Object.entries(writers)) {
  if (!skillSet.has(writer)) {
    add(setDir, `record writer ${writer} has no skill`)
    continue
  }
  const file = join(setDir, writer, 'SKILL.md')
  const text = read(file) ?? ''
  if (!/one (map|task|testimony) per run/i.test(text))
    add(file, `record writer does not say it writes one ${kind} per run`)
  if (!/does not decide how many/.test(text))
    add(file, 'record writer does not say it leaves the count and the parent to the caller')
  if (!/call|does not|nothing else/i.test(text))
    add(file, 'record writer does not bound what it writes')
}

// 8. Installable parts live under setup, not under a skill of their own.
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
