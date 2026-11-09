---
schema: 1
id: wm-q6477pe7x8tp
title: Align map lifecycle skills with audit decisions
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-09T05:25:57Z
updated_at: 2026-11-09T05:26:15Z
parent: wm-hy12yjm0yn9g
soft_links:
  - wm-c3pkrzmxr4h0
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Align the map lifecycle instructions with the decisions in the parent map, so a reader can split, execute, review, and update a map without following conflicting rules.

1. Inspect affected closed design and execution tickets against update's same-subject and verdict tests. Record the impact and, where warranted and owned by this run, synchronize design and reopen affected tickets and ancestors; do not claim the old review failed merely because a new requirement exists. Preserve historical testimony and existing audit fixtures.
2. Revise `weave-your-work/map/` (`body.md`, `frontmatter.md`, `procedure.md`, entry and usage), `split/` (entry, `task.md`, `submap.md`), `map-review/SKILL.md`, and `update/` (`SKILL.md`, `content.md`, `move.md`, `need-execute.md`) to implement the parent map's confirmed decisions. Coordinate `execute-one-task/SKILL.md` and `execute-all/SKILL.md` where required for dependency input checks; check task-design for compatibility. Keep task Review's own existing history policy unless the confirmed map-specific design requires otherwise.
3. Check the instructions with representative cases: partial task layers and uncovered acceptance, all four map review verdicts, an invalidated Review and a legacy map without one, interrupted status/Review writes, a reopened child, failed dependencies with and without usable outputs, and review gaps inside versus outside the original task signal. Report which checks were static walkthroughs and which were executed, without treating Waymark validation as review evidence.
4. Re-read affected examples as historical records, preserving what actually happened; annotate only if a current-rule statement would otherwise mislead, without rewriting past operations or declaring untested paths passed.

## Acceptance signal

The named skill instructions agree with every confirmed decision in the parent map. A reader can follow the split plan, write and invalidate a map Review, distinguish dependency readiness from input availability, repair a review gap without an illegal sibling-task dependency, and apply the existing update tests. The ticket's Result identifies each checked case, evidence and limitations; `waymark validate` is reported only as a structural check. Affected prior tickets are assessed individually rather than automatically reopened, and no historical audit is presented as a successful review without evidence.

## Boundaries

- Do not modify concurrent issue work or the original audit project fixtures.
- Do not invent past reviews or bulk backfill old maps.
- Do not change task Review history rules without a separate confirmed decision.
