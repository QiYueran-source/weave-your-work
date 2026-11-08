---
schema: 1
id: wm-sn4kzbbta91v
title: Fix the remaining task skill findings
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-08T12:53:00Z
updated_at: 2026-11-08T12:55:23Z
closed_at: 2026-11-08T12:55:23Z
parent: wm-nx5547pvnxpj
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Close the remaining task skill findings.

1. In `weave-your-work/split/task.md`, add a sixth gate: the ticket is writable only when the body carries the sections its kind requires, `needs_human` agrees with the `Person:` steps, the parent is a map, and the task carries no `dependencies` block.
2. In `weave-your-work/update/need-execute.md`, check the same ticket shape after the task is written and before it is executed; a missing section or a field/body mismatch stops the run and goes back to the owner.
3. In `weave-your-work/execute-one-task/SKILL.md`, add the required-section and `needs_human`/`Person:` checks to the preflight, and make the review call conditional on the run being the owner's.
4. In `weave-your-work/task-review/SKILL.md`, make the owner the only reviewer and closer. A non-owner reports findings to the owner and does not write `## Review` or close. State that the review does not judge design completeness.
5. In `weave-your-work/task-review/probe.md`, give the incomplete-probe branch a verdict: `needs changes` if the executor can still gather the evidence, `needs discussion` if only the owner can decide to retry, narrow, or stop. Check that a completed probe's `Result` records the map owner's confirmation of both `Next step` lines; a missing confirmation is `needs discussion`.
6. In `weave-your-work/task-design/body.md`, make `Progress` a stop marker: written when a run stops, overwritten when the state changes, removed before the close. Change "child maps that carry the edge" to "sibling maps under the same parent, with the edge between them." State that a completed probe's `Result` records the owner's confirmation of both `Next step` lines.
7. In `weave-your-work/task-design/SKILL.md`, replace "Order is carried by the tree" with "Order is carried by dependency edges between maps, never by a link."
8. Run `waymark validate` and read every changed file against the settled decisions.

## Acceptance signal

The seven files named above state the rules, and none still says a non-owner may close, that `Progress` is written at the start, that a sequence uses child maps, or that order is carried by the tree. `waymark validate` reports no findings. A reader can tell where a malformed task is stopped, who may review, and what a probe's `Result` must carry.

## Result

The seven files named in the Action are updated, plus `execute-all/SKILL.md` for the owner-only review path and the chemistry pages that describe the old rules:

- `split/task.md` has a sixth gate for required sections, `needs_human`/`Person:` agreement, a map parent, and no dependency block.
- `update/need-execute.md` checks the same shape before execution.
- `execute-one-task/SKILL.md` checks the shape in its preflight and invokes `task-review` only when the run is the owner's.
- `task-review/SKILL.md` makes the owner the only reviewer and closer; a non-owner reports findings.
- `task-review/probe.md` gives the incomplete branch its verdict and checks the map owner's confirmation of both `Next step` lines.
- `task-design/body.md` makes `Progress` a stop marker, uses sibling maps for a sequence, and records the `Next step` confirmation in `Result`.
- `task-design/SKILL.md` says dependency edges carry order, not the tree, and uses sibling maps.
- `execute-all/SKILL.md` makes large-batch reviewers report findings; the owner writes `## Review` and closes.

`waymark validate` reports no findings.

## Review

passed

- Goal: the seven named files state the rules; none still says a non-owner may close, that `Progress` is written at the start, that a sequence uses child maps, or that order is carried by the tree; `waymark validate` is clean. Read against the `Acceptance signal`.
- Convention: only the named skill files, `execute-all/SKILL.md`, the two chemistry pages, and the task's own tickets were changed; no glossary, grill, issue, or map review file was touched.

## Boundaries

- No change to the glossary, grill, issue, or map review skills.
- No new verdict or field.
