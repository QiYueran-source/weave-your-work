---
schema: 1
id: wm-aya8m15vkvkj
title: Task skill entry
category: map
status: closed
owner: frank
creator: frank
created_at: 2026-11-08T11:09:20Z
updated_at: 2026-11-08T11:10:16Z
closed_at: 2026-11-08T11:10:16Z
parent: wm-87pgn0b75yy5
custom_fields:
  split_as: task
---
## Target

A reader who arrives at task work finds one entry that names the four task skills and says which one owns their question.

Why: the Map skill's design gives it one entry; the Task skill's design did not, because the family once had two skills and a routing file looked like noise.

## Acceptance direction

`weave-your-work/task/SKILL.md` exists, routes to `task-design`, `execute-one-task`, `execute-all`, and `task-review`, names `update` and `split` as adjacent skills, and repeats no rule from any of them.

All children are complete and no further children are needed.

Review point: open `SKILL.md` alone and check that a reader can tell which skill to open for writing a task, one task, a batch, or a review, and that none of the four skills' rules is restated.

## Decisions so far

- The Task skill gets a total entry skill at `weave-your-work/task/`, named `task`. (user confirmed)
- The entry routes; it does not carry the task body, the execution procedure, or the review rules. (agent decision, revisable)
- The entry is user-invoked, like the two execute skills. It is the name a person types, not a model-side router. (agent decision, revisable)
- The entry names the four task skills and points at `update` and `split` for the adjacent operations; it does not restate any of their rules. (agent decision, revisable)
- The entry replaces the earlier decision that the two skills are their own entry. That decision was recorded when the family had two skills and `ask-me` was the only router; with four skills and no built `ask-me`, a stable entry name is worth the upkeep. (user confirmed)

## Not yet specified

(none; the design is settled and the work is filed as a child)

## Out of scope

- The four task skills and their references.
- The map skill entry.
- ask-me's routing rules.
