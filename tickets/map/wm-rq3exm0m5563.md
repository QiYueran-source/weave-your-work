---
schema: 1
id: wm-rq3exm0m5563
title: Glossary skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T11:43:18Z
updated_at: 2026-11-06T12:44:22Z
parent: wm-qhd3twqjzhma
custom_fields:
  phase: exploring
  task_kind: delivery
---
## Target

Design the glossary skill so a team keeps one vocabulary while each person writes only their own file: capture a term as JSONL, dedupe and merge into one generated view, constrain later writing with a rules file, and let setup install the pieces.
Why: a shared glossary with many editors conflicts on every change; per-person JSONL sources plus a generated view keep the writing surface small and the reading surface whole.

## Acceptance direction

All child tasks are complete and no further child task is needed: the SKILL.md, the MCP server, the hooks, and the rules exist under `weave-your-work/glossary/`; one term written plus a simulated pull shows the term in the generated view; and SKILL.md covers the four moves borrowed from matt's domain-modeling.

## Children

- (none yet; the pieces below are still fog)

## Decisions so far

- Identity: operator first, git `user.name` fallback.
- MCP tools: `glossary_lookup`, `glossary_list`, `glossary_write`, `glossary_merge`; no tool takes another person's file.
- Source: `.glossary/<operator>.jsonl`, one term per line with `term`, `definition`, `avoid`, `group`, `created_at`, `updated_at`.
- Generated view: `.agents/docs/GLOSSARY.md`, ignored, following matt's GLOSSARY-FORMAT.md plus a `_Source_` line per term.
- Same-name conflict rules are deferred.

## Not yet specified

- SKILL.md content: how to settle a term, merge and dedupe, and write the constraints.
- The MCP server and hook implementations.
- The merge format details and the conflict entry shape.

## Out of scope

- Setup's installation work (environment map).
- Same-name conflict rules (deferred).
