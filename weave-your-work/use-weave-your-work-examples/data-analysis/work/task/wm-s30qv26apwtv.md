---
schema: 1
id: wm-s30qv26apwtv
title: Produce the week-five restock list
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T00:13:59Z
updated_at: 2026-11-10T00:14:20Z
closed_at: 2026-11-10T00:14:20Z
parent: wm-jerymvgvmn3y
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Produce `results/restock-2026-11-02.csv`: one row per product whose on-hand stock covers less than two weeks of its four-week average, grouped by supplier.

1. Read `data/sales-weeks.csv`.
2. Average the four most recent weeks for each product.
3. Compute cover in weeks from on-hand stock, and the quantity as two weeks of average minus on hand, rounded up.
4. Write the rows for products below two weeks, with a header.

## Acceptance signal

`results/restock-2026-11-02.csv` holds one row for each product below two weeks of cover, with sku, product, supplier, average, cover_weeks, and quantity; each value can be recomputed from `data/sales-weeks.csv` by hand, and no product at or above two weeks appears.

## Result

`results/restock-2026-11-02.csv` holds three rows, grouped by supplier:

- North Roast, SKU-1001, average 42.00 units, 1.43 weeks of cover, order 24.
- North Roast, SKU-1004, average 7.50, 1.60 weeks of cover, order 3.
- Pack Supply, SKU-1003, average 201.25, 0.75 weeks of cover, order 253.

SKU-1002 and SKU-1005 are at or above two weeks of cover and are not in the file. Each quantity is two weeks of the average minus the on-hand stock, rounded up: 84−60, 15−12, and 403−150.

## Review

passed

- Goal: the file exists with one row for each product below two weeks of cover and the six columns the `Acceptance signal` names; 84−60, 15−12, and 403−150 recompute to 24, 3, and 253 from `data/sales-weeks.csv`, and no product at or above two weeks appears.
- Convention: the ticket carried no `Boundaries`; the run wrote only `Result` and this section.
