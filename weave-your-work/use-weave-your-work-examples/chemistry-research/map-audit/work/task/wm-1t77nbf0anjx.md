---
schema: 1
id: wm-1t77nbf0anjx
title: 'Fixture: check whether the original measurement exists'
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-09T04:00:57Z
updated_at: 2026-11-09T04:01:05Z
closed_at: 2026-11-09T04:01:05Z
parent: wm-ze97pcxt8e44
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: probe
---
## Action

Check the audit fixture's stated input for an original recorded measurement.

## Acceptance signal

The result states whether the fixture includes an original measurement, citing the fixture's decision.

## Result

No original measurement exists: the parent map's fixture decision says the invented sample was defined without one. Return this finding to the parent; a recorded value cannot be recovered.

## Review

passed

- Goal: the result answers the question and cites the parent map's fixture decision, as required by the acceptance signal.
- Convention: no measurement was fabricated.

## Next step

- If an original measurement exists, record where it can be read.
- If no original measurement exists, return the finding to the parent for review of the target.

## Boundaries

- Do not fabricate a measurement.
