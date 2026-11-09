---
schema: 1
id: wm-whds7wwb5fk7
title: 'Fixture: identify an invented sample'
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-09T03:58:55Z
updated_at: 2026-11-09T03:59:15Z
closed_at: 2026-11-09T03:59:15Z
parent: wm-zr0cemer1zpq
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `results/direct-leaf.md` naming the fictional label `sample-B` and saying it is invented for this audit.

## Acceptance signal

The file exists, names `sample-B`, and says it is invented for the audit.

## Result

Wrote `results/direct-leaf.md`, naming `sample-B` as invented for the audit.

## Review

passed

- Goal: the note exists and contains the label and limitation required by the acceptance signal.
- Convention: the note is a workflow fixture and contains no experimental claim.

## Boundaries

- This is a workflow fixture, not an experiment.
