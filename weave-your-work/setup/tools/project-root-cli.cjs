#!/usr/bin/env node
'use strict'

const { resolveProjectRoot } = require('./project-root.cjs')

try {
  const args = process.argv.slice(2)
  let options = {}
  if (args.length !== 0) {
    if (args.length !== 2 || args[0] !== '--project' || !args[1] || args[1].startsWith('--')) {
      throw new Error('Usage: node project-root-cli.cjs [--project <directory>]')
    }
    options = { project: args[1] }
  }
  process.stdout.write(`${resolveProjectRoot(options)}\n`)
} catch (error) {
  process.stderr.write(`${error.message}\n`)
  process.exitCode = 1
}
