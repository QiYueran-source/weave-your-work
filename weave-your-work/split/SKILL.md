---
name: split
description: "Turn a settled layer of a map into its next children: decide whether the layer is child maps or tasks, decide how many, and write them. Use when a map's layer is settled and its children do not exist yet."
family: track
invocation: model
---

# Split

One question decides the whole layer: can one complete action and one auditable standard be written for a part of it? Yes writes tasks, no writes child maps. Nothing else in this skill changes that answer.

## When it runs

A layer is settled — what it holds, which children it needs, and what is still unknown in each — and none of those children exists yet. A map may split while fog remains elsewhere; the part this layer covers has no open fog.

The layer goes back to `grill` when it cannot support a child's `Target`, or the evidence a task's acceptance signal would name.

## Steps

1. **Decide the type.** Ask the question above for the layer as a whole. A layer is all one type; a direction that needs the other type opens a sibling map instead.
2. **Decide the count before writing anything.** The count comes from the discussion that settled the layer, not from the number of decisions: several decisions may feed one child, and one decision may feed several. For tasks, write the count and a one-line plan per task into the discussion's testimony.
3. **Write the children, one at a time**, reading the record's own skill: the `task` skill for a task body, the `map` skill for a child map. The field rules are `waymark`'s.
   - A child map gets the same body as any map, including its own `Not yet specified` with entries or the marker.
   - A task gets `Action`, `Acceptance signal`, and `task_kind`, `reversibility`, `needs_human` written explicitly.
4. **Hang them.** Each child records its own `parent`; the parent's file is not edited for it.
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
- every new task carries Action, Acceptance signal, task_kind, reversibility, needs_human
- every new child map carries Target, Acceptance direction with a Review point, and Not yet specified
```

## Hands off

- A task: `advance-task`, when the person asks for it.
- A child map: back into this skill, one level down.
- A layer that cannot be written: `grill`.

## What this skill does not do

- Clear fog, or decide a child's content.
- Write a child against a guess: an unsettled part waits for a later split.
- Change a map that has already split. That is `update`.
