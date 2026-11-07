---
schema: 1
id: wm-nnjk0yb5wbd9
title: 'Submap reference: how to split into child maps'
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T16:01:13Z
updated_at: 2026-11-07T05:45:00Z
parent: wm-3nhrhmds8rqd
---
## Target

Design the submap reference for the split skill: how to decide a map splits into child maps, the rhythm of splitting, and how to write each child map.

Why: `submap.md` is a reference inside the split skill, not a separate skill, but its rules still need to be settled before it can be written.

## Acceptance direction

The reference is written into split's `submap.md`: the decision test, the rhythm, and the child map body are all stated, and a sample map is split into child maps.

## Children

(none yet)

## Decisions so far

- Submap is a reference inside the split skill, not a separate skill (user confirmed).
- A map splits into submaps when one action and one verifiable result cannot be written, or when it has several independent directions that need their own owner (user confirmed).
- With fog present, default to submap; split a task only when the remaining fog clearly cannot affect that part (user confirmed).
- The child map's body is minimal: Target is required; write Not yet specified when there is fog, and skip it when a clear decision is already written; acceptance direction defaults to all children done and no further children needed; other sections are optional (user confirmed).
- When splitting, analyse what is still unknown and write it into the child's Not yet specified (user confirmed).
- Grill before split: a layer is split only after grill discussed its details, so every child can state its Target and its fog; the child's content is grill-determined, not written by guessing at split time. Remaining fog stays on the child, and explore resolves it after the split (user confirmed).
- Content and writing are separate: grill determines the content of each child (its Target and fog); the submap reference owns the writing spec — how each child map body is written, per the map body reference (user confirmed).
- A child defaults to its parent's owner. Hanging a child under a parent owned by someone else is not supported; ownership is transferred explicitly before hanging (user confirmed).
- A parent's children are all one type: all submaps or all tasks, never mixed under one parent (user confirmed).
- The act of hanging a child under a parent is a distinct action of split; it is proposed to become a glossary term (user suggested).
- Rhythm: one layer at a time, no preset count, stop when each child can state Target and fog (user confirmed).
- Children sync: update the parent's body, set the waymark parent, run `waymark tree` to check both sides agree (user confirmed).

## Not yet specified

(none; fog cleared)

## Out of scope

- The task reference (`task.md`).
- Map skill content.
