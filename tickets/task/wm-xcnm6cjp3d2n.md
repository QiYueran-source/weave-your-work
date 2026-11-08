---
schema: 1
id: wm-xcnm6cjp3d2n
title: Clean the migrated glossary definitions
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-08T13:38:00Z
updated_at: 2026-11-08T13:38:00Z
parent: wm-rq3exm0m5563
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Clean the migrated glossary definitions so the sources follow the rules.

1. Read every term in `glossary/frank.jsonl`.
2. Shorten a definition over two sentences to the term's core: what it is, not what it does.
3. Move commands, file paths, and step lists out of the definitions and into the skill refs or the owning ticket. A domain attribute such as front matter or status stays if the term is about the record.
4. Split an `avoid` string into individual words or phrases where the parenthetical explanation allows it; keep the explanation when it carries the distinction.
5. Keep the term, group, and source fields. Set `updated_at` on every changed line; leave unrelated terms alone.
6. Run `glossary_merge` and check the new view.

## Acceptance signal

Every definition in `glossary/frank.jsonl` is one or two sentences and says what the term is; no command, file path, or step list remains; `avoid` entries are individual words or phrases where the original allows it. `glossary_merge` regenerates `GLOSSARY.md` with the new definitions and the source lines.

## Boundaries

- No new terms; this is a cleanup.
- No change to term names or groups.
- No code changes.
