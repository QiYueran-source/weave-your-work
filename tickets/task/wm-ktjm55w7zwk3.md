---
schema: 1
id: wm-ktjm55w7zwk3
title: Declare waiting_on in the task properties reference
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-07T10:07:45Z
updated_at: 2026-11-08T13:18:08Z
closed_at: 2026-11-08T13:18:08Z
parent: wm-793jrqph1ckv
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Give the `waiting_on` field its one definition, in `properties.md`.

1. Add `waiting_on` to the field list that opens the file: optional, type string, written during execution rather than at design time.
2. State what it holds: the person, or the thing, whose answer the task waits on. One value, not a list of everything the task touches.
3. State its lifecycle: set when the task starts waiting, cleared when the answer arrives rather than when the work resumes.
4. State its constraint: a task with a value is still `in_progress`, not blocked and not closed.
5. Correct the opening sentence that says a task carries three custom fields.

## Acceptance signal

`properties.md` lists `waiting_on`, marks it optional and string, and a reader can tell from that file alone what goes in it, who writes it, and when it is set and cleared. Nothing else in the file or in `body.md` says any of that again.

## Result

Superseded on 2026-11-08: `waiting_on` now names a person only. A task waiting on another task or map is a split error, not a wait. The current rule is in `task-design/properties.md`.

## Boundaries

- No change to `body.md` or `kind.md`.
- No rule about batch selection, which belongs to task execution.
