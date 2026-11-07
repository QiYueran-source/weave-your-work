---
schema: 1
id: wm-avc7a31tae33
title: Task execution skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-07T06:48:16Z
updated_at: 2026-11-07T09:17:42Z
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
- `task-review` is a child skill under the task execution map, because review is part of execution, not a peer of it (user confirmed). Its axes and verdicts are analysed later.
- Parallel work is not isolated by a git worktree: a task may act on an API or another system, where a branch isolates nothing and there is nothing to merge (user confirmed). The concrete isolation method is still open.
- An interrupt pauses only the task that hit the person; the rest of the batch keeps running, and the run ends with the list of what it waits on. A stop that concerns the map's direction stops the batch (user confirmed).
- `needs_human` tasks are never dispatched to a subagent, whether the whole task or only some steps need a person; the field cannot tell the two apart, so the rule is uniform. They run in a context that can interrupt (user confirmed).
- A task carries no dependency edges, only soft links. That rule belongs to task design and is not changed here (user confirmed).
- A batch defaults to every open, unclaimed task under the chosen map; the owner may name a subset. Dispatch claims all chosen tasks before sending any of them out, and caps how many run at once (default 4, user confirmed).
- A subagent receives its ticket id, the parent map's Target and Acceptance direction, its log path, the procedure to load, and the rule file paths. It may write its own ticket body, its log, and its own outputs. It may not write front matter, other tickets, or the map; it does not commit and does not close. It reports whether it finished, where it stopped and on whom, the files it touched, evidence links, and any question it could not answer (user confirmed).

## Not yet specified

- Whether the executor produces anything of its own beyond following the procedure: a checklist, a per-task plan, or nothing (open from the user's question).
- How parallel tasks are kept apart when they touch the same object.
- The shape of the task review: its axes, its verdicts, and how it relates to the owner's acceptance.
- Which questions execution answers itself, which go back to the owner, and what the log records.
- What interrupts a run, and how it resumes.
- Whether `task-execution` also carries the dispatch procedure or `task-dispatch` is its own skill under the same map.

## Out of scope

- Defining task body structure, kinds, reversibility, and acceptance signals.
- Deciding which tasks to create when splitting a map.
