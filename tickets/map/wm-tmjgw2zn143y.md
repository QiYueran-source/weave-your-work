---
schema: 1
id: wm-tmjgw2zn143y
title: Project root and work-weave directory contract
category: map
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T10:38:48Z
updated_at: 2026-11-10T11:18:05Z
closed_at: 2026-11-10T11:18:05Z
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

- ~~Decision to make: define the module interface, command, test cases, and how downstream bundles receive a consistent copy.
  Why it matters: the independently installed skills must apply the same root validation without relying on a neighboring skill directory.~~
  Resolved on 2026-11-10: [the resolver task](../task/wm-mytk1jmp74wq.md) delivered the interface, command and tests. How the issue and glossary bundles receive consistent copies remains open on their respective maps; this contract does not decide the distribution mechanism.

## Review

passed

- Goal: the setup bundle installation rule records first-time root confirmation, marker alignment and the shared/local directory contract. The root resolver and CLI validate initialized projects; the closed child task records 14 passing Linux tests for nested projects, explicit paths, worktrees, missing and overlapping markers, and ancestor conflicts. First-time initialization remains owned by the setup integration map.
- Convention: the single child is a closed delivery task, matching `split_as: task`; the map has no dependencies. The unresolved bundle distribution mechanism was handed to the issue and glossary maps, consistent with the child task's boundaries.
