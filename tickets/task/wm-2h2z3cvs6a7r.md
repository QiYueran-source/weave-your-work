---
schema: 1
id: wm-2h2z3cvs6a7r
title: Write the first-time initialization SOP
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-10T00:47:51Z
updated_at: 2026-11-10T00:47:51Z
parent: wm-ygnttse5hd5k
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `weave-your-work/setup/start-a-project.md`, the SOP that takes an empty directory to a configured project.

1. Open with what it assumes: the skill set is installed and nothing else exists — no git repository, no waymark configuration, no remote.
2. Write the steps in this order: confirm the five skill directories; run setup's own `bundle/setup.md` so its rules exist; walk the tools (git, waymark 0.1.2 or newer, node 20.18 or newer with npm, gh signed in), installing what can be installed and stopping for what a person must do; `git init` when the directory is not a repository, and set the git identity when it is missing; run `waymark init` with storage root `tickets` and the categories map, task, and testimony; add the six custom fields; ask the operator once and set it; run the four bundle setups in the order map, task, glossary, issue; write the AGENTS.md section; run the check.
3. Each step states the action and names the check that proves it, without repeating the check's command; the commands live in `.agents/rules/rules-checklist.md`.
4. End with the result table and the changed files; commit nothing and create no remote.
5. Give Unix and Windows commands where they differ.

## Acceptance signal

Every step names the check that proves it. Every command runs as written on this machine. The document creates no remote and no commit. The only files it points at are `bundle/setup.md`, the four bundle setups, and `.agents/rules/rules-checklist.md`.

## Boundaries

- No join flow, no bundle files, no rule content.
- No new tools or scripts.
