---
schema: 1
id: wm-0b59r7xfhk73
title: Map skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T12:11:25Z
updated_at: 2026-11-08T07:37:44Z
parent: wm-qhd3twqjzhma
custom_fields:
  task_kind: delivery
---
## Target

Design the map skill so a team can turn a target into a tree: write the five-section map body, hang children, move a map through its status transitions, and accept it when every child is done and no further child is needed.
Why: map is the node that answers "what I want"; without this skill the tree has no entry point.

## Acceptance direction

All children are complete and no further children are needed: the SKILL.md exists under `weave-your-work/map/`, an example map can be rebuilt from it, and `waymark tree` shows the same structure the example describes.

## Children

- [Explore skills: clear a map's fog](tickets/map/wm-3084re0f48z3.md): clear a map's Not yet specified items until the section is empty.
- [Map body format](tickets/map/wm-6c4f9e2a7b31.md): define how each map section and entry is written.
- [Map front matter and dependencies](tickets/map/wm-8zyyyafxbdwr.md): define the front matter fields, who writes them, and the dependency rules.
- [Map operating procedure](tickets/map/wm-9d7e4c1a2b60.md): define the map workflow and hand-offs between skills.
- [Split skills: choose child maps or tasks](tickets/map/wm-3nhrhmds8rqd.md): route to the submap reference or the task reference.
- [Review skill: accept a map](tickets/map/wm-3spf0jbvf9y9.md): accepting a map before close.

## Decisions so far

- Inherits the execution map's decisions: the semantic model, the five-section map template, and the frontmatter choice.
- `/map` is the single entry that routes to explore, split and review (user confirmed).
- Status flow: a new map starts open; split starts it (open to in_progress) when it gets children; when every child is closed, `/map` runs review; review closes the map or leaves it in_progress (user confirmed).
- A decision may be recorded directly in Decisions so far without fog; split then turns it into a child (user confirmed).
- The map body format is designed in the separate Map body format child map. `body.md` defines the writing shape for all five sections; this Map skill keeps the workflow and references that file.
- Current scope: the map skill covers the child-map lifecycle — write the five-section body per `body.md`, hang children, move a map through its status transitions, and accept it via review. The body keeps no children index; structure is read from waymark's parent field. The task paths (splitting tasks, task children, task-level acceptance) stay fog until the Task skill is settled. Source: user confirmation.
- Front matter management is a reference of the map skill: a separate `frontmatter.md` alongside `body.md` and the operating procedure reference, designed in its own child map. Source: user confirmation.

## Not yet specified

- The function details of the map skill: when a node is a map rather than a task, what each of the five sections holds, hanging children, status transitions, and the acceptance check.

## Out of scope

- Task skill design (sibling map under the execution map).
- Software-specific workflows.
