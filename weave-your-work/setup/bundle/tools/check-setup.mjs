#!/usr/bin/env node
// Read the seventeen setup checks from the project root. Read-only: report, never repair.
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const REQUIRED_SKILLS = ['setup', 'map', 'task', 'glossary', 'issue']
const CATEGORIES = ['map', 'task', 'testimony']
const FIELDS = ['needs_human', 'outcome', 'reversibility', 'split_as', 'task_kind', 'waiting_on']
const NODE_FLOOR = '22.20.0'
const WAYMARK_FLOOR = '0.1.2'

const OK = 'ok'
const FAIL = 'fail'
const NA = 'not-applicable'
const UNVERIFIED = 'unverified'

const ok = message => ({ status: OK, message })
const fail = message => ({ status: FAIL, message })
const na = message => ({ status: NA, message })
const unverified = message => ({ status: UNVERIFIED, message })

function run(command, args = [], options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? process.cwd(),
    encoding: 'utf8',
    input: options.input,
    timeout: options.timeout ?? 20000,
    windowsHide: true,
    shell: options.shell ?? false,
    env: options.env ? { ...process.env, ...options.env } : process.env,
  })
  return {
    status: result.status,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    error: result.error,
  }
}

function runNpm(args) {
  return run('npm', args, { shell: process.platform === 'win32' })
}

function firstLine(text) {
  return String(text ?? '')
    .split(/\r?\n/)
    .map(line => line.trim())
    .find(Boolean) ?? ''
}

function commandFailure(result) {
  if (result.error) {
    return result.error.code === 'ENOENT' ? 'command not found' : result.error.message
  }
  return firstLine(result.stderr) || firstLine(result.stdout) || `exit ${result.status}`
}

function isDirectory(target) {
  try {
    return fs.statSync(target).isDirectory()
  } catch {
    return false
  }
}

function isFile(target) {
  try {
    return fs.statSync(target).isFile()
  } catch {
    return false
  }
}

function realpath(target) {
  try {
    return fs.realpathSync(target)
  } catch {
    return path.resolve(target)
  }
}

function isOutside(cwd, target) {
  const relative = path.relative(realpath(cwd), realpath(target))
  return relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)
}

function display(cwd, target) {
  const relative = path.relative(cwd, target)
  if (relative && !relative.startsWith('..') && !path.isAbsolute(relative)) {
    return relative.split(path.sep).join('/')
  }
  const homeRelative = path.relative(os.homedir(), target)
  if (homeRelative && !homeRelative.startsWith('..') && !path.isAbsolute(homeRelative)) {
    return `~/${homeRelative.split(path.sep).join('/')}`
  }
  return target
}

export function compareVersions(left, right) {
  const parse = value => {
    const [core, prerelease = ''] = String(value).replace(/^v/, '').split('-', 2)
    return {
      numbers: core.split('.').map(part => Number.parseInt(part, 10) || 0),
      prerelease,
    }
  }
  const a = parse(left)
  const b = parse(right)
  for (let index = 0; index < Math.max(a.numbers.length, b.numbers.length); index += 1) {
    const one = a.numbers[index] ?? 0
    const two = b.numbers[index] ?? 0
    if (one !== two) return one > two ? 1 : -1
  }
  if (a.prerelease === b.prerelease) return 0
  if (!a.prerelease) return 1
  if (!b.prerelease) return -1
  return a.prerelease > b.prerelease ? 1 : -1
}

function stripTomlComment(line) {
  let quote = ''
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index]
    if (quote) {
      if (character === quote && line[index - 1] !== '\\') quote = ''
      continue
    }
    if (character === '"' || character === "'") {
      quote = character
      continue
    }
    if (character === '#') return line.slice(0, index)
  }
  return line
}

export function parseHandles(text) {
  const keys = []
  let section = ''
  for (const raw of String(text).split(/\r?\n/)) {
    const line = stripTomlComment(raw).trim()
    if (!line) continue
    const header = line.match(/^\[(.+)\]$/)
    if (header) {
      section = header[1].trim()
      continue
    }
    if (section !== 'handles') continue
    const equals = line.indexOf('=')
    if (equals < 0) continue
    let key = line.slice(0, equals).trim()
    if (key.startsWith('"') && key.endsWith('"')) key = key.slice(1, -1)
    if (key.startsWith("'") && key.endsWith("'")) key = key.slice(1, -1)
    if (key) keys.push(key)
  }
  return keys
}

