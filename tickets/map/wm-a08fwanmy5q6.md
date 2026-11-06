---
schema: 1
id: wm-a08fwanmy5q6
title: 'Environment skills: setup initialization and checks'
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T09:24:08Z
updated_at: 2026-11-06T11:43:30Z
custom_fields:
  phase: exploring
---
## Destination

Design the setup skill: check dependency configuration, initialize the waymark project (config, categories, fields, user.toml), and initialize rules (AGENTS.md, GLOSSARY.md, and so on), so a team can run from zero. Borrows from setup-matt-pocock-skills and wizard.

## Notes

- Category: environment. Answers "is the project ready, how do we initialize".
- Trigger: user-invoked, once at project start, then on demand.
- Delivery location: weave-your-work/setup/ (directory already created by the user).
- Borrowed from: .inbox/skills setup-matt-pocock-skills (probe first, ask only genuinely branching choices, land answers at fixed paths), wizard (re-entrant, one step per screen).

## Decisions so far

- setup scope: check dependency configuration, initialize the project, initialize rules (user confirmed).
- Glossary initialization is a setup child ticket: create `.glossary/`, add the `.agents/docs/GLOSSARY.md` ignore entry, register the MCP server, install the git post-merge hook, copy `glossary-rules.md` into `.agents/rules/`, and add a system prompt to AGENTS.md pointing at the rules under `.agents/rules/`. Prefer instructions an AI executes over one script; mechanical pieces may be scripts. setup carries more duties than this (user confirmed).

## Not yet specified

- Which dependencies to check (waymark binary, git, node, other toolchains).
- Which configuration to initialize (config.toml categories/fields, user.toml operator/timezone).
- What the rules files are (AGENTS.md, GLOSSARY.md, CLAUDE.md).
- Run form: one-shot command or re-entrant script.
- How an initialized project enters the execution flow.

## Out of scope

- Software-specific configuration (build tooling, CI, and so on).
- External connectors.
