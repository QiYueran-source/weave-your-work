---
schema: 1
id: wm-fqtbhjhhkbba
title: Exercise exceptional map review paths
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-09T03:56:00Z
updated_at: 2026-11-09T03:56:00Z
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

## Boundaries

- Do not change the map skill in this test without a recorded finding and separate confirmation.
- Do not invent human decisions or imply synthetic values came from experiments.
