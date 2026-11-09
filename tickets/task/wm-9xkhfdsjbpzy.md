---
schema: 1
id: wm-9xkhfdsjbpzy
title: Queue only the messages addressed to this machine
category: task
status: in_progress
owner: frank
creator: frank
created_at: 2026-11-09T08:46:13Z
updated_at: 2026-11-09T08:46:28Z
parent: wm-25b3q7mg88c7
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

A listener now queues every communicate issue whose author is on the roster, whichever owner the message names. On a channel shared by several machines, every machine queues every message, so the queue holds other people's mail and a cross-owner delivery test proves nothing.

Change the routing rule so a machine queues a message only when its `to` resolves to the owner of this machine:

1. Resolve this machine's owner from `git config user.name`, matched against the `[handles]` keys without regard to case. `git config --local user.name <owner>` is the per-clone, untracked slot for a machine that belongs to someone else.
2. Fail at startup, before the port opens, when `git config user.name` is absent, matches no owner, or matches several owners. Name the roster and the command that fixes it.
3. Replace `queueIssue`'s `mappedOnly` option with the one rule: keep the message when `ownerFor(handles, to) === machineOwner`, otherwise log a skip and return 0. Both the webhook and the catch-up path use it, which removes the difference between them.
4. Drop the `unknown` owner: a queued entry always carries a real owner.

Do not add a field to `handles.toml`. That file is tracked and shared, so a per-machine value in it is the same value for everyone who clones.

## Result

The listener queues a message only when it is addressed to this machine's owner. A message addressed to another owner, or to a handle outside the roster, is skipped on both paths with a log line. A machine whose git name is not an owner refuses to start and says how to fix it.

## Acceptance signal

- The Node tests assert: a message to this machine's owner queues; a message to another owner does not; a case-different git name still matches; an unknown git name exits non-zero with the roster in the message.
- The running service restarts and its log shows the catch-up count unchanged.
- A message to a second owner does not reach this machine's queue.

## Boundaries

- No environment variable and no new key in `handles.toml`.
- The roster stays one shared flat table; the author check stays a roster, not authentication.
- One owner per machine; a machine receiving for several owners is out of scope.
- The queue entry keeps its `owner` field.
