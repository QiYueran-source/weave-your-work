---
schema: 1
id: wm-eq3r9xrb7w2j
title: Grill entry and method
category: map
status: closed
owner: frank
creator: frank
created_at: 2026-11-08T13:25:09Z
updated_at: 2026-11-12T12:13:56Z
closed_at: 2026-11-08T13:25:22Z
parent: wm-7zvr8cnts3rs
custom_fields:
  split_as: task
---
## Target

The grill skill's entry and method exist: `weave-your-work/grill/SKILL.md` and `weave-your-work/grill/how-to-grill.md`.

Why: the entry and the method are the skill's own files. The testimony record, glossary, and ADR are separate branches. A map's next layer is one kind, so these files need their own map instead of sitting as tasks beside three child maps.

## Acceptance direction

The grill `SKILL.md` and `how-to-grill.md` exist under `weave-your-work/grill/` and install with `npx skills add`.

All children are complete and no further children are needed.

Review point: Read the entry against the method and the record. The entry points at both and restates neither; the method uses `refine`, `hand off`, and `split` with the glossary's meanings.

## Decisions so far

- The grill skill's own files are a separate refinement branch from the three artifact branches (decided in this run on 2026-11-08, after the mixed-children finding).
- The three write tasks moved under this map; the grill map's children are all maps (decided in this run on 2026-11-08).

## Not yet specified

- None; the files are written and their tasks are closed.

## Out of scope

- The testimony, glossary, and ADR branches.
- The method's runtime behavior; this map only owns the entry and the method files.
