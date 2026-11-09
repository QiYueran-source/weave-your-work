---
name: split
description: "Turn a settled layer of a map into its next children: decide whether the layer is child maps or tasks, then write them from one of two references."
---

# Split

Splitting turns one map's next layer into children. It runs after grill has settled what that layer holds, and it produces either child maps or tasks — never both under one parent.

The whole skill hangs on one question: can one complete execution action and one clearly auditable standard be written for this part?

- Yes: open `task.md` and write the tasks there.
- No: open `submap.md` and write the child maps there.

This file holds the question, when a split runs, the freeze, and the rhythm. The two references hold how each kind of child is written. Load the map skill for its body and dependency references; when the required skill is unavailable, stop and ask the owner to install it.

## When a split runs

When grill has settled the layer: what it holds, which children it needs, and what is still unknown in each. A map may split part of its children while fog remains; explore resolves that fog afterwards.

A split never clears fog and never invents a child's content. When the discussion cannot support a child's `Target`, or the evidence a task's acceptance signal would name, the part goes back to grill.

A map with an unfinished dependency may still split. The wait stays on the map it was written on; the children inherit no edge. A child map may carry its own edge when it needs the output; a task carries no edge and checks its needed input at execution. Load the map skill and read its `frontmatter.md` for dependency and failed-output rules. When the next layer's content depends on the blocker's result, leave that part for later rather than guessing.

## The freeze

A map's children are all one type. The map's first split writes `split_as` on the map — `submap` or `task` — and every later child is that type. A direction that needs the other type opens a sibling map instead.

The field lives on the map whose children they are, and it never flips. Mixing the two types under one parent blurs the layer: a reader can no longer tell whether the map is waiting for goals or for work.

## The rhythm

Two decisions, then writing.

1. Decide the type, with the question above.
2. Decide how many children this layer gets. The count comes out of the same discussion that settled the layer, and it is not tied to the number of decisions: several decisions may feed one child, and one decision may feed several. For tasks, record the count and one-line plan per task in the discussion testimony.
3. Write the children one at a time, against the reference for their type.

Decide the count before anything is written. It is the one thing a later child cannot repair, because a layer written one child at a time grows a child per idea.

## What a split touches

The first split starts the parent and sets its `split_as`; later splits leave both unchanged. Each child records its own `parent` in its own front matter, and `waymark tree --root <map>` reads the shape back. The map procedure gives the first-split commands.

Creating children does not edit the parent's body; it holds no list of children.

If a first split is interrupted, inspect status, `split_as`, the recorded plan, and actual children before resuming. If the map was started but has neither `split_as` nor children, record the already-decided type without starting it again. If the type is set, keep it and create only missing planned children. A legacy map that already had children before `split_as` existed needs an owner review of its actual shape and history, not a fabricated first-split field; stop before adding children until the type and repair are resolved.

## The two references

- `task.md`: when the parts are executable, and how each task body, field, and parent relation is written.
- `submap.md`: when the parts are still goals, and how each child map body and parent relation is written.

Both write child bodies against `body.md` in the map skill and field rules in `frontmatter.md`. Neither restates a rule that lives in those files.

## What this skill does not do

- Clear fog. That is explore.
- Decide a child's content. That is grill.
- Define a task's body, kind, or fields. That is task design.
- Move an existing subtree, or change a map that is already settled. That is update.
