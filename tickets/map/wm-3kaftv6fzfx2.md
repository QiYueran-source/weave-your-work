---
schema: 1
id: wm-3kaftv6fzfx2
title: Task review skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-07T09:42:08Z
updated_at: 2026-11-07T09:56:20Z
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
- A verdict that does not pass does not close the ticket (user confirmed). Only a passing verdict closes it.
- Review splits into two kinds, one for a delivery task and one for a probe task. The split is designed here, not in the execution skills (user confirmed).
- A probe whose finding is negative still reviews as a probe and still closes with `outcome` recorded; a negative finding is a result, not a failure (user confirmed).
- The axes and the verdict names are analysed later; this map holds that fog until then (user deferred).
- A verdict of needs changes goes back to an agent to fix, without asking a person, when the fix needs no person (user confirmed).

## Not yet specified

- The axes: what the goal axis reads on a task, what the convention axis reads.
- The four verdicts, and what each one leaves the ticket as.
- Who runs the review, and whether the reviewer may be the executor.
- How the review relates to the owner's acceptance: is the verdict the acceptance, or an input to it.
- The report shape.
- Whether a person reviews, and what triggers that.

## Out of scope

- Reviewing a map.
- The steps and gates that advance one task.
