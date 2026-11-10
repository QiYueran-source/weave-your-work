---
schema: 1
id: wm-fc8afkmg3ptv
title: Constrain a global install to keep project dependencies inside the project
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T07:46:56Z
updated_at: 2026-11-10T08:06:53Z
closed_at: 2026-11-10T08:06:53Z
parent: wm-ygnttse5hd5k
custom_fields:
  reversibility: two_way
  task_kind: delivery
---
## Action

Add a rule to setup's bundle that a globally installed skill set still keeps the project's dependencies inside the project, and that the project root is resolved and confirmed before anything is installed.

The rule file is `weave-your-work/setup/bundle/rules/rules-install.md`, following `rules-bundles.md`: the name starts with `rules`, carries no number, and the file has no frontmatter. Its four statements:

1. **Resolve the root first.** `git rev-parse --show-toplevel`, or `pwd` when the directory is not a repository yet. Print the absolute path, ask the person to confirm it is the project they mean, and run every later step from there. This is the one step the flow cannot infer.
2. **Skill files may live outside the project.** `npx skills add ... -g` writes to `~/.agents/skills/`, and that is allowed. The skill set is a tool, not a project file.
3. **Dependencies live inside the project.** Third-party packages a bundle tool imports are installed under the project, and `node_modules` is gitignored there. Never run `npm install` against a directory under `~/.agents/skills/`. A tool that needs a package resolves it from the resolved project root.
4. **Every absolute path is written once, at setup.** The MCP registration's `--project`, the service unit's `WorkingDirectory`, and a hook's skill path each record the root resolved in step 1. Nothing recomputes it at run time, and no relative path in a skill is read against the current directory.
5. **Rules land in the project, never under `~/.agents/`.** `-g` changes where the skill files live and nothing else. After a global install the source of a rule is `~/.agents/skills/<skill>/bundle/rules/`, while the copy still goes to `<project>/.agents/rules/` and the pointer still sits at `<project>/AGENTS.md`. `~/.agents/rules/` has no reader: the harness scans `.agents/skills/` itself, but `.agents/rules/` takes effect only because `AGENTS.md` tells the agent to read it. The same statement covers the pointer file: `AGENTS.md` belongs at the project root, and `<project>/.agents/AGENTS.md` is never read.

Wiring:
- `weave-your-work/setup/bundle/setup.md` copies three rules instead of two: its two `for name in` loops, its "Two rules into" opening line, and its Verify block all name `rules-install.md`. Its `SETUP_SKILL_DIR` paragraph gains the note that the directory may sit under `~/.agents/skills/setup` after a global install.
- `weave-your-work/setup/SKILL.md` line 19 and `weave-your-work/setup/start-a-project.md` step 2 each name the new rule where they now name two.
- `tickets/map/wm-ygnttse5hd5k.md`: the decision "The rule set is `rules-git` and `rules-checklist`" is amended to three, with the reason.

## Acceptance signal

`.agents/rules/rules-install.md` exists after the bundle setup runs, is byte-identical to `weave-your-work/setup/bundle/rules/rules-install.md`, and check 13 reports it registered.

A reader of the rule can answer, without opening another file, where the project root comes from, where a bundle tool's dependencies are installed, and what to do when the set was installed with `-g`.

## Boundaries

- The rule states the requirement; making the two existing bundle tools comply is a separate task. Editing `listener.mjs`, `check-pending.mjs`, and `glossary.js` to resolve from the project root is not done here.
- No change to `.gitignore`, to the install command, or to how the set is published.
- The rule adds no numbered item to `rules-checklist.md`. If a check is wanted, it goes through its own decision.

## Result

Written as `weave-your-work/setup/bundle/rules/rules-install.md` and wired into three documents.

- The rule carries the five statements the design lists: resolve the root and confirm it, skill files may live outside the project, dependencies live inside it, absolute paths are written once at setup, and rules land in the project rather than under `~/.agents/`.
- `setup/bundle/setup.md` now installs three rules: the opening line, both loops, the `SETUP_SKILL_DIR` paragraph, and the Verify block all name `rules-install.md`. The paragraph also says the directory may be `~/.agents/skills/setup` after a global install.
- `setup/SKILL.md` and `setup/start-a-project.md` step 2 name the new rule.
- `start-a-project.md` and `join-a-project.md` open by settling the directory instead of asserting "run every step from the project root": the command, the printed absolute path, and the confirmation. `start-a-project.md` also moves the fresh-install count in the check 13 warning from six unregistered rules to seven.

Measured:

- The updated loop run twice in an empty project prints `Installed:` for all three on the first pass and `Already installed:` for all three on the second. Verified in `/tmp/setuptest`.
- A global install of `./weave-your-work` ships `setup/bundle/rules/rules-install.md` to `~/.agents/skills/setup/bundle/rules/`. Verified with `HOME=/tmp/gh3`.
- Check 13 passes in this checkout after copying the rule to `.agents/rules/rules-install.md`.

## Review

passed

- Goal: the five statements are in the rule, and the three document edits name it. Checked by reading the committed diff and by running the install loop.
- Convention: the file name starts with `rules`, carries no number, and has no frontmatter, as `rules-bundles.md` requires. The text uses no em-dashes and no second person plural.
