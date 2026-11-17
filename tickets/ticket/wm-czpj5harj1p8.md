---
schema: 1
id: wm-czpj5harj1p8
title: Bring the manifest, the checker, and the glossary back into line
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-17T13:16:30Z
updated_at: 2026-11-17T13:21:22Z
closed_at: 2026-11-17T13:21:22Z
---
Part of wm-wrw42r7nsb82

## What to do

Three files outside the skill text still describe the set as it was before the
rewrite.

The `to-tickets` agent manifest gives a display description that names a word the
skill dropped. It names what the skill now does.

The record checker still checks the retired `map` and `task` categories, so a
spec with a parent is reported as a map with children, and `needs_human` is
reported on a testimony as a ticket's field. It checks the categories the
project uses, and its body checks name the sections those categories carry.

The glossary still defines the retired record kinds and does not define a spec.
It defines `spec` and `ticket` as this set treats them, and no longer defines
`map` or `task`.

## Acceptance criteria

- [ ] The `to-tickets` display description contains no tracer-bullet wording.
- [ ] `node scripts/check-records.mjs` reports no finding over this project's
      records.
- [ ] The checker's per-category body checks name `spec` and `ticket`, not `map`
      and `task`.
- [ ] The glossary defines `spec` and `ticket`, and contains no entry for `map`
      or `task`.
- [ ] `GLOSSARY.md` regenerates from the sources with the new entries.

## The result

`weave-your-work/to-tickets/agents/openai.yaml` describes whole tasks;
`scripts/check-records.mjs` checks `spec` and `ticket` and runs clean over this
project's records; `GLOSSARY.md` regenerates to 26 terms, including `spec`,
`ticket`, `result`, `arranger`, and `whole task`, and no longer defining `map` or
`task`.
