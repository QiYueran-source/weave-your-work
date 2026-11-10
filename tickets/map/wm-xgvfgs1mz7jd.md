---
schema: 1
id: wm-xgvfgs1mz7jd
title: Set up a project from globally installed skills
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-10T10:39:21Z
updated_at: 2026-11-10T10:39:21Z
parent: wm-wjwa9081hse1
dependencies:
  - wm-2ztwvye6q9t7
  - wm-tmjgw2zn143y
  - wm-zhxe0hsnpf34
---
## Target

A team can initialize or join a project using globally installed work-weave skills while the project's data and dependencies stay inside the project.

Why: global skill installation should work without writing one project's configuration or dependencies into a shared skill directory.

## Acceptance direction

A fresh project and a fresh clone can complete setup using the globally installed skill set, with project-local data and runtime and checks that verify the actual installation.

Review point: setup flows and rules, global skill discovery, checks 11–13, reproducible installation and two-project isolation evidence, plus explicit reporting of platform limitations.

## Decisions so far

- Follow the confirmed first-release and setup decisions in [Setup skill](wm-ygnttse5hd5k.md).

## Not yet specified

- Decision to make: reconcile existing setup tasks and the clone probe with the new project contract and bundle outputs.
  Why it matters: existing flows and checks assume project-local skills and legacy data paths.
- Decision to make: specify the end-to-end acceptance procedure and test fixtures.
  Why it matters: a passing check that discovers no global rules must not be mistaken for a working install.
