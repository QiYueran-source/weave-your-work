---
schema: 1
id: wm-avc7a31tae33
title: Task execution skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-07T06:48:16Z
updated_at: 2026-11-07T09:12:34Z
parent: wm-87pgn0b75yy5
---
## Target

Design the task execution skill: define how an owner advances an executable task from start through its outcome.

## Acceptance direction

The task execution skill and its references define the execution lifecycle, and an example shows a task being advanced and its outcome recorded.

## Decisions so far

- The task owner is responsible for execution and may assign work to other people (user confirmed).
- AI handles the parts it can complete; work requiring a person is handed to a human (user confirmed).
- A human-required step is notified through a GitHub issue; the issue mechanism is designed by the communication category (user confirmed).
- The operating procedure for a task lives in this skill, not in the total Task skill (user confirmed).
- A task waiting on a person keeps status `in_progress`. The wait is recorded as a comment carrying the issue link, and a `waiting_on` field names the person or the thing it waits on (user confirmed).
- The skill is user-invoked, not model-invoked (user confirmed).
- When a task no longer holds, the executor stops and hands it back to the owner. The owner closes it and either reopens the work as a map or writes a new task. The executor does not rewrite the action and does not split the task (user confirmed).
- Two skills, cut by who runs them: `task-execution` advances one task in any context and never asks a question or interrupts; `task-dispatch` runs a map's tasks and owns dispatch, review, interrupt, and resume (user confirmed).
- A separate `task-review` skill, shaped like the map review skill (user confirmed).
- Parallel work is not isolated by a git worktree: a task may act on an API or another system, where a branch isolates nothing and there is nothing to merge (user confirmed). The concrete isolation method is still open.
- An interrupt pauses only the task that hit the person; the rest of the batch keeps running, and the run ends with the list of what it waits on. A stop that concerns the map's direction stops the batch (user confirmed).
- `needs_human` tasks are never dispatched to a subagent, whether the whole task or only some steps need a person; the field cannot tell the two apart, so the rule is uniform. They run in a context that can interrupt (user confirmed).
- A task carries no dependency edges, only soft links. That rule belongs to task design and is not changed here (user confirmed).

## Not yet specified

- What a subagent receives and reports, and what it may write.
- How parallel tasks are kept apart when they touch the same object.
- The shape of the task review: who runs it, its axes, its verdicts, and how it relates to the owner's acceptance.
- Where `task-review` hangs in the target tree.
- Which questions execution answers itself, which go back to the owner, and what the log records.
- What interrupts a run, and how it resumes.
- The concurrency limit, and how tasks are chosen for a batch.

## Out of scope

- Defining task body structure, kinds, reversibility, and acceptance signals.
- Deciding which tasks to create when splitting a map.
