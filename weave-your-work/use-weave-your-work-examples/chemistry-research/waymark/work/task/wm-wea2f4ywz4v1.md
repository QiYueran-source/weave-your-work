---
schema: 1
id: wm-wea2f4ywz4v1
title: Write the comparison protocol
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-08T12:03:00Z
updated_at: 2026-11-08T12:03:20Z
closed_at: 2026-11-08T12:03:20Z
parent: wm-eq30h8a29n4y
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write the comparison protocol the six screening runs will follow, before any run starts.

The protocol states the three substrates, the palladium control, the fixed temperature, solvent, base, and analytical method, the sampling point, and the rule that decides whether nickel passes.

## Acceptance signal

`comparison-protocol.md` exists in the screen folder. It names all three substrates, both catalysts, the fixed conditions, the sampling point, and the pass rule. A chemist who did not write it can run the six experiments from it without asking a question.

## Result

`lab/comparison-protocol.md` is written. It names the three substrates, both catalysts, the fixed conditions, the 12 h sampling point, and the 70% yield / 98% purity pass rule. The protocol was written before R-01 to R-06 were logged.

## Review

passed

- Goal: `lab/comparison-protocol.md` names all three substrates, both catalysts, the fixed conditions, the sampling point, and the pass rule; read against the `Acceptance signal` line by line.
- Convention: only the protocol file was written, and the ticket carries `Result` and this section.

## Boundaries

- No experimental results in the protocol.
- No substrate beyond the three named.
