---
schema: 1
id: wm-8zyyyafxbdwr
title: Map front matter and dependencies
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-07T05:53:00Z
updated_at: 2026-11-08T07:39:05Z
parent: wm-0b59r7xfhk73
---
## Target

Design the front matter reference for the map skill: define the skill's custom fields, the dependency rules (direction and timing), and the front matter audit, so a map's front matter stays consistent, ordering lives in dependency edges, and the tree stays in sync.

Why: front matter currently rests on a one-line decision (split_as plus the waymark fields), and dependency semantics are spread across the glossary and the dependencies example; there is no authoritative reference a map, split, or the operating procedure can point to.

## Acceptance direction

The `frontmatter.md` reference exists under `weave-your-work/map/`. It points readers to `waymark --help` for the core fields, defines the skill's custom fields and who writes them, states the waymark-only writing practice, defines the dependency rules (direction and timing), and lists the front matter violations an accepting party checks.

All children are complete and no further children are needed.

Review point: Check that the reference covers the custom fields with their writers, the dependency direction and timing rules, and the violation list; and that a sample map's front matter can be read and updated from it.

## Decisions so far

- Front matter management is a reference of the map skill: a separate `frontmatter.md` alongside `body.md` (content rules) and the operating procedure reference (workflow rules). It is designed in its own child map. Source: user confirmation.
- The reference lists map front matter fields only; task front matter (task_kind, reversibility) belongs to the task skill. Dependency rules are node-agnostic and are written here as the shared rule; the task skill references them. Source: user confirmation.
- The owner is the only one who writes a map's front matter (advance): status, custom fields, dependencies, owner transfer. Skills write only their own fields at their landings: split writes split_as and parent on the child it creates; review writes closed and outcome; archive writes archived_at and archive_reason. No skill edits another owner's body to record a relation. Source: user confirmation.
- Dependency rules: parent-child is a natural dependency and gets no explicit edge (a parent's acceptance waits for its children; a child never waits for its parent, which would be a loop). An explicit edge is used for sibling or cross-branch waits: dependencies live only in front matter (the body never mirrors them), and after wiring run `waymark dep tree`, `waymark ready`, and `waymark blocked` to verify. Source: user confirmation.
- Dependency direction: a node A may depend on a node B only when B can be implemented without A — the blocked node must be independently implementable. The operating procedure may wait on task details because a task is implemented without the procedure; the reverse is invalid, and that is why a finer node never waits on the map that abstracts it. Source: user confirmation.
- Dependency timing: an edge is added after the discussion is settled — grill the relation first, wire the edge last. A completed blocker keeps its edge as history; the owner removes an edge when the wait no longer holds. Source: user confirmation (timing); the history-and-removal practice follows the earlier recommendation.
- The operating procedure waits on this child map: its dependency list includes the front matter and dependencies map. Source: user confirmation.
- The reference is named `frontmatter.md` and lives under `weave-your-work/map/`, alongside `body.md` and the operating procedure reference. It points readers to `waymark --help` for the core fields instead of repeating them, and it defines the skill's custom fields — split_as (submap / task, written by split at the first split, never flipped), outcome (failed, written by review when closing a failed node), task_kind (delivery / probe, task tickets only) — each with who writes it. Source: user confirmation.
- Soft links (`waymark link`) are covered descriptively, not as requirements: the reference says a link is typically added when a failed node is replaced by a sibling, and that waymark maintains links symmetrically on both sides (`waymark link add` / `link remove`); links are not dependencies and do not affect readiness. Source: user confirmation.
- Every front matter change goes through a waymark command; a ticket's front matter is never hand-edited. Body edits prefer waymark's methods (`waymark body replace`) so `updated_at` stays consistent. Source: user confirmation.
- Front matter audit: the reference ends with a Checking front matter list naming the violations — hand-edited front matter, a reverse dependency (the blocked node is not independently implementable), an explicit parent-child edge, an undeclared custom field, a flipped split_as, an invalid status, a stale updated_at, and a dangling reference. Machine-checkable items (undeclared fields, invalid status, dangling references) fall back to `waymark validate` and command validation; the semantic items (direction, parent-child edges, split_as, updated_at) are checked by the accepting party at acceptance. Owner self-checks after a change are optional; who accepts belongs to the review skill. Source: user confirmation.

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
- The review skill's acceptance rules (who accepts, when review runs).
