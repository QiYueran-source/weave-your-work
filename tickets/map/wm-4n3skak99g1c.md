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

Review point: `npm test` passes, `node scripts/check-references.mjs .` reports no findings, ~~`node scripts/check-records.mjs .` passes without its baseline~~, `npx skills add ./weave-your-work` installs all 25 skills with no skipped line, and the README names every action a person can reach.
Superseded on 2026-11-12: the baseline condition asked for 344 findings on closed records to be cleared, and clearing them means rewriting 147 closed records' reviews, which the set forbids. The check now ships against its baseline, and what remains is that the baseline does not grow. (user decision, 2026-11-12)

## Decisions so far

- The eight actions on the line and the review's per-axis verdicts are what ships; the release is judged on them, not on a further redesign. (user confirmed in discussion, 2026-11-12)
- The line is seven actions, not eight: `whole-review` left it when a person took over running it. The line is now `open-map`, `split`, `open-task`, `advance-task`, `task-review`, `map-review`, with `fog-explore` beside it. (settled in the review of 2026-11-12; `MAINLINE.md` carries it)
- `check-records` ships against its baseline rather than at zero, because the 344 findings it reports are on records written before the rule existed, and the set forbids rewriting a closed record's review. (user decision, 2026-11-12)

## Not yet specified

(none; no open fog, no known uncovered work)
