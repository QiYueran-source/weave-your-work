---
schema: 1
id: wm-hy12yjm0yn9g
title: Resolve map skill audit findings
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-09T04:42:21Z
updated_at: 2026-11-09T05:05:19Z
parent: wm-wjwa9081hse1
soft_links:
  - wm-0xrcwvnrcc9k
---
## Target

The map skill family has consistent instructions for splitting, review, and dependencies.

Why: the audit found contradictory instructions and review failures that need decisions before any skill changes.

## Acceptance direction

The identified instruction conflicts have an agreed disposition, and resulting changes are checked against the agreed rules.

Review point: the discussion records the choices, each affected skill agrees with them, and the worked audit distinguishes validated behavior from untested paths.

## Decisions so far

- Record the number of tasks and one-line-per-task split plan in the discussion testimony, not a child list in the parent map; read actual children from the Waymark tree. (user confirmed)
- On the first split, the parent moves from open to in_progress and gets split_as; creating children does not edit its body. Later splits leave its status and split_as unchanged. (user confirmed)
- Successive completed and planned task layers together cover the parent acceptance direction; uncovered work stays visible and prevents early review. (user confirmed)
- Map review compares actual child types with split_as, inspects failed outcomes and replacements, and reads task Result, Review, and actual deliverables against the map's acceptance direction. Waymark validate is a structural check, not a substitute. (user confirmed)
- An acceptance standard known to be ambiguous before review goes to explore as fog. Ambiguity first discovered during review returns needs discussion and goes to grill, without a guessed standard. (user confirmed)
- An edge may connect a map that needs another map's output to that producer. Tasks that need the missing output wait until it is available; unrelated tasks may run. Parent-child is not an explicit dependency edge, and tasks carry no dependency edges. (user confirmed)

## Not yet specified

- ~~Decision to make: which parent writes belong to a first split and later splits?~~
  Resolved on 2026-11-09: first split starts the map and sets split_as; later splits preserve both; child creation does not edit the parent body.
- ~~Decision to make: how should the review check actual child type, outcome, and evidence?~~
  Resolved on 2026-11-09: compare type and outcomes, and read Result, Review, and deliverables; validation is not a semantic review.
- ~~Decision to make: how should ambiguous standards be routed before and during review?~~
  Resolved on 2026-11-09: explore known fog before review; newly discovered ambiguity goes to grill as needs discussion.
- ~~Decision to make: what does a dependency edge mean when a later map uses an earlier output?~~
  Resolved on 2026-11-09: permit a map edge for required output and hold only tasks that actually need it.
- ~~Decision to make: how do successive task layers cover the parent acceptance direction?~~
  Resolved on 2026-11-09: coverage is cumulative; uncovered work remains visible and prevents premature review.
- Decision to make: when a dependency closes as failed, may the waiting map proceed?
  Why it matters: closed is not necessarily a successful producer result.
- Decision to make: where does uncovered acceptance work stay visible across partial splits?
  Why it matters: planned work in testimony is not an active child and cannot by itself make a map complete.
- Decision to make: what evidence and timing does a map reviewer check before recording a verdict?
  Why it matters: the audit missed a type mismatch, missing task results, and a reopened child.
- Decision to make: how is a review gap repaired without violating the frozen child type?
  Why it matters: the audit's second task read a sibling task's output, which the current split rules forbid.

## Out of scope

- Changing skill files before the design is settled and confirmed.
- Concurrent issue work.
