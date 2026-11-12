---
schema: 1
id: wm-avc7a31tae33
title: Task execution skill
category: map
status: closed
owner: frank
creator: frank
created_at: 2026-11-07T06:48:16Z
updated_at: 2026-11-12T12:13:56Z
closed_at: 2026-11-08T10:31:24Z
parent: wm-87pgn0b75yy5
custom_fields:
  split_as: submap
---
## Target

Design the task execution skills: define how an owner advances an executable task from start through its outcome, how a batch of tasks is run, and how a finished task is reviewed.

## Acceptance direction

The three task execution skills are delivered under `weave-your-work/`, with `dispatch.md` inside `execute-all` rather than a skill of its own.

~~...and one worked example shows a single task advanced, a batch dispatched, and a finished task reviewed.~~ Superseded on 2026-11-08: worked examples and the end-to-end test of every skill are done in one batch once the skill set is whole. The example this map asked for belongs to that batch, not here. The delivery clause is what this map is accepted on.

All children are complete and no further children are needed.

## Decisions so far

- The task owner is responsible for execution and may assign work to other people (user confirmed).
- AI handles the parts it can complete; work requiring a person is handed to a human (user confirmed).
- A human-required step is notified through a GitHub issue; the issue mechanism is designed by the communication category (user confirmed). Built so far: the wait is `waiting_on`, and no notification exists yet — the skills write the wait and the communication category will carry it out of the ticket. Nothing in the three skills claims an issue is filed.
- The operating procedure for a task lives under this map, not in the total Task skill (user confirmed).
- ~~The skills are user-invoked, not model-invoked.~~ Superseded on 2026-11-08: true of `execute-one-task` and `execute-all`, false of `task-review`. The review has to be loadable by the run that has just finished a task, so it is model-invocable; that is why `execute-one-task` can invoke it by name. The user's rule stands where it was aimed — nobody starts a batch or a task run by accident. (verified against the three front matters)
- This map delivers three sibling skills: `execute-one-task`, `execute-all`, and `task-review`. `task-dispatch` is not a sibling: its content lands as a reference file inside `execute-all`, the way task design keeps `body.md` beside `SKILL.md` (user confirmed).
- `execute-step-by-step` is renamed `execute-one-task`, because it advances one whole task rather than describing pauses (user confirmed).
- While one task is being advanced, the run keeps going until the task is done. It stops only on a blocker (user confirmed).
- `execute-step-by-step` is the smallest execution unit. It holds the step list and the gates; `execute-all` references it instead of restating the steps (user confirmed).
- Every skill in the set is installed together, so a skill may point at another skill by name or by path and the reference resolves. A cross-skill reference is not a dead link, and no skill has to restate another's rules (user confirmed).
- The two step skills do the referencing: they are the ones that name the other skills (user confirmed).
- Execution keeps no per-step question-and-answer record. What a run leaves lives on the task ticket: `Progress` while it runs, `Result` when it ends, `Review` once it is judged. How a batch went is written nowhere else: the map stays a functional record of the target, and the tickets carry what the run left (user confirmed). This replaced an earlier decision that the main agent writes the batch outcome on the parent map.
- When a task no longer holds, the executor stops and hands it back to the owner. The owner closes it and either reopens the work as a map or writes a new task. The executor does not rewrite the action and does not split the task (user confirmed).
- Two things this map needs from task design are now filed there: a `Progress` section in the task body for the state a run leaves behind, and a `waiting_on` field for a task that waits on a person. The task design map was reopened to hold them (user confirmed).

## Not yet specified

- ~~The step list, and where on it a pause belongs.~~ Resolved: the shape is the sections of `execute-one-task`; a pause is one of its five blockers and writes `Progress` with `waiting_on`.
- ~~What the step skills point at in review and dispatch, and whether a step skill runs the review itself.~~ Resolved: `execute-one-task` invokes `task-review` and the review closes; in a batch it stops at `Result` and the main agent reviews.
- ~~Which gates only a context that can talk to a person may run.~~ Resolved: no gate needs one. A needed person is a wait recorded in `waiting_on`, and only the main agent talks to a person.
- ~~Where the worked example lives. Deferred by the user.~~ Resolved on 2026-11-08: it lives in the one batch that writes every skill's worked example and runs the end-to-end test. Recorded in the root map's `Decisions so far`.

## Out of scope

- Defining task body structure, kinds, reversibility, and acceptance signals.
- Deciding which tasks to create when splitting a map.
