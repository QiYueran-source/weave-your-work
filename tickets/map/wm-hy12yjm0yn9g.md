---
schema: 1
id: wm-hy12yjm0yn9g
title: Resolve map skill audit findings
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-09T04:42:21Z
updated_at: 2026-11-09T04:42:21Z
parent: wm-wjwa9081hse1
soft_links:
  - wm-0xrcwvnrcc9k
---
## Target

The map skill family has consistent instructions for splitting, review, and dependencies.

Why: the audit found contradictory instructions and review failures that need decisions before any skill changes.

## Acceptance direction

The identified instruction conflicts have an agreed disposition, and resulting changes are checked against the agreed rules.

Review point: the discussion records the choices, each affected skill agrees with them, and the worked audit distinguishes validated behavior from untested paths.

## Decisions so far

- Record the number of tasks and one-line-per-task split plan in the discussion testimony, not a child list in the parent map; read actual children from the Waymark tree. (user confirmed)

## Not yet specified

- Decision to make: which parent writes belong to a first split and later splits?
  Why it matters: the split entry currently says only child tickets change, while the lifecycle requires parent status and split type changes.
- Decision to make: how should the review check actual child type, outcome, and evidence?
  Why it matters: Waymark validation does not certify skill compliance.
- Decision to make: how should ambiguous standards be routed before and during review?
  Why it matters: fog blocks review, while needs discussion can surface during review.
- Decision to make: what does a dependency edge mean when a later map uses an earlier output?
  Why it matters: current instructions differ on independent implementability and execution order.
- Decision to make: how do successive task layers cover the parent acceptance direction?
  Why it matters: partial splits are allowed while one reference asks each layer to produce every acceptance line.

## Out of scope

- Changing skill files before the design is settled and confirmed.
- Concurrent issue work.
