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

Remove the four out-of-date entries from the examples skill and put the index back in step with what the skill holds.

1. Delete `designing-the-update-skill/`, `designing-the-issue-skill/`, `map-example.md`, and `task-example.md` from `weave-your-work/use-weave-your-work-examples/`.
2. Rewrite `SKILL.md`: the front matter description names the two scenarios only; the "read them when" list drops the map-and-task sample entries; the Files list holds `building-work-weave/`, `chemistry-research/`, and `data-analysis/`, and says what each covers including the audit page.
3. In `chemistry-research/06-what-the-walk-found.md`, replace the `[task-example.md](../task-example.md)` link in finding #18 with a sentence saying the single-page sample was removed and the two scenarios carry the current shapes.
4. In `building-work-weave/05-defining-tasks.md`, change the sentence that says the two skills checked their rules against `map-example.md` and `task-example.md` to past tense, so it describes what happened then without naming a file a reader can still open.
5. Add `09-map-improvement-checks.md` to the reading order in `chemistry-research/README.md`, which now stops at page 8 and leaves that page unlinked.
6. Delete the empty `weave-your-work-examples/` directory at the repository root. It is untracked and holds one empty subdirectory.

## Acceptance signal

`ls weave-your-work/use-weave-your-work-examples/` prints `SKILL.md`, `building-work-weave`, `chemistry-research`, `data-analysis` and nothing else. A link scan over every Markdown file in the skill reports no broken relative link. `grep` for the four removed names finds them only in sentences that record their removal. `waymark validate` reports no findings and `git status` shows only intended changes.

## Boundaries

- No content changes to `chemistry-research/` or `data-analysis/` beyond the one link sentence and the one reading-order line.
- No change to any other skill under `weave-your-work/`.
- No amendment to `.agents/rules/04-record-examples.md`; that decision is still open on the map.
- No rewriting of closed tickets that name the removed files.
