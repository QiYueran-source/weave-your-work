---
schema: 1
id: wm-8he44vj7v4y5
title: Execute step by step skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-07T09:41:50Z
updated_at: 2026-11-07T09:42:12Z
parent: wm-avc7a31tae33
---
## Target

Design the step-by-step execution skill: the shared step list and gates that advance one task, pausing between steps so a person can look.

Why: the steps and gates live in one place only; the other execution skills reference this one instead of restating them.

## Acceptance direction

`weave-your-work/execute-step-by-step/` exists, a reader can advance one task through it and stop at each gate, and `execute-all` points at it without adding a step of its own.

All children are complete and no further child is needed.

## Children

(none yet)

## Decisions so far

- This skill holds the core step list and gates; the other execution skills reference it (user confirmed).
- It pauses between steps for a person to look (user confirmed).
- It runs in the main agent's context, where a person can be asked (user confirmed).
- The first version has no self-grill and no execution log. The executor collects the information it needs itself and reports what it could not settle (user confirmed, replacing the earlier grill-and-log direction).
- Products: the deliverable goes where the work naturally lands, a repository file is committed and an external one gets a link, and the evidence record says where it is and how to open it. Intermediate artifacts stay out of the repository and are not kept. When the Action does not say where the output goes and the choice affects other people, the executor stops instead of choosing (user confirmed).
- A task waiting on a person keeps status `in_progress`. The wait is recorded as a comment carrying the issue link, and a `waiting_on` field names the person or the thing it waits on (user confirmed).
- When a task no longer holds, the executor stops and hands it back to the owner. The executor does not rewrite the action and does not split the task (user confirmed).

## Not yet specified

- The step list itself, and where each gate sits on it.
- How a pause is presented and what the person sees at it.
- Which gates the main agent runs that a subagent cannot.
- How a stopped task is handed back to its owner.

## Out of scope

- Choosing and dispatching a batch of tasks.
- Reviewing a finished task.
