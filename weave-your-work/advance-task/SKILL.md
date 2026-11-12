---
name: advance-task
description: "Advance one task to its end, or every ready task under a map as a batch, and stop only where something blocks it. Use when a person asks to work a task, to run a batch, or to continue what a previous run left in Progress."
family: track
invocation: user
---

# Advance task

Take a task from unclaimed to handed over, and keep working until it is done. The run stops only where something blocks it. This skill covers one task and a batch; the difference is how many are claimed at once and who judges each result.

## Before the work

Read the ticket: `Action`, `Acceptance signal`, `Boundaries`, `waiting_on`, and the front matter — `task_kind`, `reversibility`, `needs_human`. Read `## Review` too when it is there, and the map above it: its `Target` says why the task matters, its `Acceptance direction` says what the branch is for.

Stop and hand the ticket back, without writing, when any of these is true:

- the ticket is `closed`;
- `parent` is not a map, or the ticket carries a `dependencies` block;
- a section the kind requires is missing (`Failure recovery` for a `one_way` delivery, `Next step` for a probe), or `needs_human` disagrees with the `Person:` steps;
- `waiting_on` is set;
- `## Review` says `needs discussion` or `passed`, unless `Progress` records that `update` invalidated that verdict.

A required input the task needs is missing or unusable: leave the status unchanged, record the missing input in `Progress`, and tell the owner. If the missing input is a sibling task's output, hand the ticket back as a split error.

The first write of a run is preceded by one check of the tracker: `waymark validate --json` is healthy. Run it once per session, not once per write.

## Steps

1. **Claim.** `waymark start <id>`.
2. **Say one line**: where you are starting and what the first step is.
3. **Do the work** in the order `Action` gives, or in any order when it is prose. Do not stop between steps.
4. **Write `Result`**: for a delivery, where the deliverable is, how to open it, and what a person handed back; for a probe, the finding and the verdict. Remove `Progress` unless it carries an update invalidation marker.
5. **Hand the result to `task-review`** when the run is the owner's; otherwise stop at `Result` and report.

A question about how the work is done is not a stop: decide it and say what you decided in `Result`. Whether the result meets the acceptance signal is not this skill's question; `task-review` decides that one, and the run stops at the record it wrote.

## The batch

A batch is the tasks under one map that the run's owner owns, `open` or `in_progress`, with no `waiting_on`, no `needs_human`, and their inputs available. Skip a task that needs a sibling's output and hand it back as a split error.

- Claim every chosen task with `waymark start` before any of them goes out.
- Send each to its own worker with the same preflight this skill opens with; the worker stops at `Result`.
- Commit one task at a time, staged from the file list the worker reports. Read the collision list before dispatch: two tasks that edit one file do not run together.
- The main agent reviews each result; a worker does not close a task.

## Transformation

```
before: a task that is open, or in_progress with Progress
after:
- the task is in_progress, or closed by a review
- Result is written, with the evidence the signal names
- Progress records where it stopped, when it stopped
- waiting_on names a person and the answer they owe, or is empty
- no section written by the designer changed
```

## Hands off

- `task-review` for the verdict.
- The owner, for a task that no longer holds, and for a stop that is not a person wait.

## What this skill does not do

- Judge the result against its acceptance signal: that is `task-review`, and a run that wrote the result is not the judge of it.
- Change the `Action` or the `Acceptance signal`, or split the task.
- Run several tasks at once outside a batch, which is the section above.
