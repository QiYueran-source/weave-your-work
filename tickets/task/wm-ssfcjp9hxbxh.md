---
schema: 1
id: wm-ssfcjp9hxbxh
title: Separate the roster template from this project's roster
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T06:26:38Z
updated_at: 2026-11-10T11:34:34Z
closed_at: 2026-11-10T11:34:34Z
parent: wm-10np2bs10s0e
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Ship the roster as a template and move this project's real roster to the project-local shared location.

1. Add `weave-your-work/issue/bundle/tools/handles.toml.example` with placeholder `[handles]` and `[pending].path` values. A comment says the queue path is relative to the project root and that the file is copied to `.work-weave/issue/handles.toml`.
2. Move this project's roster from `.agents/skills/issue/bundle/tools/handles.toml` to `.work-weave/issue/handles.toml`. Keep the existing handle and set `[pending].path = ".work-weave/pending/pending-communications.md"`.
3. Stop re-including the roster under `.agents/skills/`; keep the whole directory ignored and track `.work-weave/issue/handles.toml`.
4. Update the documents that name the old roster path: `issue/SKILL.md`, `issue/usage.md`, `issue/communicate-issue.md`, `issue/bundle/setup.md`, `issue/bundle/rules/rules-pending-communications.md`, `setup/start-a-project.md`, `setup/join-a-project.md`, and `setup/bundle/rules/rules-checklist.md`. Do not change listener or checker code; the issue map owns it.
5. A differing installed `.agents/rules/rules-pending-communications.md` is a conflict for the person; do not overwrite it.

## Acceptance signal

`git ls-files` lists `.work-weave/issue/handles.toml` and `handles.toml.example`, and lists nothing under `.agents/skills/`. The example carries placeholders only. `git check-ignore` shows `.agents/skills/` ignored and `.work-weave/issue/handles.toml` not ignored. The named documents point at the new path.

## Result

Added `weave-your-work/issue/bundle/tools/handles.toml.example` and moved this project's roster to `.work-weave/issue/handles.toml`, with the queue path set to `.work-weave/pending/pending-communications.md`. The root `.gitignore` now ignores the whole `.agents/skills/` directory and no longer re-includes the roster. The eight named documents point at the new roster and queue paths.

`git ls-files` lists the new roster and the example and nothing under `.agents/skills/`. `git check-ignore` shows `.agents/skills/` ignored and `.work-weave/issue/handles.toml` not ignored.

The installed `.agents/rules/rules-pending-communications.md` still carries the old path and differs from the bundle source. It was not overwritten; replacing it needs the person's decision under the rule-conflict policy.

## Review

passed

- Goal: the acceptance checks above pass. The example carries placeholders only, and the named source documents use the new path.
- Convention: the change moves data and documentation only. Listener and checker code, service and runtime files, and the installed rule copy were left alone.

## Boundaries

- No listener or checker code.
- No migration command for other projects.
- No second platform table.
- No service or runtime change.
