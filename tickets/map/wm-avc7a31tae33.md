---
schema: 1
id: wm-avc7a31tae33
title: Task execution skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-07T06:48:16Z
updated_at: 2026-11-07T09:56:54Z
parent: wm-87pgn0b75yy5
---
## Target

Design the task execution skills: define how an owner advances an executable task from start through its outcome, how a batch of tasks is run, and how a finished task is reviewed.

## Acceptance direction

The four task execution skills are delivered under `weave-your-work/`, and one worked example shows a single task advanced, a batch dispatched, and a finished task reviewed.

## Children

- [Execute step by step skill](tickets/map/wm-8he44vj7v4y5.md): the smallest execution unit, paused between steps.
- [Execute all skill](tickets/map/wm-qt4pdg7dd0xy.md): the same unit run in one pass, with no room to ask.
- [Task dispatch skill](tickets/map/wm-h8yejt98fbeg.md): choose, claim, and run a batch, and interrupt for a person.
- [Task review skill](tickets/map/wm-3kaftv6fzfx2.md): check a finished task against its own acceptance signal.

## Decisions so far

- The task owner is responsible for execution and may assign work to other people (user confirmed).
- AI handles the parts it can complete; work requiring a person is handed to a human (user confirmed).
- A human-required step is notified through a GitHub issue; the issue mechanism is designed by the communication category (user confirmed).
- The operating procedure for a task lives under this map, not in the total Task skill (user confirmed).
- The skills are user-invoked, not model-invoked (user confirmed).
- This map delivers four sibling skills, each with its own child map, all flat so they can reference each other: `execute-step-by-step`, `execute-all`, `task-dispatch`, and `task-review` (user confirmed).
- `execute-step-by-step` is the smallest execution unit. It holds the step list and the gates; `execute-all` references it instead of restating the steps (user confirmed).
- Every skill in the set is installed together, so a skill may point at another skill by name or by path and the reference resolves. A cross-skill reference is not a dead link, and no skill has to restate another's rules (user confirmed).
- The two step skills do the referencing: they are the ones that name the other skills (user confirmed).
- Execution keeps no per-step question-and-answer record. What a run leaves lives on the task ticket: `Progress` while it runs and `Result` when it ends. How a batch went is written on the parent map by the main agent (user confirmed).
- When a task no longer holds, the executor stops and hands it back to the owner. The owner closes it and either reopens the work as a map or writes a new task. The executor does not rewrite the action and does not split the task (user confirmed).
- Two things this map needs from task design are now filed there: a `Progress` section in the task body for the state a run leaves behind, and a `waiting_on` field for a task that waits on a person. The task design map was reopened to hold them (user confirmed).

## Not yet specified

- The step list, and where on it a pause belongs. Deferred by the user.
- What the step skills point at in review and dispatch, and whether a step skill runs the review itself.
- Which gates only a context that can talk to a person may run.
- Where the worked example lives. Deferred by the user.

## Out of scope

- Defining task body structure, kinds, reversibility, and acceptance signals.
- Deciding which tasks to create when splitting a map.