function listSkillNames(directory) {
  let entries
  try {
    entries = fs.readdirSync(directory)
  } catch {
    return []
  }
  const names = []
  for (const entry of entries) {
    const full = path.join(directory, entry)
    if (isDirectory(full) && isFile(path.join(full, 'SKILL.md'))) names.push(entry)
  }
  return names.sort()
}

export function findSkillRoots(cwd) {
  const roots = []
  const visited = new Set()
  const walk = (directory, depth, relative) => {
    if (depth > 3) return
    const real = realpath(directory)
    if (visited.has(real)) return
    visited.add(real)
    let entries
    try {
      entries = fs.readdirSync(directory, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      if (entry.name === '.git' || entry.name === 'node_modules') continue
      const full = path.join(directory, entry.name)
      if (!isDirectory(full)) continue
      const childRelative = relative ? `${relative}/${entry.name}` : entry.name
      if (entry.name === 'skills') {
        const names = listSkillNames(full)
        if (names.length) roots.push({ dir: full, label: childRelative, names, global: false })
      }
      walk(full, depth + 1, childRelative)
    }
  }
  walk(cwd, 0, '')
  const home = path.join(os.homedir(), '.agents', 'skills')
  if (isDirectory(home)) {
    const names = listSkillNames(home)
    if (names.length) roots.push({ dir: home, label: '~/.agents/skills', names, global: true })
  }
  return roots
}

function gitTracked(cwd, relative) {
  const gitRelative = relative.split(path.sep).join('/')
  const result = run('git', ['ls-files', '--', gitRelative], { cwd })
  if (result.status !== 0) return null
  const prefix = `${gitRelative.replace(/\/+$/, '')}/`
  const names = new Set()
  for (const line of result.stdout.split(/\r?\n/)) {
    if (!line.startsWith(prefix)) continue
    const rest = line.slice(prefix.length)
    if (!rest.includes('/')) continue
    names.add(rest.split('/')[0])
  }
  return [...names].sort()
}

function ghRepo(cwd) {
  const result = run('gh', ['repo', 'view', '--json', 'nameWithOwner', '-q', '.nameWithOwner'], { cwd })
  if (result.status !== 0) return ''
  return result.stdout.trim()
}

function checkGit(ctx) {
  const result = run('git', ['--version'], { cwd: ctx.cwd })
  if (result.status !== 0) return fail(`git is unavailable: ${commandFailure(result)}`)
  return ok(firstLine(result.stdout))
}

function checkWaymark(ctx) {
  const result = run('waymark', ['--version'], { cwd: ctx.cwd })
  if (result.status !== 0) return fail(`waymark is unavailable: ${commandFailure(result)}`)
  const match = result.stdout.match(/waymark\s+(\d+\.\d+\.\d+)/)
  if (!match) return fail(`waymark printed no version: ${firstLine(result.stdout) || firstLine(result.stderr)}`)
  if (compareVersions(match[1], WAYMARK_FLOOR) < 0) {
    return fail(`waymark ${match[1]} is older than ${WAYMARK_FLOOR}`)
  }
  return ok(`waymark ${match[1]}`)
}

function checkNode(ctx) {
  const node = process.versions.node
  const npmResult = runNpm(['--version'])
  const npm = npmResult.status === 0 ? npmResult.stdout.trim() : ''
  const nodeOk = compareVersions(node, NODE_FLOOR) >= 0
  if (!nodeOk) return fail(`node ${node} is older than ${NODE_FLOOR}; npm ${npm || 'unavailable'}`)
  if (!npm) return fail(`npm is unavailable (${commandFailure(npmResult)}); node ${node}`)
  return ok(`node ${node}, npm ${npm}`)
}

function checkGh(ctx) {
  const result = run('gh', ['auth', 'status'], { cwd: ctx.cwd })
  if (result.error) return fail(`gh is unavailable: ${commandFailure(result)}`)
  if (result.status !== 0) return fail(`gh is not signed in: ${firstLine(result.stderr) || firstLine(result.stdout)}`)
  const text = `${result.stdout}\n${result.stderr}`
  if (!/logged in to/i.test(text)) return fail('gh did not name a signed-in account')
  const line = text.split(/\r?\n/).find(value => /logged in to/i.test(value)) ?? 'signed in'
  return ok(line.replace(/^\s*[✓-]\s*/, '').trim())
}

function checkCurl(ctx) {
  const result = run('curl', ['--version'], { cwd: ctx.cwd })
  if (result.status !== 0) return fail(`curl is unavailable: ${commandFailure(result)}`)
  return ok(firstLine(result.stdout))
}

function checkRepository(ctx) {
  const result = run('git', ['rev-parse', '--show-toplevel'], { cwd: ctx.cwd })
  if (result.status !== 0) return fail(`not a Git repository: ${commandFailure(result)}`)
  return ok(firstLine(result.stdout))
}

function checkIdentity(ctx) {
  const name = run('git', ['config', 'user.name'], { cwd: ctx.cwd })
  const email = run('git', ['config', 'user.email'], { cwd: ctx.cwd })
  const missing = []
  if (name.status !== 0 || !name.stdout.trim()) missing.push('user.name')
  if (email.status !== 0 || !email.stdout.trim()) missing.push('user.email')
  if (missing.length) return fail(`git identity is missing: ${missing.join(', ')}`)
  return ok(`${name.stdout.trim()} <${email.stdout.trim()}>`)
}

function checkRemote(ctx) {
  const result = run('git', ['remote', 'get-url', 'origin'], { cwd: ctx.cwd })
  if (result.error) return fail(`git is unavailable: ${commandFailure(result)}`)
  if (result.status === 2) {
    ctx.hasRemote = false
    return na('no origin remote; checks 9 and 16 are not applicable')
  }
  if (result.status !== 0) return fail(`cannot read origin: ${commandFailure(result)}`)
  if (!result.stdout.trim()) {
    ctx.hasRemote = false
    return na('no origin remote; checks 9 and 16 are not applicable')
  }
  ctx.hasRemote = true
  return ok(result.stdout.trim())
}

function checkProtection(ctx) {
  if (!ctx.hasRemote) return na('no origin remote; check 9 is not applicable')
  const repo = ghRepo(ctx.cwd)
  if (!repo) return unverified('cannot resolve the GitHub repository from the remote')
  const branchResult = run('gh', ['repo', 'view', '--json', 'defaultBranchRef', '-q', '.defaultBranchRef.name'], { cwd: ctx.cwd })
  const branch = branchResult.status === 0 ? branchResult.stdout.trim() : ''
  if (!branch) return unverified(`cannot read the default branch: ${commandFailure(branchResult)}`)
  const result = run('gh', ['api', `repos/${repo}/branches/${branch}`, '--jq', '.protected'], { cwd: ctx.cwd })
  const output = `${result.stdout}\n${result.stderr}`
  if (result.status === 0 && result.stdout.trim() === 'true') {
    return ok(`${repo} ${branch} is protected`)
  }
  if (result.status === 0 && result.stdout.trim() === 'false') {
    const probe = run('gh', ['api', `repos/${repo}/branches/${branch}/protection`], { cwd: ctx.cwd })
    const probeText = `${probe.stdout}\n${probe.stderr}`
    if (/Upgrade to GitHub Pro or make this repository public/i.test(probeText)) {
      return na('the plan does not offer server protection; rely on rules-git.md and the project hook')
    }
    if (probe.status === 0) return fail(`${repo} ${branch} is not protected`)
    if (/\b(?:404|403)\b/.test(probeText)) return unverified('cannot read the protection setting; the account may lack permission')
    return fail(`${repo} ${branch} is not protected: ${firstLine(probeText)}`)
  }
  if (/\b(?:404|403)\b/.test(output)) {
    const probe = run('gh', ['api', `repos/${repo}/branches/${branch}/protection`], { cwd: ctx.cwd })
    const probeText = `${probe.stdout}\n${probe.stderr}`
    if (/Upgrade to GitHub Pro or make this repository public/i.test(probeText)) {
      return na('the plan does not offer server protection; rely on rules-git.md and the project hook')
    }
    return unverified('cannot read the branch; the account may lack permission')
  }
  return fail(`cannot read ${repo} ${branch}: ${firstLine(output)}`)
}

function checkTracker(ctx) {
  const validateResult = run('waymark', ['validate', '--json', '--project', ctx.cwd], { cwd: ctx.cwd })
  if (validateResult.status !== 0 || validateResult.error) {
    return fail(`waymark validate failed: ${commandFailure(validateResult)}`)
  }
  let validate
  try {
    validate = JSON.parse(validateResult.stdout)
  } catch {
    return fail(`waymark validate did not return JSON: ${firstLine(validateResult.stdout) || firstLine(validateResult.stderr)}`)
  }
  const health = validate.data ?? {}
  const healthy = health.healthy === true
  const errors = health.counts?.errors
  const configResult = run('waymark', ['config', 'show', '--json', '--project', ctx.cwd], { cwd: ctx.cwd })
  if (configResult.status !== 0 || configResult.error) {
    return fail(`waymark config show failed: ${commandFailure(configResult)}`)
  }
  let config
  try {
    config = JSON.parse(configResult.stdout)
  } catch {
    return fail(`waymark config show did not return JSON: ${firstLine(configResult.stdout) || firstLine(configResult.stderr)}`)
  }
  const project = config.data?.project ?? {}
  const categories = Object.keys(project.categories ?? {}).sort()
  const fields = Object.keys(project.fields ?? {}).sort()
  const problems = []
  if (!healthy) problems.push('the tracker is not healthy')
  if (errors !== 0) problems.push(`errors: ${errors ?? 'unknown'}`)
  if (project.storage_root !== 'tickets') problems.push(`storage_root: ${project.storage_root ?? 'missing'}`)
  if (categories.join(',') !== CATEGORIES.join(',')) problems.push(`categories: ${categories.join('/') || 'none'}`)
  if (fields.join(',') !== FIELDS.join(',')) problems.push(`fields: ${fields.join('/') || 'none'}`)
  if (problems.length) return fail(problems.join('; '))
  return ok(`healthy, 0 errors; storage_root tickets; ${CATEGORIES.length} categories, ${FIELDS.length} fields`)
}

function checkOperator(ctx) {
  const configResult = run('waymark', ['config', 'show', '--json', '--project', ctx.cwd], { cwd: ctx.cwd })
  if (configResult.status !== 0 || configResult.error) {
    return fail(`waymark config show failed: ${commandFailure(configResult)}`)
  }
  let config
  try {
    config = JSON.parse(configResult.stdout)
  } catch {
    return fail(`waymark config show did not return JSON: ${firstLine(configResult.stdout) || firstLine(configResult.stderr)}`)
  }
  const operator = config.data?.effective?.operator
  if (!operator || operator === 'None') return fail('the operator is unset')
  const handlePath = path.join(ctx.cwd, '.work-weave', 'issue', 'handles.toml')
  if (!isFile(handlePath)) return ok(`operator ${operator}; handles absent, nothing to match`)
  let text
  try {
    text = fs.readFileSync(handlePath, 'utf8')
  } catch {
    return fail(`cannot read ${display(ctx.cwd, handlePath)}`)
  }
  const keys = parseHandles(text)
  if (!keys.length) return fail(`operator ${operator}; the [handles] table is empty`)
  const match = keys.find(key => key.toLowerCase() === String(operator).toLowerCase())
  if (match) return ok(`operator ${operator}; handles ${match}`)
  return fail(`operator ${operator} is not in [handles]: ${keys.join(', ')}`)
}

function checkSkills(ctx) {
  const roots = findSkillRoots(ctx.cwd)
  if (!roots.length) return fail('no skills directory holding <name>/SKILL.md')
  const known = new Set()
  const installed = new Set()
  const parts = []
  let bad = false
  for (const root of roots) {
    const fresh = root.names.filter(name => !known.has(realpath(path.join(root.dir, name))))
    for (const name of root.names) {
      known.add(realpath(path.join(root.dir, name)))
      installed.add(name)
    }
    if (!fresh.length) {
      parts.push(`${root.label}: ${root.names.length} skills, all reached again through another root, nothing new to compare`)
      continue
    }
    if (root.global || isOutside(ctx.cwd, root.dir)) {
      parts.push(`${root.label}: ${root.names.length} skills (global install)`)
      continue
    }
    const tracked = gitTracked(ctx.cwd, root.label)
    if (tracked === null) {
      parts.push(`${root.label}: git ls-files failed`)
      bad = true
      continue
    }
    if (!tracked.length) {
      parts.push(`${root.label}: ${root.names.length} skills, none tracked yet, nothing to compare`)
      continue
    }
    const missing = tracked.filter(name => !root.names.includes(name))
    parts.push(`${root.label}: ${root.names.length} skills, missing: ${missing.length ? missing.join(', ') : 'none'}`)
    if (missing.length) bad = true
  }
  const source = isDirectory(path.join(ctx.cwd, 'weave-your-work')) && isFile(path.join(ctx.cwd, 'skills.sh.json'))
  if (!source) {
    const missing = REQUIRED_SKILLS.filter(name => !installed.has(name))
    if (missing.length) {
      parts.push(`missing required skills in every root: ${missing.join(', ')}`)
      bad = true
    }
  }
  return bad ? fail(parts.join('; ')) : ok(parts.join('; '))
}

function checkBundleRules(ctx) {
  const roots = [
    path.join(ctx.cwd, '.agents', 'skills'),
    path.join(os.homedir(), '.agents', 'skills'),
  ]
  const wrong = []
  const visited = new Set()
  for (const root of roots) {
    if (!isDirectory(root)) continue
    const real = realpath(root)
    if (visited.has(real)) continue
    visited.add(real)
    for (const skill of fs.readdirSync(root)) {
      const rules = path.join(root, skill, 'bundle', 'rules')
      if (!isDirectory(rules)) continue
      for (const file of fs.readdirSync(rules)) {
        if (!file.endsWith('.md')) continue
        const source = path.join(rules, file)
        const target = path.join(ctx.cwd, '.agents', 'rules', file)
        let same = false
        try {
          same = fs.readFileSync(source).equals(fs.readFileSync(target))
        } catch {
          same = false
        }
        if (!same) wrong.push(display(ctx.cwd, source))
      }
    }
  }
  if (!wrong.length) return ok('every bundle rule has a byte-identical copy in .agents/rules')
  return fail(wrong.map(source => `NOT REGISTERED: ${source}`).join('; '))
}

function checkAgents(ctx) {
  const file = path.join(ctx.cwd, 'AGENTS.md')
  let text
  try {
    text = fs.readFileSync(file, 'utf8')
  } catch {
    return fail('AGENTS.md is missing')
  }
  const count = text.split(/\r?\n/).filter(line => line.includes('Follow .agents/rules')).length
  if (!count) return fail('AGENTS.md does not contain "Follow .agents/rules"')
  return ok(`AGENTS.md points at the rules (${count} line${count === 1 ? '' : 's'})`)
}

function parseToolNames(text) {
  const candidates = [text, ...text.split(/\r?\n/)]
  for (const candidate of candidates) {
    try {
      const message = JSON.parse(candidate)
      if (Array.isArray(message.result?.tools)) return message.result.tools.map(tool => tool.name)
    } catch {
      // Try the next candidate.
    }
  }
  return []
}

function checkGlossary(ctx) {
  const server = path.join(ctx.cwd, '.work-weave', 'runtime', 'glossary', 'server.js')
  if (!isFile(server)) return fail('the glossary server is missing from .work-weave/runtime/glossary')
  const result = run(process.execPath, [server, '--project', '.'], {
    cwd: ctx.cwd,
    input: '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}\n',
    timeout: 15000,
  })
  if (result.error) return fail(`the glossary server did not answer: ${commandFailure(result)}`)
  if (result.status !== 0) return fail(`the glossary server exited ${result.status}: ${firstLine(result.stderr)}`)
  const names = parseToolNames(result.stdout)
  const expected = ['glossary_lookup', 'glossary_list', 'glossary_write', 'glossary_merge']
  const missing = expected.filter(name => !names.includes(name))
  if (names.length === expected.length && !missing.length) return ok(`4 tools: ${names.join(', ')}`)
  return fail(`expected 4 glossary tools; got ${names.length}${missing.length ? `, missing ${missing.join(', ')}` : ''}`)
}

function checkListener(ctx) {
  if (process.platform !== 'linux') {
    return na(`no bundled service on ${process.platform}; run the listener in a terminal while you work`)
  }
  if (!ctx.hasRemote) return na('no origin remote; check 16 is not applicable')
  const local = path.join(ctx.cwd, '.work-weave', 'local')
  let units = []
  try {
    units = fs.readdirSync(local).filter(name => /^work-weave-issue-.*\.service$/.test(name)).sort()
  } catch {
    units = []
  }
  if (!units.length) return fail('no generated unit under .work-weave/local')
  const unit = units[0]
  const active = run('systemctl', ['--user', 'is-active', unit], { cwd: ctx.cwd })
  const state = active.stdout.trim()
  if (active.status !== 0 || state !== 'active') {
    return fail(`unit ${unit} is ${state || 'not active'}`)
  }
  const workingDirectory = run('systemctl', ['--user', 'show', unit, '-p', 'WorkingDirectory', '--value'], { cwd: ctx.cwd })
  const shown = workingDirectory.stdout.trim()
  if (!shown) return fail(`unit ${unit} has no WorkingDirectory`)
  if (realpath(shown) !== realpath(ctx.cwd)) {
    return fail(`unit ${unit} serves ${shown}, not ${ctx.cwd}`)
  }
  const repo = ghRepo(ctx.cwd)
  if (!repo) return unverified('cannot resolve the GitHub repository from the remote')
  const hooks = run('gh', ['api', `repos/${repo}/hooks`, '--jq', '.[].config.url'], { cwd: ctx.cwd })
  if (hooks.status !== 0) {
    const admin = run('gh', ['api', `repos/${repo}`, '--jq', '.permissions.admin'], { cwd: ctx.cwd })
    if (admin.status === 0 && admin.stdout.trim() === 'false') {
      return unverified('the account cannot see webhooks')
    }
    return fail(`cannot read webhooks: ${firstLine(hooks.stderr || hooks.stdout)}`)
  }
  const envFile = path.join(local, 'issue-listener.env')
  let envText
  try {
    envText = fs.readFileSync(envFile, 'utf8')
  } catch {
    return fail('the listener settings are missing from .work-weave/local/issue-listener.env')
  }
  const match = envText.match(/^\s*(?:export\s+)?SMEE_URL\s*=\s*"?([^"\r\n]+)"?\s*$/m)
  if (!match) return fail('SMEE_URL is missing from .work-weave/local/issue-listener.env')
  const channel = match[1].trim()
  const urls = hooks.stdout.split(/\r?\n/).map(line => line.trim()).filter(Boolean)
  if (!urls.includes(channel)) return fail(`the webhook does not point at ${channel}`)
  return ok(`unit ${unit} is active in this checkout; the webhook points at ${channel}`)
}

