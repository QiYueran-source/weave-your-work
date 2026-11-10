---
schema: 1
id: wm-j3ed13ejn8cy
title: Run the join flow on a fresh clone
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-10T06:28:46Z
updated_at: 2026-11-10T11:50:18Z
parent: wm-ygnttse5hd5k
---
## Action

Find out whether `join-a-project.md` takes a fresh clone of a work-weave project, with the skill set installed globally, to a passing checklist.

1. Use a temporary HOME and install the set globally from the clone's `weave-your-work/` with `npx skills add ./weave-your-work -g`.
2. Clone this repository into a directory outside it.
3. Follow `join-a-project.md` from its first step to the result table, recording every command that fails and every check that cannot pass. Stop before the steps only a person can do: creating a webhook, installing the listener service, and registering the MCP server.
4. Record each of the seventeen checks with its state and, for a failure, the command and its output.

## Acceptance signal

The run reaches the result table, and the record lists all seventeen checks with a state each; every failure names the command and its output; the global install leaves the clone's tracked files unchanged.

## Next step

- If it holds: join is proven under a global install.
- If it does not hold: fix the step that broke, then rerun the probe.

## Boundaries

- No fixes in the probe.
- No webhook, listener service, or MCP registration.
- No claim for macOS or Windows.
