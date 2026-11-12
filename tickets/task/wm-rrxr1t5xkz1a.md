---
schema: 1
id: wm-rrxr1t5xkz1a
title: Explain and shrink the check-records baseline the branch leaves
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-12T08:10:28Z
updated_at: 2026-11-12T08:14:10Z
parent: wm-4n3skak99g1c
custom_fields:
  needs_human: false
  reversibility: one_way
  task_kind: delivery
---
## Action

The tracker's records do not all match the shapes the branch now states, so the check keeps a baseline file of known findings: six of the rules are still met by about three hundred old records, and the check reads no path inside the examples. Whatever is left is fixed or recorded as a deliberate exception.

1. Group the findings by cause and count each.
2. Fix what one edit settles on a record this repository owns: an old map without a `Source:` line, an old review with no verdict.
3. Record what stays as a migration item in `docs/gaps.md`, with the count and what it would take.
4. Regenerate the baseline.

## Acceptance signal

`npm run check:records` exits 0, `docs/gaps.md` names every class of known finding with its count, and the baseline holds no finding for a record written after this branch.

## Boundaries

- No rule is loosened to clear a finding.

## Failure recovery

All changes are to tracked records and one baseline file under Git; a bad bulk edit is undone with `git revert` of the migration commit, and nothing outside the repository changes.
