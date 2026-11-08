---
schema: 1
id: wm-3kaftv6fzfx2
title: Task review skill
category: map
status: closed
owner: frank
creator: frank
created_at: 2026-11-07T09:42:08Z
updated_at: 2026-11-07T12:59:57Z
closed_at: 2026-11-07T12:59:57Z
parent: wm-avc7a31tae33
---
## Target

Design the review skill for a finished task: read the task's own action and acceptance signal, read what the work left behind, and decide one verdict, shaped like the map review.

Why: a task is not done because its executor says so; something has to check the result against the signal written before the work started.

## Acceptance direction

`weave-your-work/task-review/` exists, its verdicts line up with the map review's four, and a sample finished task is reviewed from it.

All children are complete and no further child is needed.

## Decisions so far

- Review is part of execution, not a peer of the map review skill (user confirmed).
- It is shaped like the map review: axes, verdicts, a report with sources (user confirmed).
- A verdict that does not pass does not close the ticket (user confirmed). Only a passing verdict closes it.
- Review splits into two kinds, one for a delivery task and one for a probe task. The split is designed here, not in the execution skills (user confirmed).
- A negative probe finding is `passed`: the ticket closes without `outcome`, and the finding is the `Result`. A negative finding is a result, not a failure. This replaces the earlier wording that had a negative probe closing with `outcome` recorded (user confirmed).
- A verdict of needs changes goes back to an agent to fix, without asking a person, when the fix needs no person (user confirmed).
- The skill is `task-review/SKILL.md` with two references beside it, `delivery.md` and `probe.md`, one per kind, laid out flat like task-design's references. The entry holds what both kinds share: when the review runs, who may review, what it reads, the two axes, the four verdicts, what it writes, and how the work is handed on. Each reference holds only what the kinds do differently (user confirmed).
- Anyone may review, including the agent that did the work; a run that finishes a task reviews it before it ends, so a task never waits on a separate reviewer (user confirmed).
- The review reads along two axes, independently and reported separately. The goal axis reads the task's `Acceptance signal`: the evidence is there, and someone who did not do the work can read it by the method the signal names. The convention axis reads `Boundaries` and this repo's rules, plus whether the run wrote only what it may write. Every finding cites its source. Neither axis judges taste or implementation style unless the ticket put that in the signal (user confirmed).
- The four verdicts line up with the map review's four (user confirmed). `passed` closes the ticket. `needs changes` returns the task to the executor, which fixes only what the review named, and the task is reviewed again. `needs discussion` stops the run because the `Acceptance signal`, or the standard behind it, is unclear and only the owner can settle it; the task waits on the owner. `wrong direction` closes the ticket as failed.
- A run that stops mid-work because the task no longer holds is not `wrong direction`: it hands the task back to the owner without closing it, because no result exists to judge (user confirmed).
- The closed ticket keeps both a `## Review` section and the `outcome` field (user confirmed). `## Review` is written before the close: the verdict on one line, then one line per axis citing its source. `outcome` keeps its one meaning from the map front matter, `failed`, and is written only when the verdict is `wrong direction`; the other three verdicts write no field, because the ticket's status already says what became of it. The field mirrors the section and never contradicts it.
- A person enters the review in one place only: `needs discussion`, where the owner has to talk about the signal or the standard. Every other verdict is decided by the reviewer (recommended, not put to the user as its own question).
- Task design changes with this: `properties.md` gains `outcome` (optional string, the one accepted value `failed`, written by review when a task closes as failed) and `body.md` gains `## Review` in the sections written after creation (user confirmed).
- The owner stays the standing acceptant, and a passing review closes the ticket on the spot, so a run never waits for the owner to be present; the owner may reopen (follows from the confirmed rule that a passing verdict closes the ticket, and from task design's rule that the owner accepts; not put to the user as its own question).

- The report repeats what the run just wrote and adds nothing (user confirmed). A stop repeats `Progress` and `waiting_on`; a finish repeats the first line of `Result` and the verdict, then says what happens next. Sources stay on the ticket. A report that names something the ticket does not hold is a missing write, not a report.
- The two paths share one shape: write the ticket, then repeat it as three lines. What differs is what gets written. A stop writes a state that a later run overwrites and the close deletes; a finish writes records that stay. On the finish path two writes land: the executor's `Result` and the reviewer's `## Review` (and `outcome=failed` when the task closed as a wrong direction). When the reviewer is the executor, one agent writes both in turn (user confirmed).

## Not yet specified

- ~~The axes: what the goal axis reads on a task, what the convention axis reads.~~ Resolved: the goal axis reads the `Acceptance signal`, the convention axis reads `Boundaries` and the repo rules (see Decisions so far).
- ~~Who runs the review, and whether the reviewer may be the executor.~~ Resolved: anyone, including the executor (see Decisions so far).
- ~~The four verdicts, and what each one leaves the ticket as.~~ Resolved: passed, needs changes, needs discussion, wrong direction (see Decisions so far).
- ~~Where the verdict and its findings are recorded on the task ticket, and what `outcome` means for a task.~~ Resolved: a `## Review` section for the record and `outcome=failed` for a failed close (see Decisions so far).
- ~~How the review relates to the owner's acceptance.~~ Resolved: the owner is the standing acceptant and a pass closes on the spot (see Decisions so far).
- ~~The report shape: the map review's is a conclusion, the per-axis findings with their sources, what is done well, and the verdict; what a task review keeps of it.~~ Resolved: the report is a three-line repeat of the ticket, and the sources stay on the ticket (see Decisions so far).

(none; the design is settled and the work is filed as a child)

## Out of scope

- Reviewing a map.
- The steps and gates that advance one task.
