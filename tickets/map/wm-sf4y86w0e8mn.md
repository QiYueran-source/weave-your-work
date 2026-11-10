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

Why: five of its seven entries are records of finished work rather than examples of how to use the skills. `map-example.md` is stale in the ways that matter: it has no `Review` section and no review point, and it lists its children inside the body, so a reader who copies it writes a map the map skill rejects. `task-example.md` was rewritten and is correct, but it repeats what the two scenarios already carry as real tickets. The two design stories narrate decisions and their reversals, so they do not teach a wrong shape; they are removed because the design they describe is closed and the index should list examples a reader can use. `building-work-weave/` is the record of this project's own build, retold from tickets that still hold every decision it narrates, and it had to be rewritten on each change to the skill set.

## Acceptance direction

`weave-your-work/use-weave-your-work-examples/` holds `SKILL.md` and two directories: `chemistry-research/` and `data-analysis/`.

Review point: `ls` on the skill directory prints exactly those three entries; `SKILL.md` names no path outside them; every relative link in the skill resolves on disk; each removed file's path survives only in a sentence recording its removal; the three facts that existed nowhere else are readable in their new home; `waymark validate` reports no findings.

## Decisions so far

- Two scenarios stay: `chemistry-research/` and `data-analysis/`. The rest of the skill's entries are removed in one pass, not repaired. (user confirmed, 2026-11-10)
- ~~`building-work-weave/` stays although the request named it too. `.agents/rules/04-record-examples.md` requires this skill set's construction run kept as a worked example and names that directory, so the instruction conflicts with the rule and the rule wins until the person changes it.~~ Superseded on 2026-11-10: the rule is deleted, so nothing keeps the directory. `building-work-weave/` is removed with the other entries. (user confirmed, 2026-11-10)
- Rule 04 is deleted rather than amended. Keeping the construction run as a worked example meant rewriting it on every change to the skill set, and that upkeep grew past what the example was worth; the example retold decisions the tickets already hold. The two scenarios that stay are examples of the method, not of this project's build, so the rule's premise does not apply to them. (user confirmed, 2026-11-10)
- Three facts held only by the pages being deleted are moved before deletion: the three Gitee API differences into `issue/usage.md`, and the two "paths not exercised" lists into one `docs/gaps.md`. (user confirmed, 2026-11-10)
- One task carries the change: five removals, one rule deletion, and the moves that must land before them are one pass over one directory, read back by one listing and one link scan. (derived from task-design's size rule; this map had no grill to hold a testimony)

## Not yet specified

- ~~Whether rule 04 should be amended so the skill holds only the two scenarios.~~ Resolved on 2026-11-10: the rule is deleted outright, and `building-work-weave/` goes with it.
- ~~Decision to make: whether the three Gitee API differences recorded in `designing-the-issue-skill/04-the-two-platforms.md` move into `issue/usage.md` before that page is deleted.~~ Resolved on 2026-11-10: they move. That page is the only record of them, and `usage.md`'s "Other hosts" section is where a fork looks.

## Out of scope

- New pages for either scenario.
- Editing closed tickets that name the removed files; a closed ticket keeps what it recorded.
- Rewriting the two design stories into a shorter form; what is unique in them is moved, and the rest is dropped.
