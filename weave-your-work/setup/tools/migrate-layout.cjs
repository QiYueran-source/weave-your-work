#!/usr/bin/env node
'use strict'

// Move a checkout written under the old `.work-weave` internal layout into the
// one the layout spec describes. Runs on an old checkout and on none of the
// new one; a checkout already in the new shape is left alone.
//
// Old -> new, relative to `.work-weave/`:
//   config/tracker.md        -> shared/tracker.md
//   issue/handles.toml       -> shared/handles.toml
//   glossary/                -> shared/glossary/
//   adr/                     -> shared/adr/
//   runtime/<tool>/          -> personal/<tool>/     (one directory per tool)
//   local/<name>             -> personal/<name>      (settings and service unit)
//   pending/                 -> personal/communication/
//
// Everything is checked before anything moves: a destination that already
// exists stops the migration and both paths are named. The ignore file then
// names `personal/` and nothing else.

const fs = require('node:fs')
const path = require('node:path')

// The old directories, each of which exists only to hold what moved. Any of
// them still holding a file after the moves is reported, not deleted.
const OLD_DIRECTORIES = ['config', 'issue', 'glossary', 'adr', 'runtime', 'local', 'pending']

// The ignore lines that named the four old personal directories. A checkout
// already in the new shape may still carry them, so they are replaced too.
const OLD_IGNORE = new Set(['pending/', 'pending', 'runtime/', 'runtime', 'local/', 'local', 'personal', 'personal/'])

const IGNORE_HEADER = [
  '# Personal state for this checkout and this machine. Everything under',
  '# `shared/` is committed; `personal/` is rebuilt by an install.',
]

function relativeName(weave, target) {
  return `.work-weave/${path.relative(weave, target).split(path.sep).join('/')}`
}

