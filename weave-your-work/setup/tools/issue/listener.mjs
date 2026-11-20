#!/usr/bin/env node
// Receive a smee webhook stream, queue communicate issues, and record pull
// request and default-branch events.
//
// Run from the project root, or pass the project explicitly:
//   node <skill>/setup/tools/issue/listener.mjs [--project <directory>]
//
// The project is the nearest directory above the working directory that holds
// a .work-weave marker, unless --project names it. Checkout settings come from
// <root>/.work-weave/personal/issue-listener.env; the process environment
// overrides them. Without SMEE_URL the HTTP endpoint runs alone. WEBHOOK_SECRET
// optionally enables signature verification for transports that preserve
// request bytes.
//
// The GitHub account is the only claim of identity. The sender is the issue's
// author mapped through the roster, the recipient is the issue's assignee
// mapped through the same table, and every event is re-read from GitHub before
// it touches the queue.
//
// The listener writes two files and warns nobody. The pending queue holds open
// threads; the event file holds pull requests opened and default-branch moves,
// as history. What reads the event file, when, and how it shows it to a person
// is another tool's problem.

import { execFile } from 'node:child_process'
import http from 'node:http'
import { promisify } from 'node:util'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { parse as parseToml } from 'smol-toml'
import { parse as parseYaml } from 'yaml'
import SmeeClient from 'smee-client'
import projectRoot from './project-root.cjs'
import { acquireQueueLock } from './lock.mjs'
import { appendEvent, checkLimit, DEFAULT_LIMIT } from './events.mjs'
import { DEFAULT_QUEUE, parseQueue, readQueue, writeQueue } from './queue.mjs'

const { resolveProjectRoot } = projectRoot
const run = promisify(execFile)
const DEFAULT_EVENTS = '.work-weave/personal/communication/events.jsonl'
// The default branch a push must name to be the event a merge writes.
const DEFAULT_BRANCH = 'main'
// The permissions that let an account merge into the default branch. Push is
// write, and admin implies it; GitHub reports either as push on the listing.
const MERGE_PERMISSIONS = new Set(['push', 'admin'])
// The roster moved to shared/handles.toml; the old path is read until every
// checkout has moved, and the shared file wins when both exist.
const ROSTER_FILES = ['.work-weave/shared/handles.toml', '.work-weave/issue/handles.toml']
const SETTINGS_FILE = '.work-weave/personal/issue-listener.env'
const USAGE = 'Usage: node listener.mjs [--project <directory>]'
// The actions this listener acts on. Anything else is another event on the
// same issue, and leaves the queue alone.
const ACTIONS = new Set(['opened', 'assigned', 'closed'])

function parseArgs(argv) {
  let project
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index]
    if (argument === '--project') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error(USAGE)
      project = value
      index++
    } else if (argument.startsWith('--project=')) {
      project = argument.slice('--project='.length)
      if (!project) throw new Error(USAGE)
    } else {
      throw new Error(`Unknown argument ${argument}; ${USAGE}`)
    }
  }
  return project === undefined ? {} : { project }
}

function parseSettings(content) {
  const values = {}
  for (const [index, line] of content.split(/\r?\n/).entries()) {
    const text = line.trim()
    if (!text || text.startsWith('#')) continue
    const equals = text.indexOf('=')
    if (equals < 1) throw new Error(`${SETTINGS_FILE} line ${index + 1} must be KEY=VALUE`)
    const key = text.slice(0, equals).trim()
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
      throw new Error(`${SETTINGS_FILE} line ${index + 1} has an invalid key`)
    }
    let value = text.slice(equals + 1).trim()
    const quoted = value.length >= 2 &&
      ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))
    if (quoted) value = value.slice(1, -1)
    values[key] = value
  }
  return values
}

// Checkout settings are read once, from the project and not beside the tools.
// A process environment value wins, so a service unit or a test can override
// one key without rewriting the file.
function loadSettings(root) {
  const file = path.join(root, SETTINGS_FILE)
  let content
  try {
    content = fs.readFileSync(file, 'utf8')
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    content = ''
  }
  return { ...parseSettings(content), ...process.env }
}

function requireRepository(settings) {
  const repository = settings.REPOSITORY
  if (typeof repository !== 'string' || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) {
    throw new Error(`REPOSITORY must be set to owner/repo in ${SETTINGS_FILE} or the environment`)
  }
  return repository
}

