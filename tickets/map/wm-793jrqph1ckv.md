---
schema: 1
id: wm-793jrqph1ckv
title: Task design skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-07T06:48:08Z
updated_at: 2026-11-07T07:04:57Z
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
- Task body has three required content fields: Action, Verifiable result, and Acceptance signal. Boundaries is optional and is written when needed to prevent scope growth. Kind, Reversibility, and `needs_human` are separate task properties rather than body fields.
- Action and Verifiable result remain separate: one says what work to do; the other states what inspectable result the work leaves.
- Task design adopts the general checks that a task is independently executable and its acceptance signal is observable and falsifiable. It does not adopt `to-tickets`' engineering-specific tracer-bullet slicing rule.

## Not yet specified

- How delivery and probe task definitions differ.
- Reversibility values and what they change.
- How acceptance signals differ by task kind.
- The precise meaning and design constraints of `needs_human`.
- Whether task tickets need dependency declarations at design time; dependency behavior is designed under task execution.

## Out of scope

- Deciding which tasks to create when splitting a map.
- Claiming, execution, dependency handling, and closing tasks.
