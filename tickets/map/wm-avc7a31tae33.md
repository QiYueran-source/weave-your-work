---
schema: 1
id: wm-avc7a31tae33
title: Task execution skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-07T06:48:16Z
updated_at: 2026-11-07T09:43:16Z
parent: wm-87pgn0b75yy5
---
## Target

Design the task execution skills: define how an owner advances an executable task from start through its outcome, how a batch of tasks is run, and how a finished task is reviewed.

## Acceptance direction

The four task execution skills are delivered under `weave-your-work/`, and one worked example shows a single task advanced, a batch dispatched, and a finished task reviewed.

## Children

- [Execute step by step skill](tickets/map/wm-8he44vj7v4y5.md): the shared step list and gates, paused between steps.
- [Execute all skill](tickets/map/wm-qt4pdg7dd0xy.md): the same steps run in one pass, with no room to ask.
- [Task dispatch skill](tickets/map/wm-h8yejt98fbeg.md): choose, claim, and run a batch, and interrupt for a person.
- [Task review skill](tickets/map/wm-3kaftv6fzfx2.md): check a finished task against its own acceptance signal.

## Decisions so far

- The task owner is responsible for execution and may assign work to other people (user confirmed).
- AI handles the parts it can complete; work requiring a person is handed to a human (user confirmed).
- A human-required step is notified through a GitHub issue; the issue mechanism is designed by the communication category (user confirmed).
- The operating procedure for a task lives under this map, not in the total Task skill (user confirmed).
- The skills are user-invoked, not model-invoked (user confirmed).
- This map delivers four sibling skills, each with its own child map, all flat so they can reference each other: `execute-step-by-step`, `execute-all`, `task-dispatch`, and `task-review` (user confirmed).
- `execute-step-by-step` holds the step list and the gates, and `execute-all` references it instead of restating the steps (user confirmed).
- The reference arrows run from the two step skills out to the other skills, not the reverse (user confirmed). What each of them points at, and whether a step skill invokes the review or only names who reviews, is still open.
- The first version has no self-grill and no execution log. The executor gathers the information it needs itself and reports what it could not settle, rather than writing a question-and-answer record as it goes (user confirmed, replacing the earlier grill-and-log direction).
- When a task no longer holds, the executor stops and hands it back to the owner. The owner closes it and either reopens the work as a map or writes a new task. The executor does not rewrite the action and does not split the task (user confirmed).

## Not yet specified

- What the two step skills reference, and whether a step skill runs the review itself.
- How a stopped or interrupted task is resumed, now that no execution log is written.
- Which gates only a context that can talk to a person may run.
- Where the worked example lives.

## Out of scope

- Defining task body structure, kinds, reversibility, and acceptance signals.
- Deciding which tasks to create when splitting a map.
