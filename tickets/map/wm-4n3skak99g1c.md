---
schema: 1
id: wm-4n3skak99g1c
title: Publish the set as the next release
category: map
status: in_progress
owner: frank
creator: frank
created_at: 2026-11-12T07:41:29Z
updated_at: 2026-11-12T07:42:12Z
parent: wm-wjwa9081hse1
custom_fields:
  split_as: task
---
## Target

The set on `work-weave/discussed-restructure` ships as the next version: it installs, its checks pass, and a person who never read the review can use it from the README alone.

Why: the skill files are consistent with each other after the review, but a release is what people receive. Every defect below is one a user meets before they meet the set.

Source: the review discussion of 2026-11-12, and the release review that followed it.
A user reading the review before publishing asked whether the branch could ship; these are the answers it gave.

## Acceptance direction

All children are complete.

Review point: `npm test` passes, `node scripts/check-references.mjs .` reports no findings, `node scripts/check-records.mjs .` passes without its baseline, `npx skills add ./weave-your-work` installs all 24 skills with no skipped line, and the README names every action a person can reach.

## Decisions so far

- The eight actions on the line and the review's per-axis verdicts are what ships; the release is judged on them, not on a further redesign. (user confirmed in discussion, 2026-11-12)

## Not yet specified

(none; no open fog, no known uncovered work)
