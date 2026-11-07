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
- The skill is `task-review/SKILL.md` with two references beside it, `delivery.md` and `probe.md`, one per kind, laid out flat like task-design's references. The entry holds what both kinds share: when the review runs, who may review, what it reads, the two axes, the four verdicts, what it writes, and how the work is handed on. Each reference holds only what the kinds do differently (user confirmed).
- Anyone may review, including the agent that did the work; a run that finishes a task reviews it before it ends, so a task never waits on a separate reviewer (user confirmed).
- The review reads along two axes, independently and reported separately. The goal axis reads the task's `Acceptance signal`: the evidence is there, and someone who did not do the work can read it by the method the signal names. The convention axis reads `Boundaries` and this repo's rules, plus whether the run wrote only what it may write. Every finding cites its source. Neither axis judges taste or implementation style unless the ticket put that in the signal (user confirmed).

## Not yet specified

- ~~The axes: what the goal axis reads on a task, what the convention axis reads.~~ Resolved: the goal axis reads the `Acceptance signal`, the convention axis reads `Boundaries` and the repo rules (see Decisions so far).
- ~~Who runs the review, and whether the reviewer may be the executor.~~ Resolved: anyone, including the executor (see Decisions so far).
- The four verdicts, and what each one leaves the ticket as. The map review's four are now known — passed, needs changes, needs discussion, wrong direction — and this map's acceptance direction says the task's verdicts line up with them; the alignment is being settled.
- Where the verdict and its findings are recorded on the task ticket, and what `outcome` means for a task. `outcome` is declared in `.waymark/config.toml` and defined only in the map front matter map as `failed`, written by review when a node closes as failed; task design never mentions it.
- How the review relates to the owner's acceptance: is the verdict the acceptance, or an input to it.
- The report shape.
- Whether a person reviews, and what triggers that.

## Out of scope

- Reviewing a map.
- The steps and gates that advance one task.
