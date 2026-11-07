---
schema: 1
id: wm-hx3ef134akk9
title: Write the execute-step-by-step skill
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-07T10:18:11Z
updated_at: 2026-11-07T10:39:58Z
parent: wm-8he44vj7v4y5
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
archived_at: 2026-11-07T10:46:56Z
archive_reason: The skill it wrote was taken out; the one-task shape replaced the step-by-step shape.
---
## Action

Write `weave-your-work/execute-step-by-step/SKILL.md`: the smallest execution unit, which advances one task and pauses between steps.

1. Before the first step: read the task and the map above it, check that the task still holds, claim it, and write `Progress`.
2. The gates: a `one_way` task waits for the named confirmation before any work, and a `Person:` step runs through a person.
3. The step loop: work one step, update `Progress`, pause.
4. A person step: hand it over, set `waiting_on`, stop, and clear the value when the answer arrives.
5. Finishing: read the Acceptance signal against the evidence, write `Result`, remove `Progress`, and hand the task to review.
6. Say what the skill does not do: run a batch, review a result, rewrite the action.

## Acceptance signal

`weave-your-work/execute-step-by-step/SKILL.md` exists and stands on its own. A reader holding a real ticket can walk it from an unclaimed task to one waiting for review using that file alone, and every gate in it names the field or section it reads.

## Boundaries

- No batch or dispatch content; that belongs to the dispatch skill.
- No review rules; those belong to the review skill.
- No task body rules; those belong to task design.
