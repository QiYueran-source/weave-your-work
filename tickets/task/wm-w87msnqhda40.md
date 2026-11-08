---
schema: 1
id: wm-w87msnqhda40
title: Write the split skill entry
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-08T10:46:06Z
updated_at: 2026-11-08T10:46:06Z
parent: wm-3nhrhmds8rqd
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `weave-your-work/split/SKILL.md`, the router that decides when a map splits and whether its next layer is child maps or tasks.

1. State when a split happens: after grill has settled the layer. A map may split part of its children while fog remains; explore never creates children.
2. State the criterion once, as the router question: can one complete execution action and one clearly auditable standard be written? Yes opens `task.md`, no opens `submap.md`. The references apply it and do not restate it.
3. State the freeze: the map's first split writes `split_as`, and every later child is the same type. A direction that needs the other type opens a sibling map; the field is never flipped.
4. State the two-step rhythm: decide the type, decide how many children this layer gets, then write them one at a time.
5. State what a split never does: it does not clear fog, and it does not decide a child's content on its own. Both belong to grill and explore.
6. Keep the file short. It carries the criterion, the freeze, the rhythm, and the pointers.

## Acceptance signal

`weave-your-work/split/SKILL.md` exists. It states the criterion once and routes to exactly one of the two references. It states when to split, the freeze, and the rhythm, and names `submap.md`, `task.md`, and `body.md` without restating what they say. A reader holding a settled layer can tell which reference to open from this file alone.

## Boundaries

- No writing of child bodies. Those are the two references.
- No fog clearing. That is fog-explore.
- No task body format or field rules. Those are task design.
