---
schema: 1
id: wm-t2zhf370jy0j
title: 'Fix the skill faults a rule-by-rule read found: source line, Action shape, layout copies, split_as and the checks'
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-12T01:49:04Z
updated_at: 2026-11-12T01:51:37Z
parent: wm-09z3dt73e7t6
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Six faults named below are repaired. Each is a line in the skill or resource it belongs to, and the check it names is run before the record is closed.

1. In `weave-your-work/map/res/body.md`, state that a `Target` carries a `Source:` line, which `scripts/check-records.mjs` already requires.
2. In `weave-your-work/task/res/body.md`, keep the one definition of the `Action` shape and cut the copy in `open-task` step 2.
3. In `weave-your-work/open-map/SKILL.md`, drop the two `Transformation` lines that repeat `map/res/body.md`'s assertions.
4. In `weave-your-work/map/res/body.md`, say where the record `split_as` rule is decided, and settle it in the tracker or in the record.
5. In `.github/workflows/verify.yml`, record which of the three check scripts runs the set's own skills against a failing baseline, so a red check on `v2-resources-and-actions` is explained.
6. In `docs/v2-conformance.md`, drop the "no action links into another action's folder" row that `split` calling `open-map` contradicts.

## Acceptance signal

`node scripts/check-references.mjs .` reports 0 findings, and `node scripts/check-records.mjs .` reports no finding for a `Target` without `Source:`. The two resource files each state each of their rules once: no rule from `map/res/body.md` or `task/res/body.md` also appears in `open-map/SKILL.md` or `open-task/SKILL.md`. A reader who runs `npm run check:records` on this branch finds the result in `docs/v2-conformance.md` or in `.github/workflows/verify.yml` rather than having to infer what the check is for.

## Boundaries

- No record in `tickets/` is migrated.
