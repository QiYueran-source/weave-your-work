# The review

Three map reviews ran, each written by the owner's agent, each with its goal and convention checks reported separately.

**The list map** ([wm-jerymvgvmn3y](work/map/wm-jerymvgvmn3y.md)) was reviewed after its one remaining child closed. The goal check read `results/restock-2026-11-02.csv` against the review point: the three rows, the averages and covers recomputed from `data/sales-weeks.csv`, and no product at or above two weeks. The convention check read the body's four sections, the single active task against `split_as: task`, the archived probe as historical, and the absence of a dependency edge.

**The process map** ([wm-2wdscw2knbjk](work/map/wm-2wdscw2knbjk.md)) could not be reviewed when its own children closed, because it waits on the list map. The dependency closed first, and only then did the review run. Its goal check read the page and the second list: the page names both inputs and the arithmetic, and the list's rows recompute to 26, 3, and 252. The convention check read the three task children, the closed dependency, and the body shape.

**The root** ([wm-wgqqvca7r5zb](work/map/wm-wgqqvca7r5zb.md)) was reviewed once both maps closed. Its goal check read the two lists against the acceptance direction: consecutive weeks, the second computed from the later export, each row naming the SKU, the average, the cover, and the quantity, and no product at or above two weeks. The convention check read the six sections in order, both children as maps matching `split_as: submap`, the dependency that was closed before the second map's review, and the decisions' sources.

All three reviews passed and the tickets closed. The project validates with no findings.

What the reviews did not catch is the plan: none of the three read the testimony, so the missing task-layer plan went unnoticed until this page was written. That is the finding in [what the run showed](07-what-the-run-showed.md), and it is worth reading before trusting a passing map review to cover the split rules.
