---
schema: 1
id: wm-793jrqph1ckv
title: Task design skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-07T06:48:08Z
updated_at: 2026-11-07T07:10:33Z
parent: wm-87pgn0b75yy5
---
## Target

Design the task design skill: define how an executable task is specified and made verifiable.

## Acceptance direction

The task design skill and its references define how to write delivery and probe tasks, including reversibility, acceptance signals, human-required work, and failure recovery; examples show both kinds.

## Decisions so far

- The task design skill has three references: `body.md` for the required task content; `kinds.md` for delivery and probe task types; and `properties.md` for reversibility, `needs_human`, and other task fields (user confirmed).
- Task kinds are delivery and probe (user confirmed).
- `needs_human` is a separate boolean property, not a task kind (user confirmed).
- AI handles the parts it can complete; work that requires a person is handed to a human (user confirmed). Task execution will define how the handoff is blocked, notified, and resumed.
- Task design defines the task specification; it does not decide which tasks to create when splitting a map (user confirmed).
- Task body content is added as needed; no field is mandatory by default, to avoid making simple tasks unnecessarily complex. This applies to maps as well as tasks (user confirmed).
- Action and Verifiable result remain distinct concepts: one says what work to do; the other states what inspectable result the work leaves.
- Task design adopts the general checks that a task is independently executable and its acceptance signal is observable and falsifiable. It does not adopt `to-tickets`' engineering-specific tracer-bullet slicing rule.
- A delivery task must state a clear output; a probe task must state a clear conclusion (user confirmed).
- Reversibility uses `one_way` and `two_way` values (user confirmed).
- `needs_human: true` means the task includes work that requires a person; Action must identify which details require human participation (user confirmed). Task execution defines the handoff procedure.
- `Failure recovery` is included when needed, not mandatory. When included, it states what to do after failure even if the action cannot be undone (user confirmed).
- Delivery recovery describes what to do when the output is missing or unacceptable. Probe recovery describes the next step for both outcomes: the hypothesis holds or it does not (user confirmed).
- Failure recovery and Reversibility answer different questions: reversibility describes whether the action can be undone; failure recovery describes what to do after failure (user confirmed).

## Not yet specified

- How delivery and probe task definitions differ beyond output versus conclusion.
- How reversibility changes the task design and what `one_way` requires before starting.
- The exact recovery detail required for delivery failure and each probe outcome.
- How acceptance signals differ by task kind.
- Whether task tickets need dependency declarations at design time; dependency behavior is designed under task execution.

## Out of scope

- Deciding which tasks to create when splitting a map.
- Claiming, execution, dependency handling, and closing tasks.