function rosterFile(root) {
  for (const candidate of ROSTER_FILES) {
    const file = path.join(root, candidate)
    if (fs.existsSync(file)) return file
  }
  return null
}

function loadConfig(root) {
  const file = rosterFile(root)
  if (!file) {
    return { handles: {}, pending: DEFAULT_QUEUE, events: { path: DEFAULT_EVENTS, limit: DEFAULT_LIMIT } }
  }
  const data = parseToml(fs.readFileSync(file, 'utf8'))
  const handles = data.handles || {}
  for (const [owner, login] of Object.entries(handles)) {
    if (typeof login !== 'string') {
      throw new Error(`handles.toml: ${owner} is not a login; put every owner under one [handles] table`)
    }
  }
  let configured = DEFAULT_QUEUE
  if (data.pending !== undefined) {
    if (!data.pending || typeof data.pending !== 'object' || Array.isArray(data.pending)) {
      throw new Error('handles.toml: [pending] must be a table')
    }
    if (data.pending.path !== undefined) configured = data.pending.path
  }
  if (typeof configured !== 'string' || !configured.trim()) {
    throw new Error('handles.toml: [pending].path must be a non-empty string')
  }
  let eventsPath = DEFAULT_EVENTS
  let limit = DEFAULT_LIMIT
  if (data.events !== undefined) {
    if (!data.events || typeof data.events !== 'object' || Array.isArray(data.events)) {
      throw new Error('handles.toml: [events] must be a table')
    }
    if (data.events.path !== undefined) eventsPath = data.events.path
    if (data.events.limit !== undefined) limit = data.events.limit
  }
  if (typeof eventsPath !== 'string' || !eventsPath.trim()) {
    throw new Error('handles.toml: [events].path must be a non-empty string')
  }
  checkLimit(limit)
  return { handles, pending: configured, events: { path: eventsPath, limit } }
}

// A configured path is read from the project root, and a path that leaves it
// is refused: the listener writes inside the checkout and nowhere else.
function projectPath(root, configured, key) {
  const file = path.resolve(root, configured)
  const relative = path.relative(root, file)
  if (!relative || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`${key} must stay inside the project root: ${configured}`)
  }
  return file
}

// Owners that differ only by case make one git identity two people, so the
// roster is refused before anything is read through it.
function foldOwners(handles) {
  const owners = Object.keys(handles)
  if (!owners.length) {
    throw new Error('handles.toml has no owners; add at least one under [handles]')
  }
  const folded = new Map()
  for (const owner of owners) {
    const key = owner.toLowerCase()
    if (folded.has(key)) {
      throw new Error(`handles.toml has owners that differ only by case (${folded.get(key)}, ${owner}); rename one`)
    }
    folded.set(key, owner)
  }
  return folded
}

// This machine's owner is the local git identity, matched against the [handles]
// keys without regard to case. `git config --local user.name` is the per-clone
// slot: untracked, so a machine that belongs to someone else changes it without
// touching the shared roster.
async function resolveMachineOwner(root) {
  const owners = Object.keys(config.handles)
  const folded = foldOwners(config.handles)
  const hint = () => owners.length === 1
    ? `git config --local user.name ${owners[0]}`
    : `git config --local user.name <one of: ${owners.join(', ')}>`
  let name
  try {
    const { stdout } = await run('git', ['config', 'user.name'], { cwd: root, timeout: 15000 })
    name = stdout.trim()
  } catch (error) {
    if (error.code === 'ENOENT') throw new Error("git is not installed, and it names this machine's owner")
    throw new Error(`git config user.name is unset, so this machine has no owner; set it with: ${hint()}`)
  }
  if (!name) throw new Error(`git config user.name is empty; set it with: ${hint()}`)
  const owner = folded.get(name.toLowerCase())
  if (!owner) {
    throw new Error(`git config user.name is "${name}", which is not an owner in handles.toml (${owners.join(', ')}); set this machine's owner with: ${hint()}`)
  }
  return owner
}

function parseFrontmatter(body) {
  if (!body || !body.startsWith('---')) return null
  const end = body.indexOf('\n---', 3)
  if (end === -1) return null
  try {
    return parseYaml(body.slice(3, end))
  } catch {
    return null
  }
}

