---
schema: 1
id: wm-793jrqph1ckv
title: Task design skill
category: map
status: in_progress
owner: frank
creator: frank
created_at: 2026-11-07T06:48:08Z
updated_at: 2026-11-07T07:45:40Z
parent: wm-87pgn0b75yy5
---
## Target

Design the task design skill: define how an executable task is specified and made verifiable.

## Acceptance direction

All children are complete and no further child is needed: the task design skill's entry routes to its three references, the references are written, and the delivery and probe examples can be rebuilt from them.

## Children

- [Write the task skill entry](tickets/task/wm-qamw233hhpe3.md): SKILL.md entry and routing.
- [Write the task body reference](tickets/task/wm-6sfjje8w0688.md): shared content rules plus the delivery and probe section lists.
- [Write the task properties reference](tickets/task/wm-0sk8rrhz6gsv.md): task_kind, reversibility, and needs_human.
- [Task kind reference](tickets/map/wm-rx7newew73y5.md): choosing the kind and what failure means for each.

## Decisions so far

- Task design owns three references: `body.md` for section content, `kind.md` for choosing the kind and its failure meaning, and `properties.md` for the custom fields (user confirmed).
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
- Probe body sections: Action, Acceptance signal, `Result`, and `Next step`. Boundaries is optional. Failure recovery is added only when the check could not be completed and a retry or abandonment needs recording (user confirmed).
- `Result` records what the check found and whether the hypothesis holds. It is written after the check by the task owner; when the check was not completed, it says so and gives the reason (user confirmed).
- `Next step` is required for every probe task and covers both outcomes: what to do when the hypothesis holds and what to do when it does not (user confirmed).
- A probe task is done when the check is complete; its acceptance signal distinguishes the possible verification results rather than requiring a particular one (user confirmed).
- Unused sections are omitted entirely, not written as `none` (user confirmed).
- Every section in `body.md` is described with its purpose, its format, and a directly usable example, following the map body reference (user confirmed).
- `properties.md` covers only `task_kind`, `reversibility`, and `needs_human`. Waymark's core fields are left to `waymark --help` instead of being repeated (user confirmed).
- `reversibility` is declared in waymark as an optional string; `needs_human` is declared as an optional boolean. Accepted values live in `properties.md`, not in the config (user confirmed).
- `needs_human` is a separate boolean property, not a task kind. Whether to set it is judged by AI and handled by `split-to-task` when the task is created (user confirmed).
- Human participation is marked inside the Action with the prefix `Person:` at the start of the step. No separate `Human step` section is added (user confirmed).
- The field and the body must agree: when `needs_human` is true at least one Action step carries the `Person:` prefix, and when it is false no step does (user confirmed).
- A task is accepted by its owner. Acceptance is not limited to a non-executor (user confirmed).
- Evidence for a human step is written back as a comment with a link to the evidence. A probe task also records the finding in `Result` (user confirmed).
- Evidence must be checkable by someone else; the acceptance signal stays observable and falsifiable (user confirmed).
- For `one_way`, task design requires the task to name who confirms and what they confirm. The actual block before starting is enforced by task execution (user confirmed).
- Task design does not require dependency declarations. Dependencies belong to execution order and are written to front matter by `split-to-task` or the owner when known (user confirmed).
- Task design adopts the general checks that a task is independently executable and its acceptance signal is observable and falsifiable. It does not adopt `to-tickets`' engineering-specific tracer-bullet slicing rule.
- The example set has two files with parallel names: `task-example-delivery.md` and `task-example-probe.md`. The existing `task-example.md` becomes the delivery example and is rewritten to the new section list (user confirmed).

## Not yet specified

(none; the design is settled and split into children)

## Out of scope

- Deciding which tasks to create when splitting a map.
- Claiming, execution, dependency handling, and closing tasks.
