---
schema: 1
id: wm-tmjgw2zn143y
title: Project root and work-weave directory contract
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-10T10:38:48Z
updated_at: 2026-11-10T10:38:48Z
parent: wm-wjwa9081hse1
---
## Target

A work-weave project has one confirmed root for Git, Waymark, and project-local work-weave data.

Why: globally installed tools must not mistake their own location or an enclosing project for the project they serve.

## Acceptance direction

A project root contract specifies initial setup and normal discovery, aligned Git, Waymark, and work-weave markers, and the shared and local directory boundaries.

Review point: the delivered project-root contract and checks cover fresh projects, nested directories, explicit paths, worktrees, missing markers, and conflicting ancestor projects.

## Decisions so far

- Follow the confirmed project directory and discovery decisions in [Setup skill](wm-ygnttse5hd5k.md).

## Not yet specified

- Decision to make: choose the concrete contract artifact and the implementation and test boundary for discovery and root validation.
  Why it matters: downstream tools and setup need one executable, testable interpretation rather than inconsistent path guesses.
