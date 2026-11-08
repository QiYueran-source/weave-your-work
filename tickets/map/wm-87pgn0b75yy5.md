---
schema: 1
id: wm-87pgn0b75yy5
title: Task skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T12:11:26Z
updated_at: 2026-11-07T09:45:30Z
parent: wm-qhd3twqjzhma
custom_fields:
  task_kind: delivery
---
## Target

Define the Task skill: how work is cut from a map into executable tasks, and how an owner carries one to its outcome.

## Acceptance direction

Two child maps are complete and closed, and the Task skill's entry points at them.

## Decisions so far

- The Task skill splits by actor into task design and task execution (user confirmed).
- Tasks carry no dependency edges, only soft links. Ordering lives on maps (user confirmed).
- The execution side splits further into four flat skills: `execute-step-by-step`, `execute-all`, `task-dispatch`, and `task-review` (user confirmed).
- Execution posits no self-grill and no log in its first version; the executor gathers what it needs and reports what it could not settle (user confirmed).

## Not yet specified

- Whether the Task skill's own entry document carries anything beyond routing into the two children.

## Out of scope

- The Map skill, which owns target trees and ordering.
- The grill and glossary skills, which own how decisions are recorded while they are made.
