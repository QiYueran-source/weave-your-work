---
schema: 1
id: wm-d5xq88m7g8p6
title: Execute one task skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-07T10:46:51Z
updated_at: 2026-11-07T10:49:41Z
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
- The step list: read the ticket and the map above it; check that the task still holds; claim it; run the gates; work to the end; read the `Acceptance signal` against the evidence; write the outcome; hand the task on (user confirmed).
- Five things block a run: the `one_way` confirmation has not landed, a `Person:` step needs a person, a question would change what the task promises, the task no longer holds, or the work lacks an input or a permission. The last one is a wait; a task that no longer holds is handed back (user confirmed).
- It writes exactly two things into the task body, and no more: `Result` when the task finishes, `Progress` when it stops. Everything else in the body was written by the designer and is not touched (user confirmed).
- `Progress` is written only when the run stops, as the record that lets the next run continue. A run that starts writes nothing (user confirmed).
- `waiting_on` is set when the stop waits on a person, and cleared when the answer arrives (user confirmed).
- The ticket body's sections are task design's. This skill names `Result` and `Progress` and does not restate their format (user confirmed).
- The run says one line when it starts — where it begins and what the first step is — and then works (user confirmed).
- Every ending reports: a finished run and a stopped run both say what happened. A run never ends silently (user confirmed).
- There is no self-grill and no execution log. The executor gathers what it needs itself (user confirmed).
- Products: the deliverable goes where the work naturally lands, a repository file is committed and an external one gets a link, and `Result` says where it is and how to open it. Intermediate artifacts stay out of the repository and are not kept (user confirmed).
- The state a run leaves behind is `Progress` and `waiting_on`, as task design defines them. A stopped run is picked up by reading `Progress` (user confirmed).
- A task waiting on a person keeps status `in_progress`, sets `waiting_on`, and says in `Progress` what it waits for, with the issue link (user confirmed).
- A question that would change what the task promises blocks the run and goes to the owner. A question about how the work is done does not block it; the executor answers it and says so in `Result` (user confirmed).
- When a task no longer holds, the executor hands it back to the owner: `Progress` names the reason, `waiting_on` names the owner, and the status stays `in_progress`. The executor does not rewrite the action and does not split the task (user confirmed).
- After review returns the task for changes, the executor fixes only what the review named and sends it back; a fix that needs no person is made without asking anyone (user confirmed).
- A finished run reports three lines: what was done, how the `Acceptance signal` reads, and what is still unsettled. A stopped run reports three lines: where it stopped, why, and who picks it up (user confirmed).
- The last step invokes `task-review`. The review decides whether the ticket closes; the review's own rules are its business, so this skill only names the call (user confirmed).

## Not yet specified

(none; the run, its stops, and its endings are settled)

## Out of scope

- Running many tasks at once.
- Reviewing a finished task.
