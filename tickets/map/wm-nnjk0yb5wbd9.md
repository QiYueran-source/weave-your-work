---
schema: 1
id: wm-nnjk0yb5wbd9
title: 'Submap reference: how to split into child maps'
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T16:01:13Z
updated_at: 2026-11-06T16:01:13Z
parent: wm-3nhrhmds8rqd
custom_fields:
  phase: exploring
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
- A map splits into submaps when one action and one verifiable result cannot be written, or when it has several independent directions that need their own owner or phase (user confirmed).
- With fog present, default to submap (user confirmed).

## Not yet specified

- The rhythm: one layer at a time, how many children, and when to stop.
- How to write each child map's body: target, why, acceptance direction.
- How to keep the parent's Children index in sync.

## Out of scope

- The task reference (`task.md`).
- Map skill content.
