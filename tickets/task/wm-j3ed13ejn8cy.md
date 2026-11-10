---
schema: 1
id: wm-j3ed13ejn8cy
title: Run the join flow on a fresh clone
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T06:28:46Z
updated_at: 2026-11-10T11:55:23Z
closed_at: 2026-11-10T11:55:23Z
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

## Result

The join flow worked for local setup on a clone with the skills installed globally.

1. Cloned this repository to `/tmp/ww-clone-probe/clone` and set `origin` to `git@github.com:QiYueran-source/weave-your-work.git`.
2. Installed the set globally from the clone's `weave-your-work/` with `HOME=/tmp/ww-clone-probe/home npx --yes skills add ./weave-your-work -g -y -a codex`; it installed 22 skills under the temporary HOME.
3. Ran the join flow's local stages: identity, the four bundle rules, the glossary and issue runtimes with `npm ci --omit=dev`, the post-merge hook from the project runtime, and `merge`. The view had 40 terms.
4. Ran the checks. With `GH_CONFIG_DIR` pointed at the real `gh` configuration (the temporary HOME hides it), checks 1–15 and 17 passed; check 9 read `protected: true`; check 12 found the temporary global root with 22 skills; check 13 printed nothing; check 15 printed `4`; check 17 printed `3`. Check 16 is not applicable because no listener service was installed, and its webhook step needs a running service.

The flow needed no fix. The MCP registration and the listener service remain person-only, and no remote, webhook, or service was created.

## Review

passed

- Goal: every check has a state; the applicable checks passed; the one skipped check and its reason are recorded. The clone's local setup and the 40-term view are evidence the join flow works under a global install.
- Convention: the probe made no fixes and created no webhook, service, or MCP registration. The `GH_CONFIG_DIR` workaround is recorded as a probe-environment detail, not a project change.

## Next step

- If it holds: join is proven under a global install.
- If it does not hold: fix the step that broke, then rerun the probe.

## Boundaries

- No fixes in the probe.
- No webhook, listener service, or MCP registration.
- No claim for macOS or Windows.
