---
schema: 1
id: wm-69fh9x0nawsy
title: Teach check-records the two-axis review, and bring the baseline down
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-12T07:41:51Z
updated_at: 2026-11-12T07:42:11Z
parent: wm-4n3skak99g1c
custom_fields:
  needs_human: false
  reversibility: one_way
  task_kind: delivery
---
## Action

`check-records.mjs` still reads a review the old way, and the set's own records cannot pass it without a baseline. Both are fixed so the check describes the set that now exists.

1. Change `firstVerdict` and its four call sites to read the latest block's two axes, and report a block whose two axes disagree about closing. A map with a `Whole review` paragraph passes the assertion added for it.
2. Run `node scripts/check-records.mjs .` without a baseline and group the findings by cause.
3. Repair what the set itself owns: the `split_as` values the tracker's records are missing, the maps without a `Source:` line, and the old tasks without `Result`. Where a record cannot be repaired, record why in `docs/gaps.md` and leave it in the baseline.
4. Regenerate the baseline from what is left and record the new count in `Result`.

## Acceptance signal

`node scripts/check-records.mjs .` without `--baseline` reports 0 findings for every record this branch wrote, and `node scripts/check-records.mjs . --baseline scripts/check-records-baseline.json` exits 0 with a baseline no larger than the 213 rows it holds now.

## Boundaries

- No skill rule is loosened to make a record pass.
- Records owned by someone else are reported, not repaired.

## Failure recovery

The records are tracked in Git, and a bad bulk edit is undone with `git revert` of its own commit; nothing outside the repository changes.
