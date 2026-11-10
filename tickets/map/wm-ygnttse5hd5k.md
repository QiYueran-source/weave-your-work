---
schema: 1
id: wm-ygnttse5hd5k
title: Setup skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T12:52:39Z
updated_at: 2026-11-10T00:47:32Z
parent: wm-a08fwanmy5q6
---
## Target

Design the setup skill so a team can go from zero to a running work-weave project: install the dependencies (git, node, gh, waymark) and configure their auth, initialize a new waymark project or join an existing one, lay down rules (AGENTS.md pointing at .agents/rules/), and run every skill bundle's setup.
Why: without setup a new project has no tracker configuration, no rules, and no installed pieces; every later step assumes it ran.

## Acceptance direction

A fresh project and a clone each run setup end to end; the checklist passes, the installed pieces work, and the rules are discoverable from AGENTS.md.

## Decisions so far

- setup scope: check dependency configuration, initialize the project, initialize rules (user confirmed).
- Prefer instructions an AI executes over one script; mechanical pieces may be scripts (user confirmed).
- Installing a skill's pieces is a task under that skill's map, not under setup: the glossary install step lives under the glossary map (user confirmed).
- The future total setup explicitly lists the map and task bundles and reads each bundle setup; it does not discover bundles by scanning. The skill and its complete list are not implemented yet. Source: user confirmation.

- Setup is a manual with a bundle that carries part of the initialization rules; it has no script and no tools. (user confirmed, 2026-11-09)
- Setup does not install the skills. It installs their dependencies and configures their auth: git, node, gh, waymark. (user confirmed, 2026-11-09)
- The bundle list is fixed and complete: map, task, glossary, issue. All four are installed, with no optional subset. Setup names which skills have a bundle and points at each bundle's setup; it does not restate the install steps. (user confirmed, 2026-11-09)
- The dependency step is a checklist. (user confirmed, 2026-11-09)
- Waymark init: storage root `tickets`; categories map, task, testimony; the six custom fields; operator asked once with `git config user.name` as the default; never `--force`. (user confirmed, 2026-11-09)
- The AGENTS.md prompt is written at the top of the file; absent creates it, identical skips, different asks the person. (user confirmed, 2026-11-09)
- Setup ends when the checklist passes. (user confirmed, 2026-11-09)

- Setup is model-invocable. Its description names the states that trigger it: no `.waymark/config.toml`, or an empty `.agents/rules/`. (user confirmed, 2026-11-10)
- The step that adds the AGENTS.md prompt belongs in an SOP document, not in a rule file. (user confirmed, 2026-11-10)
- Setup's bundle carries the team's git and GitHub rules; the person's examples are that the GitHub repository's default branch is protected and that work happens on your own branch. (user confirmed, 2026-11-10)
- The checklist covers configuration state, not only dependency versions: gh configured, git configured, whether the project uses a remote, the local listener, the glossary MCP, and similar items. (user confirmed, 2026-11-10)

- Setup covers three flows: first-time initialization, joining a cloned project, and the daily startup check. They are designed one at a time, starting with first-time initialization; the other two wait for it. The SOP is the whole initialization flow. (user confirmed, 2026-11-10; this replaces the earlier two-mode decision)
- The daily startup check is a rule, not a skill. The setup skill covers the two initialization flows only. (user confirmed, 2026-11-10)
- The first-time initialization document is `start-a-project`; the join document is `join-a-project`. (user confirmed, 2026-11-10)
- First-time initialization assumes the skill set is installed and nothing else exists. (user confirmed, 2026-11-10)
- First-time initialization does not create a remote and does not commit; it lists the files it changed and the person commits. (user confirmed, 2026-11-10)
- Setup's bundle carries several rules; the person named `rules-git` and `rules-checklist` among them. (user confirmed, 2026-11-10)
- The checklist's fifteen items in five groups are confirmed; without a remote, the protection and listener items are not applicable. (user confirmed, 2026-11-10)

- Setup carries no `usage.md`: `SKILL.md` points at `start-a-project.md` and `join-a-project.md` directly. (user confirmed, 2026-11-10)
- The rule set is `rules-git` and `rules-checklist`. There is no language rule; the project's own language convention applies. (user confirmed, 2026-11-10)
- The daily check also runs when a feature turns out to be unavailable, not only at session start. (user confirmed, 2026-11-10)

- `.agents/rules/rules-bundles.md` is amended: the skill root carries `SKILL.md` and its usage documents; a skill with one usage document names it `usage.md`, and one whose use splits by flow names each document after the flow. (user confirmed, 2026-11-10)
- The `.gitignore` step belongs in `start-a-project.md`, not in the checklist: the checklist is read-only, and the file must exist before the bundles run `npm install`, because a `node_modules` already staged is not removed by a `.gitignore` written afterwards. `waymark init` writes `.waymark/.gitignore` itself; the glossary and issue bundles append their own lines; no bundle covers `node_modules/`, so setup writes it. (user confirmed, 2026-11-10)
- The fifteen checks live only in `bundle/rules/rules-checklist.md`, one line each with its command and expected result, starred where the session-start run covers them; session start runs the starred checks, a feature that turns out unavailable runs all fifteen; `start-a-project.md` references the rule and restates no check. (user confirmed, 2026-11-10)

## Not yet specified

- The individual checklist items. The person confirmed the five groups and the count of fifteen; the items themselves were never written down. Reconstructing them yields sixteen, and `curl` is missing from that reconstruction even though the issue bundle needs it. The draft sits in [Write setup's rule bundle](../task/wm-q38jx2nmm18y.md) and the person settles it before the rule file is written.
- Joining a clone: its steps and conflicts.
- What the join flow does about conflicts that a clone can have.

## Out of scope

- Software-specific configuration (build tooling, CI, and so on).
- External connectors.
