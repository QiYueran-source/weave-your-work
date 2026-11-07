---
name: execute-one-task
description: Advance one task to its end, stopping only where something blocks it.
disable-model-invocation: true
---

# Execute one task

Take one task from unclaimed to handed over, and keep working until it is done. The run stops only where something blocks it.

## Before the work

Read the ticket: `Action`, `Acceptance signal`, `Boundaries`, and the front matter — `task_kind`, `reversibility`, `needs_human`.

Read the map above it. Its `Target` says why the task matters; its `Acceptance direction` says what the branch is for. Work done correctly against the wrong map is still wrong work.

Check that the task still holds: the action still serves what the map wants, and nothing has made it moot or impossible.

Claim it with `waymark start`. Say one line about where you are starting and what the first step is, then work.

## The five things that stop a run

- The `one_way` confirmation has not landed. The `Acceptance signal` names who confirms and what they confirm.
- A `Person:` step needs a person.
- A question would change what the task promises: what counts as done, where the deliverable goes, whether a person checks it.
- The task no longer holds.
- The work lacks an input or a permission it needs.

The first three and the last are waits: write `Progress`, set `waiting_on` to the person or the thing, and leave the task `in_progress`. The fourth is a hand-back, below.

A question about how the work is done is not on this list. Decide it, and say what you decided in `Result`.

## Doing the work

Work the `Action` in the order it gives when it is a numbered list, and in any order when it is prose. Do not stop between steps.

## Finishing

Read the `Acceptance signal` against the evidence. The signal is a standard, not a mood: it says what evidence shows the result is there, and the result either meets it or does not.

Write `Result`: for a delivery, where the deliverable is, how to open it, and what a person handed back; for a probe, the finding and the verdict. Remove `Progress` if an earlier stop left one.

Then invoke `task-review`. It reads the same signal against the same evidence, writes `## Review`, and decides: close the ticket, send the task back with the gap named, or stop it on the owner. A task that comes back has only the named gap to fix.

Report three lines: what the work produced, the verdict and the axis that decided it, and what happens next.

## When it stops

Write `Progress`: the step it reached, what it waits for, and what happens next. Set `waiting_on` to the person or the thing. Leave the status `in_progress`.

Report three lines: where it stopped, why, and who picks it up.

## When the task no longer holds

Hand it back to the owner. `Progress` names the step it reached and the reason, `waiting_on` is the owner, and the status stays `in_progress`. Say what the ticket would have to change to continue.

Rewriting the `Action` and splitting the task are the owner's moves.

## What this skill writes

Only `Result`, `Progress`, and `waiting_on`, plus the status it claims with. Every other section was written by the designer and stays as it is; `## Review` and `outcome` belong to the review that follows, not to this skill.

## What this skill does not do

- Run several tasks at once. That is `execute-all`.
- Review the result. That is `task-review`.
- Rewrite the `Action` or split the task.
