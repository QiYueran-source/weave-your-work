---
schema: 1
id: wm-a08fwanmy5q6
title: 'Environment skills: setup initialization and checks'
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T09:24:08Z
updated_at: 2026-11-06T12:52:47Z
parent: wm-wjwa9081hse1
---
## Target

Design the environment-category skills. The first is the setup skill: check dependencies, initialize a waymark project, and lay down rules, so a team can run from zero.
Why: without setup a new project has no tracker configuration, no rules, and no installed skills; every later step assumes it ran.

## Acceptance direction

The setup skill map is accepted and its own children are done, or the environment category settles what else it needs.

## Children

- [Setup skill](tickets/map/wm-ygnttse5hd5k.md): dependency checks, project initialization, rules

## Decisions so far

- Environment category holds the setup skill as a skill map (user confirmed).

## Not yet specified

- Whether the environment category holds more skills later.
- How an initialized project enters the execution flow.

## Out of scope

- Software-specific configuration (build tooling, CI, and so on).
- External connectors.
