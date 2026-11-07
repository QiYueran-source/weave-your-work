---
schema: 1
id: wm-3kaftv6fzfx2
title: Task review skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-07T09:42:08Z
updated_at: 2026-11-07T09:42:12Z
parent: wm-avc7a31tae33
---
## Target

Design the review skill for a finished task: read the task's own action and acceptance signal, read what the work left behind, and decide one verdict, shaped like the map review.

Why: a task is not done because its executor says so; something has to check the result against the signal written before the work started.

## Acceptance direction

`weave-your-work/task-review/` exists, its verdicts line up with the map review's four, and a sample finished task is reviewed from it.

All children are complete and no further child is needed.

## Children

(none yet)

## Decisions so far

- Review is part of execution, not a peer of the map review skill (user confirmed).
- It is shaped like the map review: axes, verdicts, a report with sources (user confirmed).
- The axes and verdicts are analysed later; this map holds the fog until then (user deferred).
- A review runs in a context that did not produce the work: dispatch sends a fresh subagent per finished task, and a single run reviews in its own context.
- A person reviews when the acceptance signal names a person as the checker; there is no separate field.

## Not yet specified

- The axes: what the goal axis reads on a task, what the convention axis reads.
- The verdicts, and what each one does to the ticket: close, return, grill, or close with `outcome=failed`.
- What a completed probe with a negative finding counts as.
- How the review relates to the owner's acceptance: is the verdict the acceptance, or an input to it.
- The report shape.

## Out of scope

- Reviewing a map.
- The steps and gates that advance one task.
