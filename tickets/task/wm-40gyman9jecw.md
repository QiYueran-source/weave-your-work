---
schema: 1
id: wm-40gyman9jecw
title: Run a fresh project from globally installed skills
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-10T11:50:13Z
updated_at: 2026-11-10T11:50:13Z
parent: wm-xgvfgs1mz7jd
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: probe
---
## Action

Answer whether a globally installed work-weave skill set can take a fresh project to the setup result.

1. Use a temporary HOME and install the set globally from this checkout with `npx skills add ./weave-your-work -g`. Confirm the install writes to `$HOME/.agents/skills` and leaves this working tree unchanged.
2. Create a fresh project directory outside this repository. Run `start-a-project.md` from the installed setup skill, using a project-local npm cache. Follow the flow through the four bundle setups, and stop before the steps only a person can do: creating a remote, creating a webhook, installing the listener service, and registering the MCP server.
3. Run every applicable check in `rules-checklist.md`, recording each check's state and, for a failure, the command and its output. Mark remote-dependent checks not applicable with the reason.
4. Record the answer, the exact install command, the temporary HOME and project paths, and the work that remains person-only.

## Acceptance signal

The record lists every check with a state, every failure names the command and its output, and the answer says whether the global install produced a working project setup. This repository's working tree is unchanged by the install.

## Next step

- If it holds: the global installation path is proven for a fresh project.
- If it does not hold: name the failing step and open a task for that bundle or flow's owner; do not fix it inside the probe.

## Boundaries

- No fixes in this probe.
- No remote, webhook, listener service, or MCP registration.
- No clone; the revised old probe covers the join flow.
- No claim for macOS or Windows.
