---
schema: 1
id: wm-tzpgke8n6cxd
title: Write the task reference for the split skill
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-07T16:19:54Z
updated_at: 2026-11-07T16:19:54Z
parent: wm-bfqvr54kz3h4
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `weave-your-work/split/task.md`: the judgment half of splitting a map into tasks, so a settled layer becomes tickets a run can pick up.

1. Write the coverage check: read the parent's `Acceptance direction` line by line, and every line must be produced by some task. A line nothing produces means a missing task or a wrong direction.
2. Write the five gates every task passes before it is written: one action and one auditable standard; evidence a non-participant can read; who does it and whether `needs_human` agrees; what breaks if it goes wrong and therefore `reversibility`; and whether the output can be named, which decides `task_kind`. A gate that fails sends the part back to grill.
3. Say where the plan lives: one bullet in the map's `Decisions so far` with the count and one line per task, before any ticket is written.
4. Say what the split writes: each task's whole body against task design, the fields `task_kind`, `reversibility`, `needs_human`, `owner`, and `parent`; never `Result`, `Progress`, `Review`, `waiting_on`, or `outcome`.
5. Say how the tickets are hung: all written first with `waymark create --parent`, then the parent's `Children` updated once, then `waymark tree`.
6. Walk a real layer: take the nine write tasks of the task design map and run each through the five gates, reporting which gate would have stopped it.

## Acceptance signal

`weave-your-work/split/task.md` exists. A reader holding a map whose layer is settled can decide how many tasks it makes, run each through the five gates, and produce tickets a run can pick up, using that file and task design alone. The file restates no rule of task design: it names `body.md`, `kind.md`, and `properties.md` where they apply. The walk over the task design map's write tasks names a gate for every one of them.

## Boundaries

- No criterion and no routing: those live in the split skill's `SKILL.md`.
- No task body format, kinds, or acceptance signals: those are task design.
- No advancing a task: that is task execution.
