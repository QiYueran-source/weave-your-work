'use strict'

const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { test } = require('node:test')

const guides = [path.join(__dirname, 'check-setup.mjs')]

const copies = {
  setup: path.join(__dirname, 'project-root.cjs'),
  issue: path.join(__dirname, 'issue', 'project-root.cjs'),
  glossary: path.join(__dirname, 'glossary', 'project-root.cjs'),
}

// Every file under dir the predicate accepts, skipping node_modules.
function find(dir, predicate) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules') continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...find(full, predicate))
    else if (predicate(full)) out.push(full)
  }
  return out
}

test('every tool copy carries the same project-root resolver', () => {
  const expected = fs.readFileSync(copies.setup)
  for (const [name, file] of Object.entries(copies)) {
    if (name === 'setup') continue
    assert.ok(fs.existsSync(file), `${name} copy is missing: ${file}`)
    assert.ok(
      fs.readFileSync(file).equals(expected),
      `${name} copy differs from setup: ${file}`
    )
  }
})

test('no guide claims a test compares the copies', () => {
  const setupDir = path.join(__dirname, '..')
  guides.push(...find(setupDir, (file) => file.endsWith('.md')))
  for (const file of guides) {
    assert.ok(
      !/test checks that the copies/.test(fs.readFileSync(file, 'utf8')),
      `${path.relative(setupDir, file)} names a copy test that npm test does not run`
    )
  }
})
