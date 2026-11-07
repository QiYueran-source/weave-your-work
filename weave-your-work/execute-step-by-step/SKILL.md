---
name: execute-step-by-step
description: Advance one task step by step, pausing after each step for a person to look.
disable-model-invocation: true
---

# Execute step by step

Advance exactly one task and stop between steps so a person can look. This is the smallest unit of execution: the batch skill runs it over many tickets, and the one-pass skill runs it without the pauses.

## Before the first step

Read the ticket: `Action`, `Acceptance signal`, `Boundaries`, and the front matter — `task_kind`, `reversibility`, `needs_human`.

Read the map above it. Its `Target` says why the task is worth doing and its `Acceptance direction` says what the branch is for. A step done correctly against the wrong map is still wrong work.

Check that the task still holds. The action has to serve what the map wants, and nothing may have made it moot or impossible. When it does not hold, stop and hand it back to the owner: the owner closes it and either reopens the work as a map or writes a new task. Rewriting the action and splitting the task are the owner's moves.

Claim it with `waymark start`. A claimed task is `in_progress`, and the person who claimed it advances it.

A task that is already `in_progress` with `Progress` written was started by an earlier run. Read that section and continue from the step it names; an interrupted run leaves its state there and nowhere else.

Write `Progress` before the first step: one line for where the work stands, one for what happens next.

## The gates

A `one_way` task starts only after the confirmation its `Acceptance signal` names has landed. The signal names who confirms and what they confirm; ask that person, and record the confirmation as a comment.

A `Person:` step runs through a person. You hand it over and wait; you do not do it yourself.

Both gates hold whatever the size of the work.

## The loop

Work the `Action` in the order it gives when it is a numbered list, and in any order when it is prose.

After each step:

1. Update `Progress` in place.
2. Stop and show what changed: the step that finished, the evidence as it stands, and the step that is next.
3. Continue when the person says so.

`Progress` records state, not history: two lines, overwritten. What the work produced is a comment, and a probe's finding is `Result`.

## A step a person must do

Hand the person what the step needs and what to hand back. Record the wait: set `waiting_on` to the person or the thing, keep the task `in_progress`, and stop.

The answer comes back as a comment with a link to the evidence. Clear `waiting_on` when the answer arrives.

## A question the ticket leaves open

The ticket settles what the task promises, the steps settle how. A question about how — which tool, which order inside a step, where a scratch file goes — is yours to answer.

A question that would change what the task promises is not: what counts as done, where the deliverable goes, whether a person checks it. Stop and ask.

## Finishing

Read the `Acceptance signal` against the evidence. The signal is a standard, not a mood: it says what evidence shows the result is there, and the result either meets it or does not.

Write the evidence as a comment: where the deliverable is, how to open it, and who checked it. On a probe, write `Result` and `Next step` into the body; `Next step` carries both outcomes.

Remove `Progress`. The run is over, and a closed ticket keeps only what the task promised.

Hand the task to `task-review`. A passing verdict closes it. Anything else comes back here, and the fix is only what the review named.

## What this skill leaves behind

- `Progress` while the run lasts, gone at the end.
- A comment carrying the evidence.
- `Result` and `Next step` on a probe.
- `waiting_on` while a person holds the work.

## What this skill does not do

- Run several tasks at once. That is `task-dispatch`.
- Review the result. That is `task-review`.
- Rewrite the Action or split the task. A task that no longer holds goes back to its owner.
