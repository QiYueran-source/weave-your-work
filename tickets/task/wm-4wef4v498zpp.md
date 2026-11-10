---
schema: 1
id: wm-4wef4v498zpp
title: Prune the examples skill to the two current scenarios
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T01:41:02Z
updated_at: 2026-11-10T04:33:54Z
closed_at: 2026-11-10T04:33:54Z
parent: wm-sf4y86w0e8mn
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Move what only the pages being deleted hold, then delete them and the rule that required one of them. The steps run in this order: the moves have to land before the deletion, or the facts are gone with the pages.

1. Create `docs/gitee-api-notes.md`: the three Gitee API differences plus the read evidence around them, because `designing-the-issue-skill/04-the-two-platforms.md` is the only record of them. Keep the differences as the body of the note: create and update put the repository in the form body while the comment endpoints carry it in the path; issue numbers are case-sensitive strings, not integers; search is a keyword `q=` with no `in:title`, so the returned titles are filtered locally. Say in the note that it is parked, not wired into the issue skill, and that the skill supports GitHub only.
2. Create `docs/gaps.md`: both "what this does not show" lists, one section per skill, each item kept with the evidence it carries. Open it with where the lists came from and why they are in one file, and close it with the reader-testing lesson from `update/04-gaps.md` — checking a claim about the tool and checking whether a reader can act on the skill are two tests, and only the second one found the defects — together with what the reader rounds found, since the rules they produced are spread across both skills and the rounds themselves are recorded nowhere else.
3. In `tickets/map/wm-wjwa9081hse1.md` `Decisions so far`, strike "each one records the paths it has not exercised in its own gap list" and record that the lists are merged in `docs/gaps.md` instead, so the root map and the new file do not disagree.
4. Delete `.agents/rules/04-record-examples.md`. Nothing else references it once the map is amended.
5. Delete `building-work-weave/`, `designing-the-update-skill/`, `designing-the-issue-skill/`, `map-example.md`, and `task-example.md` from `weave-your-work/use-weave-your-work-examples/`.
6. Rewrite `SKILL.md`: the front matter description names the two scenarios only; the "read them when" list drops the map-and-task sample entries and the building entry; the Files list holds `chemistry-research/` and `data-analysis/`, and says what each covers including the audit page.
7. In `chemistry-research/06-what-the-walk-found.md`, replace the `[task-example.md](../task-example.md)` link in finding #18 with a sentence saying the single-page sample was removed and the two scenarios carry the current shapes.
8. Add `09-map-improvement-checks.md` to the reading order in `chemistry-research/README.md`, which now stops at page 8 and leaves that page unlinked.
9. Delete the empty `weave-your-work-examples/` directory at the repository root. It is untracked and holds one empty subdirectory.

## Acceptance signal

`ls weave-your-work/use-weave-your-work-examples/` prints `SKILL.md`, `chemistry-research`, `data-analysis` and nothing else. `grep` finds the three Gitee differences in `docs/gitee-api-notes.md`, and `docs/gaps.md` holds an item from each of the two deleted pages plus the reader-testing lesson. `grep` for the five removed names finds them only in sentences that record their removal. A link scan over every Markdown file in the skill reports no broken relative link. `.agents/rules/04-record-examples.md` is gone and nothing links to it. `waymark validate` reports no findings and `git status` shows only intended changes.

## Result

Done in `da54bba`, with the index tightened in `cb4ef1f`.

1. `docs/gitee-api-notes.md` holds the three differences, the token convention, the reads that ran against `oschina/git-osc`, and the fact that no write completed. It opens by saying it is parked and that nothing wires Gitee in.
2. `docs/gaps.md` holds four update items and six issue items, then a "Closed since" section with the `comment` category, then the reader test with what all ten rounds found. Every item's evidence came across; the one that had gone stale — the cross-owner archive item's claim that the communication map was still in design — was corrected rather than copied.
3. The root map's batch decision is struck and amended to point at `docs/gaps.md`.
4. `.agents/rules/04-record-examples.md` is deleted. No file links to it.
5. Five entries deleted: `building-work-weave/`, `designing-the-update-skill/`, `designing-the-issue-skill/`, `map-example.md`, `task-example.md`.
6. `SKILL.md` rewritten: the description names the two scenarios, the body has a "The two examples" section and a "Read them when" list, and the Files section is gone because the two directories are named above it.
7. Finding #18 in `chemistry-research/06-what-the-walk-found.md` now reads "The example task was stale. The single-page sample was removed on 2026-11-10; the two scenarios carry the current shapes."
8. `chemistry-research/README.md` lists page 9 with a one-line description.
9. The stray `weave-your-work-examples/` directory is deleted. It was untracked, so git records nothing.

Checks: `ls` on the skill prints the three entries. The link scan over every Markdown file in the skill reports 0 broken links, and the same scan over the two new files under `docs/` reports 0. `grep` for the five removed names returns nothing outside `tickets/`. `waymark validate` reports no findings.

## Review

passed

- Goal: every clause of the `Acceptance signal` was run. `ls` prints the three entries and nothing else. The three Gitee differences are in `docs/gitee-api-notes.md`, matched by grep on "form body, not the path", "case-sensitive", and "in:title". `docs/gaps.md` holds 13 items and covers every item of both deleted lists plus the reader-testing lesson. The five removed names appear in no file outside `tickets/`. The link scan is clean over the skill and over both new docs. Rule 04's file is gone and nothing references it. `waymark validate` reports no findings.
- Convention: the boundaries held. `chemistry-research/` and `data-analysis/` changed only in the two lines the task names. No skill under `weave-your-work/` was touched, `issue/` included: the Gitee note stays in `docs/` and no skill links to it. `docs/gaps.md` records without closing or re-scoping anything. Closed tickets that name the removed files are untouched. Nothing was rewritten into a shorter form: what was unique moved, the narration was dropped.
- One deviation, recorded rather than glossed: the task's step 6 said the Files list should name both directories, and the rewritten `SKILL.md` names them in a "The two examples" section instead of a separate list. The same two paths are stated once, and a second list of the same two paths would repeat them.
