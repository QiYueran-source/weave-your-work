#!/usr/bin/env node
// Check that a fresh install produced every skill under weave-your-work/ and
// that each SKILL.md still has front matter the CLI can read.
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { parse } from 'yaml'

const root = process.argv[2] ?? '.'
const resultsPath = process.argv[3]

if (!resultsPath) {
  console.error('usage: node scripts/check-skills.mjs <repo-root> <install-json>')
  process.exit(2)
}

const skillsDir = join(root, 'weave-your-work')
const expected = readdirSync(skillsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(join(skillsDir, entry.name, 'SKILL.md')))
  .map((entry) => entry.name)
  .sort()

const results = JSON.parse(readFileSync(resultsPath, 'utf8'))
if (!Array.isArray(results)) {
  console.error(`${resultsPath}: expected an array of install results`)
  process.exit(1)
}

const problems = []

for (const result of results) {
  if (result.status !== 'installed') {
    problems.push(`${result.name ?? 'unknown'}: install status is ${result.status}`)
  }
}

const installed = results
  .filter((result) => result.status === 'installed')
  .map((result) => result.name)
  .sort()

for (const name of expected) {
  if (!installed.includes(name)) problems.push(`weave-your-work/${name} is missing from the install`)
}

for (const name of installed) {
  if (!expected.includes(name)) problems.push(`${name} was installed but has no directory under weave-your-work/`)
}

for (const name of expected) {
  const file = join(skillsDir, name, 'SKILL.md')
  const text = readFileSync(file, 'utf8')
  const frontMatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)

  if (!frontMatter) {
    problems.push(`${file}: no YAML front matter`)
    continue
  }

  let data
  try {
    data = parse(frontMatter[1])
  } catch (error) {
    problems.push(`${file}: ${error.message}`)
    continue
  }

  if (!data || typeof data.name !== 'string' || data.name.trim() === '') {
    problems.push(`${file}: missing name`)
  } else if (data.name !== name) {
    problems.push(`${file}: name ${data.name} does not match directory ${name}`)
  }

  if (typeof data.description !== 'string' || data.description.trim() === '') {
    problems.push(`${file}: missing description`)
  }
}

if (problems.length > 0) {
  console.error('Skill install check failed:')
  for (const problem of problems) console.error(`  - ${problem}`)
  process.exit(1)
}

console.log(`Checked ${expected.length} skills: all installed, front matter valid.`)
