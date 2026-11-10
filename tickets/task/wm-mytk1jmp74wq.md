---
schema: 1
id: wm-mytk1jmp74wq
title: Implement and test project root resolution
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-10T10:51:22Z
updated_at: 2026-11-10T10:51:22Z
parent: wm-tmjgw2zn143y
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Deliver a project-root resolver and written installation contract that apply the confirmed project boundary without changing project data.

1. Add a dependency-free Node module and command-line entry under `weave-your-work/setup/bundle/tools/`. For normal discovery, search from the working directory upward for the nearest `.work-weave/`; validate that chosen root rather than falling through to a more distant project. For an explicit `--project` path, validate that exact directory without searching upward.
2. Validate `.work-weave/`, local `.waymark/config.toml`, and a Git worktree whose top-level directory is the selected root. Accept a `.git` file for a worktree. Resolve physical paths before comparing them and report a clear failure when discovery or validation fails. The resolver reads state and does not initialize or modify a project.
3. Revise `weave-your-work/setup/bundle/rules/rules-install.md` to state the confirmed first-time confirmation, root markers, runtime discovery and shared/local layout, without unsupported claims about agent rule discovery or Node package resolution. First-time creation and interactive confirmation stay in the setup flow.
4. Add automated Node tests using temporary repositories and worktrees. Cover valid root and subdirectory discovery, closest nested marker, missing and invalid markers, explicit paths without upward fallback, enclosing Git and Waymark projects, a Git worktree with a `.git` file, and command-line success and failure.

## Acceptance signal

The resolver and command return the same validated absolute root for a valid project and fail without returning an enclosing or unrelated project for invalid input. `node --test` runs the new tests successfully and their fixtures demonstrate the cases named in Action. The installation rule states the confirmed layout and no longer asserts that an enclosing Git root is automatically the intended project.

## Boundaries

- Do not integrate the resolver into issue, glossary, setup flows, hooks, services, or the existing checkout in this task; their maps own those changes.
- Do not decide or implement how issue and glossary receive consistent copies of the module.
- Do not overwrite installed rule copies that differ; the existing rule-conflict policy requires a human decision.
- Do not add runtime upgrades, rollback, or legacy-layout compatibility.
