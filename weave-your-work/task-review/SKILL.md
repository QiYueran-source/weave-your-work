---
name: task-review
description: Check a finished task against the acceptance signal written before the work started, and record one verdict on the ticket.
---

# Task review

A task is not done because its executor says so. The review reads what the work left behind against the signal written before the work started, and records one verdict.

## When it runs

A run has finished the work and written `Result`. The review runs before the ticket closes. A task reviewed again after a fix is reviewed by the same rules.

## Who reviews

The owner reviews and closes. The owner may be the agent that did the work when that agent runs the owner's task; a non-owner does not write `## Review` or close the ticket. A non-owner who has findings reports them to the owner.

The owner is the standing acceptant. A passing review closes the ticket on the spot, and the owner may reopen it.

## What it reads

The ticket: `Action`, `Acceptance signal`, `Boundaries`, `Result`, and `waiting_on`. Then the work `Result` points at: the file, the page, the notes, the answers.

`Result` is a claim about that work. The review checks the claim against the thing itself, never against itself.

## Two axes

The goal axis: the evidence the signal names is there, and someone who did not do the work can read it by the method the signal names.

The convention axis: the run stayed inside `Boundaries` and this repo's rules, and wrote only what it may write.

Read them separately and report them separately. One axis holding does not cover the other. Every finding names its source: the signal line, the boundary, or the rule.

The goal axis reads differently for the two kinds: `delivery.md` for a delivery, `probe.md` for a probe. The convention axis reads the same for both.

## Four verdicts

**passed**: both axes hold and `waiting_on` is empty. Recheck any map output required by the task: if it is missing or unusable, do not pass or close the task. That is `needs discussion`: record the missing input and the dependency question in `Review`, set `waiting_on` to the owner, and leave the ticket open for the disposition the map skill's `placement.md` describes. A ticket that still carries a `waiting_on` value is waiting, not passed: return `needs discussion` instead. Otherwise the ticket closes.

**needs changes**: an axis names a gap an agent can close, and `waiting_on` is empty. The task goes back to the executor with the gap named, it changes only that, and the task is reviewed again. If `waiting_on` is set, the task is waiting on a person; that is `needs discussion`, not a change.

**needs discussion**: the signal, or the standard behind it, is unclear and only the owner can settle it, or the task still waits on a person. The run stops and the task waits on whoever holds the answer: the owner, or the person the signal names. A run that cannot talk to a person returns this verdict to the one that can.

**wrong direction**: the work cannot be judged against the signal because the task itself was wrong: the map no longer wants this, or the action never could produce the thing. The ticket closes as a failed attempt, `waiting_on` is cleared, and the owner opens the replacement task.

## What it writes

`## Review`, in the shape task design defines: the verdict, then one line per axis with its source.

`outcome=failed`, only with `wrong direction`. If an old failed outcome remains on a reopened task and the owner has freshly established `passed`, clear it with `waymark field update <task> --clear outcome` before closing. Do not clear it merely to make fields match.

`waiting_on`: set only with `needs discussion`, and cleared on every close, so a `passed` or `wrong direction` ticket cannot keep a value. The rule that owns the field is the waymark skill's `fields.md`.

Nothing else. No comment ticket, no edit to `Result`, no rewrite of the `Action`. The review reads the work; it does not redo it.

## Closing and handing on

`passed` and `wrong direction`: clear `waiting_on`, write `## Review`, remove `Progress` if a stop or update left one, then close the ticket. Keep an update invalidation marker until the new Review is written, so an interruption cannot turn the old verdict into an apparent current pass.

`needs changes`: write `## Review`, leave the ticket open, hand it back naming only the gap. A ticket with a non-empty `waiting_on` is not `needs changes`; it is `needs discussion`.

`needs discussion`: write `## Review`, write `Progress`, set `waiting_on` to the person who holds the answer, leave the ticket open.

## The report

Three lines, repeating what was just written: what the work produced, the verdict and the axis that decided it, and what happens next. Sources stay on the ticket.

When the verdict leaves the ticket open, the run carries on as `execute-one-task` says: a fix for `needs changes`, a stop for `needs discussion`.

A report that names something the ticket does not hold is a missing write, not a report.

## When the evidence is not there

No `Result`, or a deliverable that cannot be found or opened, is `needs changes` naming what is missing, unless `waiting_on` is set; then it is `needs discussion`. Do not guess at the result, and do not pass a task on its executor's word.

If the `Acceptance signal` cannot be read as a standard at all, because it names no evidence or two readings of it disagree, that is `needs discussion`: the mix-up belongs to the owner.

## What this skill does not do

- Do the work or fix it. `needs changes` goes back to `execute-one-task`.
- Review a map. That is the map review skill.
- Review design completeness. The sections and field/body agreement are checked where the ticket is written and in the execute preflight.
- Define the `## Review` shape or the `outcome` field. Task design owns both.
