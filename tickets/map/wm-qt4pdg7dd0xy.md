---
schema: 1
id: wm-qt4pdg7dd0xy
title: Execute all skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-07T09:41:55Z
updated_at: 2026-11-07T10:41:48Z
parent: wm-avc7a31tae33
---
## Target

Design the whole-map execution skill: run every task under a map at once, each one in its own subagent, and collect what comes back.

Why: a map's tasks are parallel branches, so the normal way to advance a map is to run them together rather than one after another.

## Acceptance direction

`weave-your-work/execute-all/` exists, a run over a map with several open tasks starts them together, and the skill says what it does with a task that stops.

All children are complete and no further child is needed.

## Children

(none yet)

## Decisions so far

- This skill runs every task under a map at once; `execute-step-by-step` is the other shape, one whole task with pauses (user confirmed).
- Each task runs in its own subagent, in one pass, with no questions and no interrupt (user confirmed).
- Each subagent loads `execute-step-by-step` for the steps and points at it instead of restating them (user confirmed).
- The run ends with the work reviewed, not when the actions are done. A finished task is not complete until it has been checked (user confirmed).
- A subagent reports where it stopped and why; the main agent decides whether to re-dispatch, interrupt, or hand the task back to the owner (user confirmed).

## Not yet specified

- How this skill relates to `task-dispatch`: what the run loop holds and what the dispatching mechanics hold.
- What the run does when one task stops while the others continue.
- Where the run's own outcome is written, now that a run writes nothing outside the tickets.

## Out of scope

- The steps that advance one task.
- Reviewing a finished task.
