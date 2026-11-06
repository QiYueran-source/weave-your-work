---
schema: 1
id: wm-87pgn0b75yy5
title: Task skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T12:11:26Z
updated_at: 2026-11-06T12:44:22Z
parent: wm-qhd3twqjzhma
custom_fields:
  phase: exploring
  task_kind: delivery
---
## Target

Design the task skill so a team can turn a leaf of the target tree into a claimable, verifiable unit: write the task body, set its kind and reversibility, claim it with start, wire its dependencies, and close it against an acceptance signal.
Why: task is the finest target and the only node that can be executed; without this skill a map never turns into work.

## Acceptance direction

All child tasks are complete and no further child task is needed: the SKILL.md exists under `weave-your-work/task/`, the example task can be rebuilt from it, and both a probe and a delivery task are shown with their reversibility.

## Children

- (none yet; the function details are still fog)

## Decisions so far

- Inherits the execution map's decisions: ownership model, task kinds, reversibility marker, and acceptance direction.

## Not yet specified

- The function details of the task skill: the task body sections, when a task is delivery or probe, the reversibility value and what it changes, claiming with start, dependency wiring, who may advance, and closing.

## Out of scope

- Map skill design (sibling map under the execution map).
- Same-name glossary conflicts.
