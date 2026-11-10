---
schema: 1
id: wm-xgvfgs1mz7jd
title: Set up a project from globally installed skills
category: map
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T10:39:21Z
updated_at: 2026-11-10T11:55:38Z
closed_at: 2026-11-10T11:55:38Z
parent: wm-wjwa9081hse1
dependencies:
  - wm-2ztwvye6q9t7
  - wm-tmjgw2zn143y
  - wm-zhxe0hsnpf34
custom_fields:
  split_as: task
---
## Target

A team can initialize or join a project using globally installed work-weave skills while the project's data and dependencies stay inside the project.

Why: global skill installation should work without writing one project's configuration or dependencies into a shared skill directory.

## Acceptance direction

A fresh project and a fresh clone can complete setup using the globally installed skill set, with project-local data and runtime and checks that verify the actual installation.

Review point: setup flows and rules, global skill discovery, checks 11–13, reproducible installation and two-project isolation evidence, plus explicit reporting of platform limitations.

## Decisions so far

- Follow the confirmed first-release and setup decisions in [Setup skill](wm-ygnttse5hd5k.md).
- The issue and glossary bundles each carry their own byte-identical copy of `project-root.cjs`. This map verifies all copies match; no runtime dependency on another installed skill. (user confirmed, 2026-11-10)
- The end-to-end acceptance covers a fresh project and a fresh clone, checks 11–13 against a global install, and states Linux, macOS, and Windows limits instead of implying unverified support. (user confirmed, 2026-11-10)

- Proposed: checks 11–13 scan both `.agents/skills` and `$HOME/.agents/skills`, the `skills` CLI's global target, and deduplicate by real path. No new state file records the skill root. (user confirmed, 2026-11-10)
- Proposed: check 16 derives the unit name from `.work-weave/local/work-weave-issue-*.service` and reads the channel from `.work-weave/local/issue-listener.env`; it does not hardcode a service name or `~/.config`. (user confirmed, 2026-11-10)
- Proposed: the old clone probe `wm-j3ed13ejn8cy` is revised in place for the join flow under the global install; a new probe covers fresh-project initialization. (user confirmed, 2026-11-10)

## Not yet specified

- ~~Decision to make: reconcile existing setup tasks and the clone probe with the new project contract and bundle outputs.
  Why it matters: existing flows and checks assume project-local skills and legacy data paths.~~
  Resolved on 2026-11-10: update the flows and checks for the new bundle layouts, revise the clone probe, and add a fresh-project probe.
- ~~Decision to make: specify the end-to-end acceptance procedure and test fixtures.
  Why it matters: a passing check that discovers no global rules must not be mistaken for a working install.~~
  Resolved on 2026-11-10: the fresh-project probe uses a temporary HOME, a global install from the local tree, and records all checks; the clone probe runs separately.

## Review

passed

- Goal: the two closed tasks and the revised clone probe show a globally installed set taking a fresh project and a clone through local setup with project-local runtimes and data. The fresh-project probe passed checks 1–7, 10–15, and 17; the clone probe passed the same applicable checks plus check 9, with check 16 not applicable because no service was installed. The installer left this repository's working tree unchanged, and the clone kept its 40 glossary terms. Setup flows and checks name both `.agents/skills` and `$HOME/.agents/skills`, the generated checkout unit, and the project-local settings.
- Convention: the map split into two tasks under `split_as: task`, both closed, and the old clone probe was revised in place. The probes made no fixes and created no remote, webhook, listener service, or MCP registration. Linux was verified; macOS and Windows remain explicitly unverified.