// The roster read backwards: a login becomes the owner it belongs to. GitHub
// logins are case-insensitive, so the comparison is too.
function ownerFor(handles, login) {
  if (typeof login !== 'string') return null
  for (const [owner, handle] of Object.entries(handles)) {
    if (typeof handle === 'string' && handle.toLowerCase() === login.toLowerCase()) return owner
  }
  return null
}

// The startup scan reads GitHub for minutes; a webhook can queue a thread while
// it runs. `listing` is true while the scan is reading GitHub, and `late`
// records the threads a webhook queued in that window, so the scan does not
// judge them by a listing that predates them.
const scan = { listing: false, late: new Set() }

// Appends one line and returns it, or returns null when the thread is already
// queued. A thread has one recipient on this machine, so one URL is one line.
function append(entry) {
  const entries = parseQueue(readQueue(queue))
  if (entries.some(({ url }) => url === entry.url)) return null
  writeQueue(queue, [...entries, entry])
  // A thread queued while the scan is talking to GitHub may be newer than the
  // listing the scan holds; one the scan queues itself is older than it.
  if (scan.listing) scan.late.add(entry.url)
  return entry
}

// Marks a thread closed and returns whether anything changed. A thread that is
// not queued, or is already marked, is left as it is.
function closeThread(url, closedAt) {
  const entries = parseQueue(readQueue(queue))
  const target = entries.find((entry) => entry.url === url && !entry.closed_at)
  if (!target) return false
  target.closed_at = closedAt
  writeQueue(queue, entries)
  return true
}

const CATEGORIES = new Set(['request', 'result', 'comment'])

// Returns the protocol fields, or the list of fields that do not match the
// communicate issue format in `communicate-with-issue`'s
// `COMMUNICATE-ISSUE-FORMAT.md`. Who sent the message and who receives it are
// not fields: the author and the assignee say that. A message written before
// this change still carries `from` and `to`, and those are ignored.
function communicationFields(front) {
  if (!front || typeof front !== 'object' || Array.isArray(front)) return ['frontmatter']
  if (front.kind !== 'communicate') return null
  const errors = []
  if (!CATEGORIES.has(front.category)) errors.push('category')
  if (!Array.isArray(front.tickets) || front.tickets.length === 0 ||
      front.tickets.some((id) => typeof id !== 'string' || !id.trim())) errors.push('tickets')
  if (errors.length) return errors
  return { category: front.category, tickets: front.tickets }
}

// ---- GitHub ---------------------------------------------------------------
// Everything outside this block — the HTTP endpoint, the signature check, the
// queue, the deduplication and the log redaction — touches no GitHub detail.
// These functions are where GitHub shows through: the webhook event shape, the
// `gh api` reads, and the `user.login` that says who opened the issue and who
// it is assigned to. A fork for another host rewrites this block and the
// [handles] table, and leaves the rest alone.

// Normalises one webhook body for an action this listener acts on, or returns
// null for anything else. The event's own claims are kept only to be checked
// against GitHub; nothing is queued from them.
function readIssueEvent(payload, event) {
  if (event && event !== 'issues') return null
  if (!payload || !ACTIONS.has(payload.action)) return null
  const issue = payload.issue || {}
  if (issue.pull_request) return null
  const number = typeof issue.number === 'number' ? issue.number : NaN
  const sender = payload.sender && typeof payload.sender.login === 'string' ? payload.sender.login : ''
  const closer = payload.action === 'closed' && payload.closed_by && typeof payload.closed_by.login === 'string'
    ? payload.closed_by.login
    : sender
  return {
    action: payload.action,
    number,
    label: Number.isInteger(number) && number > 0 ? `issue #${number}` : 'issue',
    author: issue.user && typeof issue.user.login === 'string' ? issue.user.login : '',
    closer,
    createdAt: typeof payload.closed_at === 'string' ? payload.closed_at : new Date().toISOString(),
  }
}

