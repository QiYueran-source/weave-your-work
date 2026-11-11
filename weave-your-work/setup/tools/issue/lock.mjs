// One listener per pending queue. The lock is a file created exclusively in the
// queue directory; it records who holds it so an abnormal exit can be recovered.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const STALE_MS = 24 * 60 * 60 * 1000

function readLock(file) {
  let content
  try {
    content = fs.readFileSync(file, 'utf8')
  } catch (error) {
    if (error.code === 'ENOENT') return null
    throw error
  }
  try {
    const data = JSON.parse(content)
    if (!data || typeof data !== 'object' || Array.isArray(data)) return { invalid: true }
    return data
  } catch {
    return { invalid: true }
  }
}

function alive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false
  try {
    process.kill(pid, 0)
    return true
  } catch (error) {
    // EPERM means the process exists but belongs to another user.
    return error.code === 'EPERM'
  }
}

function age(file, now) {
  try {
    return now - fs.statSync(file).mtimeMs
  } catch (error) {
    if (error.code === 'ENOENT') return 0
    throw error
  }
}

function create(file, record) {
  const fd = fs.openSync(file, 'wx')
  try {
    fs.writeFileSync(fd, `${JSON.stringify(record)}\n`)
  } finally {
    fs.closeSync(fd)
  }
}

function describe(lock) {
  if (lock.invalid) return 'unreadable lock'
  return `pid ${lock.pid} on ${lock.host}`
}

// Acquire the lock for `queue`, or throw before the queue is touched.
export function acquireQueueLock(queue, options = {}) {
  const host = options.host ?? os.hostname()
  const pid = options.pid ?? process.pid
  const now = options.now ?? Date.now()
  const root = options.root ?? process.cwd()
  const dir = path.dirname(queue)
  fs.mkdirSync(dir, { recursive: true })
  const file = path.join(dir, '.lock')
  const record = { pid, host, started_at: new Date(now).toISOString(), root }

  try {
    create(file, record)
  } catch (error) {
    if (error.code !== 'EEXIST') throw error
    const existing = readLock(file)
    if (existing && !existing.invalid && existing.host === host && alive(existing.pid)) {
      throw new Error(`Another listener holds the queue lock (${describe(existing)}); stop it before starting another`)
    }
    const verifiable = existing && !existing.invalid && existing.host === host
    const stamped = existing && !existing.invalid && Number.isFinite(Date.parse(existing.started_at))
      ? Date.parse(existing.started_at)
      : null
    const lockAge = stamped === null ? age(file, now) : now - stamped
    const stale = verifiable
      ? !alive(existing.pid)
      : lockAge > STALE_MS
    if (!stale) {
      throw new Error(`Cannot verify the queue lock (${existing ? describe(existing) : 'missing'}); remove it only after checking that no listener is running`)
    }
    console.error(`Taking over a stale queue lock (${existing ? describe(existing) : 'missing'})`)
    try {
      fs.unlinkSync(file)
      create(file, record)
    } catch (replaceError) {
      if (replaceError.code === 'EEXIST') {
        throw new Error('Another listener acquired the queue lock during recovery')
      }
      throw replaceError
    }
  }

  let released = false
  return {
    file,
    release() {
      if (released) return
      released = true
      const current = readLock(file)
      if (current && !current.invalid && current.pid === pid && current.host === host) {
        try {
          fs.unlinkSync(file)
        } catch (error) {
          if (error.code !== 'ENOENT') throw error
        }
      }
    },
  }
}
