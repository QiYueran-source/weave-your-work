---
schema: 1
id: wm-0xzjh4wde202
title: Run glossary tools against project-local sources
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T11:24:54Z
updated_at: 2026-11-10T11:33:49Z
closed_at: 2026-11-10T11:33:49Z
parent: wm-2ztwvye6q9t7
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Deliver glossary tools that read and write the selected project's `.work-weave/glossary/` and never a checkout's old root `glossary/` or a shared skill copy.

1. Copy `weave-your-work/setup/bundle/tools/project-root.cjs` byte-for-byte to `weave-your-work/glossary/bundle/tools/project-root.cjs`, keeping the `.cjs` extension.
2. In `glossary.js` and `server.js`, resolve the project with `resolveProjectRoot`. Replace the `.waymark/config.toml` search and the fallback to the current directory. An explicit `--project` wins; otherwise discover from the working directory.
3. Read sources from `<root>/.work-weave/glossary/*.jsonl`, the header from `<root>/.work-weave/glossary/_header.md`, and write the current operator's file under the same directory. Write the generated view only to `<root>/GLOSSARY.md`.
4. When `.work-weave/` or `.work-weave/glossary/` is missing or invalid, exit non-zero with a clear message and do not create a view. Never report an empty glossary as success.
5. Add tests for two roots with different terms, a write in one root not appearing in the other, explicit and discovered roots, a missing marker, a missing glossary directory, the new header location, and the view only at the root. Keep the CLI and MCP tool names and argument shapes unchanged.

## Acceptance signal

`node --test` in `weave-your-work/glossary/bundle/tools/` passes. The tests show two independent vocabularies and views, and a missing `.work-weave/glossary/` exits non-zero without creating or overwriting `GLOSSARY.md`. The tools run under a `"type": "module"` package.

## Result

Delivered `project-root.cjs` in the glossary tools, project resolution through the shared contract, sources and header under `.work-weave/glossary/`, and the generated view only at the project root. A missing or invalid marker or glossary directory is a hard error; the tools refuse to report or write an empty glossary.

`node --test` in `weave-your-work/glossary/bundle/tools/` passed 10 tests on Linux, including two roots with separate vocabularies and views, write isolation, explicit and discovered roots, missing markers, a missing glossary directory without creating or overwriting `GLOSSARY.md`, the new header location, an empty glossary, and execution under a `type: module` project runtime. Windows and macOS were not tested.

Decisions: a missing `.work-weave/glossary/` fails every command; an empty source set or zero terms fails rather than writing a view; a missing `_header.md` uses the built-in header; the tools stay CommonJS with the runtime `package.json`; `--project` without a directory fails instead of falling back to discovery.

## Review

passed

- Goal: the tests exercise the acceptance signal, including two independent roots, no cross-read or cross-write, and a missing glossary directory that leaves the view untouched. The MCP tool names and argument shapes are unchanged.
- Convention: the change stays inside the glossary tools and their tests. No setup, runtime install, MCP registration, hook, migration, ADR, or term-schema change was made.

## Boundaries

- No setup, runtime install, MCP registration, hook, migration, or ADR change; the install task owns those.
- No change to the term schema, merge conflict policy, or operator rule.