function checkIgnore(ctx) {
  const paths = ['node_modules/', 'GLOSSARY.md', '.work-weave/pending/pending-communications.md']
  const result = run('git', ['check-ignore', ...paths], { cwd: ctx.cwd })
  if (result.error) return fail(`git is unavailable: ${commandFailure(result)}`)
  const ignored = new Set(
    result.stdout
      .split(/\r?\n/)
      .map(line => line.trim().replace(/\/+$/, ''))
      .filter(Boolean),
  )
  const missing = paths
    .map(item => item.replace(/\/+$/, ''))
    .filter(item => !ignored.has(item))
  if (missing.length) return fail(`not ignored: ${missing.join(', ')}`)
  return ok('all 3 paths are ignored')
}

const CHECKS = [
  { number: 1, starred: true, name: 'Git is available', repair: 'Install Git.', run: checkGit },
  { number: 2, starred: true, name: 'Waymark is installed and recent', repair: `Install waymark ${WAYMARK_FLOOR} or newer from its release page.`, run: checkWaymark },
  { number: 3, starred: true, name: 'Node and npm clear the floor', repair: `Install Node ${NODE_FLOOR} or newer with its bundled npm.`, run: checkNode },
  { number: 4, starred: true, name: 'GitHub CLI is signed in', repair: 'Run gh auth login as the account the project uses.', run: checkGh },
  { number: 5, starred: false, name: 'curl is available', repair: 'Install curl; the issue bundle needs it for the smee channel.', run: checkCurl },
  { number: 6, starred: true, name: 'The directory is a Git repository', repair: 'Run the setup flow or git init in the project root.', run: checkRepository },
  { number: 7, starred: true, name: 'A commit identity is set', repair: 'Set git config user.name and user.email.', run: checkIdentity },
  { number: 8, starred: false, name: 'The repository knows its remote', repair: 'Add the project remote as origin.', run: checkRemote },
  { number: 9, starred: false, name: 'The default branch is protected', repair: 'Protect the default branch in GitHub, or use rules-git.md when the plan cannot.', run: checkProtection },
  { number: 10, starred: true, name: 'The tracker validates and is configured', repair: 'Run the tracker steps in start-a-project.md, then waymark validate.', run: checkTracker },
  { number: 11, starred: false, name: 'The operator is set and on the roster', repair: 'Set the operator, or add the owner to [handles] through a pull request.', run: checkOperator },
  { number: 12, starred: true, name: 'Every installed skill is still there', repair: 'Reinstall the missing skills with npx skills add.', run: checkSkills },
  { number: 13, starred: true, name: "Every bundle's rules are registered", repair: 'Run the bundle setup that owns each missing rule.', run: checkBundleRules },
  { number: 14, starred: true, name: 'AGENTS.md points at the rules', repair: 'Write the AGENTS.md prompt at the top of the file.', run: checkAgents },
  { number: 15, starred: false, name: 'The glossary MCP server answers', repair: 'Run the glossary bundle setup and start its server from the project runtime.', run: checkGlossary },
  { number: 16, starred: false, name: 'The listener runs and the webhook reaches it', repair: 'Start the listener for this checkout from the issue bundle setup.', run: checkListener },
  { number: 17, starred: false, name: 'The queue and the build output are ignored', repair: 'Add the three ignore rules to the root .gitignore.', run: checkIgnore },
]