// Reads one issue back from GitHub. This is the confirmation: a payload that
// names an issue GitHub does not have, or describes it differently, is dropped.
async function readIssue(number) {
  const result = await run('gh', [
    'api', '--hostname', 'github.com', '--method', 'GET', `repos/${repository}/issues/${number}`,
  ], { cwd: root, timeout: 30000, maxBuffer: 32 * 1024 * 1024 })
  const record = JSON.parse(result.stdout)
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    throw new Error('GitHub returned an invalid issue')
  }
  return {
    url: typeof record.html_url === 'string' ? record.html_url : '',
    title: typeof record.title === 'string' ? record.title : '',
    body: typeof record.body === 'string' ? record.body : '',
    state: record.state,
    author: record.user && typeof record.user.login === 'string' ? record.user.login : '',
    assignee: record.assignee && typeof record.assignee.login === 'string' ? record.assignee.login : '',
    label: `issue #${record.number}`,
  }
}

// Normalises one `pull_request` webhook body for the two actions this listener
// records, or returns null for anything else. An opening is recorded as it
// opens; a close is recorded only when the pull request was merged, because a
// pull request closed unmerged moves the default branch nowhere. The payload's
// claims are kept only to be checked against GitHub.
function readPullRequestEvent(payload, event) {
  if (event && event !== 'pull_request') return null
  if (!payload || (payload.action !== 'opened' && payload.action !== 'closed')) return null
  const opened = payload.action === 'opened'
  if (!opened && !(payload.pull_request && payload.pull_request.merged === true)) return null
  const pull = payload.pull_request || {}
  const number = typeof pull.number === 'number' ? pull.number : NaN
  return {
    action: payload.action,
    number,
    label: Number.isInteger(number) && number > 0 ? `pull request #${number}` : 'pull request',
    title: typeof pull.title === 'string' ? pull.title : '',
    author: pull.user && typeof pull.user.login === 'string' ? pull.user.login : '',
    sender: payload.sender && typeof payload.sender.login === 'string' ? payload.sender.login : '',
    mergeCommit: typeof pull.merge_commit_sha === 'string' ? pull.merge_commit_sha : '',
    at: typeof pull.merged_at === 'string' && pull.merged_at ? pull.merged_at : new Date().toISOString(),
  }
}

// Normalises one `push` webhook body. `after` is the commit the branch now
// points at. A push has no number and no pull request to confirm.
function readPushEvent(payload, event) {
  if (event && event !== 'push') return null
  if (!payload || typeof payload !== 'object') return null
  return {
    ref: typeof payload.ref === 'string' ? payload.ref : '',
    commit: typeof payload.after === 'string' ? payload.after : '',
    author: payload.sender && typeof payload.sender.login === 'string' ? payload.sender.login : '',
  }
}

// Reads one pull request back from GitHub. This is the confirmation: a payload
// that names a pull request GitHub does not have is dropped.
async function readPullRequest(number) {
  const result = await run('gh', [
    'api', '--hostname', 'github.com', '--method', 'GET', `repos/${repository}/pulls/${number}`,
  ], { cwd: root, timeout: 30000, maxBuffer: 32 * 1024 * 1024 })
  const record = JSON.parse(result.stdout)
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    throw new Error('GitHub returned an invalid pull request')
  }
  return {
    url: typeof record.html_url === 'string' ? record.html_url : '',
    title: typeof record.title === 'string' ? record.title : '',
    state: record.state,
    merged: record.merged === true || typeof record.merged_at === 'string',
    mergeCommit: typeof record.merge_commit_sha === 'string' ? record.merge_commit_sha : '',
    author: record.user && typeof record.user.login === 'string' ? record.user.login : '',
    number: Number.isInteger(record.number) ? record.number : NaN,
    label: `pull request #${record.number}`,
  }
}

// Lists the repository's collaborators once. Each record is reduced to its login
// and the permissions that matter here; a record naming no login is skipped, and
// an answer that is not a list is a failed listing.
async function listCollaborators() {
  const result = await run('gh', [
    'api', '--hostname', 'github.com', '--method', 'GET', `repos/${repository}/collaborators`,
  ], { cwd: root, timeout: 30000, maxBuffer: 32 * 1024 * 1024 })
  const records = JSON.parse(result.stdout)
  if (!Array.isArray(records)) throw new Error('GitHub returned an invalid collaborator listing')
  const collaborators = []
  for (const record of records) {
    if (!record || typeof record !== 'object') continue
    const login = record.login ?? (record.user && record.user.login)
    if (typeof login !== 'string' || !login) continue
    const given = record.permissions && typeof record.permissions === 'object' ? record.permissions : {}
    const admin = given.admin === true || record.role_name === 'admin'
    const push = given.push === true || record.role_name === 'write' || admin
    const permissions = new Set()
    if (admin) permissions.add('admin')
    if (admin || push) permissions.add('push')
    collaborators.push({ login, permissions })
  }
  return collaborators
}

