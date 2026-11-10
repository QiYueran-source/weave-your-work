# Install Bundles Only When a Skill Needs Them

A skill that needs installation carries a `bundle/`; a skill with nothing to install has none. The setup skill names the skills it installs; it does not scan every installed skill. It reads each listed skill's `bundle/setup.md` and does not restate or replace its steps.

## What to do

1. Put the installable parts under `<skill>/bundle/`:
   - `setup.md` (required): what the bundle installs, the tool commands, the external steps, and how to verify it.
   - `rules/` (optional): plain Markdown rule files, copied into `.agents/rules/` by filename. A bundle rule's file name starts with `rules` and carries no number; no frontmatter.
   - `tools/` (optional): scripts and their dependency manifests. The install command lives in `setup.md`; `node_modules` and build output are never committed.
   The skill root carries `SKILL.md` and its usage documents, and no `usage.md` is required. A skill whose use is one flow names that document `usage.md`: usage-only, never repeating the install steps, and `SKILL.md` points at it. A skill whose use splits into flows names each document after its flow — `setup` carries `start-a-project.md`, and a second flow gets its own document rather than a shared `usage.md` — and `SKILL.md` points at the one that matches the state the person is in. Either way `SKILL.md` also points at `bundle/setup.md` for install. A skill with nothing to say beyond `SKILL.md` carries no second document.
2. Keep `bundle/setup.md` in five sections: What this installs, Tools, Rules, External steps, Verify.
3. The guide is instruction-first and cross-platform. Use neutral prose; give Unix and Windows commands where they differ; give the MCP or harness registration as a JSON snippet, not an edit to an unknown config. Do not add `install.sh`; the guide is the install.
4. A hook the bundle offers is recommended, not required. Say what to run when it is skipped, such as the merge command after a pull.
5. When a skill's own setup installs a rule, copy `bundle/rules/<file>` to `.agents/rules/<file>`. Absent: write it. Identical: skip it. Different: ask the person; never overwrite. The total setup does not copy rules or add the AGENTS.md prompt; the prompt belongs to the setup skill.
6. A skill without installable parts gets no `bundle/`. Do not add empty `rules/`, `tools/`, or a no-op `setup.md`.
7. Add a new skill with a bundle to the setup skill's list. The list is explicit; a bundle is not discovered by scanning.

## Why

Installable parts are the exception: most skills are Markdown only. A bundle for every skill would add empty directories and make setup report no-ops. The bundle keeps the installed artifacts (rules, tools) in one place; the skill's reading material stays in `SKILL.md` and, when a flow needs its own document, that document beside it.
