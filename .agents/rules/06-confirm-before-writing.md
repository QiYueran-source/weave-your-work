# Confirm the Design Before Writing

A task's `Action` is a proposal, not permission to write. Before implementing, sync the owning map and the task with the design, then ask the human to confirm. Write only after that confirmation.

## What to do

1. Read the task and its parent map before touching code or files. If the design is not recorded there, write it into the task; when it changes the map's shape or acceptance, write it into the map's `Decisions so far` or `Not yet specified` too.
2. Put the concrete plan in the task: what will be written, where, what stays out, and how it will be tested.
3. Ask the human to confirm the plan. Do not write the first file until the answer is yes.
4. Implement the confirmed plan; do not widen it. A new decision that appears during implementation goes back to the map or task and gets its own confirmation.
5. A human's "continue" confirms the current plan, not every later step. Sync the map and task again before the next implementation step.

## Why

Writing before the design is settled turns a proposal into files the human has to review after the fact. The map and task are where the design is checked; the confirmation is the gate.
