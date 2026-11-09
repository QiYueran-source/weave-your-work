---
schema: 1
id: wm-7krjnd07cc2d
title: 'Fixture: add the missing invented-data limitation'
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-09T03:58:16Z
updated_at: 2026-11-09T03:58:38Z
closed_at: 2026-11-09T03:58:38Z
parent: wm-0hd7sq8bwa98
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Add a sentence to `results/review-gap.md` stating that `sample-A` is invented for workflow testing.

## Acceptance signal

The note retains `sample-A` and explicitly says it is invented for workflow testing.

## Result

Added the limitation to `results/review-gap.md`.

## Review

passed

- Goal: read the note; it retains `sample-A` and says the label is invented for workflow testing.
- Convention: only the missing limitation was added.

## Boundaries

- Change only the missing limitation in the fixture note.
