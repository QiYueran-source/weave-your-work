---
schema: 1
id: wm-p8wyd7jkmkhb
title: Split skill entry
category: map
status: closed
owner: frank
creator: frank
created_at: 2026-11-08T10:53:50Z
updated_at: 2026-11-08T10:54:00Z
closed_at: 2026-11-08T10:54:00Z
parent: wm-3nhrhmds8rqd
custom_fields:
  split_as: task
---
## Target

A reader holding a settled layer of a map finds one question in split's `SKILL.md` that settles whether the layer is child maps or tasks, and the name of the reference to open next.

Why: `submap.md` and `task.md` both start from the assumption that the choice is already made. Nothing else in the set makes it, so without this entry the two references have no way in.

## Acceptance direction

`weave-your-work/split/SKILL.md` exists and carries the routing question once, routes to exactly one of the two references, and names `body.md` and `frontmatter.md` without restating what they say.

All children are complete and no further children are needed.

Review point: open `SKILL.md` alone and check that a reader can tell which reference to open, and that no rule from `submap.md`, `task.md`, `body.md`, or `frontmatter.md` is repeated in it.

## Decisions so far

- The split skill is one entry plus two references. This map owns the entry; the sibling maps own the references. (user confirmed)
- The entry is where the freeze lives: it states that the first split writes `split_as` on the map and that the field never flips. (user confirmed)
- A map's own entry document is refined into a child map of its own, with the writing task under that map, so one layer keeps one child type. The writing task `wm-w87msnqhda40` moved here from the split map after it closed. (user confirmed)

## Not yet specified

(none; the fog is cleared)

## Out of scope

- The two references, `submap.md` and `task.md`.
- Clearing fog, and the lifecycle that decides when a split runs.
