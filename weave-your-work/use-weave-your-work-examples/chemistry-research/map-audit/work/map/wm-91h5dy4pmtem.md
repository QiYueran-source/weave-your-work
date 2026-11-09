---
schema: 1
id: wm-91h5dy4pmtem
title: Audit exceptional map review scenarios
category: map
status: in_progress
owner: frank
creator: frank
created_at: 2026-11-09T03:56:46Z
updated_at: 2026-11-09T03:57:32Z
custom_fields:
  split_as: submap
---
## Target

A reader can inspect separate records of exceptional map-review scenarios and their outcomes.

Why: the review rules need examples that expose failures and changed child states, not just a passing tree.

## Acceptance direction

Each scenario is recorded with its verdict or explicit unresolved question.

Review point: the scenario maps and tasks show the review decisions, ticket changes, and final or waiting states without claiming real experiments.

## Decisions so far

- Use invented document fixtures and separate child maps for each scenario. (second-round audit plan)
- Keep the first-round audit root unchanged. (user confirmed)

## Not yet specified

(none; the scenario layer is settled)

## Out of scope

- Real chemical experiments or production conclusions.
