#!/usr/bin/env node
// Check a repository's tool dependencies the way `npm test` needs them: the
// issue runtime and the glossary runtime load packages that .gitignore keeps
// out of Git, so a fresh clone runs their suites against a missing node_modules
// and reports a module-resolution error instead of following it to its cause.
// Read-only. Usage: node scripts/check-dev-deps.mjs [repo-root]
import { existsSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(process.argv[2] ?? join(dirname(fileURLToPath(import.meta.url)), '..'))
const packages = ['weave-your-work/setup/tools/issue', 'weave-your-work/setup/tools/glossary']

const problems = []
for (const dir of packages) {
  const folder = join(root, dir)
  if (!existsSync(join(folder, 'package.json'))) {
    problems.push(`${dir}: no package.json`)
    continue
  }
  if (!existsSync(join(folder, 'node_modules'))) {
    problems.push(`${dir}: node_modules is missing; run npm ci --omit=dev there`)
  }
}
for (const problem of problems) console.log(problem)
console.log(
  problems.length === 0
    ? `${packages.length} tool runtimes have their dependencies`
    : `${problems.length} tool runtime${problems.length === 1 ? '' : 's'} cannot run tests`
)
process.exit(problems.length === 0 ? 0 : 1)
