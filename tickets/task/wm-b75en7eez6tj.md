---
schema: 1
id: wm-b75en7eez6tj
title: Write the map body reference
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-08T10:43:08Z
updated_at: 2026-11-09T14:46:40Z
closed_at: 2026-11-09T14:46:40Z
parent: wm-6c4f9e2a7b31
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `weave-your-work/map/body.md`, the content contract every map body is written against, so map, explore, split, and review read one shape instead of guessing.

1. Lay out the six sections in order — Target, Acceptance direction, Decisions so far, Not yet specified, Out of scope, Review — and say that a section with nothing to say is left out.
2. Write each section as purpose, format, example: Target with its `Why:` line; Acceptance direction with the default clause and a review point; Decisions so far with one settled decision, its concrete form, and a source; Not yet specified as the fog section; Out of scope as items with a reason; Review with the four verdicts and the invalidated-verdict layout.
3. Write one subsection per fog entry type — Assumption, Fact to establish, Decision to make, Goal to clarify — each with when to use it, its format, and an example; state that the list is open and a custom type may define its own fields.
4. State that a resolved fog entry stays in place struck through with a `Resolved:` line, and that irrelevant fog may be deleted.
5. State the boundary against the workflow: this file is content only. Who may write which section, when a map moves between statuses, and who runs a review belong to the operating procedure reference, `map-review`, and `update`.
6. End with a whole map as waymark stores it, so a reader sees the body sections in one ticket.

## Acceptance signal

`weave-your-work/map/body.md` exists. Every section carries purpose, format, and an example usable without asking the author. Each built-in fog type has its own subsection. A reader who has never written a map can write one body from this file alone. The file states no workflow rule and defines no field: front matter appears in the whole-ticket example because that is how waymark stores a ticket, and the file never says which value a field takes or who writes it.

## Result

`weave-your-work/map/body.md` defines the six sections — Target, Acceptance direction, Decisions so far, Not yet specified, Out of scope, and Review — each with purpose, format, and an example; gives every built-in fog type a subsection with when to use it, its format, and an example; states the open-list rule for custom types; states the struck-through resolve convention; states the invalidated-verdict layout, with the old verdict struck in place and the fresh one above it; and ends with a whole map as waymark stores it.

The repair: the Review section had carried three workflow sentences — that status remains the lifecycle state, that `map-review` owns the check and disposition, and how a reopened map records its invalidated review. All three already live in `map-review/SKILL.md` and `map/procedure.md`, so they were removed here rather than moved again. The whole-map note no longer says what `split_as` means or when it is written; the front matter block stays because that is the ticket waymark hands a reader.

When the file was first written, 12 of the 32 map tickets did not follow the shape: four open maps used `Destination` and `Notes` instead of `Target` and `Decisions so far` (the root map, the execution category map, entry, and communication; communication was converted on 2026-11-09), six carried a `## Children` index the format removes, `wm-9sfmaphskg0c` added `## Built`, and `wm-8m5cckpf4tc2` added `## Weave log`. They were left alone: converting them changes tickets this task does not own, and the conversion was not part of this task's acceptance.

## Review

passed

- Goal: `weave-your-work/map/body.md` exists and defines six sections — Target, Acceptance direction, Decisions so far, Not yet specified, Out of scope, Review — each with purpose, format, and an example a reader can apply without asking the author; each built-in fog type has its own subsection; the whole-map example ends the file. The file states no workflow rule and defines no field: the Review section no longer names status, `map-review`, reopen, or backfill, and the front matter block carries no sentence about what a field means or who writes it. Read line by line against the signal after the repair.
- Convention: the only file the work changed is `weave-your-work/map/body.md`. The ticket writes were this run's own `Result`, `Review`, and status, plus one confirmed decision recorded on the parent map `wm-6c4f9e2a7b31`. `waymark validate` reports no findings. The invalidated-verdict layout still matches `map-review/SKILL.md`'s retention rule and `update/content.md`'s invalidation, so the removed sentences left no rule without a home.

## Boundaries

- No front matter fields, dependency rules, or ownership. Those are the front matter reference.
- No lifecycle, statuses, or hand-offs. Those are the operating procedure reference.
- No task body format. That is task design.