// The roster logins that hold write or admin, compared without regard to case
// because GitHub logins are. The roster is what filters the listing: an account
// outside it is not recorded, however much it may merge.
function mergeRights(collaborators) {
  const logins = Object.values(config.handles).filter((login) => typeof login === 'string')
  const held = [...collaborators].sort((a, b) => a.login.toLowerCase().localeCompare(b.login.toLowerCase()) || a.login.localeCompare(b.login))
  const rights = []
  for (const login of logins) {
    const collaborator = held.find((record) => record.login.toLowerCase() === login.toLowerCase())
    if (!collaborator) continue
    if (![...collaborator.permissions].some((permission) => MERGE_PERMISSIONS.has(permission))) continue
    if (!rights.includes(login)) rights.push(login)
  }
  return rights
}

// Yields the repository's open issues one page at a time, so a later page
// failing does not discard what the earlier pages already queued.
async function* listOpenIssues() {
  // The checkout's origin says which repository this is; REPOSITORY says which
  // repository the events must name. A checkout without an origin scans nothing.
  const { stdout } = await run('git', ['remote', 'get-url', '--all', 'origin'], { cwd: root, timeout: 15000 })
  if (!stdout.trim()) throw new Error('this checkout has no origin remote')
  for (let page = 1; ; page++) {
    const result = await run('gh', [
      'api', '--hostname', 'github.com', '--method', 'GET', `repos/${repository}/issues`,
      '-f', 'state=open', '-F', 'per_page=100', '-F', `page=${page}`,
    ], { cwd: root, timeout: 30000, maxBuffer: 32 * 1024 * 1024 })
    const records = JSON.parse(result.stdout)
    if (!Array.isArray(records)) throw new Error('GitHub returned an invalid issues page')
    const issues = []
    for (const record of records) {
      if (!record || typeof record !== 'object' || record.pull_request) continue
      issues.push({
        url: typeof record.html_url === 'string' ? record.html_url : '',
        title: typeof record.title === 'string' ? record.title : '',
        body: typeof record.body === 'string' ? record.body : '',
        state: record.state,
        author: record.user && typeof record.user.login === 'string' ? record.user.login : '',
        assignee: record.assignee && typeof record.assignee.login === 'string' ? record.assignee.login : '',
        label: `issue #${record.number}`,
      })
    }
    yield { issues }
    if (records.length < 100) return
  }
}

// ---- end of GitHub -------------------------------------------------------

// Decides whether an issue is a message for this machine and, when it is,
// appends one queue entry. The sender comes from the author and the recipient
// from the assignee, both through the roster; the body's front matter says only
// what kind of message it is and which records it is about.
function queueIssue(issue, { label = issue.label || 'issue' } = {}) {
  const front = parseFrontmatter(issue.body)
  const fields = communicationFields(front)
  if (fields === null) return 0
  if (Array.isArray(fields)) {
    console.error(`Skipped ${label}: invalid ${fields.join(', ')}`)
    return 0
  }
  if (!issue.title.trim() || !issue.url.trim()) {
    console.error(`Skipped ${label}: invalid title or url`)
    return 0
  }
  const from = ownerFor(config.handles, issue.author)
  if (!from) {
    console.error(`Skipped ${label}: author ${issue.author || '(none)'} is not a known login`)
    return 0
  }
  if (!issue.assignee) {
    console.error(`Skipped ${label}: no assignee, so there is no recipient`)
    return 0
  }
  const to = ownerFor(config.handles, issue.assignee)
  if (!to) {
    console.error(`Skipped ${label}: assignee ${issue.assignee} is not a known login`)
    return 0
  }
  if (to !== machineOwner) {
    console.error(`Skipped ${label}: assigned to ${to}, not to ${machineOwner}`)
    return 0
  }
  const received = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')
  return append({ url: issue.url, from, to, owner: to, title: issue.title, received, closed_at: null }) ? 1 : 0
}

