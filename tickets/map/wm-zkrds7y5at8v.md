---
schema: 1
id: wm-zkrds7y5at8v
title: Task skill conflict fixes
category: map
status: closed
owner: frank
creator: frank
created_at: 2026-11-08T12:41:26Z
updated_at: 2026-11-08T13:10:12Z
closed_at: 2026-11-08T13:10:12Z
parent: wm-87pgn0b75yy5
custom_fields:
  split_as: task
---
## Target

Bring the task skill family in line with the acceptance-gate model settled on 2026-11-08: a blocked map may still split, `waiting_on` names a person only, batch selection never claims closed tasks, and the review refuses a stale wait.

## Why

The first pass tried to forbid splitting a blocked map; that conflicted with the Split map's user-confirmed decision and with the acceptance-gate model. The rest of the batch fixes stand.

## Acceptance direction

The split, map, task-design, task-review, execute-one-task, and execute-all files state the settled rules; the two examples no longer teach the old shape; `waymark validate` is clean; and a reader can trace each rule to the Task skill map.

## Decisions so far

- ~~A map with an unfinished dependency is not split; independent early work goes to a sibling map.~~ Superseded on 2026-11-08: a blocked map may still split; children inherit nothing; a child that uses the blocker's output carries its own edge or stops at execution.
- `waiting_on` is a person-only field; waiting on a task or map is a split error.
- `task-review` refuses to pass a ticket with a non-empty `waiting_on`.

## Boundaries

- No change to the grill, glossary, or issue skills.
- No new verdicts or fields.
