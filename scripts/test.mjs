#!/usr/bin/env node
// Run every tool test from one command. The file list is built here
// rather than by the shell so the same script works on Windows.
import { spawnSync } from 'node:child_process'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const directories = [
  'weave-your-work/setup/tools',
  'weave-your-work/setup/tools/glossary/tests',
  'weave-your-work/setup/tools/issue/tests',
]

const files = []
for (const directory of directories) {
  for (const name of readdirSync(join(root, directory))) {
    if (/\.test\.(?:cjs|mjs)$/.test(name) || /^test-.*\.mjs$/.test(name)) {
      files.push(join(root, directory, name))
    }
  }
}
files.sort()

// One invocation per file, not one invocation with every file: a single
// `--test` call reports a pass count that does not equal the sum of the
// files run alone, so a silent skip goes unseen. Each file's counts are
// added up here and checked against what it printed.
let failed = 0
const totals = { tests: 0, pass: 0, fail: 0 }
for (const file of files) {
  const result = spawnSync(process.execPath, ['--test', file], { encoding: 'utf8' })
  const text = `${result.stdout ?? ''}${result.stderr ?? ''}`
  const read = (key) => Number(new RegExp(`^# ${key} (\\d+)$`, 'm').exec(text)?.[1] ?? NaN)
  const counts = { tests: read('tests'), pass: read('pass'), fail: read('fail') }
  process.stdout.write(text)
  console.log(`\n${file}: ${counts.tests} tests, ${counts.pass} pass, ${counts.fail} fail`)
  if (result.status !== 0 || counts.fail !== 0) failed += 1
  if (counts.tests !== counts.pass + counts.fail) {
    console.log(`${file}: reported ${counts.pass} pass and ${counts.fail} fail out of ${counts.tests} tests`)
    failed += 1
  }
  totals.tests += counts.tests || 0
  totals.pass += counts.pass || 0
  totals.fail += counts.fail || 0
}
console.log(`\n${files.length} files: ${totals.tests} tests, ${totals.pass} pass, ${totals.fail} fail`)
process.exit(failed === 0 ? 0 : 1)
