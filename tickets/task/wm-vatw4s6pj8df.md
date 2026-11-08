---
schema: 1
id: wm-vatw4s6pj8df
title: Write the task skill entry
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-08T11:09:23Z
updated_at: 2026-11-08T11:10:16Z
closed_at: 2026-11-08T11:10:16Z
parent: wm-aya8m15vkvkj
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `weave-your-work/task/SKILL.md`, the entry to the task skill family.

1. State what a task is in one sentence: the finest node of the target tree, one action that ends at a result someone can check.
2. Say that this file routes and does not define the task body, the execution steps, or the review.
3. Route by the question the reader has: writing a task ticket to `task-design`; advancing one task to `execute-one-task`; advancing every task under a map to `execute-all`; judging a finished task to `task-review`.
4. Name `update` for changing a closed task, and `split` for deciding whether work is a task or a child map.
5. Keep the file short; name each skill by its installed name and repeat none of its rules.

## Acceptance signal

`weave-your-work/task/SKILL.md` exists. A reader can tell from it which skill to open for writing a task, advancing one, running a batch, or reviewing a finished one. It names `task-design`, `execute-one-task`, `execute-all`, `task-review`, `update`, and `split`, and it does not restate any rule from those skills.

## Result

`weave-your-work/task/SKILL.md` is written, 28 lines. It states what a task is, routes to `task-design`, `execute-one-task`, `execute-all`, and `task-review`, names `update` and `split` as adjacent skills, and leaves every rule to its owner. The installer found the skill and read its description, so the front matter parses.

What it has not done: no reader has used the entry to choose a skill on a real task yet. That belongs to the batch that walks every skill.

## Review

passed

- Goal: `weave-your-work/task/SKILL.md` exists; a reader can tell which skill to open for writing a task, one task, a batch, or a review; the six names are present; no rule is restated. Read against the acceptance signal line by line.
- Convention: the task wrote only `weave-your-work/task/SKILL.md`; the ticket and tree edits were the owner's setup for the task, recorded on the two maps.

## Boundaries

- No task body sections, kinds, or fields. Those are `task-design`.
- No execution steps or gates. Those are `execute-one-task` and `execute-all`.
- No review axes or verdicts. Those are `task-review`.
