---
schema: 1
id: wm-kefrc2nxqyf2
title: Write the execute-all skill
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-07T13:21:25Z
updated_at: 2026-11-07T13:21:25Z
parent: wm-qt4pdg7dd0xy
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `weave-your-work/execute-all/`: `SKILL.md` with `dispatch.md` beside it, so an owner can advance every task under a map at once, each in its own subagent.

1. Write `SKILL.md`: when to use it rather than `execute-one-task`, which tickets it takes (the map's tasks owned by the operator, `waiting_on` out, `needs_human` never, a named subset allowed), claiming them all before anything goes out, running the batch through `dispatch.md`, collecting the reports, committing one task at a time, reviewing (itself, or a few reviewer subagents when the batch is large), handling a task that stops, and how the run ends.
2. Write `dispatch.md`: the context a subagent receives, the concurrency cap and how a freed slot is refilled, what a subagent may write, the five things it reports, and the collision list read before dispatch.
3. Point at `execute-one-task` for the steps of one task and at `task-review` for the judgment. Restate neither.
4. Walk the map this skill was designed for through the two files: pick a map with several open tasks, and report where the dispatcher had to guess.

## Acceptance signal

A reader holding a map with several open tasks can choose the tickets, claim them, dispatch, collect, commit, review, and end the run from the two files alone. Each rule appears once, in the file the split assigns it to: the run in `SKILL.md`, the distribution in `dispatch.md`. A task that stops shows the slot going to the next ticket and the wait landing on the ticket. Neither file restates a step of `execute-one-task` or a rule of `task-review`.

## Boundaries

- No steps for advancing one task; those are `execute-one-task`.
- No review rules; those are `task-review`.
- No change to the map body format.
