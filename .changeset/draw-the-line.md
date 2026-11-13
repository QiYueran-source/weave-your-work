---
"weave-your-work": patch
---

Draw the line as a diagram a reader can follow, and stop naming the set's root files

The ASCII drawing in `what-is-the-mainline` used arrows to mean two different things, ran two flows through the same line of text, and left the reader to work out which one a branch belonged to. It is a mermaid flowchart now: solid arrows are the line, a step handing to the next, and dotted arrows are the return paths -- `grill-and-records` back to the step that sent it, `resplit` back to `advance-task`, and `whole-review` as a person's detour. The worked example's question tree is mermaid too.

Two pointers to files a reader of the installed set does not have are gone. `waymark` told the reader that `ASSERTIONS.md` at the set root lists every assertion once, which is a rule about maintaining this repository rather than about writing a record. `adr` and `glossary` sent the reader to a checkpoint table that no longer exists.
