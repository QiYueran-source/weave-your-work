---
schema: 1
id: wm-6fqd0tpy3bc0
title: Write the glossary rules
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

Write `glossary-rules.md`, the writing constraints the glossary skill points at and setup installs under `.agents/rules/`.

1. One term per line; define what the term is, not what it does.
2. List the words to avoid; keep one canonical name per concept.
3. Write only your own `glossary/<operator>.jsonl`; never edit `GLOSSARY.md` by hand and never write another operator's file.
4. Use `group` only when a cluster exists; keep definitions to one or two sentences.
5. Check the existing glossary and the project's use of the word before adding a term.

## Acceptance signal

`glossary-rules.md` exists; every rule is a writing instruction a person or an agent can apply to one term. The glossary skill points at it. A reader given a fuzzy term can apply the rules without opening another file.

## Result

`weave-your-work/glossary/glossary-rules.md` is in place: seven writing rules a person or an agent can apply to one term. The glossary `SKILL.md` points at it.

## Review

passed

- Goal: the `Acceptance signal` asks for a rules file the skill points at and a reader can apply. Both hold; the rules are one-term instructions.
- Convention: no `Boundaries` line was crossed; the run wrote the rules file, removed the setup-copy clause from the acceptance because setup owns that action, and wrote this task's `Result` and `Review` only.

## Boundaries

- No term definitions; the glossary view holds those.
- No MCP server or hook design.
