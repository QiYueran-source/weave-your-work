---
"weave-your-work": minor
---

Give each review axis its own verdict, add `whole-review`, and write down how a record changes.

`task/res/review.md` and `map/res/review.md` now carry the four verdicts per axis and a table for what the pair does to the record; a closed record needs both axes to pass, and when they disagree the worse verdict decides the next step. `task-review` and `map-review` read those rules instead of restating them.

`whole-review` is new, on the mainline between the last `task-review` and `map-review`: it reads a map's closed children as a set and writes one dated paragraph naming both sides of every contradiction it finds, then changes nothing else.

`map/res/body.md` gives every section one rule for a change: add an entry when the old one still holds, strike it with `Superseded on <date>: <why>` when it does not. `update` follows that rule, adds work to a reopened record before splitting it, and leaves a contradictory sibling to its owner.
