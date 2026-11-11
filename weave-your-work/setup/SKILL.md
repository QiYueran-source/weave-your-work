---
name: setup
description: "Configure a project so the set can run in it: confirm the project root, install git, waymark, node, and the GitHub CLI and sign them in, initialize the tracker, install the rules and the runtimes, write the AGENTS.md pointer, and open the first map. Use when the project has no .waymark/config.toml, when .agents/rules/ is empty, or when a clone cannot run the set."
family: setup
invocation: user
---

# Setup

Before choosing a flow or changing anything, read `rules/rules-install.md` from this installed skill. Resolve and confirm the project root with the person, and follow that rule throughout.

This file routes. The flow documents hold the steps; `install.md` holds what gets installed and how.

## Which flow

| The project | Flow |
|---|---|
| Empty, or no tracker yet | `configure-project.md`: take it to a configured project, open its root map, and stop before the commit |
| A clone of a project that already uses waymark | `join-project.md`: fill in what a clone cannot carry, and leave the shared files alone |
| Either, when something stops working | `check-project.md`: read the state and report each check with its repair, changing nothing |

When the project matches none of the three, the checks alone say what is missing.

## What setup installs

`install.md` covers it: seven rules copied into `.agents/rules/`, two tools run in place, and two runtimes installed only when the project uses them (the glossary store, the issue listener). Every installable part lives under this skill; the other skills carry none.

## The field reference

The six custom fields setup declares, and every other field the set writes, are defined in `waymark`'s `res/fields.md`. Setup declares the names; that file says what they mean. A change to a field's name or type is a change in both places, and the project's `.waymark/config.toml` carries the third copy.

## Done

Setup is done when `check-project.md` reports every check as `ok` or `not applicable`.

## What setup does not do

- Install the skills. They are installed before setup runs.
- Create a remote, or commit. It ends with the list of files it changed.
- Repair a failing check on its own.
