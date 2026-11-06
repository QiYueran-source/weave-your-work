---
schema: 1
id: wm-87pgn0b75yy5
title: Design the task skill
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-06T12:11:26Z
updated_at: 2026-11-06T12:11:26Z
parent: wm-qhd3twqjzhma
custom_fields:
  task_kind: delivery
---
## What to do

Design the task skill and show its shape with a worked example (weave-your-work/examples/task-example.md).

- The task body: action, verifiable result, acceptance signal, boundaries.
- task_kind: delivery or probe, and when each applies.
- Reversibility: one-way door or two-way door, and what it changes.
- Claiming with start, dependencies, and closing.
- Who may advance a task (owner only) and how conflicts are handled.

## Acceptance signal

- The skill's rules live under weave-your-work/task/.
- A reader can rebuild the example task from the skill without asking.
- A probe task and a delivery task are both shown, with their reversibility.

## Boundaries

- Map design is a sibling ticket.
- Same-name glossary conflicts are not in scope.
