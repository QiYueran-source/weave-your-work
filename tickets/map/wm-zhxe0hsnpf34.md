---
schema: 1
id: wm-zhxe0hsnpf34
title: Isolate issue tools and listener per project
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-10T10:38:58Z
updated_at: 2026-11-10T11:11:28Z
parent: wm-wjwa9081hse1
dependencies:
  - wm-tmjgw2zn143y
---
## Target

Issue tools installed from a global skill use the selected project and keep each checkout listener and queue isolated.

Why: a shared global skill must not share project rosters, queues, service settings, or webhook events across projects.

## Acceptance direction

A global issue skill can be set up for two independent projects without shared project data or service conflicts.

Review point: project-local runtime and dependencies, tracked roster, ignored queue, repository checks, single-writer protection, service configurations, and tests for two projects and fresh setup.

## Decisions so far

- Follow the issue, service, webhook, and first-release decisions in [Setup skill](wm-ygnttse5hd5k.md).

## Not yet specified

- Decision to make: determine service identity, lock implementation, local configuration, and the exact installation and validation steps.
  Why it matters: the listener must isolate projects and refuse conflicting queue writers without pretending unauthenticated webhook data is trusted.
- Decision to make: reconcile the existing roster separation task and issue map with the confirmed layout.
  Why it matters: their old paths and compatibility fallback conflict with the new project boundary.

- Decision to make: determine how the issue bundle receives and verifies a consistent copy of the project-root resolver without relying on another installed skill.
  Why it matters: issue must work when installed independently and validate the same project boundary.
