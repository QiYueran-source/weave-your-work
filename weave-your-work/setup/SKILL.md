---
name: setup
description: "Install what the set needs in a project: the rules, the setup check, the project-root resolver, and the three optional runtimes (glossary, ADR, issue listener). Use when a project has no .agents/rules/, when a runtime is missing, or when a clone cannot run the set."
disable-model-invocation: true
---

# Setup

Install into a project the parts the set needs, and report what still has to be
done by a person.

The flow documents are being rewritten. `START-A-PROJECT.md` takes an empty
directory to a configured project; `JOIN-A-PROJECT.md` takes a clone of one to a
checkout that runs the set. `INSTALL.md` is the index of what gets installed and
where the steps for each part live.

## What this skill holds

| Part | Where | What it is |
|---|---|---|
| Flow | `START-A-PROJECT.md` | An empty directory becomes a configured project |
| Flow | `JOIN-A-PROJECT.md` | A clone becomes a checkout that runs the set |
| Install index | `INSTALL.md` | What gets installed, and where each part's steps live |
| Rules | `rules/` | Six rule files, copied by name into `<project>/.agents/rules/` |
| Setup check | `tools/utils/check-setup.mjs` | Reads the project's state and reports each check with its repair |
| Project-root resolver | `tools/utils/project-root.cjs` | Answers which project a command belongs to |
| Glossary runtime | `tools/glossary/` | A shared vocabulary and its MCP server |
| ADR runtime | `tools/adr/` | The decision records and their tool |
| Issue runtime | `tools/issue/` | The listener that queues communicate issues |

## The rules

Copy each file from `rules/` into `<project>/.agents/rules/`. For each one:
absent, write it; identical, skip it; different, stop and ask the person. Never
overwrite a rule the person has changed.

```
work-weave-rules-git.md
work-weave-rules-checklist.md
work-weave-rules-install.md
work-weave-rules-owner.md
work-weave-rules-pending-communications.md
work-weave-rules-record.md
```

## The runtimes

A project takes only the runtimes it uses. A project with one owner and no shared
vocabulary needs neither the glossary nor the listener; a project that records no
decisions needs no ADR tool.

Each runtime copies into `.work-weave/personal/<name>/` and runs
`npm ci --omit=dev` there. Read the exit status: a failed install can leave a
partial `node_modules`, so the directory appearing proves nothing.

## Checking

Run from the project root:

```sh
node <setup>/tools/utils/check-setup.mjs --starred
```

`--starred` runs the checks a session start covers; `--all` runs every one. The
script prints `ok`, `fail`, `not applicable`, or `unverified` for each check,
exits 1 when one fails, and prints the repair on a failure. It reads state and
repairs nothing: repairing the setup is the person's decision.

`<setup>` is the installed setup skill directory: `<project>/.agents/skills/setup`
after a project install, `~/.agents/skills/setup` after a global one.

## What setup does not do

- Install the skills. `npx skills add` does that first.
- Create a remote, or commit. It ends with the list of files it changed.
- Repair a failing check on its own.
