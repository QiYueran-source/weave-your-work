---
"weave-your-work": patch
---

Separate the discussion from what it writes, and draw the line as a diagram

`grill` both ran a discussion and left its terms and decisions for the caller to write, which is why `MAINLINE.md` carried a table saying which step writes an ADR and which writes a glossary entry. The table existed to patch a hole in one action.

`grilling` now asks the questions and writes the testimony, and nothing else. `grill-and-records` assembles: it runs the discussion, then `adr` for each settled decision and `glossary` for each fixed term. Like Matt's `grill-with-docs`, it holds no rules of its own -- the questions are `grilling`'s, the three gates are `adr`'s, and the canonical name is `glossary`'s.

With nothing else in the line needing a checkpoint, that table is gone. `what-is-the-mainline` says a discussion writes its own records, and that a decision made anywhere else stays where it was made until a person decides it earned a file. Callers of `grill` now call `grill-and-records`.
