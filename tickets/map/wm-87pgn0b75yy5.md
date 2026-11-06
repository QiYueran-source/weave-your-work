---
schema: 1
id: wm-87pgn0b75yy5
title: Task skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T12:11:26Z
updated_at: 2026-11-06T15:02:27Z
parent: wm-qhd3twqjzhma
custom_fields:
  task_kind: delivery
---
## Target

Design the task skill so a team can turn a leaf of the target tree into a claimable, verifiable unit: write the task body, set its kind and reversibility, claim it with start, wire its dependencies, and close it against an acceptance signal.

Why: task is the finest target and the only node that can be executed; without this skill a map never turns into work.

## Acceptance direction

All child tasks are complete and no further child task is needed: the SKILL.md exists under `weave-your-work/task/`, the example task can be rebuilt from it, and both a probe and a delivery task are shown with their reversibility.

## Children

(none yet; the function details are still fog)

## Decisions so far

- Inherits the execution map's decisions: ownership model, task kinds, reversibility marker, and acceptance direction.
- needs_human: a boolean field marks a task that must be done by a person, as opposed to a task an agent can finish alone (user proposed).
- Task atomicity: a task cannot have child tasks. If a task is too big to finish in one go, it becomes a map (user proposed).

## Not yet specified

- The task body template: the sections for a delivery task and for a probe task.
- The reversibility field: its values and what each value changes.
- The needs_human notification: how the person is notified and which issue mechanism carries it.
- Claiming: whether a claim equals start (open to in_progress), and who may advance a task.
- Dependency wiring: how a waiting task declares its blockers.
- Closing: how close and outcome work, and how a failed task keeps its record.
- The small-addition rule under the structure freeze: whether a small extra task may be added after the freeze.
- The Split criterion and the graduation rule as they apply to tasks (inherited from the execution map).

## Out of scope

- Map skill design (sibling map under the execution map).
- Same-name glossary conflicts.
