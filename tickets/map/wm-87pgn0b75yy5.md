---
schema: 1
id: wm-87pgn0b75yy5
title: Task skill
category: map
status: closed
owner: frank
creator: frank
created_at: 2026-11-06T12:11:26Z
updated_at: 2026-11-08T10:45:03Z
closed_at: 2026-11-08T10:36:39Z
parent: wm-qhd3twqjzhma
---
## Target

Define the Task skill: how work is cut from a map into executable tasks, and how an owner carries one to its outcome.

## Acceptance direction

Two child maps are complete and closed.

All children are complete and no further children are needed.

~~...and the Task skill's entry points at them.~~ Superseded on 2026-11-08: there is no separate entry document, and none is needed. The Task skill's entry is the two skills themselves — `task-design` for cutting work out of a map, `execute-one-task` with its batch and review siblings for carrying it to an outcome — each addressable by name because the set installs together. A routing file that names two skills and adds nothing is a third place to keep in step.

## Decisions so far

- The Task skill splits by actor into task design and task execution (user confirmed).
- Tasks carry no dependency edges, only soft links. Ordering lives on maps (user confirmed).
- ~~The execution side splits further into four flat skills: `execute-step-by-step`, `execute-all`, `task-dispatch`, and `task-review`.~~ Superseded on 2026-11-08: three skills, not four. `execute-step-by-step` is `execute-one-task`, `task-dispatch` is `dispatch.md` inside `execute-all`, and `task-review` stays its own skill. Decided in the execution map, which this map routes to.
- Execution posits no self-grill and no log in its first version; the executor gathers what it needs and reports what it could not settle (user confirmed).

## Not yet specified

- ~~Whether the Task skill's own entry document carries anything beyond routing into the two children.~~ Resolved on 2026-11-08: nothing. The answer is that there is no such document; routing is what `ask-me` and the skills' own names do.

## Out of scope

- The Map skill, which owns target trees and ordering.
- The grill and glossary skills, which own how decisions are recorded while they are made.
