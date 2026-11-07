---
schema: 1
id: wm-aax1220r1a5x
title: Write the execute-one-task skill
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-07T10:51:57Z
updated_at: 2026-11-07T10:54:12Z
closed_at: 2026-11-07T10:54:12Z
parent: wm-d5xq88m7g8p6
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `weave-your-work/execute-one-task/SKILL.md`: advance one task to its end and stop only where something blocks it.

1. Before the work: read the ticket and the map above it, check that the task still holds, claim it, and say one line about where it starts.
2. The five things that stop a run, and which of them wait and which hand the task back.
3. Doing the work: follow the `Action` to the end without stopping.
4. Finishing: read the `Acceptance signal` against the evidence, write `Result`, report three lines, and invoke `task-review`.
5. Stopping: write `Progress`, set `waiting_on`, report three lines.
6. Say what the skill writes and what it does not do.

## Acceptance signal

`weave-your-work/execute-one-task/SKILL.md` exists and stands on its own. A reader holding one real ticket can carry it from unclaimed to handed-over using that file alone, each of the five blockers names the field or section that raises it, and the file claims to write only `Result`, `Progress`, and `waiting_on`.

## Result

`weave-your-work/execute-one-task/SKILL.md` is written, 67 lines, seven parts from reading the ticket to what it refuses to write.

Each blocker names its source: the `one_way` gate reads the `Acceptance signal`, the person gate reads the `Person:` prefix, the promise question names the three things that count, the hand-back names `Progress` and `waiting_on`, and the missing input is the last one. It points at `execute-all`, `task-review`, and task design by name only, and restates none of their rules.

## Boundaries

- No batch content; that belongs to `execute-all`.
- No review rules; those belong to `task-review`.
- No task body format; that belongs to task design.
