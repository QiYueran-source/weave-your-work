---
schema: 1
id: wm-3j7mzce437f4
title: Write the map operating procedure
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-09T00:27:25Z
updated_at: 2026-11-09T05:42:33Z
closed_at: 2026-11-09T05:42:33Z
parent: wm-9d7e4c1a2b60
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `weave-your-work/map/procedure.md`, the reference that tells an owner how a map moves from a target nobody started to a closed ticket.

1. Open with the lifecycle as a short diagram: `open` while it is written and discussed, `in_progress` from the first split to the verdict, `closed` when the review passes or when it fails. State that `reviewing` is a moment, not a status.
2. Write each step with its trigger, the skill that runs it, and what it hands back: explore while `Not yet specified` is not empty, split when a layer is settled, review when every child is closed and no fog is left.
3. Say that grill is a method those steps call, not a step of its own: explore calls it to clear fog, split calls it to settle a layer.
4. State where the status changes: `waymark start` at the first split, `waymark close` when the review passes, `outcome=failed` before closing a wrong direction. ~~A map has no `Review` section, so the status is the verdict.~~ Superseded on 2026-11-09: Review records the verdict and evidence; status remains the lifecycle state. See [the confirmed discussion](../testimony/wm-0xrcwvnrcc9k.md).
5. Say what `needs changes` and `needs discussion` leave behind: the gap in `Decisions so far` and an open map, or the question handed to grill.
6. State that a child reopened during a review voids it, and that a map with no children is not reviewed at all.
7. Write the change rule: editing a map that is already split starts with reopening it, revises the affected branches in the same run, and either reopens or retires every closed descendant whose verdict was given against the old content. Point at the update skill for the three dispositions and at `frontmatter.md` for who may write what.
8. Keep out everything that belongs to another file: body content, fields and edges, fog clearing, splitting, accepting.

## Acceptance signal

~~`weave-your-work/map/procedure.md` exists. It names the lifecycle and each step's trigger, the skill it hands to, and what comes back; it says where the status changes happen and that a verdict is a status. A reader holding a map can tell what to do next at any point without inventing a step. It states the change rule for a split map and points at the update skill and `frontmatter.md` rather than restating them.~~

Superseded on 2026-11-09: The file names lifecycle steps, triggers, hand-offs, status changes and Review writes. A reader can follow the next step, including reopened work, without inventing one. It points to update and frontmatter for their rules. See [the confirmed discussion](../testimony/wm-0xrcwvnrcc9k.md).

## Result

The changed deliverable `weave-your-work/map/procedure.md` was revised by task `wm-q6477pe7x8tp`: it records map Review writes and status actions, split state, review prerequisites and update routing. `weave-your-work/update/content.md` describes how a reopened split map resumes. The scratch check in `weave-your-work/use-weave-your-work-examples/chemistry-research/09-map-improvement-checks.md` ran first and later splits, not every lifecycle branch.

Previous result before the revised design:

`weave-your-work/map/procedure.md` is written. It carries the three states, the three steps with their triggers and hand-offs, the two commands that move a status, the four verdicts and what each writes, the rule that a reopened child voids a review, and the five-step change rule for a map that is already split.

Two calls were made on this map's authority rather than the user's, and both are recorded in the parent map:

- a map with no children is not reviewed, because a target that needs no refinement is a task;
- a child reopened during a review voids it.

Revised on 2026-11-09, after the first review, when the user stated two things the file was missing: `in_progress` is a loop that can split again and again until the layer is tasks, and a change to a map depends on its state — a plain edit while it is open and has no children, a change to its children while `in_progress`, and the update skill once it is closed. Both are now sections of the file.

What it has not done: no map has been advanced with it. That walk is the worked example the root map defers to one batch.

## Review

passed

- Goal: The procedure names lifecycle steps, triggers and hand-offs, status changes and each verdict's Review write; it points to update for changes. Read `weave-your-work/map/procedure.md` and the reopened-map rule in `update/content.md` against the revised Acceptance signal.
- Convention: The deliverable stays within procedure and points to front matter, update and map-review for their owned rules. The actual change was part of the related skill batch `wm-q6477pe7x8tp`, not a second isolated original-task run.

## Boundaries

- No body section formats. Those are `body.md`.
- No field or dependency rules. Those are `frontmatter.md`.
- No fog clearing, splitting, or accepting. Those are their own skills.
- No description of what a change does to a node others rely on. That is the update skill.
