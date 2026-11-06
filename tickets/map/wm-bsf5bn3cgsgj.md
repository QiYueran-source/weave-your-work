---
schema: 1
id: wm-bsf5bn3cgsgj
title: Split to submap
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T15:00:00Z
updated_at: 2026-11-06T15:00:00Z
parent: wm-3nhrhmds8rqd
custom_fields:
  phase: exploring
---
## Target

Split a map into child maps: refine the target into more specific targets, each a child map with its own target and acceptance direction.

Why: when a layer cannot yet be written as actions with verifiable results, it is still a target.

## Acceptance direction

The SKILL.md exists under `weave-your-work/split-to-submap/`; a sample map is split into child maps, and each child has a Target and an acceptance direction.

## Children

(none yet)

## Decisions so far

- Inherits the split criterion: write child maps when actions with verifiable results cannot be written yet (user confirmed).

## Not yet specified

- How many children to create.
- How to keep the body Children index in sync with waymark's parent relation.
- How the structure freeze applies after this split.

## Out of scope

- Split to task.
- Map skill content.
