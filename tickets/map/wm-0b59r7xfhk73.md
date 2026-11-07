---
schema: 1
id: wm-0b59r7xfhk73
title: Map skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T12:11:25Z
updated_at: 2026-11-06T16:41:35Z
parent: wm-qhd3twqjzhma
custom_fields:
  task_kind: delivery
---
## Target

Design the map skill so a team can turn a target into a tree: write the six-section map body, hang children, keep the body index in sync with waymark's parent relation, move a map through its status transitions, and accept it when every child is done and no further child is needed.
Why: map is the node that answers "what I want"; without this skill the tree has no entry point.

## Acceptance direction

All children are complete and no further children are needed: the SKILL.md exists under `weave-your-work/map/`, the example map can be rebuilt from it, and the body index and waymark parent relation agree after a child changes.

## Children

- [Explore skills: fog exploration](tickets/map/wm-8m5cckpf4tc2.md): triage fog and run the routes.
- [Map body format](tickets/map/wm-6c4f9e2a7b31.md): define how each map section and entry is written.
- [Map operating procedure](tickets/map/wm-9d7e4c1a2b60.md): define the map workflow and hand-offs between skills.
- [Split skills: choose child maps or tasks](tickets/map/wm-3nhrhmds8rqd.md): route to split-to-submap or split-to-task.
- [Review skill: accept a map](tickets/map/wm-64st47g6pcrj.md): accepting a map before close.

## Decisions so far

- Inherits the execution map's decisions: the semantic model, the six-section map template, and the frontmatter choice.
- `/map` is the single entry that routes to explore, split and review (user confirmed).
- Status flow: a new map starts open; split starts it (open to in_progress) when it gets children; when every child is closed, `/map` runs review; review closes the map or leaves it in_progress (user confirmed).
- A decision may be recorded directly in Decisions so far without fog; split then turns it into a child (user confirmed).
- The map body format is designed in the separate Map body format child map. `body.md` defines the writing shape for all six sections; this Map skill keeps the workflow and references that file.
- Current scope: the map skill covers the child-map lifecycle — write the six-section body per `body.md`, hang children, keep the body index in sync with the waymark parent relation, move a map through its status transitions, and accept it via review. The task paths (splitting tasks, task children, task-level acceptance) stay fog until the Task skill is settled. Source: user confirmation.

## Not yet specified

- The function details of the map skill: when a node is a map rather than a task, what each of the six sections holds, hanging children and syncing the body index, status transitions, and the acceptance check.

## Out of scope

- Task skill design (sibling map under the execution map).
- Software-specific workflows.
