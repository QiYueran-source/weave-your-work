---
schema: 1
id: wm-2ztwvye6q9t7
title: Isolate glossary tools and data per project
category: map
status: in_progress
owner: frank
creator: frank
created_at: 2026-11-10T10:39:09Z
updated_at: 2026-11-10T11:24:01Z
parent: wm-wjwa9081hse1
dependencies:
  - wm-tmjgw2zn143y
custom_fields:
  split_as: task
---
## Target

Glossary tools installed from a global skill use the selected project's shared sources and produce its root glossary view.

Why: a global skill must not read or overwrite another project's vocabulary or install its dependencies in the shared skill directory.

## Acceptance direction

Two independent projects can use the global glossary skill with separate sources, local runtime dependencies, MCP registrations, and generated views.

Review point: `.work-weave/glossary/` source reads and writes, root `GLOSSARY.md`, project-local runtime, MCP and hook configuration, tests that verify contents and project isolation, and the updated layout decision.

## Decisions so far

- Follow the glossary, project directory, and first-release decisions in [Setup skill](wm-ygnttse5hd5k.md).

- Each independently installed bundle carries a byte-identical copy of `project-root.cjs`; the setup integration map verifies all copies match. (user confirmed, 2026-11-10)
- Sources and the view header live under `.work-weave/glossary/`; the generated view stays at root `GLOSSARY.md`. The runtime, dependencies, and MCP entry point live under `.work-weave/runtime/glossary/`. (user confirmed, 2026-11-10)
- Existing `glossary/frank.jsonl` and `glossary/_header.md` move into `.work-weave/glossary/`; the old copies are kept until the regenerated view is checked, and no retained data is deleted without inspection. (user confirmed, 2026-11-10)
- A missing or invalid `.work-weave/` is a hard error. The tools never fall back to the current directory or an enclosing tracker, and never report an empty glossary as success. (user confirmed, 2026-11-10)
- The post-merge hook uses the checkout's project runtime and keeps the existing no-overwrite policy. ADR 0001 is amended for the source location; the closed glossary map stays closed as history and is referenced, not silently rewritten. (user confirmed, 2026-11-10)

## Not yet specified

- ~~Decision to make: define the exact install, migration of retained development data, MCP and hook validation, and tests.
  Why it matters: existing tooling assumes root glossary sources and can otherwise silently generate an empty view.~~
  Resolved on 2026-11-10: the decisions above settle paths and migration; the tasks carry install, validation, and tests.
- ~~Decision to make: reconcile the closed glossary map and project-layout ADR with the new source location.
  Why it matters: their recorded decisions describe the previous layout.~~
  Resolved on 2026-11-10: amend ADR 0001 and reference the closed map from this map; do not reopen it.
- ~~Decision to make: determine how the glossary bundle receives and verifies a consistent copy of the project-root resolver without relying on another installed skill.
  Why it matters: glossary must work when installed independently and validate the same project boundary.~~
  Resolved on 2026-11-10: the bundle carries its own copy; the setup integration map owns the cross-bundle equality check.
