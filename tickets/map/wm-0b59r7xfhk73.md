---
schema: 1
id: wm-0b59r7xfhk73
title: Map skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T12:11:25Z
updated_at: 2026-11-06T15:00:15Z
parent: wm-qhd3twqjzhma
custom_fields:
  phase: exploring
  task_kind: delivery
---
## Target

Design the map skill so a team can turn a target into a tree: write the six-section map body, hang children, keep the body index in sync with waymark's parent relation, move a map through its phases, and accept it when every child is done and no further child is needed.
Why: map is the node that answers "what I want"; without this skill the tree has no entry point.

## Acceptance direction

All child tasks are complete and no further child task is needed: the SKILL.md exists under `weave-your-work/map/`, the example map can be rebuilt from it, and the body index and waymark parent relation agree after a child changes.

## Children

- [Explore skills: fog exploration](tickets/map/wm-8m5cckpf4tc2.md): triage fog and run the routes.
- [Split skills: choose child maps or tasks](tickets/map/wm-3nhrhmds8rqd.md): route to split-to-submap or split-to-task.

## Decisions so far

- Inherits the execution map's decisions: the semantic model, the six-section map template, and the frontmatter choice.

## Not yet specified

- The function details of the map skill: when a node is a map rather than a task, what each of the six sections holds, hanging children and syncing the body index, phase changes, and the acceptance check.

## Out of scope

- Task skill design (sibling map under the execution map).
- Software-specific workflows.
