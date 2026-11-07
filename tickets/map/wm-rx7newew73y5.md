---
schema: 1
id: wm-rx7newew73y5
title: Task kind reference
category: map
status: closed
owner: frank
creator: frank
created_at: 2026-11-07T07:40:22Z
updated_at: 2026-11-07T08:17:46Z
closed_at: 2026-11-07T08:17:46Z
parent: wm-793jrqph1ckv
---
## Target

Design `kind.md` in the task design skill: how a task's kind is chosen, which kind suits which stage of a map, and what failure means for each kind.

## Acceptance direction

`kind.md` exists under `weave-your-work/task-design/`, a reader can pick the right kind for a new task from it, and it does not repeat the section lists that `body.md` holds.

## Decisions so far

- `kind.md` states which kind suits which stage of a map, alongside how the kind is chosen (user confirmed).
- `task_kind` is frozen once written. Changing it means closing the task and opening a new one with the other kind (user confirmed). `kind.md` states this and points at `properties.md` for the field itself.

## Not yet specified

(none; the design is settled and split into children)

## Out of scope

- Section lists and writing form per kind; those live in `body.md`.
- Claiming, execution, and closing tasks.
