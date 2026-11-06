---
schema: 1
id: wm-rq3exm0m5563
title: Design the glossary skill
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-06T11:43:18Z
updated_at: 2026-11-06T11:43:18Z
parent: wm-qhd3twqjzhma
custom_fields:
  task_kind: delivery
---
## What to do

Design the glossary skill and deliver four pieces:

1. SKILL.md: how to settle a term (challenge conflicts, one name per concept, stress definitions with scenarios, write it once settled), how to merge and dedupe, and the term constraints.
2. MCP server (Node): write a term into the current user's `.glossary/<user>.md`; before writing, do exact matching on the term name and avoid aliases, and do no semantic computation.
3. Hooks (Node): after git post-merge, merge every person's file into `.agents/docs/GLOSSARY.md`, which stays ignored by git.
4. Merge format and rules: the generated view's structure, source attribution, and provisional handling of same-name conflicts.

## Acceptance signal

- The four pieces live under `weave-your-work/glossary/`.
- On this repo: write one term, simulate a pull, and the generated view shows the term with its source file.
- SKILL.md covers the four moves borrowed from matt's domain-modeling.

## Boundaries

- Same-name conflict rules are deferred.
- Identity is git user.name or operator; pick one at implementation time.
