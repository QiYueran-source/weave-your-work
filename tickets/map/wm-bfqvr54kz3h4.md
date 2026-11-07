---
schema: 1
id: wm-bfqvr54kz3h4
title: 'Task reference: how to split a map into tasks'
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-07T16:03:36Z
updated_at: 2026-11-07T16:03:36Z
parent: wm-3nhrhmds8rqd
---
## Target

Design the task reference for the split skill: how a settled part of a map becomes a task ticket — applying the one-action-and-one-standard test, writing the task body against task design, setting the task's fields, and hanging it under the map.

Why: `task.md` is a reference inside the split skill, not a skill of its own, but its rules still need to be settled before it can be written. The task side is now closed, so the decisions this reference needs from it exist.

## Acceptance direction

The reference is written into split's `task.md`: the test, the body it writes, the fields it sets, and how the task is hung are all stated, and a sample map is split into tasks that a run can pick up.

All children are complete and no further child is needed.

## Children

(none yet)

## Decisions so far

- The reference lives inside the split skill as `task.md`, not as a skill of its own (inherited from [Split skills: choose child maps or tasks](tickets/map/wm-3nhrhmds8rqd.md)).
- The task side is settled: [Task design skill](tickets/map/wm-793jrqph1ckv.md) and [Task execution skill](tickets/map/wm-avc7a31tae33.md) are closed, so this reference points at them instead of restating them (inherited).
- The choice criterion lives once in the split skill's `SKILL.md`; this reference applies it and does not restate it (inherited).
- A child defaults to its parent's owner (inherited from the submap reference design).
- A split writes the child ticket itself: the body, the fields, and the parent relation, then updates the parent's `Children` and checks both sides with `waymark tree` (inherited from the split skill's decisions).

## Not yet specified

- What the reference covers, and where the line sits between it and task design.
- What split writes into the task body at split time, and what it leaves for execution.
- Which fields split sets when the ticket is created, and which it never writes.
- How many tasks one split makes, and how later tasks are added.
- What split does when the discussion cannot support a task body.
- How the structure freeze applies once a map's children are tasks.

## Out of scope

- Task body format, kinds, reversibility, and acceptance signals (task design).
- Advancing a task (task execution).
- Splitting into child maps (the submap reference).