export function runChecks(options = {}) {
  const cwd = options.cwd ?? process.cwd()
  const starred = options.starred === true
  const context = { cwd, hasRemote: false }
  const selected = starred ? CHECKS.filter(check => check.starred) : CHECKS
  const results = []
  for (const check of selected) {
    let result
    try {
      result = check.run(context)
    } catch (error) {
      result = fail(`the check threw: ${error.message}`)
    }
    results.push({
      number: check.number,
      starred: check.starred,
      name: check.name,
      repair: check.repair,
      ...result,
    })
  }
  return results
}

function summarize(results) {
  return {
    total: results.length,
    ok: results.filter(result => result.status === OK).length,
    notApplicable: results.filter(result => result.status === NA).length,
    unverified: results.filter(result => result.status === UNVERIFIED).length,
    failed: results.filter(result => result.status === FAIL).length,
  }
}

function usage() {
  return [
    'Usage: node check-setup.mjs [--starred] [--all] [--json]',
    '',
    'Run the setup checks from the project root. --starred runs the ten',
    'session-start checks; --all (the default) runs all seventeen. --json',
    'prints the same results as JSON. The script repairs nothing.',
  ].join('\n')
}

export function parseArgs(argv) {
  const options = { starred: false, json: false, help: false }
  for (const argument of argv) {
    if (argument === '--starred') options.starred = true
    else if (argument === '--all') options.starred = false
    else if (argument === '--json') options.json = true
    else if (argument === '--help' || argument === '-h') options.help = true
    else throw new Error(`unknown argument: ${argument}`)
  }
  return options
}

