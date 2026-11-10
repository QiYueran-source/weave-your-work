---
schema: 1
id: wm-0xzjh4wde202
title: Run glossary tools against project-local sources
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-10T11:24:54Z
updated_at: 2026-11-10T11:24:54Z
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

## Boundaries

- No setup, runtime install, MCP registration, hook, migration, or ADR change; the install task owns those.
- No change to the term schema, merge conflict policy, or operator rule.
