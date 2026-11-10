---
schema: 1
id: wm-wgqqvca7r5zb
title: The shop owner orders next week's stock from one list
category: map
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T00:13:00Z
updated_at: 2026-11-10T00:15:51Z
closed_at: 2026-11-10T00:15:51Z
soft_links:
  - wm-dns611g614me
custom_fields:
  split_as: submap
---
## Target

The shop owner orders next week's stock from one list, without opening the raw export.

Why: she reads four weeks of export rows by hand and misses slow-moving items, and a missed item is a stockout the following week.

## Acceptance direction

Two consecutive weekly lists exist in `results/`, the second produced by rerunning the written process on a later export, and every product whose on-hand stock covers less than two weeks appears with a quantity.

Review point: open both lists — each row names a SKU from the export, the four-week average, the cover in weeks, and the quantity to order; the process page names the two files to read and the arithmetic that turns them into the next list.

## Decisions so far

- A product is reordered when its on-hand stock covers less than two weeks of its four-week average weekly sales; the quantity is the difference, rounded up. (user confirmed; see [the testimony](../testimony/wm-dns611g614me.md))
- The export's SKU is the supplier's order key; the list needs no mapping step. (user confirmed; see [the testimony](../testimony/wm-dns611g614me.md))
- The four sample weeks are treated as a normal month, and the rule says so. (user confirmed; see [the testimony](../testimony/wm-dns611g614me.md))
- The list is one row per product, grouped by supplier. (user confirmed; see [the testimony](../testimony/wm-dns611g614me.md))
- The exercise checks the list and the process, not a real order; the owner's act of ordering stays outside it. (user confirmed; see [the testimony](../testimony/wm-dns611g614me.md))

## Not yet specified

- ~~Decision to make: what counts as "needs reordering" — a fixed weeks-of-cover threshold, or a per-product one the owner sets.~~
  Resolved on 2026-11-10: two weeks of cover from the four-week average; see Decisions so far.
- ~~Fact to establish: whether the export's SKU is the key the supplier takes orders under.~~
  Resolved on 2026-11-10: the export's SKU is the supplier's key; see Decisions so far.
- ~~Assumption: the four sample weeks are a normal month, with no promotion or holiday week inside.~~
  Resolved on 2026-11-10: accepted as reasonable for a small shop, and the rule states the assumption; see Decisions so far.
- ~~Goal to clarify: whether "one list" means one row per product or one order per supplier.~~
  Resolved on 2026-11-10: one row per product, grouped by supplier; see Decisions so far.

## Out of scope

- A real supplier integration. The exercise stops at the list the owner would order from.

## Review

passed

- Goal: two consecutive lists exist, `results/restock-2026-11-02.csv` and `results/restock-2026-11-09.csv`; the second was produced from `data/week-five.csv` by the same arithmetic, and both name, per row, the SKU, the four-week average, the cover in weeks, and the quantity. No product at or above two weeks appears in either.
- Convention: the body carries `Target`, `Acceptance direction`, `Decisions so far`, `Not yet specified`, `Out of scope`, and `Review`, in that order; both children are maps, matching `split_as: submap`; the second map's dependency on the first was closed before its review; every decision carries a source and the testimony it cites is closed; the body holds no children index. `waymark validate` reports no findings.
