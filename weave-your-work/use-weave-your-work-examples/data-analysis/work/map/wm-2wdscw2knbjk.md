---
schema: 1
id: wm-2wdscw2knbjk
title: The owner can produce next week's list without help
category: map
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T00:13:36Z
updated_at: 2026-11-10T00:15:51Z
closed_at: 2026-11-10T00:15:51Z
parent: wm-wgqqvca7r5zb
dependencies:
  - wm-jerymvgvmn3y
custom_fields:
  split_as: task
---
## Target

A process page turns one week's export into the next restock list, and a second list for 2026-11-09 has been produced from `data/week-five.csv`.

Why: the owner reuses this every Monday; a list that exists once is not the outcome.

## Acceptance direction

All children are complete and no further children are needed.

Review point: `results/process.md` names both input files and the arithmetic; `results/restock-2026-11-09.csv` was computed from `data/week-five.csv` by the same rule, and its rows agree with the page.

## Decisions so far

- The reorder rule is the parent map's; this map makes it reusable. (see [the root map](wm-wgqqvca7r5zb.md))

## Out of scope

- A scheduler that runs the process automatically.

## Review

passed

- Goal: `results/process.md` names both input files and the arithmetic, and `results/restock-2026-11-09.csv` was computed from `data/week-five.csv` with the three earlier weeks; 86−60, 15−12, and 402−150 recompute to 26, 3, and 252, and the rows agree with the page's columns and order.
- Convention: the body carries `Target`, `Acceptance direction`, `Decisions so far`, and `Out of scope`, in that order; the three children are tasks, matching `split_as: task`; the dependency on the list map is closed; no children index. `waymark validate` reports no findings.
