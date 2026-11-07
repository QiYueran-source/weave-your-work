---
schema: 1
id: wm-nnjk0yb5wbd9
title: 'Submap reference: how to split into child maps'
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T16:01:13Z
updated_at: 2026-11-07T06:20:00Z
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
- A map splits into submaps when one complete execution action and one clearly auditable standard cannot be written, or when it has several independent directions that need their own owner (user confirmed).
- ~~With fog present, default to submap; split a task only when the remaining fog clearly cannot affect that part~~. Superseded: whether a part has fog at all is decided by the grill discussion, not by a default (see below).
- The child map's body is minimal: Target is required; write Not yet specified when there is fog, and skip it when a clear decision is already written; acceptance direction defaults to all children done and no further children needed; other sections are optional (user confirmed).
- A child's content comes from the parent's settled decisions and clarified Target directions. There is no strict one-to-one mapping between decisions and children: several decisions may feed one child, or one decision may feed several, as long as the child does not drift from the parent (user confirmed).
- Grilling a child covers the sections of its body: Target, Decisions so far, Out of scope, Not yet specified, and the Review point under Acceptance direction. Each is discussed and settled before the child is written (user confirmed).
- The number of children is not limited to the number of decisions; the count is whatever the grill discussion settles on, without a strict one-to-one limit (user confirmed).
- A split does not require a non-empty Decisions so far: a map may split a single child that is a pure refinement of the parent (one leaf), as long as grill has clarified it (user confirmed).
- Whether a child has fog is decided by the grill discussion, not by a default; when the discussion leaves no fog, the child's Not yet specified is written as none (user confirmed).
- When splitting, analyse what is still unknown and write it into the child's Not yet specified (user confirmed).
- Grill before split: a layer is split only after grill discussed its details, so every child can state its Target and its fog; the child's content is grill-determined, not written by guessing at split time. Remaining fog stays on the child, and explore resolves it after the split (user confirmed).
- Content and writing are separate: grill produces only its own artifacts (discussion and weave logs) and never writes the child body; split's submap reference writes the child body, formatted against the map body reference (user confirmed).
- A child's Decisions so far holds only the child's own settled content from the grill discussion; it does not copy the parent's decisions. When the child needs to reference a parent decision, it links it (user confirmed).
- A child's Out of scope holds only what this child explicitly decided not to do during grill; it does not inherit the parent's Out of scope (user confirmed).
- The grill discussion walks through all five sections of a child; a section with no content is simply left unwritten (user confirmed).
- Hard constraint: what is written into a child must not conflict with its parent ticket or its sibling tickets; a conflict is merged, adjusted, or asked back to the owner before the child is written (user confirmed).
- A child defaults to its parent's owner. Hanging a child under a parent owned by someone else is not supported; ownership is transferred explicitly before hanging (user confirmed).
- A parent's children are all one type: all submaps or all tasks, never mixed under one parent (user confirmed).
- Hanging is the act of opening a child ticket under a node; it is a distinct action of split and is defined in the glossary (user confirmed).
- Rhythm: split in two steps — first decide the child type (submap or task), then decide how many children this layer gets. The count is decided at the start, before writing, and the children are then written one by one. The count comes out of the grill discussion that precedes the split (user confirmed).
- Children sync: update the parent's body, set the waymark parent, run `waymark tree` to check both sides agree (user confirmed).

## Not yet specified

(none; fog cleared)

## Out of scope

- The task reference (`task.md`).
- Map skill content.
