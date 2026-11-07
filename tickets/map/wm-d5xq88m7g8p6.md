---
schema: 1
id: wm-d5xq88m7g8p6
title: Execute one task skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-07T10:46:51Z
updated_at: 2026-11-07T10:46:51Z
parent: wm-avc7a31tae33
---
## Target

Design the one-task execution skill: carry a single task from unclaimed to reviewed, stopping only when something blocks it.

Why: this is the smallest unit of execution. `execute-all` runs it once per task, one task per subagent.

## Acceptance direction

`weave-your-work/execute-one-task/` exists and stands on its own. A reader holding one real ticket can carry it from unclaimed to waiting for review using that file alone, and every blocker it names points at the field or section that raises it.

All children are complete and no further child is needed.

## Children

(none yet)

## Decisions so far

- It advances exactly one task and is the smallest execution unit; `execute-all` points at it rather than restating the steps (user confirmed).
- It runs the task to the end. Work does not stop between steps; it stops only when something blocks it (user confirmed).
- Its name is `execute-one-task`, after the unit it advances rather than the pauses it used to have (user confirmed).
- There is no self-grill and no execution log. The executor gathers what it needs itself and reports what it could not settle (user confirmed).
- Products: the deliverable goes where the work naturally lands, a repository file is committed and an external one gets a link, and `Result` says where it is and how to open it. Intermediate artifacts stay out of the repository and are not kept (user confirmed).
- The state a run leaves behind is the `Progress` section of the task body and the `waiting_on` field, as the task design skill defines them. This skill names them and does not restate their format (user confirmed).
- A stopped run is picked up by reading `Progress`: the ticket is the only place that state survives (user confirmed).
- A task waiting on a person keeps status `in_progress`, sets `waiting_on`, and says in `Progress` what it waits for, with the issue link (user confirmed).
- A question that would change what the task promises blocks the run and goes to the owner. A question about how the work is done does not block it; the executor answers it and says so in `Result` (user confirmed).
- When a task no longer holds, the executor hands it back to the owner: `Progress` names the reason, `waiting_on` names the owner, and the status stays `in_progress`. The executor does not rewrite the action and does not split the task (user confirmed).
- After review returns the task for changes, the executor fixes only what the review named and sends it back; a fix that needs no person is made without asking anyone (user confirmed).

## Not yet specified

- The blocker list: which conditions stop a run.
- The step list.
- When `Progress` is written and updated.
- Whether the run says one line at the start before working.

## Out of scope

- Running many tasks at once.
- Reviewing a finished task.
