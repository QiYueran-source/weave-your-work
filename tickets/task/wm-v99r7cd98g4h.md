---
schema: 1
id: wm-v99r7cd98g4h
title: Run the initialization flow in an empty directory
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-10T00:48:01Z
updated_at: 2026-11-10T00:48:01Z
parent: wm-ygnttse5hd5k
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: probe
---
## Action

Find out whether `start-a-project.md` takes an empty directory to a passing checklist.

1. Create an empty directory outside the repository.
2. Install the skill set into it with the skills CLI.
3. Follow `start-a-project.md` from its first step to the result table, recording every command that fails and every check that cannot pass.
4. Record each of the seventeen checks with its state and, for a failure, the command and its output.

## Acceptance signal

The run reaches the result table, and the record lists all seventeen checks with a state each; every failure names the command and its output.

## Next step

- If it holds: write `join-a-project.md` and add it to the entry.
- If it does not hold: fix the step that broke, then rerun the probe.
