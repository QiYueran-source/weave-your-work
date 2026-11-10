'use strict'

const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { test } = require('node:test')

const copies = {
  setup: path.join(__dirname, 'project-root.cjs'),
  issue: path.resolve(__dirname, '../../../issue/bundle/tools/project-root.cjs'),
  glossary: path.resolve(__dirname, '../../../glossary/bundle/tools/project-root.cjs'),
}

test('every bundle carries the same project-root resolver', () => {
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
