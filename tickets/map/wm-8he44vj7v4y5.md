---
schema: 1
id: wm-8he44vj7v4y5
title: Execute step by step skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-07T09:41:50Z
updated_at: 2026-11-07T10:29:00Z
parent: wm-avc7a31tae33
---
## Target

Design the step-by-step execution skill: the shared step list and gates that advance one task, pausing between steps so a person can look.

Why: this is the smallest unit of execution, and the other execution skills reference it instead of restating it.

## Acceptance direction

`weave-your-work/execute-step-by-step/` exists, a reader can advance one task through it and stop at each gate, and `execute-all` points at it without adding a step of its own.

All children are complete and no further child is needed.

## Children

- [Write the execute-step-by-step skill](tickets/task/wm-hx3ef134akk9.md): not started; the step list below is what it writes.

## Decisions so far

- This is the smallest execution unit: it advances exactly one task, and every other execution skill is built by pointing at it or by running it repeatedly (user confirmed).
- It completes a whole task, not one step of a task. `execute-all` is the other shape: every task under a map run at once (user confirmed).
- It runs a task to the end. Work does not stop between steps; it stops only when something blocks it (user confirmed).
- It holds the step list and the gates, and `execute-all` references it (user confirmed).
- It pauses between steps for a person to look (user confirmed).
- It runs where a person can be asked, which a subagent cannot (user confirmed).
- The first version has no self-grill and no execution log. The executor gathers the information it needs itself and reports what it could not settle (user confirmed, replacing the earlier grill-and-log direction).
- Products: the deliverable goes where the work naturally lands, a repository file is committed and an external one gets a link, and what the work left says where it is and how to open it. Intermediate artifacts stay out of the repository and are not kept (user confirmed).
- A question the ticket leaves open that changes what the task promises is answered by the skill, not by taste: `execute-step-by-step` has a person at hand and stops to ask; `execute-all` cannot stop, decides, says what it decided in its report, and leaves the check to review. Where an output goes when the Action does not say is such a question (user confirmed).
- The state a run leaves behind is the `Progress` section of the task body and the `waiting_on` field, as the `task-design` skill defines them. What they hold, their format, their constraints, and their timing live there and nowhere else; this skill names them and does not restate them (user confirmed).
- A stopped run is picked up by reading the `Progress` section: an interrupt ends the run and working memory does not survive it, so the ticket is the only place the state can live (user confirmed).
- A task waiting on a person keeps status `in_progress`, sets `waiting_on`, and says in `Progress` what it waits for, with the issue link (user confirmed).
- When a task no longer holds, the executor stops and hands it back to the owner. The executor does not rewrite the action and does not split the task (user confirmed).
- After review returns the task for changes, the executor fixes only what the review names, not the whole action again, and sends it back for review. A fix that needs no person is made by an agent without asking anyone (user confirmed).
- A finished run reports three lines: what was done, how the `Acceptance signal` reads, and what is still unsettled. A run that stopped says which step it stopped at first.
- A task that no longer holds goes back with `Progress` naming the step and the reason, `waiting_on` set to the owner, and the status left `in_progress`. The message names what the ticket would have to change to continue.
- Batch selection is two layers: waymark's query takes the tasks owned by the operator, and the skill applies the semantic filters on top — a task waiting on a person, a task that no longer holds. The tool makes the coarse cut and the skill makes the judgement (user confirmed).

## Not yet specified

- Its name: settled as `execute-one-task`; the directory, the skill name, the map title, and every reference follow it (user confirmed).
- The step list. Proposed and not settled: read the ticket and the map above it; check that the task still holds; claim it and write `Progress`; run the gates; work one step and pause; read the `Acceptance signal` against the evidence; write what the work left and take `Progress` out; hand the task to `task-review`.
- Where the pauses sit. Proposed: after checking that the task holds, after each worked step, and after what the work left is written; no pause after reading, claiming, or running the gates.

## Out of scope

- Choosing and dispatching a batch of tasks.
- Reviewing a finished task.
