---
schema: 1
id: wm-793jrqph1ckv
title: Task design skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-07T06:48:08Z
updated_at: 2026-11-07T07:25:13Z
parent: wm-87pgn0b75yy5
---
## Target

Design the task design skill: define how an executable task is specified and made verifiable.

## Acceptance direction

The task design skill and its references define how to write delivery and probe tasks, including reversibility, acceptance signals, human-required work, and failure recovery; examples show both kinds.

## Decisions so far

- The task design skill has two references: `body.md` for task content and `properties.md` for task fields. `kinds.md` is dropped; the delivery and probe difference lives in `body.md` (user confirmed).
- Task design defines the task specification; it does not decide which tasks to create when splitting a map. `split-to-task` decides whether and how work should split into tasks, then references task design when creating them (user confirmed).
- Task body content is added as needed; no content section is mandatory by default, to avoid making simple tasks unnecessarily complex. This applies to maps as well as tasks (user confirmed).
- A task must be classified as delivery or probe using `task_kind` (user confirmed).
- A task carries exactly one complete action: one goal, which may take several steps (user confirmed).
- Verifiable result is not a separate section. The action states the work, and the acceptance signal states how the result is checked (user confirmed).
- `body.md` has a shared part plus one part per task kind (user confirmed).
- Delivery body sections: Action, Acceptance signal, Failure recovery. Boundaries is optional (user confirmed).
- Failure recovery states whether the action is reversible, the consequence of failure, and the remediation (user confirmed).
- Probe body sections: Action, Acceptance signal, and one section for the result and whether the hypothesis holds (user confirmed).
- A probe task is done when the check is complete; its acceptance signal distinguishes the possible verification results rather than requiring a particular one (user confirmed).
- `needs_human` is a separate boolean property, not a task kind. AI handles the parts it can complete; work that requires a person is handed to a human. Whether to set it is judged by AI and handled by `split-to-task` when the task is created (user confirmed). Task execution defines how the handoff is blocked, notified, and resumed.
- When `needs_human` is true, the action section identifies which steps require human participation (user confirmed).
- For `one_way`, task design requires the task to name who confirms and what they confirm. The actual block before starting is enforced by task execution (user confirmed).
- Task design does not require dependency declarations. Dependencies belong to execution order and are written to front matter by `split-to-task` or the owner when known (user confirmed).
- Task design adopts the general checks that a task is independently executable and its acceptance signal is observable and falsifiable. It does not adopt `to-tickets`' engineering-specific tracer-bullet slicing rule.
- The task reference must define the writing form for every section, as the map body reference does (user confirmed).

## Not yet specified

- Whether reversibility stays a required front matter field or is only stated in the body's Failure recovery section. The two currently overlap.
- Whether probe also gets optional Boundaries and Failure recovery sections.
- The name of the probe section that holds the result and the hypothesis fit.
- Whether an unused section is omitted entirely or written as none.
- What `properties.md` holds now that reversibility may live in the body.

## Out of scope

- Deciding which tasks to create when splitting a map.
- Claiming, execution, dependency handling, and closing tasks.
