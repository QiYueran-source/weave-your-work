---
schema: 1
id: wm-0b59r7xfhk73
title: Design the map skill
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-06T12:11:25Z
updated_at: 2026-11-06T12:11:25Z
parent: wm-qhd3twqjzhma
custom_fields:
  task_kind: delivery
---
## What to do

Design the map skill and show its shape with a worked example (weave-your-work/examples/map-example.md).

- When a node is a map rather than a task, and how to decide.
- The six body sections and what each holds.
- Building children, keeping the body index in sync with waymark's parent relation.
- Phase changes and how a map is accepted (all children done and no further children needed).
- Moving fog from Not yet specified into children, or clearing it.

## Acceptance signal

- The skill's rules live under weave-your-work/map/.
- A reader can rebuild the example map from the skill without asking.
- The body index and waymark parent relation agree after a child is added or removed.

## Boundaries

- Task design is a sibling ticket.
- Example uses the click-through case; the skill itself stays domain-agnostic.