// Confirms a webhook event against GitHub and acts on it. A non-zero return is
// the number of queue lines written; a refusal writes nothing and logs one line.
async function handleEvent(event) {
  const { label } = event
  if (!Number.isInteger(event.number) || event.number < 1) {
    console.error(`Skipped ${label}: the event names no issue number`)
    return 0
  }
  if (event.action === 'closed') {
    // Closing is the sender's. The closer is the event's, not the issue's:
    // GitHub reports the issue as closed whoever closed it.
    const sender = event.author ? ownerFor(config.handles, event.author) : null
    if (!sender) {
      console.error(`Skipped ${label}: author ${event.author || '(none)'} is not a known login`)
      return 0
    }
    if (event.closer.toLowerCase() !== event.author.toLowerCase()) {
      console.error(`Skipped ${label}: closed by ${event.closer || '(none)'}, not by its sender ${event.author}`)
      return 0
    }
    return closeThread(`https://github.com/${repository}/issues/${event.number}`, event.createdAt) ? 1 : 0
  }
  let issue
  try {
    issue = await readIssue(event.number)
  } catch (error) {
    console.error(`Skipped ${label}: GitHub would not confirm it: ${error.message}`)
    return 0
  }
  if (!issue.author || issue.author.toLowerCase() !== event.author.toLowerCase()) {
    console.error(`Skipped ${label}: GitHub says ${label} was opened by ${issue.author || '(none)'}, not by ${event.author || '(none)'}`)
    return 0
  }
  if (issue.state !== 'open') {
    console.error(`Skipped ${label}: ${label} is ${issue.state || 'not open'}`)
    return 0
  }
  return queueIssue(issue)
}

function writtenTime(date) {
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z')
}

// True when the webhook came from this repository regardless of case: GitHub
// owners and repository names are case-insensitive.
function sameRepository(fullName) {
  return typeof fullName === 'string' && fullName.trim().toLowerCase() === repository.toLowerCase()
}

// Number of event lines written: one, or none when the event is dropped. Each
// drop writes one line to stderr and nothing to the event file.
function recordEvent(event, label) {
  try {
    appendEvent(events, event, config.events.limit)
    return 1
  } catch (error) {
    console.error(`Skipped ${label}: cannot write the event file: ${error.message}`)
    return 0
  }
}

// Records a pull request opening. Reviewing and merging are a person's work, so
// the line also names who holds merge rights now, read from GitHub as the event
// arrives; a listing that fails drops the event rather than recording a line
// without them.
async function handlePullRequest(event) {
  const { label } = event
  if (!Number.isInteger(event.number) || event.number < 1) {
    console.error(`Skipped ${label}: the event names no pull request number`)
    return 0
  }
  let pull
  try {
    pull = await readPullRequest(event.number)
  } catch (error) {
    console.error(`Skipped ${label}: GitHub would not confirm it: ${error.message}`)
    return 0
  }
  if (event.action === 'opened') {
    if (pull.state !== 'open') {
      console.error(`Skipped ${label}: ${label} is ${pull.state || 'not open'}`)
      return 0
    }
    if (!pull.author || !event.author || pull.author.toLowerCase() !== event.author.toLowerCase()) {
      console.error(`Skipped ${label}: GitHub says ${label} was opened by ${pull.author || '(none)'}, not by ${event.author || '(none)'}`)
      return 0
    }
    let collaborators
    try {
      collaborators = await listCollaborators()
    } catch (error) {
      console.error(`Skipped ${label}: cannot read the collaborators: ${error.message}`)
      return 0
    }
    const title = pull.title.trim() ? pull.title : event.title
    if (!title.trim() || !pull.url.trim()) {
      console.error(`Skipped ${label}: invalid title or url`)
      return 0
    }
    return recordEvent({
      kind: 'pull-request-opened',
      number: event.number,
      title,
      url: pull.url,
      author: pull.author,
      at: writtenTime(new Date()),
      merge_rights: mergeRights(collaborators),
    }, label)
  }
  // A merge moves the default branch, so it is recorded the way a push to the
  // branch is: with the commit the branch now points at.
  if (pull.number !== event.number) {
    console.error(`Skipped ${label}: GitHub answered with pull request #${pull.number}`)
    return 0
  }
  if (!pull.merged) {
    console.error(`Skipped ${label}: GitHub says ${label} is not merged`)
    return 0
  }
  let commit = pull.mergeCommit
  if (!/^[0-9a-f]{7,40}$/i.test(commit) && /^[0-9a-f]{7,40}$/i.test(event.mergeCommit)) commit = event.mergeCommit
  if (!/^[0-9a-f]{7,40}$/i.test(commit)) {
    console.error(`Skipped ${label}: GitHub names no merge commit`)
    return 0
  }
  const at = Number.isNaN(Date.parse(event.at)) ? writtenTime(new Date()) : writtenTime(new Date(event.at))
  return recordEvent({ kind: 'default-branch-moved', commit, author: event.sender || event.author, at }, label)
}

