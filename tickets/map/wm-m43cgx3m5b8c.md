---
schema: 1
id: wm-m43cgx3m5b8c
title: 'Skill set v2: records defined once, actions on a mainline'
category: map
status: closed
owner: frank
creator: frank
created_at: 2026-11-11T16:06:21Z
updated_at: 2026-11-11T16:06:50Z
closed_at: 2026-11-11T16:06:50Z
custom_fields:
  split_as: task
---
## Target

The skill set is organised as records defined once and actions that follow a mainline, and every rule it states is decided by a command, a script, or a review.

Why: the first set wrote each record's shape into the skills that acted on it and pointed them at one another for the parts they shared. That produced reference loops, two homes for one rule, and constraint text that cost more than the work it guarded.

Source: the person, in the v2 design discussion on 2026-11-11, after comparing the set with Matt's.

## Acceptance direction

All children are complete and no further children are needed.

Review point: every record is defined once under a skill's `res/`; every action names its steps and its transformation; `scripts/check-references.mjs` reports no finding; `scripts/check-records.mjs` reports no new finding; the install lists every skill with valid front matter.

## Decisions so far

- A record is defined once, under the skill that owns that record kind; what every record shares lives under `waymark/res/`. (user confirmed 2026-11-11)
- A resource defines and never runs: no step procedure, at most 60 lines, assertions with the check that decides each. (user confirmed 2026-11-11)
- An action states when it runs, its steps, its writing as before/after, and what it hands off. It never describes what a record contains. (user confirmed 2026-11-11)
- The mainline is five actions: split, fog-explore, advance-task, task-review, map-review. Everything else is auxiliary and never adds a step to the line. (user confirmed 2026-11-11)
- Recursion is the line itself: a child map re-enters at split. No depth is set in advance; a map takes children while its acceptance direction holds something one task cannot show. (user confirmed 2026-11-11)
- `submap` is a map: it has no resource or action of its own, and split produces it. (user confirmed 2026-11-11)
- A handoff is a resource (five sections) and an action (write the file). A separate dispatch action is not in this version. (user confirmed 2026-11-11)
- Installable parts live under `setup/`; no other skill carries a bundle. (user confirmed 2026-11-11)
- Setup follows the configuration-first shape: explore, present, confirm, write text; installs are consolidated in one guide. (user confirmed 2026-11-11)
- Field checking runs once at the entry of a stretch of work; `--dry-run` is used only on a write that reaches a record the run does not own. (user confirmed 2026-11-11)

## Not yet specified

- Decision to make: whether the worked examples' inner ticket stores are migrated to the v2 rules.
  Why it matters: they are read as examples, and their records predate every assertion this set now states.

## Out of scope

- Rewriting the tracker's rules. The records' fields are unchanged; only where they are defined moved.
- Removing v1 from the project. The first set stays on the parent branch.

## Review

passed
- Goal: the map's single child is closed, and its `Result` carries the four commands with their output. Every line of the review point is answered by that record: records defined once under `res/`, actions with their transformations, both check scripts reporting zero, and an install listing 22 skills.
- Convention: the body follows the six-section shape, the child is a task and `split_as` says `task`, the body holds no children index, and every write went through waymark.