// The moves an old checkout needs, in the order `migrate` performs them.
// Only sources that exist are listed, so a checkout missing a tool has no
// move for it.
function movesFor(weave) {
  const moves = []
  const file = (from, to) => {
    if (fs.existsSync(from)) moves.push({ from, to, directory: false })
  }
  const directory = (from, to) => {
    if (fs.existsSync(from)) moves.push({ from, to, directory: true })
  }

  const shared = path.join(weave, 'shared')
  const personal = path.join(weave, 'personal')
  const runtime = path.join(weave, 'runtime')
  const local = path.join(weave, 'local')

  file(path.join(weave, 'config', 'tracker.md'), path.join(shared, 'tracker.md'))
  file(path.join(weave, 'issue', 'handles.toml'), path.join(shared, 'handles.toml'))
  directory(path.join(weave, 'glossary'), path.join(shared, 'glossary'))
  directory(path.join(weave, 'adr'), path.join(shared, 'adr'))

  if (fs.existsSync(runtime)) {
    const tools = fs.readdirSync(runtime, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
      .map((entry) => entry.name)
      .sort()
    for (const name of tools) directory(path.join(runtime, name), path.join(personal, name))
  }
  if (fs.existsSync(local)) {
    for (const name of fs.readdirSync(local).sort()) {
      file(path.join(local, name), path.join(personal, name))
    }
  }

  directory(path.join(weave, 'pending'), path.join(personal, 'communication'))
  return moves
}

function describe(weave, move) {
  const from = relativeName(weave, move.from)
  const to = relativeName(weave, move.to)
  return `${from}${move.directory ? '/' : ''} -> ${to}${move.directory ? '/' : ''}`
}

// Replace the lines naming the old directories with `personal/`, keeping the
// rest of the file as it was. A comment that says nothing but the names of the
// moved directories goes with them. Returns whether the file changed.
function updateIgnore(weave) {
  const file = path.join(weave, '.gitignore')
  let current = ''
  try {
    current = fs.readFileSync(file, 'utf8')
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  const lines = current.split(/\r?\n/).filter((line) => line.trim() !== '')
  const stale = (line) => {
    const text = line.trim()
    // `personal/` is where everything moves to, so it is never a line to drop.
    if (!text.startsWith('#')) return text !== 'personal/' && text !== 'personal' && OLD_IGNORE.has(text)
    const body = text.replace(/^#+\s*/, '').replace(/[.,;:!?]+$/, '')
    const words = body.split(/[^A-Za-z0-9_./-]+/).filter(Boolean)
    // Every word has to be one of the moved directories, written as `name` or
    // `name/`. A comment that says anything else is still about the file.
    return words.length > 0 && words.every((word) => OLD_IGNORE.has(word) && word !== 'personal' && word !== 'personal/')
  }
  const replaced = lines.filter((line) => !stale(line))
  const names = replaced.filter((line) => !line.startsWith('#')).map((line) => line.trim())
  if (names.length === 1 && names[0] === 'personal/' && replaced.length === lines.length) return false
  // A comment is kept only when a pattern under it survives, because that is the
  // rule it explains. A comment whose patterns all moved goes with them.
  const kept = replaced.filter((line) => line.trim() !== 'personal/')
  const surviving = kept.some((line) => !line.trim().startsWith('#'))
  const body = kept.filter((line) => !line.trim().startsWith('#') || surviving)
  if (!body.some((line) => line.trim().startsWith('#'))) body.unshift(...IGNORE_HEADER)
  const next = `${body.join('\n')}\npersonal/\n`
  if (next === current) return false
  fs.writeFileSync(file, next)
  return true
}

function migrate(root) {
  if (typeof root !== 'string' || root.length === 0) {
    throw new Error('Project root must be a non-empty directory path')
  }
  const project = path.resolve(root)
  const weave = path.join(project, '.work-weave')
  if (!fs.existsSync(weave) || !fs.statSync(weave).isDirectory()) {
    throw new Error(`No .work-weave directory in ${project}; nothing to migrate`)
  }

  const moves = movesFor(weave)
  const conflicts = moves.filter((move) => fs.existsSync(move.to))
  if (conflicts.length) {
    const lines = conflicts.map((move) => `  ${describe(weave, move)}`)
    throw new Error(
      `Cannot migrate ${weave}: ${conflicts.length === 1 ? 'a destination already exists' : `${conflicts.length} destinations already exist`}\n` +
      `${lines.join('\n')}\n` +
      'Nothing was moved. Move or remove the destination, then run the migration again.'
    )
  }

  fs.mkdirSync(path.join(weave, 'shared'), { recursive: true })
  fs.mkdirSync(path.join(weave, 'personal'), { recursive: true })

  const moved = []
  for (const move of moves) {
    fs.mkdirSync(path.dirname(move.to), { recursive: true })
    try {
      fs.renameSync(move.from, move.to)
    } catch (error) {
      // A checkout on more than one filesystem cannot rename across them.
      if (error.code !== 'EXDEV') throw error
      fs.cpSync(move.from, move.to, { recursive: true, preserveTimestamps: true })
      fs.rmSync(move.from, { recursive: true, force: true })
    }
    moved.push(describe(weave, move))
  }

  for (const name of OLD_DIRECTORIES) {
    const directory = path.join(weave, name)
    if (!fs.existsSync(directory)) continue
    if (fs.readdirSync(directory).length !== 0) {
      throw new Error(`${relativeName(weave, directory)} still holds files the migration does not know; left in place`)
    }
    fs.rmdirSync(directory)
  }

  return { weave, moved, ignoreChanged: updateIgnore(weave) }
}

function main(argv) {
  const usage = 'Usage: node migrate-layout.cjs [<project-root>]'
  if (argv.length > 1) throw new Error(usage)
  if (argv.length === 1 && (argv[0] === '' || argv[0].startsWith('--'))) throw new Error(usage)
  const result = migrate(argv[0] === undefined ? process.cwd() : argv[0])
  if (result.moved.length === 0 && !result.ignoreChanged) {
    process.stdout.write(`${result.weave} is already in the shared/ and personal/ layout; nothing to do\n`)
    return
  }
  for (const line of result.moved) process.stdout.write(`Moved ${line}\n`)
  if (result.ignoreChanged) process.stdout.write('Wrote .work-weave/.gitignore naming personal/ only\n')
}

if (require.main === module) {
  try {
    main(process.argv.slice(2))
  } catch (error) {
    process.stderr.write(`${error.message}\n`)
    process.exitCode = 1
  }
}
