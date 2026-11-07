---
schema: 1
id: wm-qamw233hhpe3
title: Write the task skill entry
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-07T07:34:24Z
updated_at: 2026-11-07T07:34:24Z
parent: wm-793jrqph1ckv
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `weave-your-work/task/SKILL.md`: the entry for the task skill. It states what a task is, routes a reader to `body.md` for task content and `properties.md` for task fields, and points at the two example files. It does not restate the rules those references hold.

## Acceptance signal

A reader who opens only `SKILL.md` knows whether to use `body.md` or `properties.md` next, and no rule from either reference appears twice in `SKILL.md`.
