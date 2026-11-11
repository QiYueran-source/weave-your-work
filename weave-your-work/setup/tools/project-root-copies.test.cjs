'use strict'

const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { test } = require('node:test')

const copies = {
  setup: path.join(__dirname, 'project-root.cjs'),
  issue: path.join(__dirname, 'issue', 'project-root.cjs'),
  glossary: path.join(__dirname, 'glossary', 'project-root.cjs'),
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
