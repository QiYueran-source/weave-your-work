---
schema: 1
id: wm-8zyyyafxbdwr
title: Map front matter and dependencies
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-07T05:53:00Z
updated_at: 2026-11-08T09:07:41Z
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
- Hanging a child under someone else's map is not a write to that map. `parent` lives on the child, so `waymark create --parent <id>` and `waymark parent set <own child> <id>` touch only the child; verified in waymark 0.1.0, where `parent set`, `parent clear`, and `create --parent` leave the parent's file byte-identical. The question is not permission but consent: the child's owner may write their own row, and the parent's owner still decides what belongs in their map. (user confirmed)
- Two waymark operations cross ownership: `waymark link add` / `link remove` writes both tickets because a soft link is symmetric, and `waymark archive` rewrites every ticket that points at the archived node, removing inbound dependencies and soft links from files its owner does not own. Both proceed; the foreign owner is told afterwards in an issue. Blocking instead was tried and dropped: the write is the only way to retire a node others depend on, and a rule that cannot be obeyed in the common case gets worked around. (user confirmed)
- Telling the owner is a step of the operation, not a courtesy: the issue names the relation that disappeared and the id that replaced the node, so the owner can re-point the edge or accept the archived outcome. An archive with no replacement id has nothing to tell them, which is why retiring a node and naming its successor happen together. (user confirmed)
- Archiving changes what a dependent may do, not only what its file says: with a ticket of carol's depending on kim's node, archiving the node moves carol's ticket from `blocked` to `ready`. The file edit is visible in the diff; the change in her plan is not. That is what the issue is for. (verified in waymark 0.1.0)
- Whether a child may hang under someone else's map follows the parent's state, not the parent's owner, and waymark enforces none of it — `create --parent` happily hangs a child under a closed map nobody asked. The rule is ours:

  | Child | Parent state | What the operator does |
  |---|---|---|
  | task | open | hang directly with `create --parent` |
  | map | open | hang directly; the parent is still being built, so a new branch is ordinary advance |
  | any | closed | do not hang. Open an issue asking the owner to reopen, then hang once they do |

  A closed node asserts a verdict — its acceptance said every child is complete — so a child appearing under it falsifies that verdict without the owner ever agreeing. (user confirmed)
- While the issue is open, the child is not blocked: create it as an isolated node with no parent, record `Intended parent: <id>, waiting on <issue link>` in its own body, and do the real work there. `parent set` happens when the owner reopens. Everything in the preparation is a write to the operator's own ticket. (user confirmed)
- The preparation does not use a soft link, and the reason is narrower than it looks. `waymark link add` writes both tickets, so the link would be a write to a foreign file before that owner has agreed to anything; the intent lives in the child's body instead. This does not contradict the archive ruling above: archiving a depended-on node has no alternative, while waiting on a parent has one. (verified in waymark 0.1.0)
- The owner is the only one who writes a map's front matter (advance): status, custom fields, dependencies, owner transfer. Skills write only their own fields at their landings: split writes split_as and parent on the child it creates; review writes closed and outcome; archive writes archived_at and archive_reason. No skill edits another owner's body to record a relation. The two exceptions are waymark commands that write both ends by construction — `link add` / `link remove` and `archive`'s inbound cleanup — and a skill that reaches one of them across ownership files the hand-over issue straight after. Source: user confirmation.
- Dependency rules: parent-child is a natural dependency and gets no explicit edge (a parent's acceptance waits for its children; a child never waits for its parent, which would be a loop). An explicit edge is used for sibling or cross-branch waits: dependencies live only in front matter (the body never mirrors them), and after wiring run `waymark dep tree`, `waymark ready`, and `waymark blocked` to verify. Source: user confirmation.
- Dependency direction: a node A may depend on a node B only when B can be implemented without A — the blocked node must be independently implementable. The operating procedure may wait on task details because a task is implemented without the procedure; the reverse is invalid, and that is why a finer node never waits on the map that abstracts it. Source: user confirmation.
- Dependency timing: an edge is added after the discussion is settled — grill the relation first, wire the edge last. A completed blocker keeps its edge as history; the owner removes an edge when the wait no longer holds. Source: user confirmation (timing); the history-and-removal practice follows the earlier recommendation.
- The operating procedure waits on this child map: its dependency list includes the front matter and dependencies map. Source: user confirmation.
- The reference is named `frontmatter.md` and lives under `weave-your-work/map/`, alongside `body.md` and the operating procedure reference. It points readers to `waymark --help` for the core fields instead of repeating them, and it defines the skill's custom fields — split_as (submap / task, written by split at the first split, never flipped), outcome (failed, written by review when closing a failed node), task_kind (delivery / probe, task tickets only) — each with who writes it. Source: user confirmation.
- Soft links (`waymark link`) are covered descriptively, not as requirements: the reference says a link is typically added when a failed node is replaced by a sibling, and that waymark maintains links symmetrically on both sides (`waymark link add` / `link remove`); links are not dependencies and do not affect readiness. Because the write is symmetric, a link that crosses ownership writes the foreign ticket, and the owner is told in an issue afterwards rather than left to find it in a diff. Source: user confirmation.
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
