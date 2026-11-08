---
schema: 1
id: wm-2vphdebar7ph
title: Write the Progress section into the task body reference
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-07T10:07:04Z
updated_at: 2026-11-08T13:18:08Z
closed_at: 2026-11-08T13:18:08Z
parent: wm-793jrqph1ckv
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Add one section to `body.md` so a task in progress says where the work stands.

1. Add `Progress` to the shared sections, after Boundaries.
2. Give it purpose, format, and an example, in the same shape as every other section. The format is two short lines: where the work stands, and what happens next. It records state, not history.
3. State its constraints: it is never written before the work starts; it does not hold evidence, because evidence is a comment; it is never left in a closed ticket.
4. State its lifecycle and timing: set when the work starts, updated whenever the state changes, removed before the ticket closes.
5. Correct the sentence that calls a probe's `Result` the one section added after creation, so it names both.
6. Leave the whole-ticket example as it is, and say that it shows a ticket after `Progress` is removed.

## Acceptance signal

`body.md` defines `Progress` with a purpose, a format, an example, its constraints, and its lifecycle including when it is written, all in one place. A reader who opens only that file sees where the section sits in the order, what it may and may not hold, when it is written, and what a reader of a closed ticket sees without it.

No other skill restates the format, the constraints, or the timing; they refer to the section by name.

## Result

Superseded on 2026-11-08: `Progress` is now a stop marker. It is written when a run stops, not when work starts. The current rule is in `task-design/body.md`.

## Boundaries

- No change to `kind.md` or `properties.md`.
- No new section for any other purpose.
