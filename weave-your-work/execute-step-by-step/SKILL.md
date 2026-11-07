---
name: execute-step-by-step
description: Advance one task step by step, pausing after each step for a person to look.
disable-model-invocation: true
---

# Execute step by step

Advance exactly one task and stop between steps so a person can look. This is the smallest unit of execution: `task-dispatch` runs it over many tickets, and `execute-all` runs it without the pauses.

## Before the first step

Read the ticket: `Action`, `Acceptance signal`, `Boundaries`, and the front matter — `task_kind`, `reversibility`, `needs_human`.

Read the map above it. Its `Target` says why the task is worth doing; its `Acceptance direction` says what the branch is for. A step done correctly against the wrong map is still wrong work.

Check that the task still holds. The action has to serve what the map wants, and nothing may have made it moot or impossible. When it no longer holds, hand it back — the last section says how.

Claim it with `waymark start`. A claimed task is `in_progress`, and the person who claimed it advances it.

A task already `in_progress` with a `Progress` section was started by an earlier run. Read that section and continue from the step it names; the ticket is the only place that state survives.

Write `Progress`: one line for where the work stands, one for what happens next.

## The gates

A `one_way` task starts only after the confirmation its `Acceptance signal` names has landed. The signal names who confirms and what they confirm; ask that person and wait.

A `Person:` step runs through a person. You hand it over and wait; you do not do it yourself.

Both gates hold whatever the size of the work.

## The loop

Work the `Action` in the order it gives when it is a numbered list, and in any order when it is prose.

After each step, update `Progress` and stop with one short message: what changed, and the step that is next. Continue when the person says so.

## A step a person must do

Hand the person what the step needs and what to hand back. Set `waiting_on` to the person or the thing, say in `Progress` what it waits for and link the issue, and keep the task `in_progress`.

What they hand back is written into `Result`, with a link to it. Clear `waiting_on` when the answer arrives.

## A question the ticket leaves open

The ticket settles what the task promises; the steps settle how. A question about how is yours: which tool, which order inside a step, where a scratch file goes.

A question that would change what the task promises is not: what counts as done, where the deliverable goes, whether a person checks it. Stop and ask.

## Finishing

Read the `Acceptance signal` against the evidence. The signal is a standard, not a mood: it says what evidence shows the result is there, and the result either meets it or does not.

Write `Result`: for a delivery, where the deliverable is and how to open it, and what a person handed back; for a probe, the finding and the verdict.

Remove `Progress` and stop. The person sees what the task produced before it goes to review; hand it to `task-review` on their word. Only a passing verdict closes the ticket, and anything else comes back here with the fix limited to what the review named.

## Handing a task back

A task that no longer holds goes back to its owner. Write `Progress` with the step it reached and the reason, set `waiting_on` to the owner, leave the status `in_progress`, and say what the ticket would have to change to continue.

## What this skill leaves behind

- `Result`: what the work produced or found.
- `waiting_on` while a person holds the work.
- `Progress` only while the run lasts.
- The status: `in_progress` until a review passes, or handed back to the owner.

## What this skill does not do

- Run several tasks at once. That is `task-dispatch`.
- Review the result. That is `task-review`.
- Rewrite the Action or split the task. A task that no longer holds goes back to its owner.
