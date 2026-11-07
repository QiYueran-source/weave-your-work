---
schema: 1
id: wm-8he44vj7v4y5
title: Execute step by step skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-07T09:41:50Z
updated_at: 2026-11-07T09:49:48Z
parent: wm-avc7a31tae33
---
## Target

Design the step-by-step execution skill: the shared step list and gates that advance one task, pausing between steps so a person can look.

Why: this is the smallest unit of execution, and the other execution skills reference it instead of restating it.

## Acceptance direction

`weave-your-work/execute-step-by-step/` exists, a reader can advance one task through it and stop at each gate, and `execute-all` points at it without adding a step of its own.

All children are complete and no further child is needed.

## Children

(none yet)

## Decisions so far

- This is the smallest execution unit: it advances exactly one task, and every other execution skill is built by pointing at it or by running it repeatedly (user confirmed).
- It holds the step list and the gates, and `execute-all` references it (user confirmed).
- It pauses between steps for a person to look (user confirmed).
- It runs where a person can be asked, which a subagent cannot (user confirmed).
- The first version has no self-grill and no execution log. The executor gathers the information it needs itself and reports what it could not settle (user confirmed, replacing the earlier grill-and-log direction).
- Products: the deliverable goes where the work naturally lands, a repository file is committed and an external one gets a link, and the evidence says where it is and how to open it. Intermediate artifacts stay out of the repository and are not kept. When the Action does not say where the output goes and the choice affects other people, the executor stops instead of choosing (user confirmed).
- A task waiting on a person keeps status `in_progress`. The wait is recorded as a comment carrying the issue link, and a `waiting_on` field names the person or the thing it waits on (user confirmed).
- When a task no longer holds, the executor stops and hands it back to the owner. The executor does not rewrite the action and does not split the task (user confirmed).
- After review returns the task for changes, the executor fixes only what the review names, not the whole action again, and sends it back for review. A fix that needs no person is made by an agent without asking anyone (user confirmed).

## Not yet specified

- The step list itself, and where each gate sits on it. Deferred by the user.
- How a run resumes after an interrupt. The answer offered is the ticket alone: an interrupt ends the run, working memory does not survive it, and a task small enough to be one node can be picked up from its own body in one read.
- How a pause is presented and what the person sees at it.
- What the executor reports when it finishes, now that no log is written.
- How a stopped task is handed back to its owner.

## Out of scope

- Choosing and dispatching a batch of tasks.
- Reviewing a finished task.
