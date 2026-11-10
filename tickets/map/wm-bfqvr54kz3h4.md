---
schema: 1
id: wm-bfqvr54kz3h4
title: 'Task reference: how to split a map into tasks'
category: map
status: closed
owner: frank
creator: frank
created_at: 2026-11-07T16:03:36Z
updated_at: 2026-11-10T00:25:06Z
closed_at: 2026-11-09T15:11:13Z
parent: wm-3nhrhmds8rqd
custom_fields:
  split_as: task
---
## Target

Design the task reference for the split skill: how a settled part of a map becomes a task ticket — applying the one-action-and-one-standard test, writing the task body against task design, setting the task's fields, and hanging it under the map.

Why: `task.md` is a reference inside the split skill, not a skill of its own, but its rules still need to be settled before it can be written. The task side is now closed, so the decisions this reference needs from it exist.

## Acceptance direction

The reference is written into split's `task.md`: the test, the body it writes, the fields it sets, and how the task is hung are all stated. ~~A sample map is split into tasks that a run can pick up.~~ That sample split is the worked example the root map defers to one batch: [Work-weave: general team collaboration skill set](wm-wjwa9081hse1.md).

All children are complete and no further child is needed.

Review point: read `split/task.md` — the six gates are stated, each task's body is written against task design, the fields set at creation and the ones split never writes are listed, and the hanging order (start the map, record `split_as`, create every ticket, read the tree back) is described.

## Decisions so far

- The reference lives inside the split skill as `task.md`, not as a skill of its own (inherited from [Split skills: choose child maps or tasks](wm-3nhrhmds8rqd.md)).
- The task side is settled: [Task design skill](wm-793jrqph1ckv.md) and [Task execution skill](wm-avc7a31tae33.md) are closed, so this reference points at them instead of restating them (inherited).
- The choice criterion lives once in the split skill's `SKILL.md`; this reference applies it and does not restate it (inherited).
- A child defaults to its parent's owner (inherited from the submap reference design).
- A split writes the child ticket itself: the body, the fields, and the parent relation, then reads the shape back with `waymark tree` (inherited from the split skill's decisions).
- The reference covers the judgment, not the writing: how to decide the layer splits into tasks, how many, and what each task must pass before it is written. How a body is written belongs to task design, which the reference names instead of restating (user confirmed).
- Split writes each task's body itself, because a task is a leaf and nothing later comes along to write its action. The reference only says to write it against task design's `body.md`, `kind.md`, and `properties.md` (user confirmed).
- Split never writes `Result`, `Progress`, `Review`, `waiting_on`, or `outcome`: those belong to the run and the review (user confirmed).
- The count is decided before anything is written, then each task is taken one at a time. The first split writes `split_as: task`, and every later child of that map is a task; a part that needs a map opens a sibling map (user confirmed).
- When the discussion cannot support a body — no evidence the signal could name, or no single action that ends at one result — split sends the part back to grill. It never guesses (user confirmed).

- ~~The split plan — how many tasks this layer makes and one line for each — is written on this map, not in a testimony (user confirmed). One bullet in `Decisions so far` carries it, because the count and each task's scope are what the grill settled. No new section is opened for it: the result of the split is the set of children, read back with `waymark tree --root <map>`, and anything still unwritten is the decided list minus what that read shows. Source: user confirmation that the plan lives on the map; the section choice is this file's, and a section of its own can be added later if a split ever spans sessions.~~ Superseded on 2026-11-09: record the count and one-line task plan in testimony; read actual children from the tree. Task layers cumulatively cover the full acceptance direction; a planned task is not completed work. See [the confirmed discussion](../testimony/wm-0xrcwvnrcc9k.md).
- The task-layer plan is a log, not a review input: no skill reads it today, and a later skill may read a testimony to see why a layer was cut the way it was. (user confirmed, 2026-11-10)
- The fields split sets at creation are `task_kind`, `reversibility`, `needs_human` written explicitly, `owner` defaulting to the parent map's, and `parent` given on `waymark create`. What each field accepts and who may write it stays in task design's `properties.md`, which the reference names instead of restating (user confirmed).
- Split writes all the task tickets first, then reads the shape back with `waymark tree --root <map>`. A half-finished split leaves no body edit behind, and any ticket whose parent is wrong shows up in that check (user confirmed).

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

## Review

passed

- Goal: `weave-your-work/split/task.md` exists. It states the six gates a part passes before it becomes a task, writes each task's body against task design's `body.md`, `kind.md`, and `properties.md` without repeating them, lists the fields split sets at creation and the ones it never writes, and gives the hanging order: start the map, record `split_as`, create every ticket, read the tree back. The struck sample-split clause is deferred to the root map's batch, as the acceptance direction says.
- Convention: the body carries the sections `body.md` lists, in order, and every Decisions entry carries a source. The one child is a task, matching `split_as: task`, and the body holds no children index. The map carried its child while still `open` and without the field — the miss its own reference warns against — and both were recorded at this review. Four links written from the repository root now use the sibling form so they resolve from the file. `waymark validate` reports no findings.
