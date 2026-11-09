---
schema: 1
id: wm-ygnttse5hd5k
title: Setup skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T12:52:39Z
updated_at: 2026-11-09T02:54:20Z
parent: wm-a08fwanmy5q6
---
## Target

Design the setup skill so a team can go from zero to a running work-weave project: check dependencies (waymark, git, node), initialize the waymark project (config, categories, fields, user.toml), lay down rules (AGENTS.md pointing at .agents/rules/), and install each skill's pieces.
Why: without setup a new project has no tracker configuration, no rules, and no installed skills; every later step assumes it ran.

## Acceptance direction

All child tasks are complete and no further child task is needed: a fresh project runs setup end to end, the installed pieces work, and the rules are discoverable from AGENTS.md.

## Decisions so far

- setup scope: check dependency configuration, initialize the project, initialize rules (user confirmed).
- Prefer instructions an AI executes over one script; mechanical pieces may be scripts (user confirmed).
- Installing a skill's pieces is a task under that skill's map, not under setup: the glossary install step lives under the glossary map (user confirmed).

- The future total setup explicitly lists the map and task bundles and reads each bundle setup; it does not discover bundles by scanning. The skill and its complete list are not implemented yet. Source: user confirmation.

## Not yet specified

- Which dependencies to check (waymark, git, node, and so on).
- The order of the steps and which parts are scripts.
- How the AGENTS.md prompt is worded.
- ~~How setup discovers each skill's install steps.~~ Resolved on 2026-11-09: the total setup reads each explicitly listed skill's `bundle/setup.md`; it does not scan skills.

## Out of scope

- Software-specific configuration (build tooling, CI, and so on).
- External connectors.
