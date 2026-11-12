---
name: split
description: "Turn a settled layer of a map into its next children: decide whether the layer is child maps or tasks, decide how many, and open each child by calling the action that writes that record. Use when a map's layer is settled and its children do not exist yet."
family: track
invocation: model
---

# Split

One question decides the whole layer: can one complete action and one auditable standard be written for a part of it? Yes writes tasks, no writes child maps. Nothing else in this skill changes that answer.

## When it runs

A layer is settled — what it holds, which children it needs, and what is still unknown in each — and none of those children exists yet. A map may split while fog remains elsewhere; the part this layer covers has no open fog. The fog of a child is not this layer's: it is written when the child is opened.

The layer goes back to `grill` when it cannot support a child's `Target`, or the evidence a task's acceptance signal would name.

## Steps

1. **Decide the type.** Ask the question above for the layer as a whole. A layer is all one type; a direction that needs the other type opens a sibling map instead.
2. **Decide the count before writing anything.** A layer is cut by the decisions the map already settled: each child's part comes from a decision in `Decisions so far`, and several decisions may feed one child or one decision may feed several. A part with no decision behind it is not cut; it goes back to `grill`, or stays in `Not yet specified` until it settles. For tasks, write the count and a one-line plan per task into the discussion's testimony.
3. **Open each child, one at a time, by calling the action that writes that record.** This skill does not write a child's body.
   - A child map: call `open-map` once per child map, with that child's part of the parent's target. It writes the body and its `Not yet specified`.
   - A task: call `open-task` once per task, with the action, the acceptance signal, the kind, and `reversibility` and `needs_human`.

   A layer is all one type, so a run calls one of the two actions for every child, never both.
4. **Hang them.** Each child records its own `parent`: on the create command, or with `waymark parent set <child> <map>` after it. Neither writer sets it, and the parent's file is not edited for it.
5. **Start the map on its first split.** `waymark start <map>` and `waymark field update <map> --set split_as=<submap|task>`. Later splits change neither.
6. **Read the shape back.** `waymark tree --root <map>`.

A map carries one type for its whole life, so a split that finds a settled layer needing the other type is not this skill's job: it reports the mismatch and stops.

## Transformation

```
before: a map, a settled layer, and no children for it
after:
- the map carries split_as, and it is the same value as before if it was already set
- the map is in_progress
- every new child carries parent = the map
- every new child is the same category, and it matches the layer's type
- every child was written by the action for its record, not by this skill
```

## Hands off

- A task: `advance-task`, when the person asks for it.
- A child map: back into this skill, one level down.
- A layer that cannot be written: `grill`.

## What this skill does not do

- Clear fog, or decide a child's content.
- Write a child's body. `open-map` and `open-task` do, and this skill calls them once per child.
- Write a child against a guess: an unsettled part waits for a later split.
- Change a map that has already split. That is `update`.
