---
schema: 1
id: wm-gg4m636xgrxz
title: Add outcome and Review to the task references
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-07T12:39:27Z
updated_at: 2026-11-07T12:39:27Z
parent: wm-793jrqph1ckv
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Add the two things a review writes to the task design references.

1. In `properties.md`, add an `outcome` entry: optional string, one accepted value, `failed`; written by review when a task closes as failed; the other three verdicts write no field, because the ticket's status already says what became of it. Say that it was first defined for maps and means the same thing on a task.
2. In `body.md`, add `## Review` under "Sections written after creation", beside `Result` and `Progress`: purpose, format (the verdict on one line, then one line per axis citing its source), lifecycle (written before the close and kept on the closed ticket), and who writes it (the reviewer, never the executor).
3. Show both in the whole-ticket example: a closed task carrying `Review` and, in a second example, the same ticket with `outcome` set to `failed`.
4. Check that "Keeping a body short" and the `Result` entry still read correctly now that a closed ticket carries one more section.

## Acceptance signal

`properties.md` defines `outcome` with its one accepted value and who writes it; `body.md` defines `## Review` with its purpose, format, lifecycle, and writer; the whole-ticket example shows a closed task carrying `## Review` and carries `outcome: failed` as a field; and the two files agree on who writes what — review writes `## Review` and `outcome`, execution writes `Result` and `Progress`, the designer writes neither.

## Boundaries

- No review procedure: how a review is run belongs to `task-review`.
- No change to `task_kind`, `reversibility`, `needs_human`, or `waiting_on`.
- Do not rewrite `Result`'s rules.
