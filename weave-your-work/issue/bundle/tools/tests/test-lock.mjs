import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { acquireQueueLock } from '../lock.mjs'

function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'issue-lock-'))
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  return path.join(dir, 'pending.md')
}

function writeLock(queue, record) {
  fs.mkdirSync(path.dirname(queue), { recursive: true })
  fs.writeFileSync(`${path.dirname(queue)}/.lock`, `${JSON.stringify(record)}\n`)
}

test('acquires and releases the queue lock', (t) => {
  const queue = fixture(t)
  const lock = acquireQueueLock(queue)
  assert.ok(fs.existsSync(lock.file))
  lock.release()
  assert.equal(fs.existsSync(lock.file), false)
  lock.release()
  assert.equal(fs.existsSync(lock.file), false)
})

test('rejects a second live listener on the same host', (t) => {
  const queue = fixture(t)
  writeLock(queue, {
    pid: process.pid,
    host: os.hostname(),
    started_at: new Date().toISOString(),
    root: process.cwd(),
  })
  assert.throws(() => acquireQueueLock(queue), /Another listener holds the queue lock/)
})

test('takes over a lock whose process is gone', (t) => {
  const queue = fixture(t)
  writeLock(queue, {
    pid: 999999,
    host: os.hostname(),
    started_at: new Date().toISOString(),
    root: process.cwd(),
  })
  const lock = acquireQueueLock(queue)
  const written = JSON.parse(fs.readFileSync(lock.file, 'utf8'))
  assert.equal(written.pid, process.pid)
  lock.release()
})

test('takes over an unverifiable lock only after 24 hours', (t) => {
  const queue = fixture(t)
  const old = {
    pid: 123,
    host: 'another-host',
    started_at: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
    root: '/elsewhere',
  }
  writeLock(queue, old)
  const lock = acquireQueueLock(queue)
  assert.equal(JSON.parse(fs.readFileSync(lock.file, 'utf8')).pid, process.pid)
  lock.release()

  writeLock(queue, { ...old, started_at: new Date().toISOString() })
  assert.throws(() => acquireQueueLock(queue), /Cannot verify the queue lock/)
})

test('takes over an unreadable lock only after 24 hours', (t) => {
  const queue = fixture(t)
  fs.mkdirSync(path.dirname(queue), { recursive: true })
  fs.writeFileSync(`${path.dirname(queue)}/.lock`, 'not json\n')
  assert.throws(() => acquireQueueLock(queue), /Cannot verify the queue lock/)

  const old = new Date(Date.now() - 25 * 60 * 60 * 1000)
  fs.utimesSync(`${path.dirname(queue)}/.lock`, old, old)
  const lock = acquireQueueLock(queue)
  assert.equal(JSON.parse(fs.readFileSync(lock.file, 'utf8')).pid, process.pid)
  lock.release()
})

test('release leaves a lock owned by another process alone', (t) => {
  const queue = fixture(t)
  const lock = acquireQueueLock(queue)
  writeLock(queue, {
    pid: 999999,
    host: os.hostname(),
    started_at: new Date().toISOString(),
    root: process.cwd(),
  })
  lock.release()
  assert.ok(fs.existsSync(lock.file))
})
