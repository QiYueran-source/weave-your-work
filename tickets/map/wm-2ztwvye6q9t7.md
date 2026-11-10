---
schema: 1
id: wm-2ztwvye6q9t7
title: Isolate glossary tools and data per project
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-10T10:39:09Z
updated_at: 2026-11-10T11:11:28Z
parent: wm-wjwa9081hse1
dependencies:
  - wm-tmjgw2zn143y
---
## Target

Glossary tools installed from a global skill use the selected project's shared sources and produce its root glossary view.

Why: a global skill must not read or overwrite another project's vocabulary or install its dependencies in the shared skill directory.

## Acceptance direction

Two independent projects can use the global glossary skill with separate sources, local runtime dependencies, MCP registrations, and generated views.

Review point: `.work-weave/glossary/` source reads and writes, root `GLOSSARY.md`, project-local runtime, MCP and hook configuration, tests that verify contents and project isolation, and the updated layout decision.

## Decisions so far

- Follow the glossary, project directory, and first-release decisions in [Setup skill](wm-ygnttse5hd5k.md).

## Not yet specified

- Decision to make: define the exact install, migration of retained development data, MCP and hook validation, and tests.
  Why it matters: existing tooling assumes root glossary sources and can otherwise silently generate an empty view.
- Decision to make: reconcile the closed glossary map and project-layout ADR with the new source location.
  Why it matters: their recorded decisions describe the previous layout.

- Decision to make: determine how the glossary bundle receives and verifies a consistent copy of the project-root resolver without relying on another installed skill.
  Why it matters: glossary must work when installed independently and validate the same project boundary.
