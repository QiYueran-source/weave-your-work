# The update

Four update operations ran, one for each case the skill names.

**An editorial edit.** The process page said "sorted by supplier and then SKU"; it now reads "sorted by supplier, then SKU". The meaning is identical, so the file changed and the ticket did not: [the page task](work/task/wm-tath3j1wcym1.md) kept its status, its `Result`, and its `Review`. Editing a closed ticket's deliverable without reopening is the first disposition.

**A verdict that stopped holding.** [The second-list task](work/task/wm-1h6zzafwyxfy.md) had closed on a copy in `results/order-folder/`. The owner's supplier reads `results/sent/`, so the acceptance signal's promise was no longer true. The run struck the old signal in place with `Superseded on 2026-11-10` and the reason, wrote `Progress` saying which verdict was invalidated and what had to be repaired, reopened the ticket, moved the copy, replaced `Result`, and reviewed again. The fresh `Review` replaced the old one, and `Progress` was removed before the close — a closed ticket carries no `Progress`.

**A different subject.** The first probe asked about four weeks. The export now covers five, so its question no longer matched the file the rule reads. The run opened [a replacement probe](work/task/wm-rbtfk79gjt21.md) with the same parent, wrote `Superseded by wm-rbtfk79gjt21 on 2026-11-10` on the old ticket, and archived it with a reason that names the replacement. No soft link joins the two: `waymark archive` removes soft links from the tickets that pointed at the archived node, so a link written before the archive would not survive it. The old ticket keeps its `Result` and `Review`, and the tree shows its parent as historical.

**A move.** The replacement probe was hung under the list map, like the probe it replaced, and then moved to the process map, where the input window it checks is documented. `waymark parent set` wrote one file. Neither map reopened: the list map's target still holds without the probe, and the process map was already `in_progress`. A move records nothing on the ticket — the old position survives in git and in `waymark git history --item`.

The order of writes mattered twice. The replacement existed before the old ticket was archived, because the old ticket's last write names it. And the copy moved only after the signal was struck and the verdict recorded as invalid, so no reader saw a ticket that still claimed `results/order-folder/` while the file was somewhere else.
