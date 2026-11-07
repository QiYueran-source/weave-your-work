---
schema: 1
id: wm-avc7a31tae33
title: Task execution skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-07T06:48:16Z
updated_at: 2026-11-07T07:41:31Z
parent: wm-87pgn0b75yy5
---
## Target

Design the task execution skill: define how an owner advances an executable task from start through its outcome.

## Acceptance direction

The task execution skill and its references define the execution lifecycle, and an example shows a task being advanced and its outcome recorded.

## Decisions so far

- The task owner is responsible for execution and may assign work to other people (user confirmed). The assignment and authority rules still need design.
- AI handles the parts it can complete; work requiring a person is handed to a human (user confirmed).
- A human-required step is notified through a GitHub issue; the issue mechanism is designed by the communication category and the concrete implementation comes later (user confirmed).
- The operating procedure for a task lives in this skill, not in the total Task skill (user confirmed).

## Not yet specified

- Claiming and starting work.
- How delegated work is assigned and tracked, and who may advance a task.
- The task status while it waits for a person, and how the wait is recorded.
- The notification content and how the issue relates to the task ticket.
- How the human result is written back and how the owner accepts it.
- How dependencies affect execution.
- How results are recorded and tasks are closed, failed, or archived.

## Out of scope

- Defining task body structure, kinds, reversibility, and acceptance signals.
- Deciding which tasks to create when splitting a map.
