---
schema: 1
id: wm-pggmqtpa0a70
title: Guard the pending queue with one listener
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-10T11:24:39Z
updated_at: 2026-11-10T11:24:39Z
parent: wm-zhxe0hsnpf34
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Deliver an exclusive queue lock so two listeners on one checkout cannot both append, and a crashed listener can recover.

1. Add a lock module used by `listener.mjs`. Create `<queue-dir>/.lock` atomically with `fs.openSync(path, 'wx')` and write JSON holding `pid`, `started_at`, `host`, and `root`.
2. When the lock exists, read it. If it names this host and the pid is alive, exit with a clear error before touching the queue. If the pid is dead, log the takeover and replace the lock. If the host or pid cannot be checked, take over only when the lock is older than 24 hours, and log that decision.
3. Release the lock on clean shutdown and on SIGINT/SIGTERM. Leave a crashed lock for the next start to recover; never leave the queue holding a partial line.
4. Add tests for a second live listener being rejected, a dead-pid lock being taken over, an old unverifiable lock being taken over, a live lock being kept, and the lock disappearing after clean shutdown. Confirm the queue is unchanged when a listener is rejected.

## Acceptance signal

`node --test` in `weave-your-work/issue/bundle/tools/` passes. The tests start two listeners against one queue and show that only one appends; they also show recovery after a simulated crash and no append while rejected. The lock lives under the ignored pending directory and is not committed.

## Boundaries

- No service, systemd, or port changes.
- No queue file format change.
- No repository validation change; that is the listener isolation task.
