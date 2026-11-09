---
schema: 1
id: wm-fqtbhjhhkbba
title: Exercise exceptional map review paths
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-09T03:56:00Z
updated_at: 2026-11-09T04:07:17Z
closed_at: 2026-11-09T04:07:17Z
parent: wm-718gwavgsf3s
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

In the existing isolated project `weave-your-work/use-weave-your-work-examples/chemistry-research/map-audit/`, create a sibling of the first audit root and run five distinct review scenarios using Waymark ticket operations. Append the actual commands, intermediate status observations, verdict evidence and deviations to `weave-your-work/use-weave-your-work-examples/chemistry-research/08-map-lifecycle-audit.md`.

1. `needs changes`: demonstrate a reviewable map with all children closed and a specific fixable gap in its acceptance direction. Record the gap in Decisions so far, leave the map in progress, fix the gap, then review again.
2. `needs discussion`: demonstrate a reviewable map whose acceptance direction cannot be judged; leave it unchanged at verdict time and route the question to discussion without inventing a human answer.
3. `wrong direction`: demonstrate an unreachable or unwanted target, set `outcome=failed`, close the failed map, and create and soft-link a replacement sibling.
4. Reopen a child while its parent is being reviewed. Capture the changed tree, discard the pending verdict, and review again only after the child is closed.
5. Split a map directly into tasks on its first split. Check that the task is a leaf and that the map can close after review.

Use fictional, explicitly labelled workflow fixture content; do not represent real chemistry experiments. Do not modify the first-round closed root or the original chemistry-research/waymark fixtures. Use Waymark commands for ticket changes, validate the audit project, and report any rule or tool failure without representing simulated choices as human decisions.

## Acceptance signal

Each of the five paths has traceable ticket IDs, commands, before-and-after states and evidence or a concrete limitation. The case distinguishes prescribed behavior from Waymark enforcement and includes both review axes. The isolated project passes `waymark validate`; unrelated issue work remains untouched.

## Findings so far

- The first-round interpretation map `wm-7yf6bypy1260` says `split_as=submap` but its child `wm-qvfnzn5rb5q9` is a task, contrary to the split freeze. That task closed without Result or Review, although its map's review point requires its Result. The earlier claim that the map passed review is incorrect. Record this in the case; leave the first-round tickets unchanged. (independent check against the tickets and split/SKILL.md)
- The first-round report task uses the protocol, and the interpretation probe uses the report, but their maps lack ordering edges. Review whether later staging actually removes each need for an edge; do not claim the convention axis passed without that check. (independent check against tickets and split references)
- The first-round testimony was created after the split and the map's close. It is a retrospective record, not evidence that a discussion was recorded before splitting. The current root also lacks dated retained resolved fog. Correct the case without asserting that no prior discussion occurred. (ticket timestamps and map/body.md)
- The first round did create task children under maps marked `split_as=task`; its report map actually went from open straight to closed, not through the required first-split start. The second round will test the direct-task path with the required transition and leaf rule. (ticket inspection and observed close output)

- Second-round inspection found that the gap note describes an invented label but the acceptance direction asks for an invented value. The goal remains unmet. The ambiguous fixture has unresolved fog despite claiming none, so its attempted needs-discussion review violates the review precondition. The wrong-direction fixture was already known to be unreachable when split, and its probe cannot produce the acceptance result. (review of scenario tickets against map/body.md and split/task.md)
- None of the scenario maps retains the task-layer count and per-task plan required by split/task.md; that instruction conflicts with the split instructions saying not to edit the parent body. The simple single-action fixtures also may be tasks rather than maps. Narrow the case conclusions and do not call their review convention checks complete. (independent case review)

## Result

Created the second audit root `wm-91h5dy4pmtem` and scenario tickets in the isolated chemistry audit project. The case document records the observed commands, status changes, verdict attempts, and limitations for all five agreed scenarios. The needs-changes fix did not fully satisfy the goal and introduced a task-layer dependency. The needs-discussion and wrong-direction fixtures had review or split precondition violations. The child-reopen and direct-task scenarios exercised the status operations, but subsequent review found convention questions that prevent claiming full map-review passes. The second audit root stays in progress with open scenarios.

Corrected the first-round case: its interpretation map's split type contradicts its task child, the probe has no Result or Review, the report map was not started on split, ordering edges are absent, and the testimony was written retrospectively. The first-round root and the original chemistry fixture project were not changed.

Both Waymark projects validated without findings; the case's 32 local links resolved. Validation does not evaluate skill compliance. The case records the apparent split-plan instruction conflict without changing skill files.

## Review

passed

- Goal: inspected the case and scenario tickets. All five requested paths have concrete observations and limitations; the case does not present an attempted or invalid path as a clean pass.
- Convention: the fictional fixtures are labelled, the first audit root and original chemistry fixture project remain unchanged, and issue work was not staged. Waymark validation reported no findings for both projects, and the local case links resolved.
- Limits: the needs-changes path has not reached a passing re-review; needs discussion has no human answer; wrong direction began with an invalid split; the reopened-child test was staged rather than concurrent. The status checks do not prove Waymark enforces map-review rules.

## Boundaries

- Do not change the map skill in this test without a recorded finding and separate confirmation.
- Do not invent human decisions or imply synthetic values came from experiments.
