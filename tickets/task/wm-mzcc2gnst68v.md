---
schema: 1
id: wm-mzcc2gnst68v
title: Write the glossary skill entry
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-08T11:24:43Z
updated_at: 2026-11-08T11:26:54Z
closed_at: 2026-11-08T11:26:54Z
parent: wm-rq3exm0m5563
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `weave-your-work/glossary/SKILL.md`, the skill that keeps one vocabulary while each operator writes only their own file.

1. State the trigger: a term is fuzzy, overloaded, or conflicts with the glossary; a reader needs the project's meaning; a grill settles a term.
2. Write the four moves: challenge the term against the glossary; sharpen fuzzy language into a canonical term; test the boundary with a concrete scenario; check how the project already uses the word.
3. Write the term: one JSONL line through `glossary_write` with the six fields; one operator writes only their own file; write the term when it resolves, not in a batch.
4. State the generated view: `GLOSSARY.md` is regenerated from `glossary/*.jsonl`; never edit it by hand; `glossary_merge` or the post-merge hook rebuilds it.
5. State the read path: `glossary_lookup`, `glossary_list`, and the generated view.
6. Point at `glossary-rules.md` for the writing constraints.
7. End with what it does not do: ADRs, testimony, ticket decisions, conflict resolution.

## Acceptance signal

`weave-your-work/glossary/SKILL.md` exists and installs with `npx skills add`. A reader given a fuzzy term can choose the canonical name, write one source line through the named tool, and say how the view is rebuilt; the file names the four moves, the six fields, the generated view, and the rules file, and never tells the reader to edit `GLOSSARY.md` by hand.

## Result

`weave-your-work/glossary/SKILL.md` is in place. It holds the four moves, the six source fields, the read path, the generated view, the rules pointer, and the boundaries. `npx skills add ./glossary --list` parsed the front matter and found 1 skill; a temp install copied it with no skip.

## Review

passed

- Goal: the `Acceptance signal` asks for a reader who can choose a canonical term, write one source line, and say how the view is rebuilt. The file names the tools, the fields, the view, and `glossary-rules.md`.
- Convention: no `Boundaries` line was crossed; the run wrote the skill file and this task's `Result` and `Review` only. The MCP server and hook are left to their own tasks, as the boundaries say.

## Boundaries

- No MCP server or hook implementation; those are their own tasks.
- No ADR or testimony format.
- No same-name conflict resolution.
