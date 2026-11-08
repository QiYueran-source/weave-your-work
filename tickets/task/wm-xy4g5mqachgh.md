---
schema: 1
id: wm-xy4g5mqachgh
title: Fix the task skill conflicts
category: task
status: in_progress
owner: frank
creator: frank
created_at: 2026-11-08T12:41:33Z
updated_at: 2026-11-08T12:41:33Z
parent: wm-zkrds7y5at8v
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Bring the task skill family and its two examples in line with the batch model settled on 2026-11-08.

1. In `weave-your-work/split/SKILL.md`, replace "A map that is waiting on another node may still split" with the rule that a map with an unfinished dependency is not split; independent early work goes to a sibling map.
2. In `weave-your-work/split/task.md`, state that a task which reads another task's output is a split error: merge the work into one task or put the parts under child maps with an edge. In `split/submap.md`, state that the parent's dependency closes before the sequence is split.
3. In `weave-your-work/map/frontmatter.md`, change the dependency line from "cannot start" to "cannot be accepted", and state that `blocked` is the item's own edge, not a freeze of the subtree.
4. In `weave-your-work/task-design/properties.md`, make `waiting_on` person-only and say that waiting on a task or map is a split error; fix the optional-field contradiction and the `waymark owner transfer` command.
5. In `weave-your-work/execute-one-task/SKILL.md`, add the closed-ticket guard, the input check that stops on a task or map's output, the person-only `waiting_on` stop, the `needs_human` manual release, the `Result` write on a hand-back, and the rule to read and preserve an existing `## Review`.
6. In `weave-your-work/execute-all/SKILL.md`, select only `open` and `in_progress` tasks, use the chosen map's owner rather than the operator, and stop on a non-empty `waiting_on`. In `dispatch.md`, narrow the subagent's writes to `Result`, `Progress`, `waiting_on`, and the claim.
7. In `weave-your-work/task-review/SKILL.md`, refuse to pass or close a ticket whose `waiting_on` is non-empty: `passed` and `wrong direction` require it cleared, `needs changes` with a value becomes `needs discussion`, and `needs discussion` is the only verdict that sets it.
8. Rewrite `weave-your-work/use-weave-your-work-examples/task-example.md` in the current task shape. In the chemistry scenario, mark the table/probe pair as a split error rather than a batch input rule; the example must not teach the old shape.
9. Run `waymark validate` and review every changed file against the task skill map's settled decisions.

## Acceptance signal

The nine files named above state the settled rules, and none still says a blocked map may split, that `waiting_on` can name a thing, or that a batch claims a closed task. `waymark validate` reports no findings. A reader of `split` and `execute-all` sees the same model: a blocked map is not split, and a task that needs another task's output is a split error. The examples no longer teach the old shape.

## Boundaries

- No change to the grill, glossary, map review, or issue skills.
- No new verdict, field, or command.
- No change to the chemistry fixture's tickets; only the pages that describe them.
