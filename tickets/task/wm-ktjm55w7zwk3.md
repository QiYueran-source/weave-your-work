---
schema: 1
id: wm-ktjm55w7zwk3
title: Declare waiting_on in the task properties reference
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-07T10:07:45Z
updated_at: 2026-11-07T10:07:45Z
parent: wm-793jrqph1ckv
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Give the `waiting_on` field a home in `properties.md` so a task that waits on a person says so in one place instead of three.

1. Add `waiting_on` to the field list that opens the file: optional, type string, written during execution rather than at design time.
2. State what it holds: the person, or the thing, whose answer the task waits on.
3. State who writes it and when: task execution sets it when a task starts waiting and clears it when the answer arrives. Task design only declares it.
4. State that it is what keeps a waiting task out of the next automatic batch, and that the body's `Progress` section says what the work is waiting for.

## Acceptance signal

`properties.md` lists `waiting_on` among a task's fields, marks it optional and string, and a reader can tell from that file alone what goes in it, who writes it, and when it is cleared. The opening sentence no longer claims the task carries only three custom fields.

## Boundaries

- No change to `body.md` or `kind.md`.
- No rule about how dispatch selects a batch.
