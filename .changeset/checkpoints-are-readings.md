---
"weave-your-work": minor
---

Make the checkpoints for a term and an ADR readings, not calls.

`MAINLINE.md` said six times that one step "calls `glossary` or `adr`", while `grill`, `adr`, and `glossary` each deferred the decision back to "the caller". A rule whose subject, object, and verb sit in three files cannot be run by any of them, and none of those six was a call in the graph `PRINCIPLES.md` builds: they were references pretending to be edges.

The table now names what a step leaves behind and where it may land, and says plainly that nothing here is a call and no step waits on one. Most of these are written by the action that produced them, because it read the thing the gates judge on; `grill` and the two openers hand their output to a caller, who decides, and `task-review` decides on what `Result` recorded.
