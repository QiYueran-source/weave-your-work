---
schema: 1
id: wm-4wef4v498zpp
title: Prune the examples skill to the two current scenarios
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-10T01:41:02Z
updated_at: 2026-11-10T01:41:02Z
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

## Boundaries

- No content changes to `chemistry-research/` or `data-analysis/` beyond the one link sentence and the one reading-order line.
- No change to any other skill under `weave-your-work/`, including `issue/`: the Gitee note stays in `docs/` and no skill links to it.
- `docs/gitee-api-notes.md` records what was found; it does not build Gitee support or describe it as planned.
- `docs/gaps.md` records what has not been exercised; it does not close, fix, or re-scope any of it.
- No rewriting of closed tickets that name the removed files; a closed ticket keeps what it recorded.
- No attempt to keep the two design stories in a shorter form. What is unique in them moves; the narration does not.
