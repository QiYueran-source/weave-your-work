---
schema: 1
id: wm-hy12yjm0yn9g
title: Resolve map skill audit findings
category: map
status: in_progress
owner: frank
creator: frank
created_at: 2026-11-09T04:42:21Z
updated_at: 2026-11-09T05:26:15Z
parent: wm-wjwa9081hse1
soft_links:
  - wm-0xrcwvnrcc9k
  - wm-c3pkrzmxr4h0
custom_fields:
  split_as: task
---
## Target

The map skill family has consistent instructions for splitting, review, and dependencies.

Why: the audit found contradictory instructions and review failures that need decisions before any skill changes.

## Acceptance direction

The identified instruction conflicts have an agreed disposition, and resulting changes are checked against the agreed rules.

Review point: the discussion records the choices, each affected skill agrees with them, and the worked audit distinguishes validated behavior from untested paths.

## Decisions so far

The design decisions below were confirmed in [the map skill discussion](../../testimony/wm-0xrcwvnrcc9k.md).

- Record the number of tasks and one-line-per-task split plan in the discussion testimony, not a child list in the parent map; read actual children from the Waymark tree. (user confirmed)
- On the first split, the parent moves from open to in_progress and gets split_as; creating children does not edit its body. Later splits leave its status and split_as unchanged. (user confirmed)
- Successive completed and planned task layers together cover the parent acceptance direction; uncovered work stays visible and prevents early review. (user confirmed)
- Map review compares actual child types with split_as, inspects failed outcomes and replacements, and reads task Result, Review, and actual deliverables against the map's acceptance direction. Waymark validate is a structural check, not a substitute. (user confirmed)
- An acceptance standard known to be ambiguous before review goes to explore as fog. Ambiguity first discovered during review returns needs discussion and goes to grill, without a guessed standard. (user confirmed)
- An edge may connect a map that needs another map's output to that producer. Tasks that need the missing output wait until it is available; unrelated tasks may run. Parent-child is not an explicit dependency edge, and tasks carry no dependency edges. (user confirmed)

- A failed closed dependency does not by itself authorize proceeding: check whether the required output exists and is usable. If not, the waiting work cannot execute or be accepted; the owner decides whether to wait for a replacement or adjust the target and dependency, without automatically changing the edge. (user confirmed)
- Keep the full acceptance direction on the map. Unclear uncovered work stays in Not yet specified; planned tasks in testimony are not completed work. Review requires actual evidence for every acceptance requirement. (user confirmed)
- When a review gap was already required by a task's acceptance signal, use update to decide whether to reopen, fix, and review that task. When the task met its signal but the parent omitted a new requirement, discuss the target or structure rather than automatically create a task dependent on a sibling's output. (user confirmed)

- Maps have a short Review section recording the verdict, goal and convention checks, and evidence; status remains the lifecycle state. Do not bulk backfill existing maps or invent past review evidence. (user confirmed)

- All four map review verdicts write Review, including needs discussion; the review records the unresolved question without deciding it. (user confirmed)
- On reopen, invalidate the old Review, strike it through with `~~`, and record why it is invalid; do not invent old reviews for legacy maps. (user confirmed)
- If Review and status disagree, do not treat the map as passed automatically. The owner rechecks children and evidence before completing the appropriate state change; changed evidence requires a fresh review. (user confirmed)

- Apply update's existing two tests rather than change size: same subject and verdict still holds means edit; same subject and verdict fails means reopen and re-review, retaining the struck-through old Review; a different subject means archive and replace. (user confirmed)

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
- ~~Decision to make: when a dependency closes as failed, may the waiting map proceed?~~
  Resolved on 2026-11-09: check actual output and usability; the owner decides the next disposition without automatic edge changes.
- ~~Decision to make: where does uncovered acceptance work stay visible across partial splits?~~
  Resolved on 2026-11-09: keep the complete acceptance direction; unclear work stays as fog, and review requires evidence rather than plans.
- ~~Decision to make: should map review write a Review section, and what would that cost?~~
  Resolved on 2026-11-09: add a short Review section; retain lifecycle status and do not bulk backfill old maps.
- ~~Decision to make: which verdicts write Review, and how is an old review invalidated on reopen?~~
  Resolved on 2026-11-09: all four verdicts write Review; strike through the invalidated review and state why.
- ~~Decision to make: how should interrupted or inconsistent status and Review writes be handled?~~
  Resolved on 2026-11-09: do not infer a pass; the owner rechecks children and evidence before the next state write.
- ~~Decision to make: does a struck-through review remain after re-review for a small change?~~
  Resolved on 2026-11-09: retain it on re-review of the same subject; a different subject is archived and replaced, following update's tests.
- ~~Decision to make: what distinguishes a small change from a large change that requires archive and a new ticket?~~
  Resolved on 2026-11-09: use update's same-subject and verdict tests, not change size.
- ~~Decision to make: how is a review gap repaired without violating the frozen child type?~~
  Resolved on 2026-11-09: use update for a gap already promised by a task; otherwise discuss the new requirement or structure first.

## Out of scope

- Changing skill files before the design is settled and confirmed.
- Concurrent issue work.
