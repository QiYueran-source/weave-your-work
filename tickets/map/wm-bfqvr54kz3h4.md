---
schema: 1
id: wm-bfqvr54kz3h4
title: 'Task reference: how to split a map into tasks'
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-07T16:03:36Z
updated_at: 2026-11-07T16:19:42Z
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
- The reference covers the judgment, not the writing: how to decide the layer splits into tasks, how many, and what each task must pass before it is written. How a body is written belongs to task design, which the reference names instead of restating (user confirmed).
- Split writes each task's body itself, because a task is a leaf and nothing later comes along to write its action. The reference only says to write it against task design's `body.md`, `kind.md`, and `properties.md` (user confirmed).
- Split never writes `Result`, `Progress`, `Review`, `waiting_on`, or `outcome`: those belong to the run and the review (user confirmed).
- The count is decided before anything is written, then each task is taken one at a time. The first split writes `split_as: task`, and every later child of that map is a task; a part that needs a map opens a sibling map (user confirmed).
- When the discussion cannot support a body — no evidence the signal could name, or no single action that ends at one result — split sends the part back to grill. It never guesses (user confirmed).

- The split plan — how many tasks this layer makes and one line for each — is written on this map, not in a weave log (user confirmed). One bullet in `Decisions so far` carries it, because the count and each task's scope are what the grill settled. No new section is opened for it: the result of the split is `Children`, and anything still unwritten is the decided list minus what `Children` and `waymark tree` already show. Source: user confirmation that the plan lives on the map; the section choice is this file's, and a section of its own can be added later if a split ever spans sessions.
- The fields split sets at creation are `task_kind`, `reversibility`, `needs_human` written explicitly, `owner` defaulting to the parent map's, and `parent` given on `waymark create`. What each field accepts and who may write it stays in task design's `properties.md`, which the reference names instead of restating (user confirmed).
- Split writes all the task tickets first, then updates the parent's `Children` once, then checks both sides with `waymark tree`. A half-finished split leaves `Children` clean, and any ticket whose parent is not listed shows up in that check (user confirmed).

## Not yet specified

- ~~What the reference covers, and where the line sits between it and task design.~~ Resolved: the judgment here, the writing in task design (see Decisions so far).
- ~~What split writes into the task body at split time, and what it leaves for execution.~~ Resolved: the whole body against task design, never `Result`, `Progress`, `Review`, `waiting_on`, or `outcome` (see Decisions so far).
- ~~Which fields split sets when the ticket is created, and which it never writes.~~ Resolved: `task_kind`, `reversibility`, `needs_human`, `owner`, `parent`, each defined in task design (see Decisions so far).
- ~~How many tasks one split makes, and how later tasks are added.~~ Resolved: the count is settled before writing, and later children stay tasks (see Decisions so far).
- ~~What split does when the discussion cannot support a task body.~~ Resolved: it goes back to grill (see Decisions so far).
- ~~How the structure freeze applies once a map's children are tasks.~~ Resolved: inherited from the split skill — `split_as: task` at the first split, and later children are tasks only.

## Out of scope

- Task body format, kinds, reversibility, and acceptance signals (task design).
- Advancing a task (task execution).
- Splitting into child maps (the submap reference).
