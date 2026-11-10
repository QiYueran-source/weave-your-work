---
schema: 1
id: wm-hxj76ykjqx4c
title: Write the join-a-project SOP
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T04:36:43Z
updated_at: 2026-11-10T04:40:24Z
closed_at: 2026-11-10T04:40:24Z
parent: wm-ygnttse5hd5k
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `weave-your-work/setup/join-a-project.md`, the SOP that takes a clone of a project already using waymark to a checkout that passes the setup checks.

A clone carries what was committed: `.waymark/config.toml`, `tickets/`, `testimony/`, `glossary/`, `.agents/rules/`, `.agents/skills/`, `AGENTS.md`, `skills-lock.json`, `handles.toml`. It does not carry what was never committed, and those are the flow's work: `.waymark/user.toml`, every `node_modules`, `GLOSSARY.md`, `pending/`, `.git/hooks/post-merge`, the MCP registration, and the listener's service.

## Settled shape

1. Confirm the three facts that make this a clone of a waymark project: `git remote get-url origin` answers, `.waymark/config.toml` exists, `tickets/` is not empty. Each failure points at a different flow; name which.
2. Set the clone's commit identity with `git config --local user.name` and `user.email`. The identity is never committed, so a fresh clone has only a global value.
3. Confirm the identity pair and the roster. The operator is derived from `git config user.name`, so there is nothing to set; `gh api user --jq .login` reads the login, and the two names are put back to the person as one question, because nothing derives one from the other. A missing owner is reported, never written: the roster is a shared committed file and the person files it through a branch and a pull request.
4. Install the dependencies that `node_modules` was ignoring: find every `package.json` outside `node_modules`, `npm install` in each directory with dependencies, skip the rest. Never assume a root `package.json`.
5. Install the post-merge hook from the glossary bundle template, never overwriting an existing one.
6. Build `GLOSSARY.md`; it is gitignored and generated.
7. Leave the two pieces only the person can do: the MCP registration and the listener's service. The channel and the webhook are repository state and already exist; creating a second one is wrong.
8. Run all seventeen checks, not only the starred ones, and end with the four-state table. Commit nothing: everything this flow writes is local.

## Why all seventeen on a clone

The runtime rule says to run the unstarred ones when a feature turns out to be unavailable, and a clone is the one moment when none of the local pieces has been proven yet. Later sessions run only the starred ones.

## Boundaries

- No skill install; a clone carries the set. Check 12 proves the tracked skills are still present.
- No rule registration; check 13 proves the copies still match.
- No edit of `handles.toml`.
- No channel or webhook creation.
- No `waymark init`, and never `--force`.

## Acceptance signal

Every step names the check that proves it. Every command runs as written on a fresh clone. The flow writes only local state. The two person-only pieces are named with the command that runs each and the alternative when the platform has no service step.
