---
schema: 1
id: wm-6w02npknj8zy
title: Write the synthetic comparison protocol
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-09T03:31:26Z
updated_at: 2026-11-09T03:37:30Z
closed_at: 2026-11-09T03:37:30Z
parent: wm-x1bjza36xwqh
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `results/report-protocol.md` defining the audit fixture's six comparisons, output fields, and illustrative thresholds. Label the thresholds and all data as synthetic.

## Acceptance signal

The file lists A/B/C and Pd-X/Ni-Y, yield and purity, the synthetic threshold of 70% yield and 98% purity, and the rule that both thresholds must hold on all three substrate labels. It explicitly says the values are synthetic and not chemistry evidence.

## Result

Wrote `results/report-protocol.md`. It specifies the six combinations, yield and purity, both illustrative thresholds, the all-three-substrates rule, and that the values are synthetic.

## Review

passed

- Goal: all fields and thresholds named by the Acceptance signal are in the protocol, and the file labels the dataset as synthetic. Read the artifact directly.
- Convention: the artifact states that it is not experimental evidence and draws no chemistry or production conclusion.

## Boundaries

- No real chemistry claims or recommendations.
