---
name: task
description: "The reference for a task record: the sections a body may hold, the delivery and probe kinds, and the two review axes. Read it before writing, advancing, or judging a task."
family: track
invocation: model
---

# Task

A task is the finest node of the target tree: one action that ends at a result someone can check. This skill is the reference for the record; the actions that write it are `split` and `advance-task`, and the review is `task-review`.

Read it before writing a task, advancing one, or judging one. It defines; it does not run.

## What is here

| File | Defines |
|---|---|
| `res/body.md` | the sections a body may hold, and the size rule |
| `res/kind.md` | `delivery` and `probe`, and what failure means for each |
| `res/review.md` | the two review axes, the four verdicts, and the `## Review` shape |

The field rules are `waymark/res/fields.md`; where a task sits, and what it may never carry, are `waymark/res/relations.md`.

## What this skill does not do

- Write a task. `split` does, reading this skill's files.
- Advance or judge one. Those are `advance-task` and `task-review`.
- Define a field. `waymark` does.
