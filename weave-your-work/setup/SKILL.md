---
name: setup
description: "Configure a project so the work-weave skill set can run in it: install git, waymark, node, and the GitHub CLI and sign them in, initialize the tracker, write the AGENTS.md rule pointer, and run each bundle's setup. Use when the project has no .waymark/config.toml, or when .agents/rules/ is empty."
---

# Setup

Before choosing a flow or making any changes, read [rules-install.md](bundle/rules/rules-install.md) from this installed skill. Resolve and confirm the project root with the person, then follow the rule throughout setup. This applies whether the skill is installed globally or in the project.

This file is the entry to setup. It routes; the flow document holds the steps.

Setup configures a project so the rest of the skill set can run in it. It installs the dependencies and configures their auth, initializes the tracker, writes the rule pointer into `AGENTS.md`, and runs the four bundles' setups. It stops when the checks pass.

## Which flow

- An empty directory, or a project with no tracker yet: [start-a-project.md](start-a-project.md) takes it to a configured project, opens its root map, and stops before the commit.
- A clone of a project that already uses waymark: [join-a-project.md](join-a-project.md) fills in what a clone cannot carry — the identity, the dependencies, the hook, the MCP registration, and the service — and leaves the shared files alone.

Both flows end by running the checks in `.agents/rules/rules-checklist.md`. When the project does not match either opening state, the checks alone say what is missing.

Setup's own rules are installed by [bundle/setup.md](bundle/setup.md), which copies `rules-git.md`, `rules-checklist.md`, and `rules-install.md` into `.agents/rules/`. The other four skills that carry installable parts — `map`, `task`, `glossary`, and `issue` — each own a `bundle/setup.md` of their own. Setup names them and points at them; it never restates their steps.

## What setup does not do

- It does not install the skills. They are installed before setup runs, and `.agents/skills/` is where the checks look for them.
- It does not create a remote, and it does not commit. It ends with a list of the files it changed, and the person commits.
- It does not repair a failing check on its own. When a check fails, setup reports it with the command that fixes it.

## Done

Setup is done when every check in `.agents/rules/rules-checklist.md` passes or reports not applicable. The checks run at session start and whenever a feature turns out to be unavailable; the rule explains both triggers.
