---
schema: 1
id: wm-zhxe0hsnpf34
title: Isolate issue tools and listener per project
category: map
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T10:38:58Z
updated_at: 2026-11-10T11:48:26Z
closed_at: 2026-11-10T11:48:26Z
parent: wm-wjwa9081hse1
dependencies:
  - wm-tmjgw2zn143y
custom_fields:
  split_as: task
---
## Target

Issue tools installed from a global skill use the selected project and keep each checkout listener and queue isolated.

Why: a shared global skill must not share project rosters, queues, service settings, or webhook events across projects.

## Acceptance direction

A global issue skill can be set up for two independent projects without shared project data or service conflicts.

Review point: project-local runtime and dependencies, tracked roster, ignored queue, repository checks, single-writer protection, service configurations, and tests for two projects and fresh setup.

## Decisions so far

- Follow the issue, service, webhook, and first-release decisions in [Setup skill](wm-ygnttse5hd5k.md).

- Each independently installed bundle carries a byte-identical copy of `project-root.cjs`; the setup integration map verifies all copies match. (user confirmed, 2026-11-10)
- Project-local runtime: `.work-weave/runtime/issue/` holds the tool copy, package files and `node_modules`; `.work-weave/local/issue-listener.env` holds checkout-specific settings; the default queue is `.work-weave/pending/pending-communications.md`; the shared roster is `.work-weave/issue/handles.toml`. (user confirmed, 2026-11-10)
- The roster task `wm-ssfcjp9hxbxh` is revised in place to the new roster path; its legacy fallback and old candidate paths are dropped. (user confirmed, 2026-11-10)
- The listener service is `work-weave-issue-<first 8 hex of sha256 of the physical project root>.service`. Checkout settings live in `.work-weave/local/issue-listener.env`. Linux uses a systemd user service; macOS remains unverified; Windows runs in the foreground. (user confirmed, 2026-11-10)
- The listener takes an exclusive lock at `.work-weave/pending/.lock`, created atomically and recording pid and start time. A live same-host pid rejects a second instance; a dead pid or stale lock is logged and taken over. (user confirmed, 2026-11-10)

## Not yet specified

- ~~Decision to make: determine service identity, lock implementation, local configuration, and the exact installation and validation steps.
  Why it matters: the listener must isolate projects and refuse conflicting queue writers without pretending unauthenticated webhook data is trusted.~~
  Resolved on 2026-11-10: the decisions above settle identity, paths, and lock semantics; the tasks carry the install and validation steps.
- ~~Decision to make: reconcile the existing roster separation task and issue map with the confirmed layout.
  Why it matters: their old paths and compatibility fallback conflict with the new project boundary.~~
  Resolved on 2026-11-10: revise `wm-ssfcjp9hxbxh` in place and keep this map as the issue integration owner.
- ~~Decision to make: determine how the issue bundle receives and verifies a consistent copy of the project-root resolver without relying on another installed skill.
  Why it matters: issue must work when installed independently and validate the same project boundary.~~
  Resolved on 2026-11-10: the bundle carries its own copy; the setup integration map owns the cross-bundle equality check.

## Review

passed

- Goal: the three closed tasks deliver project-root resolution, roster and queue paths under `.work-weave/`, repository rejection, the exclusive queue lock, and a per-checkout runtime and hashed systemd unit. The issue suite passed 53 tests on Linux, including two project roots with separate rosters and queues and a rejected second listener. `.work-weave/issue/handles.toml` is tracked and the queue directory is ignored. macOS remains an unverified LaunchAgent template; Windows is foreground only, as recorded.
- Convention: the map split into three tasks, all closed, under `split_as: task`; its only dependency is the closed root contract. The body holds no children index, and no unresolved fog remains. The global-install end-to-end run belongs to the setup integration map and is not claimed here.
