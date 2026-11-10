---
schema: 1
id: wm-dns611g614me
title: 'Restock list: the questions this exercise settled'
category: testimony
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T00:13:06Z
updated_at: 2026-11-10T00:13:27Z
closed_at: 2026-11-10T00:13:27Z
soft_links:
  - wm-wgqqvca7r5zb
---
## Question tree

- [x] Restock list for the shop owner
  - [x] What counts as "needs reordering"
  - [x] Does the export's SKU match the supplier's key
  - [x] Are the four sample weeks representative
  - [x] One row per product or one order per supplier

## Discussion

### Round 1

The exercise ran unattended. The operator asked for every recommended answer to be accepted and for no interruptions, so each question records the recommendation it was given rather than an exchange.

- Q: Target — the owner orders from one list without opening the export. A: accepted.
- Q: Input — one weekly CSV with date, SKU, product, units sold, unit price, and on-hand stock; four sample weeks plus one later week. A: accepted.
- Q: Who acts — the owner, Monday morning; acceptance is a second list produced by rerunning the process, not a real order. A: accepted.
- Q: The example is fictional and the tickets are owned by frank. A: accepted.
- Q: Reorder rule — two weeks of cover from the four-week average; order the difference. A: accepted.
- Q: Supplier key — the export's SKU is the supplier's key, no mapping step. A: accepted.
- Q: Four weeks — treated as a normal month; the rule states that as an assumption. A: accepted.
- Q: List shape — one row per product, grouped by supplier. A: accepted.
