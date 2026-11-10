---
schema: 1
id: wm-sf4y86w0e8mn
title: 'Examples skill: keep only the examples that still match the skills'
category: map
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T01:40:43Z
updated_at: 2026-11-10T04:34:29Z
closed_at: 2026-11-10T04:34:29Z
parent: wm-wjwa9081hse1
custom_fields:
  split_as: task
---
## Target

The examples skill holds only worked examples that still match the skills they illustrate.

Why: five of its seven entries are records of finished work rather than examples of how to use the skills. `map-example.md` is stale in the ways that matter: it has no `Review` section and no review point, and it lists its children inside the body, so a reader who copies it writes a map the map skill rejects. `task-example.md` was rewritten and is correct, but it repeats what the two scenarios already carry as real tickets. The two design stories narrate decisions and their reversals, so they do not teach a wrong shape; they are removed because the design they describe is closed and the index should list examples a reader can use. `building-work-weave/` is the record of this project's own build, retold from tickets that still hold every decision it narrates, and it had to be rewritten on each change to the skill set.

## Acceptance direction

`weave-your-work/use-weave-your-work-examples/` holds `SKILL.md` and two directories: `chemistry-research/` and `data-analysis/`.

Review point: `ls` on the skill directory prints exactly those three entries; `SKILL.md` names no path outside them; every relative link in the skill resolves on disk; each removed file's path survives only in a sentence recording its removal; the three facts that existed nowhere else are readable in their new home under `docs/`; `waymark validate` reports no findings.

## Decisions so far

- Two scenarios stay: `chemistry-research/` and `data-analysis/`. The rest of the skill's entries are removed in one pass, not repaired. (user confirmed, 2026-11-10)
- ~~`building-work-weave/` stays although the request named it too. `.agents/rules/04-record-examples.md` requires this skill set's construction run kept as a worked example and names that directory, so the instruction conflicts with the rule and the rule wins until the person changes it.~~ Superseded on 2026-11-10: the rule is deleted, so nothing keeps the directory. `building-work-weave/` is removed with the other entries. (user confirmed, 2026-11-10)
- Rule 04 is deleted rather than amended. Keeping the construction run as a worked example meant rewriting it on every change to the skill set, and that upkeep grew past what the example was worth; the example retold decisions the tickets already hold. The two scenarios that stay are examples of the method, not of this project's build, so the rule's premise does not apply to them. (user confirmed, 2026-11-10)
- Three facts held only by the pages being deleted are moved before deletion: the three Gitee API differences into their own note under `docs/`, and the two "paths not exercised" lists into one `docs/gaps.md`. The Gitee note is parked rather than wired into the issue skill: that skill supports GitHub only by decision, and adding a host's API details to its document would read as support it does not have. (user confirmed, 2026-11-10)
- One task carries the change: five removals, one rule deletion, and the moves that must land before them are one pass over one directory, read back by one listing and one link scan. (derived from task-design's size rule; this map had no grill to hold a testimony)

## Not yet specified

- ~~Whether rule 04 should be amended so the skill holds only the two scenarios.~~ Resolved on 2026-11-10: the rule is deleted outright, and `building-work-weave/` goes with it.
- ~~Decision to make: whether the three Gitee API differences recorded in `designing-the-issue-skill/04-the-two-platforms.md` move into `issue/usage.md` before that page is deleted.~~ Resolved on 2026-11-10: they move into their own note under `docs/`, not into the issue skill. That page is the only record of them, so they have to land somewhere; `usage.md` is not that place while the skill claims one host.

## Out of scope

- New pages for either scenario.
- Editing closed tickets that name the removed files; a closed ticket keeps what it recorded.
- Rewriting the two design stories into a shorter form; what is unique in them is moved, and the rest is dropped.

## Review

passed

- Goal: the three lines of the `Acceptance direction` and the review point hold. `ls` on the skill prints `SKILL.md`, `chemistry-research`, `data-analysis` and nothing else. The skill is one `SKILL.md` naming only those two directories, and a link scan over every Markdown file in it reports no broken relative link. Each of the five removed paths is gone from disk and appears in no file outside `tickets/`. The three facts that existed only in the deleted pages are readable in `docs/gitee-api-notes.md` and `docs/gaps.md`, including the Gitee differences matched by grep and every item of both gap lists. `waymark validate` reports no findings, and the child task's `Result` records each step with the command that read it back.
- Convention: the children match `split_as: task` — one task, closed, carrying `Result` and this review's sibling on the child. The body holds no children index; the shape is read from `parent` with `waymark tree`. `Not yet specified` is empty of live entries and keeps both resolved ones struck, as `map/body.md` asks. The map was reviewed by its owner, and the review is written here rather than on the child.
