# Install Bundles Only When a Skill Needs Them

A skill that needs installation carries a `bundle/`. A skill with nothing to install has no bundle. The setup skill names the skills it installs; it does not scan every installed skill.

## What to do

1. Put the installable parts under `<skill>/bundle/`:
   - `setup.md` (required): what the bundle installs, the tool commands, the external steps, and how to verify it.
   - `rules/` (optional): plain Markdown rule files, copied into `.agents/rules/` by filename. A bundle rule's file name starts with `rules` and carries no number; no frontmatter.
   - `tools/` (optional): scripts and their dependency manifests. The install command lives in `setup.md`; `node_modules` and build output are never committed.
2. Keep `setup.md` in five sections: What this installs, Tools, Rules, External steps, Verify.
3. When setup installs a rule, copy `bundle/rules/<file>` to `.agents/rules/<file>`. Absent: write it. Identical: skip it. Different: ask the person; never overwrite.
4. A skill without installable parts gets no `bundle/`. Do not add empty `rules/`, `tools/`, or a no-op `setup.md`.
5. Add a new skill with a bundle to the setup skill's list. The list is explicit; a bundle is not discovered by scanning.

## Why

Installable parts are the exception: most skills are Markdown only. A bundle for every skill would add empty directories and make setup report no-ops. The bundle keeps the installed artifacts (rules, tools) in one place; the skill's reading material stays in `SKILL.md` and its references.
