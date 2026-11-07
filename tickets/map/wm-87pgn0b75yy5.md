---
schema: 1
id: wm-87pgn0b75yy5
title: Task skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T12:11:26Z
updated_at: 2026-11-07T07:40:27Z
parent: wm-qhd3twqjzhma
custom_fields:
  task_kind: delivery
---
## Target

Design the task skill system so a team can define a leaf of the target tree as a claimable, verifiable unit and advance it to an outcome.

Why: task is the finest target and the only node that can be executed; without this skill a map never turns into work.

## Acceptance direction

All child maps are accepted and no further child maps are needed: task design defines how a task is written, task execution defines how it is advanced, and the split skill can create tasks from them.

## Children

- [Task design skill](tickets/map/wm-793jrqph1ckv.md): define how tasks are specified and made verifiable.
- [Task execution skill](tickets/map/wm-avc7a31tae33.md): define how an owner advances a task and records its outcome.

## Decisions so far

- Inherits the execution map's decisions: ownership model, task kinds, reversibility marker, and acceptance direction.
- needs_human: a boolean field marks a task that must be done by a person, as opposed to a task an agent can finish alone (user proposed).
- Task atomicity: a task cannot have child tasks, and it leaves one result someone can name. Length is not the test: a task may run for days while it waits on a person or on data. Work with no result of its own is a step, not a task (user confirmed).
- A task carries no dependency edges, and a task hangs under exactly one map. The tasks under one map are parallel branches. Where two pieces of work must run in sequence, either they are one action with several steps, or the map splits into child maps that carry the edge (user confirmed).
- A task may link to items outside its map for provenance or shared subject, and a link never expresses order: it does not block or affect readiness. The owner adds and removes links through the waymark command, and the body does not mirror them. A task whose parent is another task is an error (user confirmed).
- Splitting follows the vertical slice: a task ends at a result that can be handed over whole, even when the action crosses several stages to reach it. A slice that finishes one stage and waits for a sibling is a step, not a task (user confirmed).
- A task carries no date fields: no start date, no deadline. Starting is the claim, which execution records; a deadline needs an overdue check this layer does not have. A hard external date goes into Action or Boundaries (user confirmed).
- The Task skill has two child skills, task design and task execution, following the Map skill structure (user confirmed).
- Split-to-task decides whether and how work should split into tasks based on semantics; it does not design individual tasks. It references the task design skill when creating them (user confirmed).
- Splitting follows semantic groupings, not a one-decision-to-one-task mapping, consistent with the submap rule (user confirmed).
- The total Task skill keeps no references of its own. Its rules live in the two child skills: the content and kind rules in task design, the operating procedure in task execution (user confirmed).

## Not yet specified

- The small-addition rule under the structure freeze: whether a small extra task may be added after the freeze.

## Out of scope

- Map skill design (sibling map under the execution map).
- Same-name glossary conflicts.
