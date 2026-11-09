---
schema: 1
id: wm-w4f9edjaxatf
title: 'Fixture: write the sample label'
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-09T03:57:40Z
updated_at: 2026-11-09T03:58:01Z
closed_at: 2026-11-09T03:58:01Z
parent: wm-0hd7sq8bwa98
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `results/review-gap.md` containing the fictional sample label `sample-A`.

## Acceptance signal

The file exists and contains `sample-A`.

## Result

Wrote `results/review-gap.md`; it contains `sample-A`.

## Review

passed

- Goal: read `results/review-gap.md`; it exists and contains `sample-A`, as the acceptance signal requires.
- Convention: the note is a test fixture, and no laboratory work was performed.

## Boundaries

- This is a workflow fixture, not a laboratory record.
