---
schema: 1
id: wm-8zyyyafxbdwr
title: Map front matter and dependencies
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-07T05:53:00Z
updated_at: 2026-11-07T05:53:00Z
parent: wm-0b59r7xfhk73
---
## Target

Design the front matter reference for the map skill: define what each front matter field means, who writes it, and the dependency rules, so a map's front matter stays consistent, ordering lives in dependency edges, and the tree stays in sync.

Why: front matter currently rests on a one-line decision (split_as plus the waymark fields) with no field-level inventory, and dependency semantics are spread across the glossary and the dependencies example; there is no authoritative reference a map, split, or the operating procedure can point to.

## Acceptance direction

The `frontmatter.md` reference exists under `weave-your-work/map/`. It defines the field inventory, the write-ownership matrix, and the dependency rules (when an edge is needed, its direction, the parent-child rule, and the verification steps), and a sample map's front matter can be read and updated from it.

All children are complete and no further children are needed.

Review point: Check that the reference names each front matter field and who writes it, and that the dependency rules cover when an edge is needed, direction, the parent-child rule, and verification.

## Children

(none yet; the reference is not split into tasks until the task skill is settled)

## Decisions so far

- Front matter management is a reference of the map skill: a separate `frontmatter.md` alongside `body.md` (content rules) and the operating procedure reference (workflow rules). It is designed in its own child map. Source: user confirmation.
- The reference lists map front matter fields only; task front matter (task_kind, reversibility) belongs to the task skill. Dependency rules are node-agnostic and are written here as the shared rule; the task skill references them. Source: user confirmation.
- The owner is the only one who writes a map's front matter (advance): status, custom fields, dependencies, owner transfer. Skills write only their own fields at their landings: split writes split_as, parent, and Children; review writes closed and outcome; archive writes archived_at and archive_reason. Source: user confirmation.
- Dependency rules: parent-child is a natural dependency and gets no explicit edge (a parent's acceptance waits for its children; a child never waits for its parent, which would be a loop). An explicit edge is used for sibling or cross-branch waits: direction is waiter to blocked (`waymark dependency add <ID> <BLOCKING_ID>`), dependencies live only in front matter (the body never mirrors them), and after wiring run `waymark dep tree`, `waymark ready`, and `waymark blocked` to verify. Source: user confirmation.
- The operating procedure waits on this child map: its dependency list includes the front matter and dependencies map. Source: user confirmation.

## Not yet specified

- The exact reference name and location (default: `frontmatter.md` under `weave-your-work/map/`).
- Whether soft links (`waymark link`) belong in the reference or stay in node-outcome flows.
- Whether the write-ownership matrix covers field-level notes (updated_at bumping, custom field usage).

## Out of scope

- Map body content rules (`body.md`).
- Map lifecycle workflow (the operating procedure reference).
- Task front matter fields and task-level dependency rules (task skill).
