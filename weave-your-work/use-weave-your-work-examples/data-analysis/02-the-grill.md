# The grill

The discussion ran as a grill with one testimony: [Restock list: the questions this exercise settled](work/testimony/wm-dns611g614me.md) (`wm-dns611g614me`). It was created `open`, soft-linked to the map, and closed once the decisions were landed, which is what lets the map cite it.

The testimony holds two sections. The question tree has four settled branches, one per fog entry. The discussion has one round: the operator asked for every recommended answer to be accepted without interruption, so each line records the recommendation it was given. That is the honest form of this run — no invented back-and-forth, and no claim that a person weighed the alternatives.

Five decisions were written into the map's `Decisions so far`, each with the testimony as its source:

- A product is reordered when its on-hand stock covers less than two weeks of its four-week average weekly sales, and the quantity is the difference, rounded up.
- The export's SKU is the supplier's order key, so the list needs no mapping step.
- The four sample weeks are treated as a normal month, and the rule says so.
- The list is one row per product, grouped by supplier.
- The exercise checks the list and the process, not a real order.

The four fog entries were struck in place with a `Resolved on 2026-11-10` line saying what each became, rather than deleted. The section still shows what the map considered before it settled, and every entry is struck, so no unresolved fog remains — which is the state explore must reach before a split.

One thing the grill did not produce: the ADR and the glossary term. Both were written after the run, from the decisions, and are linked from the case's index rather than from the testimony. The grill's record branch is the testimony itself; recording a term or a decision elsewhere is the caller's act, and this run did it late.
