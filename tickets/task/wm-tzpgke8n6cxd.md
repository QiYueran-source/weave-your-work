---
schema: 1
id: wm-tzpgke8n6cxd
title: Write the task reference for the split skill
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-07T16:19:54Z
updated_at: 2026-11-08T10:49:33Z
closed_at: 2026-11-08T10:49:33Z
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
5. Say how the tickets are hung: all written first with `waymark create --parent`, then the shape read back with `waymark tree --root <map>`. There is no parent-body update, so a half-finished split leaves nothing behind on the map.
6. Walk a real layer: take every write task under the task design map and run each through the five gates, reporting which gate would have stopped it.

## Acceptance signal

`weave-your-work/split/task.md` exists. A reader holding a map whose layer is settled can decide how many tasks it makes, run each through the five gates, and produce tickets a run can pick up, using that file and task design alone. The file restates no rule of task design: it names `body.md`, `kind.md`, and `properties.md` where they apply. The walk over the task design map's write tasks names a gate for every one of them.

## Result

`weave-your-work/split/task.md` is written. It covers the coverage check against the parent's acceptance direction, the five gates and what each one decides, the plan entry on the parent map, what the split writes and never writes, the create-and-read-back commands, and the two situations that send a part back to grill.

The walk over the ten tasks under the task design map:

- **Gate 5 stops two.** `wm-f5ddb0342bt1` and `wm-yx9rckmhnkpm` both ask whether a reader can write both kinds of task from the skill alone. The output is an answer, not a deliverable, so each is a probe wearing `task_kind: delivery`, and neither carries the two `Next step` lines a probe needs. They are also duplicates of each other: same action, overlapping signal.
- **Gate 2 is weak on four.** `wm-0sk8rrhz6gsv`, `wm-6sfjje8w0688`, `wm-qamw233hhpe3`, and `wm-5am6jgx5jyvb` each rest part of their standard on "a reader can..." and on what the file "used to" say. Each also names something openable, so the gate does not stop them; it flags the shape.
- **The other four pass all five.** `wm-2vphdebar7ph`, `wm-gg4m636xgrxz`, `wm-ktjm55w7zwk3`, `wm-ma7v0p1bqb52`.
- **One gap none of the gates covers.** `wm-2vphdebar7ph`, `wm-5am6jgx5jyvb`, and `wm-6sfjje8w0688` each wrote a rule about `Progress`, `Result`, or where evidence lives that a later sibling reversed. No gate catches this, because the tasks under one map are meant to run in parallel and their premises can move under each other. That is the same question the split map still holds as fog: what to do when parts of a layer have to run in sequence.

## Review

passed

- Goal: `weave-your-work/split/task.md` exists; the coverage check, the five gates, the plan entry, what the split writes, the hanging steps, and the return-to-grill rule are all stated; the walk names a gate verdict for all ten tasks. Read against the acceptance signal line by line.
- Convention: only `weave-your-work/split/task.md` was written by this task, plus the step 6 correction in this ticket's own `Action`. The rest of the ticket edits were the run's own `Result`, `Review`, and status.

## Boundaries

- No criterion and no routing: those live in the split skill's `SKILL.md`.
- No task body format, kinds, or acceptance signals: those are task design.
- No advancing a task: that is task execution.
