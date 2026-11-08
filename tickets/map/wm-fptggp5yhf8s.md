---
schema: 1
id: wm-fptggp5yhf8s
title: ADR skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-08T10:43:47Z
updated_at: 2026-11-08T10:43:47Z
parent: wm-7zvr8cnts3rs
---
## Target

Design the ADR skill: turn a decision that is hard to reverse, surprising without context, and the result of a real trade-off into a numbered record under `docs/adr/`, and keep the record's status and superseding honest.

Why: grill produces decisions, and the ones a future reader cannot reconstruct from the code need a record that says what was decided and why. Without this branch, the three gates and the record format stay a paragraph inside grill.

## Acceptance direction

The ADR `SKILL.md` exists under `weave-your-work/adr/` and installs with `npx skills add`; a reader holding one settled decision can say whether it qualifies, write the next numbered record, and supersede an older record. A decision that fails a gate stays in the caller's `Decisions so far`.

All children are complete and no further children are needed.

Review point: Check the three gates, the file format, the numbering rule, and the supersede rule against a decision this repository has already recorded, and against one it decided not to record.

## Decisions so far

- ADR is a branch of grill: grill produces the decision, and the ADR branch owns the record (user confirmed on 2026-11-08, as part of making the three artifacts grill's branches).
- An ADR is written only when all three gates hold: hard to reverse, surprising without context, and a real trade-off. A decision that fails any gate stays in the caller's `Decisions so far` (user confirmed, recorded in the grill map).
- ADRs live under `docs/adr/` in this repository (recorded in [ADR 0001](../../docs/adr/0001-project-document-layout.md)).

## Not yet specified

- Decision to make: the record's format — one paragraph or named sections, and whether status, considered options, and consequences are fields or optional sections. Why it matters: the format decides what a reader can rely on and how much work writing an ADR costs.
- Decision to make: the numbering and supersede flow — who writes `Superseded by`, whether the old file is edited in place, and whether a superseded ADR keeps its number. Why it matters: without it, the same decision can end up with two live records.
- Decision to make: whether the ADR skill is a separate installed skill or a reference file inside grill. Why it matters: a separate skill can be invoked directly to read or supersede an existing ADR; a reference file is reachable only through a grill.
- Decision to make: how an ADR links back to the ticket and testimony that produced it. Why it matters: the record says why; the ticket says who asked and what was settled around it.

## Out of scope

- Decisions that fail a gate; they stay in the caller's `Decisions so far`.
- Glossary terms and testimonies; each has its own branch under grill.
- Architecture advice beyond recording a decision.
