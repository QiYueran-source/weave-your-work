---
schema: 1
id: wm-718gwavgsf3s
title: Audit exceptional map review paths
category: map
status: closed
owner: frank
creator: frank
created_at: 2026-11-09T03:55:49Z
updated_at: 2026-11-09T16:04:16Z
closed_at: 2026-11-09T16:04:16Z
parent: wm-wjwa9081hse1
custom_fields:
  split_as: task
---
## Target

The chemistry example records an actual second-round test of exceptional map review paths.
Why: ~~the first audit covered a passing review~~ Superseded on 2026-11-09: later inspection found that the first audit's claimed passing review was invalid. It did not exercise the other verdicts or a changing tree during review.

## Acceptance direction

All children are complete and no further children are needed.

Review point: the case links the actual audit tickets and reports the observations and limitations for needs changes, needs discussion, wrong direction, a child reopening during review, and a first split directly into tasks. The separate audit project validates, and invented fixture data is not presented as real chemistry.

## Decisions so far

- Use the existing isolated chemistry-research/map-audit project and a new sibling root, without altering the closed first-round audit root. (user confirmed)
- Test three review verdicts, a child reopened during review, and first split directly into tasks; append the results to 08-map-lifecycle-audit.md. (user confirmed)
- Keep the original chemistry-research/waymark fixtures intact and leave concurrent issue work alone. (audit boundary)
- Record the first-round review errors and the unresolved second-round scenario findings in the case rather than claim they passed. (inspection of audit tickets)
- ~~The task split was created without the prior count and per-task plan required by split/task.md. This conflicts with instructions that say a split does not edit the parent body. The goal evidence is present, but the convention verdict is not settled; the premature close was reopened.~~ Superseded on 2026-11-09: the conflict is gone. `split/task.md` writes the count and the per-task plan into the discussion testimony and keeps the map's body unchanged, so the two instructions no longer ask for incompatible things. (verified against `split/task.md`)

## Not yet specified

(none; the second-round scope is confirmed)

## Out of scope

- Claiming real chemistry experiments or completing whole-skill batch acceptance.

## Review

passed

- Goal: the case links each scenario's tickets and states what ran, what was observed, and the limits for all five paths; the audit project validates with no findings, checked now; the fixtures are labelled invented. The review point's checks hold.
- Convention: the body carries `Target`, `Acceptance direction`, `Decisions so far`, `Not yet specified`, and `Out of scope`, in that order; the single child is a task, matching `split_as: task`; the body holds no children index and the map no dependency edge; every decision carries a source, and the stale finding about the split plan is struck with its reason. `waymark validate` reports no findings.
