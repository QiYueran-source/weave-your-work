---
schema: 1
id: wm-3nhrhmds8rqd
title: 'Split skills: choose child maps or tasks'
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T14:59:53Z
updated_at: 2026-11-06T15:06:49Z
parent: wm-0b59r7xfhk73
custom_fields:
  phase: exploring
---
## Target

Route a map to the right split: decide whether the map's next layer is child maps or tasks, then follow the matching reference (submap.md or task.md). The SKILL.md holds only the decision.

Why: children come from splitting, and mixing child maps with tasks in one map blurs structure and execution.

## Acceptance direction

The skill exists under `weave-your-work/split/`: SKILL.md states the decision question and points at one of the two references, and each reference covers one split.

## Children

(none; the two references are `submap.md` and `task.md` inside the skill directory)

## Decisions so far

- One skill with two references (submap.md, task.md); the router logic is one section of SKILL.md (user confirmed).
- The parent skill routes to references and can be one sentence, following matt's grill-with-docs (user confirmed).
- A map picks one child type: all child maps or all tasks; the structure freezes (user proposed).

## Not yet specified

- The exact decision question the router asks.
- How the two references share the split criterion.

## Out of scope

- The actual splitting logic (references).
- Map and task content rules.