// Records a push to the default branch. A push to any other branch changes
// nothing everyone has to catch up with, so it writes no line and logs nothing.
function handlePush(event) {
  if (event.ref !== `refs/heads/${DEFAULT_BRANCH}`) return 0
  const label = `push to ${DEFAULT_BRANCH}`
  if (!/^[0-9a-f]{40}$/i.test(event.commit)) {
    console.error(`Skipped ${label}: the event names no commit (${event.commit || 'none'})`)
    return 0
  }
  return recordEvent({
    kind: 'default-branch-moved',
    commit: event.commit,
    author: event.author,
    at: writtenTime(new Date()),
  }, label)
}

// The startup scan reconciles the queue with GitHub: a thread open on GitHub and
// absent from the queue is added, a queued thread GitHub no longer lists as open
// is marked closed, and a scan that fails changes nothing.
async function catchUp() {
  // A page that fails throws before anything below it runs, so the queue is
  // untouched: the scan either finishes or changes nothing.
  const seen = new Map()
  scan.listing = true
  try {
    for await (const page of listOpenIssues()) {
      for (const issue of page.issues) {
        if (issue.state === 'open' && issue.url) seen.set(issue.url, issue)
      }
    }
  } finally {
    scan.listing = false
  }
  // Every thread is queued by its own append, which re-reads the queue, so a
  // webhook that appends while this loop runs is never overwritten by a
  // snapshot taken before it.
  const before = parseQueue(readQueue(queue))
  const wasQueued = new Set(before.map(({ url }) => url))
  let added = 0
  for (const issue of seen.values()) {
    if (wasQueued.has(issue.url)) continue
    if (queueIssue(issue, { label: issue.label }) === 1) added++
  }
  const closedAt = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')
  // A thread of this checkout is the only one this scan can judge: another
  // repository's thread was never in the listing it read.
  const escaped = repository.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const ownIssue = new RegExp(`^https://github\\.com/${escaped}/issues/[0-9]+$`)
  // Only a thread queued before this scan read GitHub, and that the scan did
  // not list as open, is marked. `scan.late` covers the one case left: a
  // webhook that queued the thread while the scan was reading.
  let closed = 0
  const entries = parseQueue(readQueue(queue))
  for (const entry of entries) {
    if (entry.closed_at || !wasQueued.has(entry.url) || seen.has(entry.url) || scan.late.has(entry.url)) continue
    if (!ownIssue.test(entry.url)) continue
    entry.closed_at = closedAt
    closed++
  }
  if (closed > 0) writeQueue(queue, entries)
  console.log(`Catch-up complete: queued ${added} entries, closed ${closed} from ${repository}`)
}

// The channel URL is a shared secret: anyone who knows it can post or read
// events. Smee logs the full source URL, so redact it before writing a line.
const redactedLogger = {
  info: (message) => console.log(redact(message)),
  warn: (message) => console.warn(redact(message)),
  error: (message) => console.error(redact(message)),
}

function redact(message) {
  const text = String(message)
  return smeeUrl ? text.split(smeeUrl).join('<smee channel>') : text
}

