---
schema: 1
id: wm-yaw977a0sr2c
title: Install and migrate the glossary runtime
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-10T11:24:59Z
updated_at: 2026-11-10T11:24:59Z
parent: wm-2ztwvye6q9t7
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Deliver a glossary setup and migration that uses the checkout's runtime, moves the retained vocabulary, and leaves no old-path install behind.

1. Rewrite `weave-your-work/glossary/bundle/setup.md` to copy the tools, resolver, `package.json`, and `package-lock.json` into `<root>/.work-weave/runtime/glossary/` and run `npm install` there. Do not install dependencies under the skill directory.
2. Point the MCP registration and the post-merge hook at the project runtime with an explicit `--project <root>`. Keep the hook's no-overwrite rule. Keep the hook working when the project has no glossary data by exiting cleanly, not by creating an empty view.
3. Create `.work-weave/glossary/` and `.work-weave/.gitignore`; add `/GLOSSARY.md` to the root `.gitignore`. Move the retained `glossary/frank.jsonl` and `glossary/_header.md` into `.work-weave/glossary/`. Keep the old copies until `merge` regenerates the root view with the same term count and content, then remove the old directory in the same run. Do not delete anything else.
4. Update `glossary/SKILL.md`, `glossary/usage.md`, `glossary/bundle/rules/rules-glossary.md`, and the setup flow and checklist references that name the old `glossary/` path. A differing installed `.agents/rules/rules-glossary.md` is a conflict for the person, not an overwrite.
5. Amend `docs/adr/0001-project-document-layout.md` for the source location and cite this map as the owning ticket. Leave the closed glossary map as history.
6. Verify a second fixture project has its own sources, runtime, MCP path, and root view; verify the current checkout's regenerated view contains the retained terms.

## Acceptance signal

The current checkout's `GLOSSARY.md` is regenerated from `.work-weave/glossary/` and contains the same number of terms as the retained source before the old directory is removed. The hook and MCP registration name the project runtime. Docs, rules, and ADR name the new paths and no longer tell a reader to install under the skill directory. Two fixture projects produce separate views.

## Boundaries

- No version upgrade, cutover, or rollback.
- No term schema or merge-policy change.
- No overwrite of a differing installed rule.
- No deletion of retained data before the regenerated view is checked.
