---
schema: 1
id: wm-ay1ksehch13t
title: Write the glossary usage reference
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-08T13:32:40Z
updated_at: 2026-11-08T13:32:52Z
closed_at: 2026-11-08T13:32:52Z
parent: wm-rq3exm0m5563
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `weave-your-work/glossary/usage.md`, the usage reference for the glossary tools: install, CLI, MCP registration, tool signatures, and troubleshooting.

1. Give the first-run sequence: `npm install` in `bundle/`, register the MCP server, call `glossary_list`, write a term, merge, check the view.
2. Document the CLI commands: `list`, `lookup`, `write`, `merge`, with the `--project` option and the flags.
3. Document the four MCP tools: arguments, return, errors; note that `glossary_write` writes only the current operator's file.
4. Show the stdio config shape: `node <skill>/bundle/server.js --project <root>`.
5. State the file layout: sources, header, generated view; the view is ignored and never hand-edited.
6. Add troubleshooting for the missing SDK, a not-found lookup, a stale view, and the wrong operator.

## Acceptance signal

`weave-your-work/glossary/usage.md` exists and `SKILL.md` points at it. A reader who has never run the glossary can install the dependencies, call the CLI, register the MCP server, call each of the four tools, and know which file to edit and which to leave generated. Every command matches the current `bundle/` code.

## Result

`weave-your-work/glossary/usage.md` is in place: first-run steps, the CLI commands, the four MCP tool signatures, the stdio config shape, the file layout, and troubleshooting. `SKILL.md` points at it. Every command matches the current `bundle/` code.

## Review

passed

- Goal: the `Acceptance signal` asks for a reader who can install, run the CLI, register the MCP server, call the four tools, and know which file to edit. The reference covers each, and the command shapes match `bundle/glossary.js` and `bundle/server.js`.
- Convention: no `Boundaries` line was crossed; the run wrote the reference, the `SKILL.md` pointer, and this task's `Result` and `Review` only.

## Boundaries

- No method (the four moves or when to write a term); that is `SKILL.md`.
- No hook or install implementation; those are separate tasks.
- No term definitions.
