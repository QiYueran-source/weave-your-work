---
schema: 1
id: wm-793jrqph1ckv
title: Task design skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-07T06:48:08Z
updated_at: 2026-11-07T07:30:39Z
parent: wm-87pgn0b75yy5
---
## Target

Design the task design skill: define how an executable task is specified and made verifiable.

## Acceptance direction

The task design skill and its references define how to write delivery and probe tasks, including reversibility, acceptance signals, human-required work, and failure recovery; examples show both kinds.

## Decisions so far

- The task design skill has two references: `body.md` for task content and `properties.md` for task fields. `kinds.md` is dropped; the delivery and probe difference lives in `body.md` (user confirmed).
- Task design defines the task specification; it does not decide which tasks to create when splitting a map. `split-to-task` decides whether and how work should split into tasks, then references task design when creating them (user confirmed).
- A task must be classified as delivery or probe using `task_kind` (user confirmed).
- A task carries exactly one complete action: one goal, which may take several steps (user confirmed).
- Verifiable result is not a separate section. The action states the work, and the acceptance signal states how the result is checked (user confirmed).
- `body.md` has a shared part plus one part per task kind (user confirmed).
- Delivery body sections: Action, Acceptance signal, Failure recovery. Boundaries is optional (user confirmed).
- A delivery task must state what it produces; the Action says what work is done and what it delivers (user confirmed).
- A probe task must state the hypothesis or question it verifies; the Action says what is checked and how (user confirmed).
- `reversibility` stays a required front matter field with `one_way` and `two_way` values (user confirmed).
- Failure recovery is required for a `one_way` task and optional for a `two_way` task. It states the consequence of failure and the remediation (user confirmed).
- Probe body sections: Action, Acceptance signal, `Result`, and a separate section for the next step under each outcome (user confirmed). Boundaries is optional. Failure recovery is added only when the check could not be completed and a retry or abandonment needs recording.
- `Result` records what the check found and whether the hypothesis holds. When the check was not completed, it says so and gives the reason (user confirmed).
- A probe task is done when the check is complete; its acceptance signal distinguishes the possible verification results rather than requiring a particular one (user confirmed).
- Unused sections are omitted entirely, not written as `none` (user confirmed).
- Every section in `body.md` is described with its purpose, its format, and a directly usable example, following the map body reference (user confirmed).
- `properties.md` covers only `task_kind`, `reversibility`, and `needs_human`. Waymark's core fields are left to `waymark --help` instead of being repeated (user confirmed).
- `needs_human` is a separate boolean property, not a task kind. AI handles the parts it can complete; work that requires a person is handed to a human. Whether to set it is judged by AI and handled by `split-to-task` when the task is created (user confirmed). Task execution defines how the handoff is blocked, notified, and resumed.
- When `needs_human` is true, the action section identifies which steps require human participation (user confirmed).
- For `one_way`, task design requires the task to name who confirms and what they confirm. The actual block before starting is enforced by task execution (user confirmed).
- Task design does not require dependency declarations. Dependencies belong to execution order and are written to front matter by `split-to-task` or the owner when known (user confirmed).
- Task design adopts the general checks that a task is independently executable and its acceptance signal is observable and falsifiable. It does not adopt `to-tickets`' engineering-specific tracer-bullet slicing rule.

## Not yet specified

- The name of the probe section that holds the next step under each outcome.
- Whether that section is required for every probe task.
- What a good example looks like for each section, and whether the example set needs a probe task alongside the existing delivery example.

## Out of scope

- Deciding which tasks to create when splitting a map.
- Claiming, execution, dependency handling, and closing tasks.
