---
schema: 1
id: wm-jerymvgvmn3y
title: The restock list is computed from the export
category: map
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T00:13:36Z
updated_at: 2026-11-10T00:15:45Z
closed_at: 2026-11-10T00:15:45Z
parent: wm-wgqqvca7r5zb
custom_fields:
  split_as: task
---
## Target

A restock list for the week of 2026-11-02 exists, computed from the four sample weeks, with every product below two weeks of cover and the quantity to order.

Why: the calculation is what turns four weeks of export rows into the numbers the owner orders.

## Acceptance direction

All children are complete and no further children are needed.

Review point: open the list — each row's four-week average and cover can be recomputed from `data/sales-weeks.csv`, and every product below two weeks of cover appears with a quantity.

## Decisions so far

- The reorder rule and the supplier key are the parent map's decisions; this map applies them. (see [the root map](wm-wgqqvca7r5zb.md))

## Out of scope

- The process page and the later week's list.

## Review

passed

- Goal: `results/restock-2026-11-02.csv` holds the three rows the review point asks for; 84−60, 15−12, and 403−150 recompute to 24, 3, and 253, and no product at or above two weeks appears.
- Convention: the body carries `Target`, `Acceptance direction`, `Decisions so far`, and `Out of scope`, in that order; the only active child is a task, matching `split_as: task`; the archived probe is historical and its replacement moved to the sibling map, each recorded on its own ticket; no dependency edge. `waymark validate` reports no findings.
