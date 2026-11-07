---
name: task-review
description: Check a finished task against the acceptance signal written before the work started, and record one verdict on the ticket.
---

# Task review

A task is not done because its executor says so. The review reads what the work left behind against the signal written before the work started, and records one verdict.

This skill is model-invocable because `execute-one-task` invokes it at the end of a run. The execution skills beside it are user-invoked.

## When it runs

A run has finished the work and written `Result`. The review runs before the ticket closes. A task reviewed again after a fix is reviewed by the same rules.

## Who reviews

Anyone, including the agent that did the work. A run that has just finished a task reviews it in the same run, so a task never waits for a separate reviewer.

The owner is the standing acceptant. A passing review closes the ticket on the spot, and the owner may reopen it. A reviewer who is not the owner acts with that authority, not instead of it.

## What it reads

The ticket: `Action`, `Acceptance signal`, `Boundaries`, and `Result`. Then the work `Result` points at: the file, the page, the notes, the answers.

`Result` is a claim about that work. The review checks the claim against the thing itself, never against itself.

## Two axes

The goal axis: the evidence the signal names is there, and someone who did not do the work can read it by the method the signal names.

The convention axis: the run stayed inside `Boundaries` and this repo's rules, and wrote only what it may write.

Read them separately and report them separately. One axis holding does not cover the other. Every finding names its source: the signal line, the boundary, or the rule.

The goal axis reads differently for the two kinds: `delivery.md` for a delivery, `probe.md` for a probe. The convention axis reads the same for both.

## Four verdicts

**passed**: both axes hold. The ticket closes.

**needs changes**: an axis names a gap an agent can close. The task goes back to the executor with the gap named, it changes only that, and the task is reviewed again.

**needs discussion**: the signal, or the standard behind it, is unclear and only the owner can settle it. The run stops and the task waits on whoever holds the answer: the owner, or the person the signal names. A run that cannot talk to a person returns this verdict to the one that can.

**wrong direction**: the work cannot be judged against the signal because the task itself was wrong: the map no longer wants this, or the action never could produce the thing. The ticket closes as a failed attempt, and the owner opens the replacement task.

## What it writes

`## Review`, in the shape task design defines: the verdict, then one line per axis with its source.

`outcome=failed`, only with `wrong direction`.

Nothing else. No comment ticket, no edit to `Result`, no rewrite of the `Action`. The review reads the work; it does not redo it.

## Closing and handing on

`passed` and `wrong direction`: remove `Progress` if a stop left one, write `## Review`, close the ticket.

`needs changes`: write `## Review`, leave the ticket open, hand it back naming only the gap.

`needs discussion`: write `## Review`, write `Progress`, set `waiting_on` to whoever holds the answer, leave the ticket open.

## The report

Three lines, repeating what was just written: what the work produced, the verdict and the axis that decided it, and what happens next. Sources stay on the ticket.

When the verdict leaves the ticket open, the run carries on as `execute-one-task` says: a fix for `needs changes`, a stop for `needs discussion`.

A report that names something the ticket does not hold is a missing write, not a report.

## When the evidence is not there

No `Result`, or a deliverable that cannot be found or opened, is `needs changes` naming what is missing. Do not guess at the result, and do not pass a task on its executor's word.

If the `Acceptance signal` cannot be read as a standard at all, because it names no evidence or two readings of it disagree, that is `needs discussion`: the mix-up belongs to the owner.

## What this skill does not do

- Do the work or fix it. `needs changes` goes back to `execute-one-task`.
- Review a map. That is the map review skill.
- Define the `## Review` shape or the `outcome` field. Task design owns both.
