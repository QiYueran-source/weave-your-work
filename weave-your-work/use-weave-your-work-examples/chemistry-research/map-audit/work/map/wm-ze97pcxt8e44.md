---
schema: 1
id: wm-ze97pcxt8e44
title: 'Fixture: recover an absent invented measurement'
category: map
status: closed
owner: frank
creator: frank
created_at: 2026-11-09T04:00:48Z
updated_at: 2026-11-09T04:01:17Z
closed_at: 2026-11-09T04:01:05Z
parent: wm-91h5dy4pmtem
soft_links:
  - wm-1fqvcyvd3kvn
custom_fields:
  outcome: failed
  split_as: task
---
## Target

A reader can recover a measurement that was deliberately never recorded for an invented sample.

Why: this fixture tests a target that cannot be reached from the available fictional inputs.

## Acceptance direction

A note contains the original measurement exactly as recorded.

Review point: `results/unreachable-fixture.md` identifies the original measurement for the invented sample; all children are complete.

## Decisions so far

- No original measurement exists: the fictional sample was defined without one. (audit fixture)

## Not yet specified

(none; the absent input is known)

## Out of scope

- Fabricating a real or synthetic measurement as if it were recovered.