const server = http.createServer((req, res) => {
  if (req.method !== 'POST' || req.url !== '/webhook') {
    res.writeHead(404)
    res.end()
    return
  }
  const chunks = []
  req.on('data', (chunk) => chunks.push(chunk))
  req.on('end', () => {
    const raw = Buffer.concat(chunks)
    if (secret) {
      const signature = req.headers['x-hub-signature-256'] || ''
      const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(raw).digest('hex')
      const a = Buffer.from(signature)
      const b = Buffer.from(expected)
      if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
        res.writeHead(401)
        res.end('bad signature')
        return
      }
    }
    let payload
    try {
      payload = JSON.parse(raw.toString('utf8'))
      if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error('bad payload')
    } catch {
      res.writeHead(400)
      res.end('bad json')
      return
    }
    const event = req.headers['x-github-event']
    const fullName = payload.repository && payload.repository.full_name
    if (typeof fullName !== 'string' || !fullName.trim()) {
      console.error('Skipped webhook event: repository.full_name is missing')
      res.writeHead(202)
      res.end('queued 0\n')
      return
    }
    if (!sameRepository(fullName)) {
      console.error(`Skipped webhook event: repository ${fullName} is not ${repository}`)
      res.writeHead(202)
      res.end('queued 0\n')
      return
    }
    // A pull request or a push is recorded in the event file, not queued. The
    // answer names how many event lines it wrote.
    const reply = (outcome) => {
      res.writeHead(202)
      res.end(outcome ? `recorded ${outcome}\n` : 'ignored')
    }
    const pullRequest = readPullRequestEvent(payload, event)
    if (pullRequest) {
      handlePullRequest(pullRequest).then(reply, (error) => {
        console.error(`Cannot record ${pullRequest.label}: ${error.message}`)
        res.writeHead(500)
        res.end('cannot record event\n')
      })
      return
    }
    const push = readPushEvent(payload, event)
    if (push) {
      reply(handlePush(push))
      return
    }
    if (event === 'pull_request' || event === 'push') {
      reply(0)
      return
    }
    const issue = readIssueEvent(payload, event)
    if (!issue) {
      res.writeHead(202)
      res.end(event && event !== 'issues' ? 'ignored' : 'queued 0\n')
      return
    }
    handleEvent(issue).then((changed) => {
      res.writeHead(202)
      res.end(`queued ${changed}\n`)
    }, (error) => {
      console.error(`Cannot queue communication: ${error.message}`)
      res.writeHead(500)
      res.end('cannot queue communication\n')
    })
  })
})

// The project, its settings, the roster, and this machine's owner are read
// once, before the port opens: a machine with no owner or no expected
// repository can queue nothing, so it refuses to start instead of running and
// silently dropping messages that do not belong to this checkout.
let root
let settings
let repository
let config
let machineOwner
let queue
let queueLock
let events
try {
  const options = parseArgs(process.argv.slice(2))
  root = resolveProjectRoot(options)
  settings = loadSettings(root)
  repository = requireRepository(settings)
  config = loadConfig(root)
  machineOwner = await resolveMachineOwner(root)
  queue = projectPath(root, config.pending, '[pending].path')
  events = projectPath(root, config.events.path, '[events].path')
  queueLock = acquireQueueLock(queue, { root })
} catch (error) {
  console.error(error.message)
  process.exit(1)
}

const port = Number(settings.PORT || 8765)
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('PORT must be an integer from 1 to 65535')
  queueLock.release()
  process.exit(1)
}
const secret = settings.WEBHOOK_SECRET || ''
const smeeUrl = settings.SMEE_URL || ''

if (secret && !secret.trim()) {
  console.error('WEBHOOK_SECRET must not contain only whitespace')
  process.exit(1)
}

function shutdown(code = 0) {
  queueLock.release()
  server.close(() => process.exit(code))
  setTimeout(() => process.exit(code), 1000).unref()
}

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))
process.on('exit', () => queueLock.release())

server.listen(port, '127.0.0.1', async () => {
  console.log(`listening on http://127.0.0.1:${port}/webhook`)
  console.log(`queueing messages assigned to ${machineOwner}`)
  console.log(`recording pull request and ${DEFAULT_BRANCH} events in ${path.relative(root, events)}`)
  if (!secret) console.warn('Webhook signatures are not verified; queued messages are untrusted')
  if (smeeUrl) {
    const smee = new SmeeClient({
      source: smeeUrl,
      target: `http://127.0.0.1:${port}/webhook`,
      logger: redactedLogger,
    })
    try {
      await smee.start()
    } catch (error) {
      console.error(redact(`Cannot connect to smee; catch-up not started: ${error.message || 'connection failed'}`))
      await smee.stop()
      queueLock.release()
      server.close()
      process.exitCode = 1
      return
    }
  } else {
    console.log('SMEE_URL is empty; the HTTP endpoint runs alone')
  }
  try {
    await catchUp()
  } catch (error) {
    console.error(`Catch-up failed: ${error.message}`)
  }
})
