---
schema: 1
id: wm-hy7r0dkp4see
title: Amend the bundle rule for usage documents
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T00:47:58Z
updated_at: 2026-11-10T01:39:34Z
closed_at: 2026-11-10T01:39:34Z
parent: wm-ygnttse5hd5k
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Amend `.agents/rules/rules-bundles.md` so its usage sentence matches the set's practice.

1. Replace the sentence "The skill root carries `SKILL.md` and `usage.md`..." with one that says the skill root carries `SKILL.md` and its usage documents; a skill with one usage document names it `usage.md`; a skill whose use splits by flow names each document after the flow.
2. Keep the rest of the paragraph's meaning: usage is usage-only and does not repeat the install steps; `SKILL.md` points at `bundle/setup.md` for install and at the usage documents for use.
3. Leave the rest of the rule unchanged.

## Acceptance signal

The amended sentence allows a skill with two flow documents and no `usage.md`. Reading the rule against `weave-your-work/setup/` and `weave-your-work/map/` finds no contradiction, and the five-section and three-state requirements are unchanged.

## Boundaries

- No other rule files.
- No skill files; setup's documents are other tasks.
