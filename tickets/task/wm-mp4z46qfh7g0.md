---
schema: 1
id: wm-mp4z46qfh7g0
title: Implement the glossary store and MCP server
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-08T11:24:43Z
updated_at: 2026-11-08T13:16:47Z
closed_at: 2026-11-08T13:16:47Z
parent: wm-rq3exm0m5563
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Build the glossary source store and the four MCP tools so a skill can read and write terms without touching another operator's file.

1. Define the source: `glossary/<operator>.jsonl`, one JSON object per line with `term`, `definition`, `avoid`, `group`, `created_at`, `updated_at`.
2. Implement `glossary_write`: append one line to the current operator's file; reject a write aimed at another operator's file; set both timestamps.
3. Implement `glossary_lookup`: return one term with its definition, avoid list, group, and source file.
4. Implement `glossary_list`: return every merged term.
5. Implement `glossary_merge`: read all `glossary/*.jsonl`, keep the latest `updated_at` per term, and write root `GLOSSARY.md` with a `_Source_` line per term.
6. Register the server in the harness configuration; setup installs it.

## Acceptance signal

`glossary_write` appends only to the calling operator's file and rejects another operator's file. `glossary_lookup` returns one term, `glossary_list` returns the merged terms, and `glossary_merge` rebuilds `GLOSSARY.md` from two scratch operator files. A reader who did not write the server can open the view and see both terms with their sources.

## Result

The Node store and MCP server are in place: `glossary.js` (list, lookup, write, merge; standard library), `server.js` (the four MCP tools through the SDK), and `package.json`. Tested with the MCP client against two operator sources: `glossary_write` appended gamma to alice's file, Bob's file stayed unchanged, `glossary_lookup` returned Bob's latest alpha, `glossary_list` returned all three, and `glossary_merge` rebuilt `GLOSSARY.md` with the source lines. The CLI merge reproduces the Python-generated view byte for byte.

## Review

passed

- Goal: the `Acceptance signal` asks for the four tools and a merged view from two scratch sources. The MCP client test covers each tool, and the view names Bob's alpha and alice's beta and gamma with their sources.
- Convention: no `Boundaries` line was crossed; the run wrote the two skill files, `package.json`, the `.gitignore` entry, and this task's `Result` and `Review` only. The hook, conflict resolution, and ticket writes are still out of scope.

## Boundaries

- No post-merge hook; that is its own task.
- No same-name conflict resolution.
- No ticket or testimony writes.
