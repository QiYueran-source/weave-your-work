---
schema: 1
id: wm-a08fwanmy5q6
title: 'Environment skills: setup initialization and checks'
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T09:24:08Z
updated_at: 2026-11-09T02:54:20Z
parent: wm-wjwa9081hse1
---
## Target

Design the environment-category skills. The first is the setup skill: check dependencies, initialize a waymark project, and lay down rules, so a team can run from zero.
Why: without setup a new project has no tracker configuration, no rules, and no installed skills; every later step assumes it ran.

## Acceptance direction

The setup skill map is accepted and its own children are done, or the environment category settles what else it needs.

## Decisions so far

- Environment category holds the setup skill as a skill map (user confirmed).
- A skill that needs installation carries a `bundle/`; a skill with nothing to install has none. The setup skill specifies which skills it installs; it does not scan every installed skill. It reads each listed skill's `bundle/setup.md` and does not restate or replace the steps. (user confirmed, 2026-11-08; reads the setups, settled 2026-11-09)
- The bundle layout: `setup.md` (required), `rules/` (optional; plain Markdown rule files), `tools/` (optional). `setup.md` carries the install and verify steps; `tools/` holds scripts and their dependency manifests, and its install command lives in `setup.md`. The skill root carries `SKILL.md` and `usage.md`; `usage.md` is usage-only and does not repeat the install steps. (user confirmed, 2026-11-08; usage split settled 2026-11-09)
- The install guide is cross-platform and instruction-first: Unix and Windows commands where they differ, MCP registration as a JSON instruction, no `install.sh`. (settled 2026-11-09)
- A bundle's optional hook is recommended, not required; the guide says what to run if it is skipped. (settled 2026-11-09)
- Each skill's own setup installs its rules; the total setup reads every listed setup and does not copy rules or add the AGENTS.md prompt. The AGENTS.md prompt belongs to the setup skill. (settled 2026-11-09)
- Setup installs a rule by copying the Markdown into `.agents/rules/<basename>`: an identical file is a no-op, and a different one is a conflict the person decides, not an overwrite. (agent decision, revisable)
- The convention is also a project rule at `.agents/rules/rules-bundles.md`, so this repository's sessions follow it while the setup skill is being built. (agent decision)

## Not yet specified

- Whether the environment category holds more skills later.
- How an initialized project enters the execution flow.
- The setup skill's own list, order, and conflict report. The list must explicitly include `map` and `task`, whose bundles install their own rules; the order and conflict report remain open for the setup skill design. (list requirement resolved by user confirmation, 2026-11-09; total setup not implemented)

## Out of scope

- Software-specific configuration (build tooling, CI, and so on).
- External connectors.
