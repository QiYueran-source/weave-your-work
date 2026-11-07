---
schema: 1
id: wm-rx7newew73y5
title: Task kind reference
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-07T07:40:22Z
updated_at: 2026-11-07T07:49:51Z
parent: wm-793jrqph1ckv
---
## Target

Design `kind.md` in the task design skill: how a task's kind is chosen, which kind suits which stage of a map, how delivery and probe differ in meaning, and what failure means for each.

## Acceptance direction

`kind.md` exists under `weave-your-work/task/`, a reader can pick the right kind for a new task from it, and it does not repeat the section lists that `body.md` holds.

## Decisions so far

- `kind.md` states which kind suits which stage of a map, alongside how the kind is chosen (user confirmed).

## Not yet specified

- Whether `task_kind` is frozen once written, and how a change of kind is handled.

## Out of scope

- Section lists and writing form per kind; those live in `body.md`.
- Claiming, execution, and closing tasks.
