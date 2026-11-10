---
schema: 1
id: wm-nhkqse95wf3r
title: Mark check 9 not applicable when the plan lacks branch protection
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T13:13:16Z
updated_at: 2026-11-10T13:14:14Z
closed_at: 2026-11-10T13:14:14Z
parent: wm-ygnttse5hd5k
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Change check 9 in both copies of `rules-checklist.md` so a plan without server protection is not a failure.

1. Keep `true` as the pass result.
2. When the branch prints `false`, probe `/protection` once. A 403 whose message contains `Upgrade to GitHub Pro or make this repository public` marks the check not applicable and names the plan gate; the project relies on `rules-git.md` plus its own hook if it has one.
3. Leave every other answer a failure. A non-admin's 404 or 403 without that message is unverifiable, as check 16 treats a missing permission.
4. Add the plan-gate reason to the preamble's not-applicable sentence. Keep seventeen checks and the numbering.

## Acceptance signal

The bundle copy and the installed copy stay byte-identical. A protected repository still passes. A private repository on a free plan reports not applicable with the plan gate named, instead of failing. `waymark validate` reports no errors.

## Result: check 9 names the plan gate

Changed check 9 in both copies of `rules-checklist.md`. `true` still passes; when the branch prints `false`, the check probes `/protection` once. A 403 carrying `Upgrade to GitHub Pro or make this repository public` marks the check not applicable and names the plan gate; a `false` while the feature is available stays a failure. The preamble now lists the plan gate as a second not-applicable reason. Seventeen checks and the numbering are unchanged.

Verified against both repositories that exist today: `world-model-project` (private, free) prints `false` and the probe returns the 403 upgrade message; `weave-your-work` (public) prints `true`. The two checklist copies are byte-identical and `waymark validate` reports no errors.
