---
schema: 1
id: wm-87pgn0b75yy5
title: Task skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T12:11:26Z
updated_at: 2026-11-07T06:50:44Z
parent: wm-qhd3twqjzhma
custom_fields:
  task_kind: delivery
---
## Target

Design the task skill system so a team can define a leaf of the target tree as a claimable, verifiable unit and advance it to an outcome.

Why: task is the finest target and the only node that can be executed; without this skill a map never turns into work.

## Acceptance direction

All child maps are accepted and no further child maps are needed: the Task skill routes to the task design and task execution skills; task design defines task content, kinds, reversibility, and acceptance signals; task execution defines the lifecycle and outcome handling; examples demonstrate a delivery task and a probe task.

## Children

- [Task design skill](tickets/map/wm-793jrqph1ckv.md): define how tasks are specified and made verifiable.
- [Task execution skill](tickets/map/wm-avc7a31tae33.md): define how an owner advances a task and records its outcome.

## Decisions so far

- Inherits the execution map's decisions: ownership model, task kinds, reversibility marker, and acceptance direction.
- needs_human: a boolean field marks a task that must be done by a person, as opposed to a task an agent can finish alone (user proposed).
- Task atomicity: a task cannot have child tasks. If a task is too big to finish in one go, it becomes a map (user proposed).
- The Task skill has a total entry point and two child skills: task design and task execution, following the Map skill structure (user confirmed).
- Task design defines how each task is designed; task execution has a separate design map because its rules need further design (user confirmed).
- split-to-task decides whether and how work should split into tasks based on semantics; it does not design individual tasks. It references the task design skill when creating them (user confirmed).
- Splitting follows semantic groupings, not a one-decision-to-one-task mapping, consistent with the submap rule (user confirmed).

## Not yet specified

- Task design details: task body, kinds, reversibility, acceptance signals, and relevant fields.
- Task execution lifecycle: claim, authority, dependencies, handover, closing, and outcomes.
- The needs_human notification: how the person is notified and which issue mechanism carries it.
- The small-addition rule under the structure freeze: whether a small extra task may be added after the freeze.

## Out of scope

- Map skill design (sibling map under the execution map).
- Same-name glossary conflicts.
