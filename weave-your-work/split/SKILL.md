---
name: split
description: "Turn a settled layer of a map into its next children: decide whether the layer is child maps or tasks, then write them from one of two references."
---

# Split

Splitting turns one map's next layer into children. It runs after grill has settled what that layer holds, and it produces either child maps or tasks — never both under one parent.

The whole skill hangs on one question: can one complete execution action and one clearly auditable standard be written for this part?

- Yes: open `task.md` and write the tasks there.
- No: open `submap.md` and write the child maps there.

This file holds the question, when a split runs, the freeze, and the rhythm. The two references hold how each kind of child is written.

## When a split runs

When grill has settled the layer: what it holds, which children it needs, and what is still unknown in each. A map may split part of its children while fog remains; explore resolves that fog afterwards.

A split never clears fog and never invents a child's content. When the discussion cannot support a child's `Target`, or the evidence a task's acceptance signal would name, the part goes back to grill.

A map with an unfinished dependency may still split. The wait stays on the map it was written on; the children inherit nothing. If a child actually needs the blocker's output, it carries its own edge or stops at execution. When the next layer's content depends on the blocker's result, leave that part for later rather than guessing.

## The freeze

A map's children are all one type. The map's first split writes `split_as` on the map — `submap` or `task` — and every later child is that type. A direction that needs the other type opens a sibling map instead.

The field lives on the map whose children they are, and it never flips. Mixing the two types under one parent blurs the layer: a reader can no longer tell whether the map is waiting for goals or for work.

## The rhythm

Two decisions, then writing.

1. Decide the type, with the question above.
2. Decide how many children this layer gets. The count comes out of the same discussion that settled the layer, and it is not tied to the number of decisions: several decisions may feed one child, and one decision may feed several.
3. Write the children one at a time, against the reference for their type.

Decide the count before anything is written. It is the one thing a later child cannot repair, because a layer written one child at a time grows a child per idea.

## What a split touches

The children, and nothing else. Each child records its own `parent` in its own front matter, and `waymark tree --root <map>` reads the shape back.

The parent's body is not edited. It holds no list of children, so there is nothing to update, and the parent's owner is never asked to open their ticket because someone else split under it.

## The two references

- `task.md`: when the parts are executable, and how each task body, field, and parent relation is written.
- `submap.md`: when the parts are still goals, and how each child map body and parent relation is written.

Both write child bodies against `body.md` in the map skill and field rules in `frontmatter.md`. Neither restates a rule that lives in those files.

## What this skill does not do

- Clear fog. That is explore.
- Decide a child's content. That is grill.
- Define a task's body, kind, or fields. That is task design.
- Move an existing subtree, or change a map that is already settled. That is update.
