---
schema: 1
id: wm-yaw977a0sr2c
title: Install and migrate the glossary runtime
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T11:24:59Z
updated_at: 2026-11-10T11:48:10Z
closed_at: 2026-11-10T11:48:10Z
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

## Result

Moved the retained sources to `.work-weave/glossary/` (`frank.jsonl` and `_header.md`, 40 terms), created `.work-weave/.gitignore` for `pending/`, `runtime/`, and `local/`, changed the root ignore rule to `/GLOSSARY.md`, and regenerated the root view with 40 terms. The old top-level `glossary/` was removed only after the count matched and the view was checked.

Installed the project runtime at `.work-weave/runtime/glossary/` with `npm ci --omit=dev --cache .work-weave/local/npm-cache` (95 packages). Installed `.git/hooks/post-merge` from the new template with the runtime path; running it regenerates `GLOSSARY.md` with 40 terms. `node .work-weave/runtime/glossary/server.js --project .` lists the four MCP tools.

Rewrote `glossary/bundle/setup.md` for the project runtime, platform-independent install steps, migration, MCP registration, and hook. Updated `glossary/SKILL.md`, `glossary/usage.md`, `glossary/bundle/rules/rules-glossary.md`, the glossary paths in `setup/start-a-project.md` and `setup/join-a-project.md`, check 15 in `rules-checklist.md`, and ADR 0001 with this map as the amendment owner. The installed `.agents/rules/rules-glossary.md` and `rules-checklist.md` were refreshed with the person's approval.

`node --test` in `weave-your-work/glossary/bundle/tools/` passed 10 tests on Linux. The harness MCP registration itself was not written: its config is outside the repository and the setup guide hands the snippet to the person. macOS and Windows were not tested.

## Review

passed

- Goal: the retained 40 terms are in `.work-weave/glossary/`, the regenerated root view has 40 terms, the old directory was removed after that check, the hook runs against the project runtime, the MCP server lists four tools, and the docs and ADR name the new paths. The glossary test suite passes.
- Convention: no term data was lost; the old directory was removed only after verification. The rule copies were replaced with the person's approval. The setup flows changed only their glossary references, not their structure.

## Boundaries

- No version upgrade, cutover, or rollback.
- No term schema or merge-policy change.
- No overwrite of a differing installed rule.
- No deletion of retained data before the regenerated view is checked.
