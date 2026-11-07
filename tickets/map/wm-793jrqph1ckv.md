---
schema: 1
id: wm-793jrqph1ckv
title: Task design skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-07T06:48:08Z
updated_at: 2026-11-07T06:59:59Z
parent: wm-87pgn0b75yy5
---
## Target

Design the task design skill: define how an executable task is specified and made verifiable.

## Acceptance direction

The task design skill and its references define how to write delivery and probe tasks, including reversibility, acceptance signals, and human-required work; examples show both kinds.

## Decisions so far

- The task design skill has three references: `body.md` for the required task content; `kinds.md` for delivery and probe task types; and `properties.md` for reversibility, `needs_human`, and other task fields (user confirmed).
- Task kinds are delivery and probe (user confirmed).
- `needs_human` is a separate boolean property, not a task kind (user confirmed).
- AI handles the parts it can complete; work that requires a person is handed to a human (user confirmed). Task execution will define how the handoff is blocked, notified, and resumed.
- Task design defines the task specification; it does not decide which tasks to create when splitting a map (user confirmed).

## Not yet specified

- Task body structure and required information.
- How delivery and probe task definitions differ.
- Reversibility values and what they change.
- How acceptance signals are stated for each task kind.
- The meaning and design constraints of `needs_human`.

## Out of scope

- Deciding which tasks to create when splitting a map.
- Claiming, execution, dependency handling, and closing tasks.
