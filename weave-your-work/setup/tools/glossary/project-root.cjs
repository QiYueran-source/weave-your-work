'use strict'

const fs = require('node:fs')
const path = require('node:path')
const { execFileSync } = require('node:child_process')

function physicalDirectory(directory, description) {
  if (typeof directory !== 'string' || directory.length === 0) {
    throw new Error(`${description} must be a non-empty directory path`)
  }
  try {
    const real = fs.realpathSync(directory)
    if (!fs.statSync(real).isDirectory()) throw new Error('not a directory')
    return real
  } catch (error) {
    throw new Error(`${description} is not an accessible directory: ${directory}`, { cause: error })
  }
}

function exists(directory) {
  try {
    fs.lstatSync(directory)
    return true
  } catch (error) {
    if (error.code === 'ENOENT') return false
    throw error
  }
}

function requireMarker(marker, kind, parent) {
  let real
  try {
    real = fs.realpathSync(marker)
    const stat = fs.statSync(real)
    if (!(kind === 'directory' ? stat.isDirectory() : stat.isFile())) {
      throw new Error(`Expected ${kind} at ${marker}`)
    }
  } catch (error) {
    throw new Error(`Cannot inspect ${marker}: ${error.message}`, { cause: error })
  }
  const relative = path.relative(parent, real)
  if (!relative || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`Project marker ${marker} resolves outside ${parent}`)
  }
  return real
}

function overlaps(a, b) {
  const within = (parent, child) => {
    const relative = path.relative(parent, child)
    return relative === '' || (relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative))
  }
  return within(a, b) || within(b, a)
}

function validate(root) {
  const workWeave = requireMarker(path.join(root, '.work-weave'), 'directory', root)
  const waymark = requireMarker(path.join(root, '.waymark'), 'directory', root)
  requireMarker(path.join(root, '.waymark', 'config.toml'), 'file', waymark)
  const gitMarker = path.join(root, '.git')
  let gitMarkerPath
  try {
    gitMarkerPath = fs.realpathSync(gitMarker)
    const stat = fs.statSync(gitMarkerPath)
    if (!stat.isDirectory() && !stat.isFile()) throw new Error('not a file or directory')
  } catch (error) {
    throw new Error(`Expected a Git worktree marker at ${gitMarker}`, { cause: error })
  }
  if (overlaps(workWeave, waymark) || overlaps(workWeave, gitMarkerPath) || overlaps(waymark, gitMarkerPath)) {
    throw new Error('Project markers .git, .waymark, and .work-weave must not overlap')
  }

  // Inherited Git environment variables can point Git at a different worktree.
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.toUpperCase().startsWith('GIT_')))
  let gitRoot
  try {
    gitRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], {
      cwd: root, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']
    }).replace(/\r?\n$/, '')
    gitRoot = fs.realpathSync(gitRoot)
  } catch (error) {
    throw new Error(`Cannot validate Git worktree at ${root}`, { cause: error })
  }
  if (gitRoot !== root) {
    throw new Error(`Git worktree root ${gitRoot} does not match project root ${root}`)
  }
  return root
}

function resolveProjectRoot(options = {}) {
  const cwd = physicalDirectory(options.cwd === undefined ? process.cwd() : options.cwd, 'Working directory')
  if (options.project !== undefined) {
    if (typeof options.project !== 'string' || options.project.length === 0) {
      throw new Error('Project path must be a non-empty directory path')
    }
    return validate(physicalDirectory(path.resolve(cwd, options.project), 'Project path'))
  }

  let current = cwd
  for (;;) {
    if (exists(path.join(current, '.work-weave'))) return validate(current)
    const parent = path.dirname(current)
    if (parent === current) throw new Error(`No .work-weave marker found above ${cwd}; run setup or specify a project`)
    current = parent
  }
}

module.exports = { resolveProjectRoot }
