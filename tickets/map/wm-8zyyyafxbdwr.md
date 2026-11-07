---
schema: 1
id: wm-8zyyyafxbdwr
title: Map front matter and dependencies
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-07T05:53:00Z
updated_at: 2026-11-07T06:13:09Z
parent: wm-0b59r7xfhk73
---
## Target

Design the front matter reference for the map skill: define what each front matter field means, who writes it, and the dependency rules, so a map's front matter stays consistent, ordering lives in dependency edges, and the tree stays in sync.

Why: front matter currently rests on a one-line decision (split_as plus the waymark fields) with no field-level inventory, and dependency semantics are spread across the glossary and the dependencies example; there is no authoritative reference a map, split, or the operating procedure can point to.

## Acceptance direction

The `frontmatter.md` reference exists under `weave-your-work/map/`. It introduces waymark's core fields and the skill's custom fields, states that every front matter change goes through waymark, and defines the dependency rules (when an edge is needed, its direction, the parent-child rule, and the verification steps).

All children are complete and no further children are needed.

Review point: Check that the reference names each front matter field and who writes it, that it states the waymark-only writing practice, and that the dependency rules cover when an edge is needed, direction, the parent-child rule, and verification. A sample map's front matter can be read and updated from it.

## Children

(none yet; the reference is not split into tasks until the task skill is settled)

## Decisions so far

- Front matter management is a reference of the map skill: a separate `frontmatter.md` alongside `body.md` (content rules) and the operating procedure reference (workflow rules). It is designed in its own child map. Source: user confirmation.
- The reference lists map front matter fields only; task front matter (task_kind, reversibility) belongs to the task skill. Dependency rules are node-agnostic and are written here as the shared rule; the task skill references them. Source: user confirmation.
- The owner is the only one who writes a map's front matter (advance): status, custom fields, dependencies, owner transfer. Skills write only their own fields at their landings: split writes split_as, parent, and Children; review writes closed and outcome; archive writes archived_at and archive_reason. Source: user confirmation.
- Dependency rules: parent-child is a natural dependency and gets no explicit edge (a parent's acceptance waits for its children; a child never waits for its parent, which would be a loop). An explicit edge is used for sibling or cross-branch waits: direction is waiter to blocked (`waymark dependency add <ID> <BLOCKING_ID>`), dependencies live only in front matter (the body never mirrors them), and after wiring run `waymark dep tree`, `waymark ready`, and `waymark blocked` to verify. Source: user confirmation.
- The operating procedure waits on this child map: its dependency list includes the front matter and dependencies map. Source: user confirmation.
- The reference is named `frontmatter.md` and lives under `weave-your-work/map/`, alongside `body.md` and the operating procedure reference. It reads as an introduction: waymark's core fields (schema, id, title, category, status, owner, creator, created_at, updated_at, parent, dependencies, plus the retired-state archived_at and archive_reason) and the skill's custom fields (split_as, outcome), each with what it holds and who writes it. Source: user confirmation.
- Soft links (`waymark link`) are covered descriptively, not as requirements: the reference says a link is typically added when a failed node is replaced by a sibling, and that waymark maintains links symmetrically on both sides (`waymark link add` / `link remove`); links are not dependencies and do not affect readiness. Source: user confirmation.
- Every front matter change goes through a waymark command; a ticket's front matter is never hand-edited. Body edits prefer waymark's methods (`waymark body replace`) so `updated_at` stays consistent. Source: user confirmation.

## Not yet specified

- ~~The exact reference name and location (default: `frontmatter.md` under `weave-your-work/map/`).~~
  Resolved: `frontmatter.md` under `weave-your-work/map/` (see Decisions so far).
- ~~Whether soft links (`waymark link`) belong in the reference or stay in node-outcome flows.~~
  Resolved: soft links are described in the reference without hard requirements (see Decisions so far).
- ~~Whether the write-ownership matrix covers field-level notes (updated_at bumping, custom field usage).~~
  Resolved: the reference states the waymark-only writing practice and field-level notes (see Decisions so far).

## Out of scope

- Map body content rules (`body.md`).
- Map lifecycle workflow (the operating procedure reference).
- Task front matter fields and task-level dependency rules (task skill).