export function main(argv = process.argv.slice(2)) {
  let options
  try {
    options = parseArgs(argv)
  } catch (error) {
    console.error(error.message)
    console.error(usage())
    return 2
  }
  if (options.help) {
    console.log(usage())
    return 0
  }
  const results = runChecks({ cwd: process.cwd(), starred: options.starred })
  const summary = summarize(results)
  if (options.json) {
    console.log(JSON.stringify({ checks: results, summary }, null, 2))
  } else {
    const labels = { [OK]: 'ok', [FAIL]: 'fail', [NA]: 'not applicable', [UNVERIFIED]: 'unverified' }
    for (const result of results) {
      console.log(`${String(result.number).padStart(2)}  ${labels[result.status].padEnd(15)} ${result.message}`)
      if (result.status === FAIL) console.log(`    repair: ${result.repair}`)
    }
    console.log('')
    console.log(`${summary.total} checks: ${summary.ok} ok, ${summary.notApplicable} not applicable, ${summary.unverified} unverified, ${summary.failed} failed`)
  }
  return summary.failed > 0 ? 1 : 0
}

const invoked = process.argv[1] ? realpath(path.resolve(process.argv[1])) : ''
if (invoked === realpath(fileURLToPath(import.meta.url))) {
  process.exitCode = main()
}
