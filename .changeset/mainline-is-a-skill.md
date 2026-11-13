---
"weave-your-work": patch
---

Move the mainline into a skill, so an install carries it

`MAINLINE.md` sat at the set root, and a root file is one an install never
copies: `skills add` takes skill folders, and only skill folders. Four
skills sent a reader to it -- `adr`, `ask-me`, `glossary`, `grilling` -- so a
person who installed the set found four pointers to a file that was not
there.

It is `what-is-the-mainline` now, a skill like `waymark` and `task`:
model-invoked, it describes the order and runs nothing, and it says so in
its own last line. The pointers name the skill. `check-references.mjs` reads
the actions out of `what-is-the-mainline/SKILL.md` instead of the root file.

`PRINCIPLES.md` and `ASSERTIONS.md` stay where they are: they say how this
repository is built and what checks it, and no skill in the set points at
either one.
