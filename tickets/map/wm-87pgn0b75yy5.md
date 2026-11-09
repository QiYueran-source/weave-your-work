---
schema: 1
id: wm-87pgn0b75yy5
title: Task skill
category: map
status: closed
owner: frank
creator: frank
created_at: 2026-11-06T12:11:26Z
updated_at: 2026-11-09T14:52:11Z
closed_at: 2026-11-08T13:10:12Z
parent: wm-qhd3twqjzhma
custom_fields:
  split_as: submap
---
## Target

Define the Task skill: how work is cut from a map into executable tasks, how an owner carries one to its outcome, and how a reader finds the skill for the question they have.

## Acceptance direction

~~Two child maps are complete and closed.~~

~~All children are complete and no further children are needed.~~

~~...and the Task skill's entry points at them.~~ Superseded on 2026-11-08: there is no separate entry document, and none is needed. The Task skill's entry is the two skills themselves — `task-design` for cutting work out of a map, `execute-one-task` with its batch and review siblings for carrying it to an outcome — each addressable by name because the set installs together. A routing file that names two skills and adds nothing is a third place to keep in step.

Superseded on 2026-11-08: the Task skill gains a total entry, so the map has three child maps and the entry is part of its acceptance. The old reasoning lost because the family now has four skills, `ask-me` is not built, and a named entry is how a person finds the family.

Five child maps are complete and closed.

All children are complete and no further children are needed.

The entry exists at `weave-your-work/task/SKILL.md` and routes to `task-design`, `execute-one-task`, `execute-all`, and `task-review`.

Review point: the five child maps are closed, and a reader who opens `task/SKILL.md` alone can tell which skill owns their question.

Reopened on 2026-11-08: the chemistry walk found conflicts in the batch and review rules. Fixed in [Task skill conflict fixes](tickets/map/wm-zkrds7y5at8v.md) and [Task skill review fixes](tickets/map/wm-nx5547pvnxpj.md); the chemistry walk's findings are now closed or recorded as rejected. (user confirmed the batch model on 2026-11-08)

## Decisions so far

- The Task skill splits by actor into task design and task execution (user confirmed).
- Tasks carry no dependency edges, only soft links. Ordering lives on maps (user confirmed).
- ~~The execution side splits further into four flat skills: `execute-step-by-step`, `execute-all`, `task-dispatch`, and `task-review`.~~ Superseded on 2026-11-08: three skills, not four. `execute-step-by-step` is `execute-one-task`, `task-dispatch` is `dispatch.md` inside `execute-all`, and `task-review` stays its own skill. Decided in the execution map, which this map routes to.
- Execution posits no self-grill and no log in its first version; the executor gathers what it needs and reports what it could not settle (user confirmed).
- The Task skill gains a total entry skill at `weave-your-work/task/`, named `task`. It routes to the four task skills; it does not carry the task body, the execution procedure, or the review rules. (user confirmed)
- The entry is user-invoked, like the two execute skills, because it is the name a person types, not a router a model loads. (user confirmed, 2026-11-09; see [Work-weave: general team collaboration skill set](wm-wjwa9081hse1.md))
- The entry names `update` for changing a closed task and `split` for deciding whether work is a task or a child map. It restates neither. (agent decision, revisable)
- The entry is designed in [Task skill entry](tickets/map/wm-aya8m15vkvkj.md), which hangs [Write the task skill entry](tickets/task/wm-vatw4s6pj8df.md) under it. (agent decision, revisable)
- Batch selection: only `open` and `in_progress` tasks are candidates; a closed task is never claimed. (user confirmed on 2026-11-08)
- A dependency edge gates the map's acceptance, not its whole subtree. There is no recursive `startable` check: before work, the executor lists the task's inputs and the parent map's unfinished dependencies, and stops only when the task actually uses a blocker's output. (user confirmed on 2026-11-08)
- A task that starts while an ancestor waits records that judgment in `Result`. (agent decision, revisable)
- `waiting_on` is handled explicitly: a run stops on a non-empty value, and the value is cleared once the wait is handled, before the task is selected again. (user confirmed on 2026-11-08)

- `waiting_on` is cleared by the owner after the wait is handled; a `needs_human` task stops at its `Person:` step and the owner releases it by clearing the field. (user confirmed on 2026-11-08)
- `execute-all` selects tasks owned by the chosen map's owner, not by the local operator. (user confirmed on 2026-11-08)

- `waiting_on` names a person only. A task waiting on another task or a map is a split error, not a wait. (user confirmed on 2026-11-08)
- ~~A map with an unfinished dependency is not split; wait for the dependency to close. Independent early work becomes a sibling map.~~ Superseded on 2026-11-08: a blocked map may still split; the wait stays on the map, children inherit nothing, and a child that uses the blocker's output carries its own edge or stops at execution. (user confirmed)
- The chemistry table/probe pair is a mis-split. Merge them or put them under sibling maps with an edge; the batch needs no external-input rule for it. (agent decision, revisable)

## Not yet specified

- (none; the chemistry walk's findings are closed or recorded as rejected.)

- Align `map/frontmatter.md` and the batch skills with the acceptance-gate model recorded in `GLOSSARY.md`.
- Whether `execute-all` selects tasks owned by the chosen map's owner or by the local operator.
- The wording of the `Result` line that records why a task started while an ancestor waits.

- ~~Whether the Task skill's own entry document carries anything beyond routing into the two children.~~ Resolved on 2026-11-08: nothing. The answer is that there is no such document; routing is what `ask-me` and the skills' own names do.
  Resolved again on 2026-11-08: the entry exists, and its scope is settled in [Task skill entry](tickets/map/wm-aya8m15vkvkj.md).

## Out of scope

- The Map skill, which owns target trees and ordering.
- The grill and glossary skills, which own how decisions are recorded while they are made.
