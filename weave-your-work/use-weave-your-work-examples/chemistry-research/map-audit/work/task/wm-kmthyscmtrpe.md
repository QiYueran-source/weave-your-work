---
schema: 1
id: wm-kmthyscmtrpe
title: Write the synthetic comparison report
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-09T03:31:36Z
updated_at: 2026-11-09T03:39:16Z
closed_at: 2026-11-09T03:39:16Z
parent: wm-qyyxhrazaq0n
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `results/synthetic-report.md` with one row for each combination of three synthetic substrate labels and two synthetic catalyst labels, using the protocol's yield and purity fields. State which fictional label meets the illustrative thresholds, and label the full report synthetic.

## Acceptance signal

The report has six distinct combinations, yield and purity values, a transparent application of both thresholds, and an explicit statement that the data are invented for workflow testing and support no real chemistry conclusion.

## Result

Wrote `results/synthetic-report.md`. It contains six distinct substrate/catalyst combinations, yield and purity percentages, and applies both illustrative thresholds. Pd-X meets them on A/B/C; Ni-Y misses yield on B and purity on C. The file says the values are synthetic and not experimental evidence.

## Review

passed

- Goal: the six rows, both fields, threshold comparison, and explicitly synthetic limitation match the Acceptance signal. Read the report directly and recomputed each comparison against `report-protocol.md`.
- Convention: the output stays within the ticket's boundaries and makes no real chemistry claim.

## Boundaries

- No real chemistry claims or recommendations.
