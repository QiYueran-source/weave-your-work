---
schema: 1
id: wm-q6477pe7x8tp
title: Align map lifecycle skills with audit decisions
category: task
status: in_progress
owner: frank
creator: frank
created_at: 2026-11-09T05:25:57Z
updated_at: 2026-11-09T05:32:18Z
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

## Progress

The owner confirmed this task's implementation plan. The prior review-design testimony and this task's split-plan testimony are closed.

Impact scan so far: the same subjects remain, but the changed body-format, split-task, front-matter, map-review, procedure and update rules must be checked against their map acceptance directions and the new evidence. The affected maps `wm-6c4f9e2a7b31`, `wm-bfqvr54kz3h4`, `wm-8zyyyafxbdwr`, `wm-3spf0jbvf9y9`, `wm-9d7e4c1a2b60`, and `wm-9sfmaphskg0c` are reopened for fresh review; `wm-3nhrhmds8rqd` and `wm-0b59r7xfhk73` also reopened because their acceptance counts affected children. The changed design decisions cite the discussion. No past map Review was invented.

The prior write tasks and other nearby maps were inspected but not automatically reopened. Their existing acceptance signals and past evidence must be checked against the final changed files before the owner decides their dispositions. In particular, `wm-vz22et2b7gja` and `wm-3j7mzce437f4` explicitly required status as map verdict; the new design conflicts. The audit task `wm-rxe8ntrjx845` asserts a fully passing review that the corrected case disputes; its own verdict and parent need an evidence-based recheck. Do not silently rewrite the original audit fixtures.

Dependency front matter rules are revised; split/execution and map-review/update changes are in progress. Historical case statements have been marked as describing the rules at the time, not a rerun. Still to do: reconcile the changed skill files, check the named scenarios, disposition affected tickets, and report evidence and gaps.
