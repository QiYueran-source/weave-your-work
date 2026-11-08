---
schema: 1
id: wm-3nhrhmds8rqd
title: 'Split skills: choose child maps or tasks'
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T14:59:53Z
updated_at: 2026-11-08T10:49:58Z
parent: wm-0b59r7xfhk73
---
## Target

Route a map to the right split: decide when to split and whether the map's next layer is child maps or tasks, then follow the matching reference (submap.md or task.md). The SKILL.md holds only the decision.

Why: children come from splitting, and mixing child maps with tasks in one map blurs structure and execution.

## Acceptance direction

The skill exists under `weave-your-work/split/`: SKILL.md states the decision question and points at one of the two references, and each reference covers one split.

## Decisions so far

- The split skill's two references live inside the skill directory as `submap.md` and `task.md`.
- One skill with two references (submap.md, task.md); the router logic is one section of SKILL.md (user confirmed).
- The parent skill routes to references and can be one sentence, following matt's grill-with-docs (user confirmed).
- The child-type choice is frozen for the map's lifetime: after the first split a map adds only children of that type; a direction that needs the other type opens a sibling map. `split_as` is written at the first split and does not flip (user confirmed).
- Split timing belongs to the split skill. A map may split part of its children while fog remains; explore does not create children (user confirmed).
- SKILL.md holds the three overall rules: the child type is uniform (all submaps or all tasks, never mixed), a map may split while fog remains, and the choice criterion is "can one complete execution action and one clearly auditable standard be written" (user confirmed).
- arrive is a sufficient condition, not a necessary one: fog that has resolved allows a split, but a part may split while other fog remains (user confirmed).
- Split takes settled decisions, not fog: a clear target is written into Decisions so far first, then split; fog stays for explore (user confirmed).
- The decision that triggers a split must itself be grilled first: what this layer will hold, which children it needs, and what is still unknown in each; split then writes the children (user confirmed).
- A split decides only whether each part becomes a submap or a task; it does not resolve fog (user confirmed).
- After a split, add same-type children while the map is open; once closed, reopen or open a sibling map; a direction change opens a sibling map (user confirmed).
- A `split_as` field (submap / task) is written at split time to record the child type and support the structure freeze (user confirmed).
- The router question is the choice criterion: can one complete execution action and one clearly auditable standard be written? Yes goes to `task.md`, no to `submap.md` (user confirmed).
- The criterion lives once in SKILL.md; the two references do not restate it (user confirmed).
- Grill-before-split: the split skill calls grill to decide the details of a layer before it splits; split itself never guesses content (user confirmed).
- The grill discussion covers each child's body sections — Target, Decisions so far, Out of scope, Not yet specified, and the Review point — and settles whether the child has fog; there is no default fog judgment (user confirmed).
- grill produces only its own artifacts (discussion and testimonies); split's submap reference writes the child body against the map body reference. A child's Decisions so far and Out of scope hold only the child's own content, and a written child must not conflict with its parent or siblings (user confirmed).
- A split proceeds in two steps: decide the child type (all submaps or all tasks) first, then decide how many children this layer gets. The count is decided up front, before writing, and the children are then written one by one (user confirmed).
- After a split, set the child's waymark parent. The body has no Children index to update, so `waymark create --parent <map>` is the whole recording step; run `waymark tree --root <map>` to read back the shape (default).
- Before adding a child, check conflict with sibling nodes, conflict with other nodes under the same map, and whether a dependency edge is needed; on conflict merge, adjust or ask the owner (user confirmed).
- Hanging under someone else's map: works directly when that map is open, needs an issue and a wait when it is closed, and the child waits as an isolated node in the meantime. The rules live in [Map front matter and dependencies](tickets/map/wm-8zyyyafxbdwr.md) and split points there instead of restating them (user confirmed).

## Not yet specified

- Decision to make: where a map's own entry document comes from when the map has already split into child maps. `wm-w87msnqhda40` wrote split's `SKILL.md` from a task hanging under this map, which now holds two child maps and one task, and the freeze says a map's children are all one type.
  Why it matters: either the freeze covers only the children a map refines into, and a map may carry a task that delivers its own file beside them, or those tasks need a different home, and the Map skill's own `SKILL.md` currently has none.
- Whether a blocked map may split. A map waiting on another may still have parts that do not need the blocker's answer; the open question is whether those parts may be split now or must wait.
- The submap side of vertical slicing: when work must run in sequence, what the child maps look like and where the edge is carried. The task side is settled in the task skill.
- How a task relates to other maps. A task hangs under exactly one map but may link to another; what a link is used for, and what it does not mean (no ordering, no shared acceptance).

## Out of scope

- The actual splitting logic (references).
- Map and task content rules.
