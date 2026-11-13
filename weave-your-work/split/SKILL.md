---
name: split
description: "Turn a settled layer of a map into its next children: decide whether the layer is child maps or tasks, decide how many, and start each child through the action that writes it. Use when a map's layer is settled and its children do not exist yet."
family: track
invocation: model
---

# Split

One question decides the whole layer: can one complete action and one auditable standard be written for a part of it? Yes writes tasks, no writes child maps. Nothing else in this skill changes that answer.

## When it runs

A layer is settled — what it holds, which children it needs, and what is still unknown in each — and none of those children exists yet. A map may split while fog remains elsewhere; the part this layer covers has no open fog. The fog of a child is not this layer's: it is written when the child is opened.

The layer goes back to `grill-and-records` when it cannot support a child's `Target`, or the evidence a task's acceptance signal would name.

## Steps

1. **Decide the type.** Ask the question above for the layer as a whole. A layer is all one type; a direction that needs the other type opens a sibling map instead. Parts that read each other's output are not tasks: they are child maps with an edge between them.
2. **Decide the count before writing anything.** A layer is cut by the decisions the map already settled: each child's part comes from a decision in `Decisions so far`, and several decisions may feed one child or one decision may feed several. A part with no decision behind it is not cut; it goes back to `grill-and-records`, or stays in `Not yet specified` until it settles. For tasks, write the count and a one-line plan per task into the discussion's testimony.
3. **Open each child, one at a time, by calling the action that writes that record.** This skill writes no record: the writer hangs the child under the parent it is given.
   - A child map: call `open-map` once per child map, with that child's part of the parent's target and the decision it came from, and `--parent <map>`.
   - A task: call `open-task` once per task, with the action, the acceptance signal, the kind, `reversibility`, `needs_human`, the decision it serves, and `--parent <map>`.

   A layer is all one type, so a run calls one of the two actions for every child, never both.
4. **Start the map on its first split.** `waymark start <map>` and `waymark field update <map> --set split_as=<submap|task>`, once. `waymark/res/fields.md` defines the field and `map/res/body.md` freezes it; later splits change neither.
5. **Read the shape back.** `waymark tree --root <map>`.

A map carries one type for its whole life, so a split that finds a settled layer needing the other type is not this skill's job: it reports the mismatch and stops.

Each child exists, hung under the map, written by the action for its record; `waymark/res/fields.md` says what `split_as` is.

## Hands off

- A task: `advance-task`, when the person asks for it.
- A child map: back into this skill, one level down, when its own layer is settled.
- A layer that cannot be written: `grill-and-records`.

## What this skill does not do

- Change a map that has already split. Its content is `update`'s; recutting a task layer whose tasks wait on each other is `resplit`'s.
