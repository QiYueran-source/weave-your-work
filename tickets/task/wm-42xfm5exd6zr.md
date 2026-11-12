---
schema: 1
id: wm-42xfm5exd6zr
title: Repair the contradictions the principle pass found between skill files
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-12T01:48:58Z
updated_at: 2026-11-12T01:49:01Z
closed_at: 2026-11-12T01:49:01Z
parent: wm-09z3dt73e7t6
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

The ten repairs in `docs/principle-review.md` are written under review and committed on `v2-resources-and-actions` as `b90b22c`, so every contradiction between two skill files that the pass found is gone.

1. Read `docs/principle-review.md` section "What this pass changed" and open each file it names.
2. Confirm each repair against the side that lost: `split` step 4 names the one step that sets a child's parent, `open-map` step 2 names `map/res/body.md` instead of restating the walk, `setup/SKILL.md` says eight rules, `ask-me` routes a fresh project to `setup`, `map/res/body.md` states the `split_as` freeze, and `install.md` no longer claims a test that does not run.
3. Run `node scripts/check-references.mjs .`, `node scripts/check-records.mjs . --baseline scripts/check-records-baseline.json`, and `npm test`.

## Acceptance signal

`git show --stat b90b22c` lists every file the review's change table names, and each one carries the change the table describes. The three commands exit 0, with 0 findings, 0 new findings, and 86 passing tests.

## Boundaries

- No record in `tickets/` is repaired: the 213 baseline findings are the migration's work, not this task's.
- The open questions in the review are not decided here.

## Result

The repairs are on `v2-resources-and-actions` in two commits, `b90b22c` for the skills and `fe4187f` for the review record.

- `weave-your-work/split/SKILL.md`: step 2 stops claiming the caller supplies the parent, and step 4 names the one place it is set — on the create command, or with `waymark parent set <child> <map>`. That removes the contradiction with `open-map` step 3's `--parent <map>`.
- `weave-your-work/open-map/SKILL.md`: step 2 names `map/res/body.md` as the place the walk is written and stops restating the entry shape.
- `weave-your-work/map/SKILL.md`: the fog walk is named for the action that runs it, `open-map`, instead of "every action that creates a map".
- `weave-your-work/map/res/body.md`: the `split_as` assertion now states what `check-records.mjs` reads — a map with children carries `split_as`, and the value matches the children's category.
- `weave-your-work/fog-explore/SKILL.md`: step 4 and the transformation quote the resource's one shape for a cleared entry.
- `weave-your-work/stop-and-wait/res/report.md`: the preamble names the file the walk is in, in place of v1's `usage.md`.
- `weave-your-work/ask-me/SKILL.md`: a fresh project is routed to `setup`, not to three files inside it.
- `weave-your-work/setup/SKILL.md`: eight rules, matching `install.md`, `configure-project.md`, `rules-install.md`, and the eight files under `setup/rules/`.
- `weave-your-work/setup/check-project.md` and `weave-your-work/setup/install.md`: the starred-check count is left to `rules-checklist.md`.
- `weave-your-work/setup/install.md` and `weave-your-work/setup/tools/project-root-copies.test.cjs`: the guide no longer claims a copy comparison `npm test` does not run, and a test fails if a guide claims it again.

Evidence at `fe4187f`: `node scripts/check-references.mjs .` printed `0 findings across 23 skills`; `node scripts/check-records.mjs . --baseline scripts/check-records-baseline.json` printed `0 new findings across 149 records, 213 known`; `npm test` printed `# tests 86 # pass 86 # fail 0`.
