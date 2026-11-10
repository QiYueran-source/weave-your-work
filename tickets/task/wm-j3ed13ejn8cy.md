---
schema: 1
id: wm-j3ed13ejn8cy
title: Run the join flow on a fresh clone
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-10T06:28:46Z
updated_at: 2026-11-10T06:28:46Z
parent: wm-ygnttse5hd5k
---
## Action

Find out whether `join-a-project.md` takes a fresh clone of a waymark project to a passing checklist.

1. Clone this repository into a directory outside it.
2. Follow `join-a-project.md` from its first step to the result table, recording every command that fails and every check that cannot pass.
3. Record each of the seventeen checks with its state and, for a failure, the command and its output.

## Acceptance signal

The run reaches the result table, and the record lists all seventeen checks with a state each; every failure names the command and its output.

## Next step

- If it holds: the two setup flows are both probed and the skill entry can stop growing.
- If it does not hold: fix the step that broke, then rerun the probe.
