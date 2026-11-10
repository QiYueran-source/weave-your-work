---
schema: 1
id: wm-tath3j1wcym1
title: Write the process page for next week's list
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T00:13:59Z
updated_at: 2026-11-10T00:14:26Z
closed_at: 2026-11-10T00:14:26Z
parent: wm-2wdscw2knbjk
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `results/process.md` so the owner can produce next week's list without help.

1. Name the input files and the columns the rule reads.
2. State the arithmetic: average the four most recent weeks, cover in weeks, quantity to two weeks.
3. State the output columns and the grouping.

## Acceptance signal

`results/process.md` names `data/sales-weeks.csv` and the new week's file, gives the average and cover formulas, and states the output columns; a reader who has not seen this ticket can produce a list from it.

## Result

`results/process.md` is written. It names `data/sales-weeks.csv` and the new week's export, lists the columns the rule reads, gives the two formulas (average over the four most recent weeks, cover as on-hand divided by that average), states the two-week threshold and the quantity formula, and gives the output columns and sort order. It also states the normal-month assumption.

A reader who has not seen this ticket can produce a list by following the Arithmetic and Output sections: every term is defined and no step depends on this ticket's context.

## Review

passed

- Goal: the page names both input files, the columns, the average and cover formulas, the two-week threshold, the quantity rule, and the output columns, read against the `Acceptance signal`.
- Convention: the ticket carried no `Boundaries`; the run wrote `results/process.md`, `Result`, and this section.
