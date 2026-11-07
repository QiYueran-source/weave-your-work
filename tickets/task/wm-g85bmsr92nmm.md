---
schema: 1
id: wm-g85bmsr92nmm
title: Write the task review skill
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-07T12:52:23Z
updated_at: 2026-11-07T12:56:02Z
closed_at: 2026-11-07T12:56:02Z
parent: wm-3kaftv6fzfx2
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `weave-your-work/task-review/`: the entry `SKILL.md` with `delivery.md` and `probe.md` beside it, so a run that has finished a task can check the result against the signal written before the work started.

1. Write `SKILL.md`: when the review runs (a run that has finished a task), who may review (anyone, including the executor), what it reads (the ticket's `Action`, `Acceptance signal`, `Boundaries`, and `Result`, then the work that result points at), the two axes, the four verdicts and what each leaves the ticket as, the `## Review` section it writes, the `outcome=failed` it sets on a wrong direction, closing on a pass, and the report rule.
2. Write `delivery.md`: how the goal axis reads a delivery's evidence — the deliverable is where `Result` says, and the signal's method is how it is opened and read — and what a missing or unreadable deliverable leaves as a verdict.
3. Write `probe.md`: how the goal axis reads a probe's evidence — the check is complete when the evidence the signal asks for is there, completeness is about the evidence and not about which way the answer went, a negative finding is a pass, and a finding with nothing behind it is a change.
4. Walk `wm-aax1220r1a5x`, a real finished task, through the three files as a reviewer would, without writing anything. Report where they left you guessing, and fix those gaps.

## Acceptance signal

`weave-your-work/task-review/` holds the three files. A reader who did not write them can take a finished task, run the review to one of the four verdicts, write `## Review` in the shape task design defines, and report the run in three lines — from those files alone. Nothing in the three files restates a rule that task design or `execute-one-task` owns; each points at the file that owns it. The walk in step 4 found no place where the files left a reviewer guessing, or every such place was fixed.

## Boundaries

- No map review; that is the map review skill.
- No execution steps or gates; those are `execute-one-task`.
- No task body format. `## Review` and `outcome` are defined in task design, and that change lands first as wm-gg4m636xgrxz.

## Result

`weave-your-work/task-review/` holds three files: `SKILL.md` for when the review runs, who may review, what it reads, the two axes, the four verdicts, what it writes, how it closes or hands the task on, and the report rule; `delivery.md` for how the goal axis reads a deliverable, the `one_way` confirmation, and the convention axis; `probe.md` for evidence completeness, a negative finding passing, and the convention axis.

The walk over `wm-aax1220r1a5x` found three contradictions in `execute-one-task`, all fixed there: the finish report came before the review, so its verdict could not appear in it; the closing line said anything short of a pass comes back, which is false for `wrong direction` and `needs discussion`; and the write list did not say where `## Review` comes from.

## Review

passed

- Goal: the three files exist, a reader can carry a finished task to one of the four verdicts, write `## Review` in the shape `body.md` defines, and report three lines; the walk on `wm-aax1220r1a5x` reached a verdict with no place left to guess.
- Convention: no rule of task design or `execute-one-task` is restated; each is named and left where it lives. Only the three files were added, and the `execute-one-task` edits stop at what the review changes for it.
