---
schema: 1
id: wm-xy4g5mqachgh
title: Fix the task skill conflicts
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-08T12:41:33Z
updated_at: 2026-11-08T13:12:06Z
closed_at: 2026-11-08T13:12:06Z
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

The nine files named above state the settled rules: a blocked map may still split, the children inherit nothing, `waiting_on` names a person only, a batch never claims a closed task, and a task that needs another task's output is a split error. `waymark validate` reports no findings.

Superseded on 2026-11-08: the first pass also changed `split` to forbid splitting a blocked map. That part was reversed after the Split map's owner decision; the current rule is that a blocked map may still split, and a child that uses the blocker's output carries its own edge or stops at execution. The rest of this task stands.

## Result

The nine files named in the Action are updated:

- `split/SKILL.md`, `split/task.md`, and `split/submap.md` now say a blocked map may still split, the children inherit nothing, and a task that reads another task's output is a split error.
- `map/frontmatter.md` says the edge gates acceptance, not the subtree, and that task front matter carries no dependency rule.
- `task-design/properties.md` makes `waiting_on` person-only, fixes the optional-field wording, the parent/dependency check, and the owner-transfer command.
- `execute-one-task/SKILL.md` adds the closed guard, the parent/dependency check, the person-only wait stop, the `needs_human` manual release, the `Result` hand-back, and the instruction to read and preserve an existing `## Review`.
- `execute-all/SKILL.md` selects only open/in-progress tasks owned by the chosen map's owner, not the operator, and skips a non-empty `waiting_on`; `dispatch.md` narrows the subagent's writes.
- `task-review/SKILL.md` refuses to pass or close a ticket with a non-empty `waiting_on`.
- `task-example.md` is rewritten in the current task shape.
- The chemistry batch and review pages no longer teach the old shape; the table/probe pair is marked as a split error.
- `update/need-execute.md` was also aligned so its stopped-gate instruction names the person who holds the answer.

`waymark validate` reports no findings.

The later findings are fixed in [Task skill review fixes](tickets/map/wm-nx5547pvnxpj.md); this task's scope ends at the batch rules.

## Review

passed

- Goal: `split`, `map/frontmatter`, `task-design/properties`, `execute-one-task`, `execute-all`, `dispatch`, `task-review`, `task-example`, and the chemistry pages state the settled rules: a blocked map may still split, the children inherit nothing, `waiting_on` names a person, and a batch never claims a closed task; `waymark validate` is clean. Read against the current `Acceptance signal`.
- Convention: only the listed skill files, the two examples, `update/need-execute.md`, and the task's own tickets were changed; no grill, glossary, map review, or issue file was touched.

## Boundaries

- No change to the grill, glossary, map review, or issue skills.
- No new verdict, field, or command.
- No change to the chemistry fixture's tickets; only the pages that describe them.
