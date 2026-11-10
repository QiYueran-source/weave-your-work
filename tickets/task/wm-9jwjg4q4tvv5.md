---
schema: 1
id: wm-9jwjg4q4tvv5
title: Check the setup state from one cross-platform script
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T13:37:47Z
updated_at: 2026-11-10T13:48:33Z
closed_at: 2026-11-10T13:48:33Z
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

## Result

Delivered `weave-your-work/setup/bundle/tools/check-setup.mjs` and `check-setup.test.mjs`. The script runs the seventeen checks from the project root, prints one result per check (`ok`, `fail`, `not applicable`, `unverified`), supports `--starred`, `--all`, and `--json`, and exits 1 only on a failure. It repairs nothing and reads no secret.

The rule is 58 lines instead of 265 and keeps each check's goal, pass condition, and repair. The two copies are identical. `npm test` passed 85 tests. On this checkout `--starred` reported 10 ok; `--all` reported 16 ok and one real failure: no generated listener unit under `.work-weave/local`.

The join flow now reads the roster and lists `package.json` files without `awk` or `find`; the feedback skill states the `GH_TOKEN` mechanism once, with Unix and PowerShell forms; the setup guide's Verify points at check 13. Windows and macOS were not run here. The script uses Node and direct process calls, so it has no shell dialect, but their behavior remains unverified.

## Review

passed

- Goal: `npm test` passed 85 tests. `--starred` returned 10 ok on this checkout; `--all` returned 16 ok and one real failure (no listener unit). The rule copies are byte-identical. The Windows and macOS paths are not verified.
- Convention: the script repairs nothing and reads no secret; check 9 keeps the plan-gate exception; `rules-git.md` and the parallel protection change were not touched; the platform service guides are unchanged.

## Boundaries

- Do not change the meaning or count of the seventeen checks; check 9 keeps the plan-gate exception.
- Do not add a macOS or Windows background service; keep the platform guides as they are.
- Do not touch `rules-git.md` or the parallel check-9 change.
- Do not change waymark configuration, the tracker, or project data.
