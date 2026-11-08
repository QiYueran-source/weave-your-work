---
schema: 1
id: wm-zkrds7y5at8v
title: Task skill conflict fixes
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-08T12:41:26Z
updated_at: 2026-11-08T12:41:26Z
parent: wm-87pgn0b75yy5
custom_fields:
  split_as: task
---
## Target

Bring the task skill family in line with the batch model settled on 2026-11-08: a blocked map is not split, `waiting_on` names a person only, batch selection never claims closed tasks, and the review refuses a stale wait.

## Why

The chemistry walk showed the execution skills can reopen closed tasks and can treat a split error as a batch input problem. The split skill still says a blocked map may split, which contradicts the glossary.

## Acceptance direction

The split, map, task-design, task-review, execute-one-task, and execute-all files state the settled rules; the two examples no longer teach the old shape; `waymark validate` is clean; and a reader can trace each rule to the Task skill map.

## Decisions so far

- A map with an unfinished dependency is not split; independent early work goes to a sibling map.
- `waiting_on` is a person-only field; waiting on a task or map is a split error.
- `task-review` refuses to pass a ticket with a non-empty `waiting_on`.

## Boundaries

- No change to the grill, glossary, or issue skills.
- No new verdicts or fields.
