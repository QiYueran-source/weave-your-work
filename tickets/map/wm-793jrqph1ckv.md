---
schema: 1
id: wm-793jrqph1ckv
title: Task design skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-07T06:48:08Z
updated_at: 2026-11-07T07:12:46Z
parent: wm-87pgn0b75yy5
---
## Target

Design the task design skill: define how an executable task is specified and made verifiable.

## Acceptance direction

The task design skill and its references define how to write delivery and probe tasks, including reversibility, acceptance signals, human-required work, and failure recovery; examples show both kinds.

## Decisions so far

- The task design skill has three references: `body.md` for task content; `kinds.md` for delivery and probe task types; and `properties.md` for reversibility, `needs_human`, and other task fields (user confirmed).
- Task design defines the task specification; it does not decide which tasks to create when splitting a map. `split-to-task` decides whether and how work should split into tasks based on semantic groupings, then references task design when creating them (user confirmed).
- Task body content is added as needed; no content field is mandatory by default, to avoid making simple tasks unnecessarily complex. This applies to maps as well as tasks (user confirmed).
- A task must be classified as delivery or probe using `task_kind` (user confirmed).
- A delivery task must state a clear output; a probe task must state a clear conclusion (user confirmed).
- Every task must state an acceptance signal, kept as concise as the task allows (user confirmed).
- Every task must state reversibility as `one_way` or `two_way` (user confirmed).
- `needs_human` is a separate boolean property, not a task kind. AI handles the parts it can complete; work that requires a person is handed to a human. When `needs_human` is true, Action identifies which details require human participation (user confirmed). Task execution defines how the handoff is blocked, notified, and resumed.
- `Failure recovery` is included when needed, not mandatory. When included, it states what to do after failure even if the action cannot be undone (user confirmed).
- Delivery recovery describes what to do when the output is missing or unacceptable. Probe recovery describes the next step for both outcomes: the hypothesis holds or it does not (user confirmed).
- Failure recovery and Reversibility answer different questions: reversibility describes whether the action can be undone; failure recovery describes what to do after failure (user confirmed).
- Task design adopts the general checks that a task is independently executable and its acceptance signal is observable and falsifiable. It does not adopt `to-tickets`' engineering-specific tracer-bullet slicing rule.
- The task reference must define the writing form for every section, as the map body reference does (user confirmed).

## Not yet specified

- The exact sections of `body.md` and the writing form for each section.
- How delivery and probe task definitions differ beyond output versus conclusion and their recovery paths.
- How reversibility changes task design and what `one_way` requires before starting.
- The exact recovery detail required for delivery failure and each probe outcome.
- Whether task tickets need dependency declarations at design time; dependency behavior is designed under task execution.

## Out of scope

- Deciding which tasks to create when splitting a map.
- Claiming, execution, dependency handling, and closing tasks.
