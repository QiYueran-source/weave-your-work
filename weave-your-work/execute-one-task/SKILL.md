---
name: execute-one-task
description: Advance one task to its end, stopping only where something blocks it.
disable-model-invocation: true
---

# Execute one task

Take one task from unclaimed to handed over, and keep working until it is done. The run stops only where something blocks it.

## Before the work

Read the ticket: `Action`, `Acceptance signal`, `Boundaries`, `waiting_on`, and the front matter — `task_kind`, `reversibility`, `needs_human`. Read `## Review` too when it is there.

If the ticket is `closed`, stop. A closed task is changed through `update`, not started again.

If `parent` is not a map, or the ticket carries a `dependencies` block, stop and hand the ticket back. Waymark accepts both and `validate` does not flag them; the task layer does not.

Check the body against its kind: `Action` and `Acceptance signal` are there; `Failure recovery` is there for `one_way`; `Next step` is there for a probe; `needs_human` agrees with the `Person:` steps. A missing section or a mismatch is a design defect: stop and hand the ticket back. The executor does not write the missing section.

If `waiting_on` is set, stop. The owner clears it after handling the answer; the run does not guess that the answer arrived.

If `## Review` says `needs changes`, fix only the gap it names. If it says `needs discussion`, stop and wait on the person. If it says `passed` or `wrong direction`, the ticket should already be closed; stop.

Read the map above it. Its `Target` says why the task matters; its `Acceptance direction` says what the branch is for. Work done correctly against the wrong map is still wrong work.

Check that the task still holds: the action still serves what the map wants, and nothing has made it moot or impossible.

Claim it with `waymark start`. Say one line about where you are starting and what the first step is, then work.

## The five things that stop a run

- The `one_way` confirmation has not landed. The `Acceptance signal` names who confirms and what they confirm.
- A `Person:` step needs a person.
- A question would change what the task promises: what counts as done, where the deliverable goes, whether a person checks it.
- The task no longer holds.
- The work lacks an input or a permission it needs.

If the missing input is produced by another task or map, that is a split error, not a wait: hand the ticket back and say which producer it needs. Do not put a task or map in `waiting_on`. If a person must supply or confirm the input, wait on that person.

The waits write `Progress`, set `waiting_on` to the person, and leave the task `in_progress`. The fourth is a hand-back, below. A `needs_human` task stays `needs_human: true`; the owner releases it by clearing `waiting_on`, not by changing the field.

A question about how the work is done is not on this list. Decide it, and say what you decided in `Result`.

## Doing the work

Work the `Action` in the order it gives when it is a numbered list, and in any order when it is prose. Do not stop between steps.

## Finishing

Read the `Acceptance signal` against the evidence. The signal is a standard, not a mood: it says what evidence shows the result is there, and the result either meets it or does not.

Write `Result`: for a delivery, where the deliverable is, how to open it, and what a person handed back; for a probe, the finding and the verdict. Remove `Progress` if an earlier stop left one.

Then invoke `task-review` when the run is the owner's. A run that is not the owner's stops at `Result` and reports; the owner reviews and closes. The review reads the same signal against the same evidence, writes `## Review`, and decides: close the ticket, send the task back with the gap named, or stop it on the owner. A task that comes back has only the named gap to fix.

In a batch, the main agent reviews instead: stop at `Result`, report, and let `execute-all` carry the judgment.

Report three lines: what the work produced, the verdict and the axis that decided it, and what happens next.

## When it stops

Write `Progress`: the step it reached, what it waits for, and what happens next. Set `waiting_on` to the person. Leave the status `in_progress`.

Report three lines: where it stopped, why, and who picks it up.

## When the task no longer holds

Write `Result` with the reason: the action no longer serves the map, or the task cannot be done as written. Keep `Progress` if the run stopped, and set `waiting_on` to the owner. Then invoke `task-review` when the run is the owner's; otherwise stop at `Result` and hand it to the owner. The review's `wrong direction` verdict closes the task as a failed attempt, and its `needs discussion` verdict waits on the owner. Do not leave the ticket open without a review.

Rewriting the `Action`, splitting the task, and changing a task that is already closed are the owner's moves. The last one has its own rules: `update`.

## What this skill writes

Only `Result`, `Progress`, and `waiting_on`, plus the status it claims with. Every other section was written by the designer and stays as it is; `## Review` and `outcome` belong to the review that follows, not to this skill. When it replaces the body, it includes the existing `## Review` unchanged; only the review replaces that section.

## What this skill does not do

- Run several tasks at once. That is `execute-all`.
- Review the result. That is `task-review`.
- Rewrite the `Action` or split the task. That is the owner's, and changing a closed task is `update`.
