---
schema: 1
id: wm-x1bjza36xwqh
title: Design the synthetic comparison protocol
category: map
status: closed
owner: frank
creator: frank
created_at: 2026-11-09T03:29:28Z
updated_at: 2026-11-09T03:43:28Z
closed_at: 2026-11-09T03:37:30Z
parent: wm-98h7n5a01bh0
soft_links:
  - wm-ev0yh7xh7681
custom_fields:
  split_as: task
---
## Target

The synthetic report uses a protocol that names its comparison fields, fictional data source, and decision threshold.
Why: the report needs a visible basis that a reviewer can trace without treating synthetic values as experimental evidence.

## Acceptance direction

All children are complete and no further children are needed.

Review point: the protocol states the six synthetic comparisons, fields, and illustrative threshold, and clearly labels all values synthetic.

## Decisions so far

- Use a fictional comparison across substrate labels A, B, and C, catalyst labels Pd-X and Ni-Y, with synthetic yield and purity percentages. (audit fixture decision)
- Use 70% synthetic yield and 98% synthetic purity as illustrative thresholds; a catalyst passes only if both hold for all three substrate labels. (audit fixture decision)

## Not yet specified

(none; all protocol fields and the illustrative decision rule are settled)

## Out of scope

- Inferring real catalyst performance.
