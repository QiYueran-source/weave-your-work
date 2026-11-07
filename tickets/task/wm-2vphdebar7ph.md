---
schema: 1
id: wm-2vphdebar7ph
title: Write the Progress section into the task body reference
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-07T10:07:04Z
updated_at: 2026-11-07T10:07:04Z
parent: wm-793jrqph1ckv
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Add one section to `body.md` so a task in progress says where the work stands.

1. Add `Progress` to the shared sections, after Boundaries.
2. Give it purpose, format, and an example, in the same shape as every other section: it states where the work stands, not what was done along the way.
3. State the lifecycle in the same place: it is written while the task is in progress and removed before the ticket closes.
4. Leave the whole-ticket example as it is, and say that it shows a ticket after `Progress` is removed.

## Acceptance signal

`body.md` defines `Progress` with a purpose, a format, and an example, and states that execution writes it and closing removes it. A reader who opens only that file sees where the section sits in the order, what a reader of a closed ticket sees without it, and that no other section is added after creation apart from a probe's `Result`.

## Boundaries

- No change to `kind.md` or `properties.md`.
- No rule about when execution writes the section beyond its lifecycle.
- No new section for any other purpose.
