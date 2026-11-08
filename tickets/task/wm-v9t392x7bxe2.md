---
schema: 1
id: wm-v9t392x7bxe2
title: Write the need-execute reference
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-08T11:45:49Z
updated_at: 2026-11-08T11:47:29Z
closed_at: 2026-11-08T11:47:29Z
parent: wm-9sfmaphskg0c
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Add the `need-execute` reference to the update skill and point the skill at it.

1. Write `weave-your-work/update/need-execute.md`: the shape table by `split_as`, the order of the writes, and the gate that decides whether the run executes the task now or stops.
2. Add a short `When the change needs execution` section to `weave-your-work/update/SKILL.md`, pointing at `need-execute.md`.
3. Add the pointer from `content.md`'s `The reopen loop` section.
4. Keep the reference pointing at `split`, `task-design`, `execute-one-task`, and `task-review`; do not restate their rules.

## Acceptance signal

`weave-your-work/update/need-execute.md` exists. It states the `split_as=submap` path (a small child map first, then a task under it), the `split_as=task` path (a task directly), and the stop when the type is missing, mixed, or needs order under a task layer. It states the execution gate in terms of `reversibility`, `needs_human`, ownership, and a change to `Target` or `Acceptance direction`. `SKILL.md` and `content.md` point to it. No rule from `split`, `task-design`, `execute-one-task`, or `task-review` is repeated.

## Result

`weave-your-work/update/need-execute.md` is written, 56 lines. It states the map path by `split_as` — a small child map first under `submap`, a task directly under `task` — the order of the writes, and the execution gate in terms of `reversibility`, `needs_human`, ownership, and a change to the promise. It also states that a task takes no child and rewrites its own `Action`. `SKILL.md` has a short section and a pointer; `content.md`'s reopen loop points to it.

What it has not done: no update run has used the reference on a real change yet. The task that wrote this file is the first shape it describes, but the reference has not been read by a second run.

## Review

passed

- Goal: `need-execute.md` exists; the `submap` path puts a child map first and the task under it; the `task` path adds the task directly; missing or mixed types stop; the execution gate names `reversibility`, `needs_human`, ownership, and a promise change; `SKILL.md` and `content.md` point to it; no rule from the four named skills is repeated. Read against the acceptance signal line by line.
- Convention: only the update skill files were written; the ticket and tree edits were the owner's setup for the task, recorded on the update map.

## Boundaries

- No change to `split`, `task-design`, `execute-one-task`, or `task-review`.
- No new skill.
