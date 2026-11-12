---
"weave-your-work": minor
---

Add `resplit`, and let `fog-explore` write its own landing on a childless map.

`resplit` handles the case where a map split into tasks and one task turns out to need another's output: it cuts the layer into two child maps, one that can run now and one that waits, adds the dependency edge between them, and re-hangs the tasks. A task keeps its content, status, and review, and order between tasks becomes order between maps. `advance-task` reports the case as a layer that needs a clearer split and sends the map to `resplit`; `split` and `update` point at it for their own overlaps.

`fog-explore` now writes a landing into a map's body itself when the map is open and has no children, and sends it through `update` only when the map is closed or has already split.

`whole-review` reads every child against itself, its siblings, and its parent, and reports where the set does not hold together.
