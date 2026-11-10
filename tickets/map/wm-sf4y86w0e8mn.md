---
schema: 1
id: wm-sf4y86w0e8mn
title: 'Examples skill: keep only the examples that still match the skills'
category: map
status: in_progress
owner: frank
creator: frank
created_at: 2026-11-10T01:40:43Z
updated_at: 2026-11-10T01:42:07Z
parent: wm-wjwa9081hse1
custom_fields:
  split_as: task
---
## Target

The examples skill holds only worked examples that still match the skills they illustrate.

Why: four of its seven entries are records of finished work rather than examples of how to use the skills. `map-example.md` is stale in the ways that matter: it has no `Review` section and no review point, and it lists its children inside the body, so a reader who copies it writes a map the map skill rejects. `task-example.md` was rewritten and is correct, but it repeats what the two scenarios already carry as real tickets. The two design stories narrate decisions and their reversals, so they do not teach a wrong shape; they are removed because the design they describe is closed and the index should list examples a reader can use.

## Acceptance direction

`weave-your-work/use-weave-your-work-examples/` holds `SKILL.md` and three directories: `building-work-weave/`, `chemistry-research/`, and `data-analysis/`.

Review point: `ls` on the skill directory prints exactly those four entries; `SKILL.md` names no path outside them; every relative link in the skill resolves on disk; each removed file's path survives only in a sentence recording its removal; `waymark validate` reports no findings.

## Decisions so far

- Two scenarios stay: `chemistry-research/` and `data-analysis/`. The rest of the skill's entries are removed in one pass, not repaired. (user confirmed, 2026-11-10)
- `building-work-weave/` stays although the request named it too. `.agents/rules/04-record-examples.md` requires this skill set's construction run kept as a worked example and names that directory, so the instruction conflicts with the rule and the rule wins until the person changes it. (source: `.agents/rules/04-record-examples.md`)
- One task carries the change: four removals and three page edits are one pass over one directory, read back by one listing and one link scan. (derived from task-design's size rule; this map had no grill to hold a testimony)

## Not yet specified

- Whether rule 04 should be amended so the skill holds only the two scenarios.
  Why it matters: after this change the index and the rule disagree, and only the person can amend a repository rule.
- Decision to make: whether the three Gitee API differences recorded in `designing-the-issue-skill/04-the-two-platforms.md` move into `issue/usage.md` before that page is deleted.
  Why it matters: that page says it is the only record of them, and `usage.md` names Gitee as unsupported without the differences a fork would hit.

## Out of scope

- New pages for either scenario.
- Editing closed tickets that name the removed files; a closed ticket keeps what it recorded.
- Repairing `building-work-weave/` beyond the sentence that points at removed files.
