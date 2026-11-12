---
"weave-your-work": minor
---

Add a `waymark` skill that is the set's single field reference and query guide.

`waymark/fields.md` now defines every field a ticket carries — the core fields, the six custom fields the tracker is configured with, and `owner` — along with where each write lands, who may run it, and the list an accepting party checks. `waymark/queries.md` holds the reads the set uses: the tree, one item, the ready and blocked lists, filtered lists, search, and the archive, with the traps each one hides.

The old `map/frontmatter.md` and `task-design/properties.md` are gone. Each had grown the other node's fields and repeated the same write rules in its own words. Their placement content moves to `map/placement.md` and `task-design/placement.md`, which keep only where a node sits: dependency edges, soft links, the parent rule, and what a node never carries.

`setup` declares the six fields and points here for what they mean; `ask-me` lists the skill; the setup check now requires it.
