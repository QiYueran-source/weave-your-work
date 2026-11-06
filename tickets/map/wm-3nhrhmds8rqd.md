---
schema: 1
id: wm-3nhrhmds8rqd
title: 'Split skills: choose child maps or tasks'
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T14:59:53Z
updated_at: 2026-11-06T17:00:49Z
parent: wm-0b59r7xfhk73
---
## Target

Route a map to the right split: decide when to split and whether the map's next layer is child maps or tasks, then follow the matching reference (submap.md or task.md). The SKILL.md holds only the decision.

Why: children come from splitting, and mixing child maps with tasks in one map blurs structure and execution.

## Acceptance direction

The skill exists under `weave-your-work/split/`: SKILL.md states the decision question and points at one of the two references, and each reference covers one split.

## Children

- [Submap reference: how to split into child maps](tickets/map/wm-nnjk0yb5wbd9.md): the design map for split's `submap.md` reference.
- The two references live inside the skill directory as `submap.md` and `task.md`.

## Decisions so far

- One skill with two references (submap.md, task.md); the router logic is one section of SKILL.md (user confirmed).
- The parent skill routes to references and can be one sentence, following matt's grill-with-docs (user confirmed).
- A map picks one child type: all child maps or all tasks; the structure freezes (user proposed).
- Split timing belongs to the split skill. A map may split part of its children while fog remains; explore does not create children (user confirmed).
- SKILL.md holds the three overall rules: the child type is uniform (all submaps or all tasks, never mixed), a map may split while fog remains, and the choice criterion is "can one action and one verifiable result be written" (user confirmed).
- arrive is a sufficient condition, not a necessary one: fog that has resolved allows a split, but a part may split while other fog remains (user confirmed).
- Split takes from Decisions so far, not from fog: a map may still carry fog while its settled decisions are split, and explore keeps resolving the fog (user confirmed).
- With fog present, default to a submap; split a task only when the remaining fog clearly cannot affect that part (user confirmed).
- When the split is clear at split time, write that decision into Decisions so far first, then split (user confirmed).
- After a split, add same-type children while the map is open; once closed, reopen or open a sibling map; a direction change opens a sibling map (user confirmed).
- A `split_as` field (submap / task) is written at split time to record the child type and support the structure freeze (user confirmed).
- The router question is the choice criterion: can one action and one verifiable result be written? Yes goes to `task.md`, no to `submap.md` (user confirmed).
- The criterion lives once in SKILL.md; the two references do not restate it (user confirmed).
- After a split, update the parent's Children section immediately, set the waymark parent, and run `waymark tree` to check both sides agree (default).
- Before adding a child, check conflict with sibling nodes, conflict with other nodes under the same map, and whether a dependency edge is needed; on conflict merge, adjust or ask the owner (user confirmed).

## Not yet specified

(none; fog cleared)

## Out of scope

- The actual splitting logic (references).
- Map and task content rules.
