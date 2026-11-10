---
schema: 1
id: wm-tmjgw2zn143y
title: Project root and work-weave directory contract
category: map
status: in_progress
owner: frank
creator: frank
created_at: 2026-11-10T10:38:48Z
updated_at: 2026-11-10T10:51:21Z
parent: wm-wjwa9081hse1
custom_fields:
  split_as: task
---
## Target

A work-weave project has one confirmed root for Git, Waymark, and project-local work-weave data.

Why: globally installed tools must not mistake their own location or an enclosing project for the project they serve.

## Acceptance direction

A project root contract specifies initial setup and normal discovery, aligned Git, Waymark, and work-weave markers, and the shared and local directory boundaries.

Review point: the delivered project-root contract and checks cover fresh projects, nested directories, explicit paths, worktrees, missing markers, and conflicting ancestor projects.

## Decisions so far

- Follow the confirmed project directory and discovery decisions in [Setup skill](wm-ygnttse5hd5k.md).
- The Git worktree marker `.git`, `.waymark/`, and `.work-weave/` are peers directly under one project root; none is nested inside another. Git worktrees may use a `.git` file instead of a directory. (user confirmed, 2026-11-10)
- This map delivers root-discovery code and tests as well as the written contract, not rules alone. Downstream issue and glossary maps integrate the result. (user confirmed, 2026-11-10)
- The setup skill carries a Node module with no third-party dependencies, a command-line entry, and automated tests. Normal discovery finds the nearest `.work-weave/` and validates all three markers; an explicit path validates that directory only. The setup flow owns first-time root confirmation and creation. Issue and glossary later carry the module in their own project runtimes without assuming another skill is installed. (user confirmed, 2026-11-10)

## Not yet specified

- Decision to make: define the module interface, command, test cases, and how downstream bundles receive a consistent copy.
  Why it matters: the independently installed skills must apply the same root validation without relying on a neighboring skill directory.
