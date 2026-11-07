---
schema: 1
id: wm-qt4pdg7dd0xy
title: Execute all skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-07T09:41:55Z
updated_at: 2026-11-07T09:42:12Z
parent: wm-avc7a31tae33
---
## Target

Design the whole-task execution skill: run one task through every step without pausing, in a context that cannot ask a question or interrupt.

Why: this is the shape a subagent can run, so it has to fit in one pass.

## Acceptance direction

`weave-your-work/execute-all/` exists, it references the step list in `execute-step-by-step` and adds only the differences, and a task can be run end to end from it.

All children are complete and no further child is needed.

## Children

(none yet)

## Decisions so far

- This skill is the shape a subagent runs: one pass, no questions, no interrupt (user confirmed).
- It holds no steps of its own. It references `execute-step-by-step` and states only what changes when the run never pauses (user confirmed).
- It collects what it needs before starting, because it cannot ask for more once it has begun (user confirmed).
- It reports back what it could not settle; the main agent decides whether to re-dispatch, interrupt, or hand the task back (user confirmed).

## Not yet specified

- What the differences are: what it gathers up front, what it does at a gate it cannot pass, how it reports.
- What it may write, restated from the dispatch contract or referenced from it.

## Out of scope

- Choosing and dispatching a batch of tasks.
- Reviewing a finished task.
