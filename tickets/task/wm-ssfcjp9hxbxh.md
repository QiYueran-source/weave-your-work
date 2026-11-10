---
schema: 1
id: wm-ssfcjp9hxbxh
title: Separate the roster template from this project's roster
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-10T06:26:38Z
updated_at: 2026-11-10T06:26:38Z
parent: wm-10np2bs10s0e
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Ship the roster as a template instead of this project's real file, and move this project's roster out of the install target.

Today `.agents/skills/issue/bundle/tools/handles.toml` holds `frank = "QiYueran-source"`, and it is tracked only because `.gitignore` re-includes it level by level. That makes this project's people data part of a skill's installed copy, which `skills add --copy` deletes before writing. It also means a stranger who installs the set receives a roster naming someone else.

Planned change, pending confirmation of the path:

1. `weave-your-work/issue/bundle/tools/handles.toml.example` — the template, committed with the skill. Both keys with placeholder values and a comment saying what each does and that the queue path is relative to the project root.
2. The project's real roster moves out of the skill directory. Two candidate paths, one chosen below: `.agents/issue-handles.toml`, or `.waymark/handles.toml` where it lived before 2026-11-09.
3. `listener.mjs` and `check-pending.mjs` resolve the roster from the project root first, then fall back to the copy beside the tools, so a project set up under the old layout keeps working.
4. Docs that name the old path: `issue/SKILL.md`, `issue/usage.md`, `issue/communicate-issue.md`, `issue/bundle/setup.md`, `issue/bundle/rules/rules-pending-communications.md`, `setup/start-a-project.md`, `setup/join-a-project.md`, `setup/bundle/rules/rules-checklist.md`, plus the installed `.agents/rules/rules-pending-communications.md`.
5. `.gitignore` drops the re-include chain; the whole of `.agents/skills/` is ignored again.
6. The tests write the roster at the project root instead of beside the tools, with one test kept for the fallback.

## Acceptance signal

`git ls-files | grep handles` lists the template and this project's roster and nothing under `.agents/skills/`. `npm test` in `weave-your-work/issue/bundle/tools/` passes. A fresh clone lists the roster at its new path, and `node .agents/skills/issue/bundle/tools/check-pending.mjs` still exits 0 there after an install.

## Boundaries

- No change to the roster's contents or to what the listener does with it.
- No second platform table.
- No migration command for other projects; the fallback read is the migration.
