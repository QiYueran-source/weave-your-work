---
schema: 1
id: wm-1h6zzafwyxfy
title: Produce and place the week of 2026-11-09 list
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T00:13:59Z
updated_at: 2026-11-10T00:15:13Z
closed_at: 2026-11-10T00:15:13Z
parent: wm-2wdscw2knbjk
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Produce `results/restock-2026-11-09.csv` from `data/week-five.csv` by the same rule, and place a copy in `results/sent/`.

1. Read the four most recent weeks, including `data/week-five.csv`.
2. Compute the rows by the rule.
3. Write the list and copy it into `results/sent/`.

## Acceptance signal

~~The second list exists, uses `data/week-five.csv` with the three earlier weeks, every row matches the arithmetic, and the copy in `results/order-folder/` is byte-identical to it.~~ Superseded on 2026-11-10: the supplier reads a folder named `results/sent/`, not `results/order-folder/`, so the copy goes there.

The second list exists, uses `data/week-five.csv` with the three earlier weeks, every row matches the arithmetic, and the copy in `results/sent/` is byte-identical to it.

## Result

`results/restock-2026-11-09.csv` holds three rows, grouped by supplier:

- North Roast, SKU-1001, average 42.75 units, 1.40 weeks of cover, order 26.
- North Roast, SKU-1004, average 7.50, 1.60 weeks of cover, order 3.
- Pack Supply, SKU-1003, average 200.75, 0.75 weeks of cover, order 252.

The window is the four most recent weeks, which now include `data/week-five.csv`, so the averages and quantities differ from the first list: 86−60, 15−12, and 402−150.

The copy moved from `results/order-folder/` to `results/sent/` after the update, and `cmp` reports no difference. The first copy in the earlier run was read in text mode, which turned CRLF into LF; the byte copy replaced it.

## Review

passed

- Goal: the copy in `results/sent/` is byte-identical to the list, checked with `cmp`, and 86−60, 15−12, and 402−150 recompute to 26, 3, and 252 with no product at or above two weeks; read against the struck and the current `Acceptance signal`.
- Convention: the update struck the old signal with its reason instead of rewriting it, `Progress` recorded the invalidation while the ticket was open, and it is gone now; the run wrote only `Result` and this section.
