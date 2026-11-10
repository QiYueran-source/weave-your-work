---
schema: 1
id: wm-13pnvh9d6n44
title: Run a real map lifecycle audit in the chemistry example
category: map
status: closed
owner: frank
creator: frank
created_at: 2026-11-09T03:24:34Z
updated_at: 2026-11-09T14:51:40Z
closed_at: 2026-11-09T14:51:40Z
parent: wm-wjwa9081hse1
custom_fields:
  split_as: task
---
## Target

Run the map lifecycle on a separate Waymark project in `chemistry-research/`, and record what the actual run shows about the map skill.

Why: the existing chemistry scenario is described as fictional and its tickets are fixtures. A real command-by-command map run can expose lifecycle gaps without claiming that the fictional lab work happened.

## Acceptance direction

A separate scratch Waymark project was created under the chemistry example and advanced through map creation, discussion landing, first split, a later split of the same type, review, and a content update that exercises the update hand-off. The case document links the actual tickets and records commands, statuses before and after, observations, deviations, and remaining test gaps. No fictional chemistry experiment is represented as performed. The review states which map paths the run did and did not cover.

Review point: a reader can reproduce the scratch project's visible lifecycle from its committed ticket files and case document; the scratch project validates without findings.

## Decisions so far

- Keep the existing chemistry scenario and fixture tickets intact. Run the map audit in a separate nested Waymark project and distinguish performed workflow tests from fictional chemistry outcomes. (user confirmed)
- Focus this audit on map behavior; task, grill, and whole-set tests remain separate. (user confirmed direction)

## Not yet specified

(none; the audit scope is settled)

## Review

passed
- Goal: the acceptance direction reads against the case. The scratch project exists under the chemistry example and `waymark validate --project` reports no findings. [The case](../../weave-your-work/use-weave-your-work-examples/chemistry-research/08-map-lifecycle-audit.md) records the creation, the discussion landing and that its testimony was written after the fact, the first split, the repeated split of the same child type, the review, the update hand-off, the errors found afterwards, and the paths the run did not cover.
- Convention: the sections present run in the order `body.md` lists them, the child is a task matching `split_as: task`, and both decisions carry a user confirmation.
