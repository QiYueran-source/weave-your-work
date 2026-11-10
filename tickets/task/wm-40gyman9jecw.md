---
schema: 1
id: wm-40gyman9jecw
title: Run a fresh project from globally installed skills
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T11:50:13Z
updated_at: 2026-11-10T11:54:27Z
closed_at: 2026-11-10T11:54:27Z
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

## Result

The global install worked for a fresh project's local setup. Command:

```sh
HOME=/tmp/ww-global-probe/home npm_config_cache=/tmp/ww-global-probe/npm-cache   npx --yes skills add ./weave-your-work -g -y -a codex
```

It installed 22 skills under `/tmp/ww-global-probe/home/.agents/skills` and left this repository's working tree unchanged. A fresh project at `/tmp/ww-global-probe/project` then completed the local stages: setup, map, task, glossary, and issue rules; `waymark init` with three categories and six fields; the glossary and issue runtimes with `npm ci --omit=dev` under `.work-weave/runtime/`; ignore files; and `AGENTS.md`.

Check states: 1, 2, 3, 4, 5, 6, 7, 10, 11, 12, 13, 14, 15, and 17 passed. Check 11 printed `handles: absent, nothing to match` because the roster is a person step for a new project. Check 12 found the temporary global root with 22 skills. Check 13 printed nothing. Check 15 printed `4`; check 17 printed `3`. Checks 8, 9, and 16 were not applicable: the project has no remote, so there is no protected branch, webhook, or listener service. The MCP harness registration and the roster remain person steps and were not performed.

Answer: yes for the local setup. The global install takes a fresh project to the applicable checks without writing dependencies or configuration into the temporary global skill directory.

## Review

passed

- Goal: every check has a state in the record, no applicable check failed, and the one unrun area is named as person-only. The temporary HOME and project paths and the exact install command are recorded. This repository stayed clean.
- Convention: the probe made no fixes and created no remote, webhook, listener service, or MCP registration. It did not claim macOS or Windows.

## Next step

- If it holds: the global installation path is proven for a fresh project.
- If it does not hold: name the failing step and open a task for that bundle or flow's owner; do not fix it inside the probe.

## Boundaries

- No fixes in this probe.
- No remote, webhook, listener service, or MCP registration.
- No clone; the revised old probe covers the join flow.
- No claim for macOS or Windows.
