---
"weave-your-work": minor
---

Move the mainline into a skill, so an install carries it

`MAINLINE.md` sat at the set root, and a root file is one an install never
copies: `skills add` takes skill folders, and only skill folders. Four
skills sent a reader to it -- `adr`, `ask-me`, `glossary`, `grill` -- so a
person who installed the set found four pointers to a file that was not
there.

It is `mainline` now, a skill like `waymark` and `task`: model-invoked, it
defines the order and runs nothing, and it says so in its own last line.
The four pointers name the skill. `check-references.mjs` reads the actions
out of `mainline/SKILL.md` instead of the root file.

`PRINCIPLES.md` and `ASSERTIONS.md` stay where they are: they say how this
repository is built and what checks it, and nothing in the set points at
`PRINCIPLES.md` at all. `waymark` still mentions `ASSERTIONS.md`, which a
reader of the set does not have; that one sentence is left as it was,
since what it says is true of any copy that has the file.
