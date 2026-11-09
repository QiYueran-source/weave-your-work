---
schema: 1
id: wm-3tbfbj0g5827
title: Map and task reference repair
category: map
status: closed
owner: frank
creator: frank
created_at: 2026-11-09T15:55:06Z
updated_at: 2026-11-09T15:58:13Z
closed_at: 2026-11-09T15:58:13Z
parent: wm-wjwa9081hse1
custom_fields:
  split_as: task
---
## Target

The `map` and `task` references give one answer per question: no two files state different rules for the same act, and every pointer resolves from the file that writes it.

Why: a second audit of the two families found nine places where two files disagree about the same rule, and seven pointers that cannot be resolved from where they are written. A reader who follows one file writes a ticket the other calls malformed.

## Acceptance direction

All children are complete and no further children are needed.

Review point: for each pair named in the child task, the two lines say one thing when read together; a search for a bare `body.md`, `frontmatter.md`, `explore`, and `review` outside `weave-your-work/map/` finds nothing; no `SKILL.md` carries `disable-model-invocation`; `waymark validate` reports no findings.

## Decisions so far

- The repair is wording only: no section, heading, verdict name, or field changes shape. (user confirmed, 2026-11-09)
- `(none; the fog is cleared)` marks a section with no entries; a section whose entries are all struck through is cleared without it. (user confirmed, 2026-11-09)
- Skill invocation stops being a per-skill classification: every skill becomes model-invocable, and `execute-all` carries the only guard in its own text. (user confirmed, 2026-11-09)

## Out of scope

- Redesigning the map or task lifecycle. This round removes contradictions in what is already written.
- Reopening and re-reviewing the design tickets. Their verdicts are about what the files define, and that does not change.

## Review

passed

- Goal: the child task carries each of the ten pairs in its `Result`, with the searches and `waymark validate` run after the last write. The review point's three checks return nothing.
- Convention: the body carries `Target`, `Acceptance direction`, `Decisions so far`, and `Out of scope`, in that order; the single child is a task, matching `split_as: task`; every decision carries a source; the body holds no children index and the map no dependency edge. `waymark validate` reports no findings.
