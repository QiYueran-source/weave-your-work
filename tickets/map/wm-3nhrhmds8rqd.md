---
schema: 1
id: wm-3nhrhmds8rqd
title: 'Split skills: choose child maps or tasks'
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T14:59:53Z
updated_at: 2026-11-06T15:00:14Z
parent: wm-0b59r7xfhk73
custom_fields:
  phase: exploring
---
## Target

Route a map to the right split: decide whether the map's next layer is child maps or tasks, then call split-to-submap or split-to-task. The parent skill holds only the decision.

Why: children come from splitting, and mixing child maps with tasks in one map blurs structure and execution.

## Acceptance direction

The SKILL.md exists under `weave-your-work/split/` and is a short router: it states the decision question and calls the right child skill. No split logic lives here.

## Children

- [Split to submap](tickets/map/wm-bsf5bn3cgsgj.md): refine the target into child maps.
- [Split to task](tickets/map/wm-43wtytq03ywn.md): turn the target into executable tasks.

## Decisions so far

- The parent skill routes to child skills and can be one sentence, following matt's grill-with-docs (user confirmed).
- A map picks one child type: all child maps or all tasks; the structure freezes (user proposed).

## Not yet specified

- The exact decision question the router asks.
- How the two child skills share the split criterion.

## Out of scope

- The actual splitting logic (child skills).
- Map and task content rules.
