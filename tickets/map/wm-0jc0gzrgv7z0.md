---
schema: 1
id: wm-0jc0gzrgv7z0
title: 'Stop-and-wait: read the whole project and report contradictions'
category: map
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T01:21:53Z
updated_at: 2026-11-12T12:13:29Z
closed_at: 2026-11-10T01:47:30Z
parent: wm-wjwa9081hse1
custom_fields:
  split_as: task
---
## Target

A run can step out of the task it is advancing, read the whole project at once, and report where two parts of it contradict each other, without changing a single ticket.

Why: work advances one ticket at a time and each ticket reads only what it needs. Two maps can promise the same outcome, a map can claim a skill does something it does not, and a rule can forbid what a flow requires. None of that shows up from inside one task; it surfaces after the contradiction has already cost work.

## Acceptance direction

All children are complete and no further children are needed.

Review point: `weave-your-work/stop-and-wait/SKILL.md` names the trigger, the read set, the conflict classes as a closed list, the report path and the shape of one finding, and what the skill never writes. One real report from this repository exists under `docs/stop-and-wait/`; every finding in it names both sides with a resolvable ticket id or file path, and no finding names only one side.

## Decisions so far

- The skill is named `stop-and-wait`, after the act it performs rather than after `review`, which already means judging one map or one task. (user confirmed, 2026-11-10)
- Its output is one report under `docs/stop-and-wait/`; the run changes no ticket, opens nothing, and fixes nothing. (user confirmed, 2026-11-10)
- It hangs directly under the root map, not under a new category map. (user confirmed, 2026-11-10)
- A conflict needs two citable sides. A finding that names one side is an opinion and is dropped, the same discipline `map-review` applies to its findings. (agent decision, revisable)
- The conflict classes are a closed list. A new class is added here first, not invented in a report. (agent decision, revisable)

## Not yet specified

(none; the fog is cleared)

## Out of scope

- Repairing what the report finds. The person decides which findings become tickets.
- Reviewing one map or one task. Those are `map-review` and `task-review`.
- A health score, a badge, or a coverage percentage. The output is specific conflicts, not a grade.

## Review

passed

- Goal: the review point has four parts. `weave-your-work/stop-and-wait/SKILL.md` names the trigger (`## When it runs`), the read set with its stopping rule (`## The read set`), the six classes as a closed list with the instruction that a new class is a decision on this map (`## Six conflict classes`), the report path and the fixed shape of one finding (`## The report`), and what the run never writes (`## What it never does`). One real report exists at `docs/stop-and-wait/2026-11-10-skill-set.md`; its four findings each carry a `Side A` and a `Side B`, and every one of the fourteen citations was re-opened at the cited line or resolved with `waymark show` before the report was committed.
- Convention: the body carries the five sections this map needs, `split_as: submap` matches its one child being a task, no children index appears in the body, and the work was written by the task that owns it. The child closed with a `passed` review citing the same evidence.
