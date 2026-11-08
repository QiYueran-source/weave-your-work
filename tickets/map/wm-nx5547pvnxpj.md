---
schema: 1
id: wm-nx5547pvnxpj
title: Task skill review fixes
category: map
status: closed
owner: frank
creator: frank
created_at: 2026-11-08T12:52:50Z
updated_at: 2026-11-08T12:54:46Z
closed_at: 2026-11-08T12:54:46Z
parent: wm-87pgn0b75yy5
custom_fields:
  split_as: task
---
## Target

Close the remaining task skill findings: design completeness is checked where a ticket is written and before work starts, only the owner reviews and closes, a probe's completion and `Next step` are recorded, and `Progress` is a stop marker.

## Why

The chemistry walk left six findings open after the batch fix. They are all rules a writer or reviewer needs at the moment they act, not new concepts.

## Acceptance direction

`split/task.md`, `update/need-execute.md`, `task-design/SKILL.md`, `task-design/body.md`, `execute-one-task/SKILL.md`, `task-review/SKILL.md`, and `task-review/probe.md` state the rules; `waymark validate` is clean; and none still says a non-owner may close, that `Progress` is written at the start, or that a task sequence is expressed with child maps.

## Decisions so far

- Required sections and `needs_human`/`Person:` agreement are checked where the ticket is written and in the execute preflight; `task-review` does not judge design.
- Only the owner reviews and closes; a non-owner does not write `## Review`.
- An incomplete probe is `needs changes` if the executor can still gather the evidence, `needs discussion` if only the owner can decide to retry, narrow, or stop.
- A completed probe's `Result` records the map owner's confirmation of both `Next step` lines; the review checks it.
- `Progress` is written when a run stops, overwritten when the state changes, and removed before the close.

## Boundaries

- No change to the glossary, grill, issue, or map review skills.
- No new verdict or field.
