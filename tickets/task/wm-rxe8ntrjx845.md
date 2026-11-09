---
schema: 1
id: wm-rxe8ntrjx845
title: Run and document the map lifecycle audit
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-09T03:24:53Z
updated_at: 2026-11-09T03:24:53Z
parent: wm-13pnvh9d6n44
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Run the map lifecycle in a separate Waymark project under `chemistry-research/` and write a case document at `08-map-lifecycle-audit.md`.

1. Inspect the current map references and the existing scratch project's configuration. Create a separate project directory for this audit so no prior fixtures are modified.
2. Create an audit root map with all five body sections. Explore and settle its fog, recording a discussion round and each resolved decision in the owning map before splitting.
3. Split the root to child maps, then later split it again with the same frozen child type. Split one child into tasks to show that a descendant can choose its own child type. Write and close the tasks with actual, modest file outputs in the audit project.
4. Review and close the maps only after their children close and fog is empty. Record the commands and observed status transitions from Waymark output.
5. Exercise a content change on a closed map through the update skill's tests. Choose the disposition supported by the old and new text, carry out only the matching writes, and preserve the old fixture project.
6. Write the case file with links to the actual audit tickets, commands, before/after statuses, observations, rule deviations found, and a clear statement of uncovered map paths. Do not represent any fictional chemistry result as experimental evidence.

## Acceptance signal

A separate Waymark audit project and `08-map-lifecycle-audit.md` exist under the chemistry example. The case links every ticket it discusses and contains actual command output or recorded status evidence for creation, first and repeated split, child/task completion, review, and update. `waymark validate --project <audit-project>` reports no findings. The example clearly separates workflow tests from fictional lab data and states what remains untested.

## Boundaries

- Do not edit or replace the existing `waymark/` fixture project.
- Do not claim that chemical experiments in the fictional scenario were performed.
- Do not expand this into task/grill/whole-skill batch acceptance.
- Do not rewrite map behavior based on an observation until the owning map/task records the finding and its disposition.
