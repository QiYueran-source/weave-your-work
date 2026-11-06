---
schema: 1
id: wm-43wtytq03ywn
title: Split to task
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T15:00:01Z
updated_at: 2026-11-06T15:00:01Z
parent: wm-3nhrhmds8rqd
archived_at: 2026-11-06T15:06:49Z
archive_reason: Merged into the split skill as a reference (task.md), following the one-skill-many-references pattern
---
## Target

Split a map into tasks: turn the target into executable leaves, each declaring an action and a verifiable result.

Why: once a layer can be written as actions with verifiable results, it is execution.

## Acceptance direction

The SKILL.md exists under `weave-your-work/split-to-task/`; a sample map is split into tasks, each with a body, a kind and an acceptance signal.

## Children

(none yet)

## Decisions so far

- Inherits the split criterion: write tasks when an action and a verifiable result can be written (user confirmed).

## Not yet specified

- Dependency edges between the tasks.
- How the structure freeze applies after the split.
- Who assigns the task owner.

## Out of scope

- Split to submap.
- Task skill content (body sections, kinds, claim, close).
