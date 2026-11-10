---
schema: 1
id: wm-9jwjg4q4tvv5
title: Check the setup state from one cross-platform script
category: task
status: in_progress
owner: frank
creator: frank
created_at: 2026-11-10T13:37:47Z
updated_at: 2026-11-10T13:37:49Z
parent: wm-ygnttse5hd5k
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Add one dependency-free Node check script under setup's bundle and move the executable checks out of the always-loaded rule.

1. Add `bundle/tools/check-setup.mjs`. It runs the seventeen checks from the project root, prints one result per check (`ok`, `fail`, `not applicable`, `unverified`), and exits 1 only when a check fails. `--starred` runs the ten session-start checks; `--all` runs all seventeen; `--json` prints the same results as JSON for tests. It repairs nothing and reads no secret.
2. Rewrite `bundle/rules/rules-checklist.md` to keep each check's goal, pass condition, repair, and the two triggers, with the script as the one runnable command. Remove the POSIX-only shell (`sort -V`, `python3`, `awk`, `cmp`, `grep`, `wc`, here-strings, redirections). Keep the check meanings and the seventeen-check count.
3. Update `bundle/setup.md`: name the script under Tools, replace the sh-only Verify block with a pointer to check 13, and leave the five sections intact.
4. Update `start-a-project.md` and `join-a-project.md` so they name checks instead of restating commands, and drop the `awk` roster read and the POSIX `find` scan. Keep the roster and dependency semantics.
5. Update `feedback-me-please/SKILL.md` to state the `GH_TOKEN` mechanism once, with Unix and PowerShell forms, and remove the per-command POSIX prefix.
6. Copy the rewritten rule to `.agents/rules/rules-checklist.md` byte for byte.
7. Add `check-setup.test.cjs` covering the version comparison, the handles parser, a fixture skills tree (including a root at `skills/`), and a fixture bundle-rule comparison. Run `npm test`, the script on this repository, and `waymark validate`.

## Acceptance signal

`node <setup-skill>/bundle/tools/check-setup.mjs --all` prints seventeen results and reports this repository's real state; `--starred` prints the ten starred checks; the JSON mode is stable enough for tests. The rule has no POSIX-only command, the two copies are identical, and `npm test` passes. The script runs on Linux here; Windows and macOS behavior is in the Node code paths, not in unverified PowerShell.

## Boundaries

- Do not change the meaning or count of the seventeen checks; check 9 keeps the plan-gate exception.
- Do not add a macOS or Windows background service; keep the platform guides as they are.
- Do not touch `rules-git.md` or the parallel check-9 change.
- Do not change waymark configuration, the tracker, or project data.
