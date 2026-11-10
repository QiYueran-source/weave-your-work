---
schema: 1
id: wm-vz22et2b7gja
title: Write the map review skill
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-08T12:03:16Z
updated_at: 2026-11-09T05:42:33Z
closed_at: 2026-11-09T05:42:33Z
parent: wm-3spf0jbvf9y9
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `weave-your-work/map-review/SKILL.md`, the skill that accepts a map whose children are all closed, or sends it back.

1. State who reviews: anyone, including the owner, and that a passing review closes the map on the spot while the owner may reopen it.
2. State what it reads: the map's `Target`, `Acceptance direction`, and review point; its `Decisions so far` for what changed since the split; each child's own closure; and `body.md` plus the split rules for the convention axis.
3. Write the two axes, read and reported separately: the goal check against the acceptance direction and review point, the convention check against the body format and the split rules. Every finding cites the line it fails.
4. Write the four verdicts and what each one produces: passed closes the map; needs changes records the gap in the map's `Decisions so far` and leaves it open; needs discussion leaves it open and hands the question to grill; wrong direction closes the map with `outcome=failed` and names the sibling that replaces it.
5. ~~State that a map has no `Review` section: its verdict is its status, so the only body write is the gap that `needs changes` records.~~ Superseded on 2026-11-09: record all four verdicts in a map Review with both checks and evidence, preserving invalidated map reviews as agreed in [the design discussion](../testimony/wm-0xrcwvnrcc9k.md).
6. State that the review point is not a checklist. A review point that cannot be checked is fog for explore, not a reason to open one.
7. Keep the report shape: conclusion, findings per axis with sources, what holds up, verdict.

## Acceptance signal

~~`weave-your-work/map-review/SKILL.md` exists. It names who reviews, states the two axes and that they are reported separately, gives the four verdicts with what each one produces, and says a verdict is the map's status rather than a body section. A reader holding a map whose children are complete can run the review from this file and know which status and which body entry the verdict produces. It names `body.md` and the split skill instead of restating their rules.~~

Superseded on 2026-11-09: The file exists and names the owner, both separately reported checks, all four verdicts and their Review, status, and outcome writes. A reader can check actual children and evidence, handle ambiguity and inconsistent states, and see which rules own the body, split, and dependencies. See [the confirmed discussion](../testimony/wm-0xrcwvnrcc9k.md).

## Result

The changed deliverable `weave-your-work/map-review/SKILL.md` was revised by task `wm-q6477pe7x8tp`: it records four verdicts, separate goal and convention evidence, checks child type and output, and handles dependency readiness, ambiguity and mismatches. The scratch check in `weave-your-work/use-weave-your-work-examples/chemistry-research/09-map-improvement-checks.md` recorded a non-passing verdict; the other verdict branches were statically walked, not executed.

Previous result before the revised design:

`weave-your-work/map-review/SKILL.md` is written. It states when a review runs (every child closed, and no fog left, because fog says another child may still be needed), who reviews, what it reads, the two axes with the rule that every finding cites its source, the four verdicts with what each one writes, and the report shape. It says the verdict is the map's status, because a map has no `Review` section.

What it has not done: no map has been reviewed with it. The sample review its map's acceptance originally named is the worked example the root map defers to one batch.

## Review

passed

- Goal: The skill names the owner, two separately reported checks, four verdicts and their Review, status and outcome writes; it requires child and actual evidence checks and has instructions for ambiguity and inconsistent state. Read `weave-your-work/map-review/SKILL.md` against the revised Acceptance signal.
- Convention: The skill points to the map body, split and dependency rules; the change was implemented together with the related skill files under `wm-q6477pe7x8tp`, not as a new isolated original-task run. No task acceptance or split was performed by map-review.

## Boundaries

- No task acceptance. That is `task-review`.
- No splitting and no fog clearing.
- No definition of a map body section. That is `body.md`.
