---
schema: 1
id: wm-b75en7eez6tj
title: Write the map body reference
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-08T10:43:08Z
updated_at: 2026-11-09T06:11:14Z
parent: wm-6c4f9e2a7b31
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `weave-your-work/map/body.md`, the content contract every map body is written against, so map, explore, split, and review read one shape instead of guessing.

1. Lay out the five sections in order — Target, Acceptance direction, Decisions so far, Not yet specified, Out of scope — and say that a section with nothing to say is left out.
2. Write each section as purpose, format, example: Target with its `Why:` line; Acceptance direction with the default clause and a review point; Decisions so far with one settled decision, its concrete form, and a source; Not yet specified as the fog section; Out of scope as items with a reason.
3. Write one subsection per fog entry type — Assumption, Fact to establish, Decision to make, Goal to clarify — each with when to use it, its format, and an example; state that the list is open and a custom type may define its own fields.
4. State that a resolved fog entry stays in place struck through with a `Resolved:` line, and that irrelevant fog may be deleted.
5. State the boundary against the workflow: this file is content only; who may write which section, and when a map moves between statuses, belong to the operating procedure reference.
6. End with a whole map as waymark stores it, so a reader sees the five sections in one ticket.

## Acceptance signal

`weave-your-work/map/body.md` exists. Every section carries purpose, format, and an example usable without asking the author. Each built-in fog type has its own subsection. A reader who has never written a map can write one body from this file alone. The file states no workflow rule and no front matter field.

## Result

`weave-your-work/map/body.md` is written. It lays out the five sections with purpose, format, and an example each; gives every built-in fog type a subsection with when to use it, its format, and an example; states the open-list rule for custom types; states the struck-through resolve convention; states that the body carries no workflow rule and no front matter field; and ends with a whole map as waymark stores it.

Reading this repository against the finished file showed 12 of the 32 map tickets do not follow the shape: four open maps use `Destination` and `Notes` instead of `Target` and `Decisions so far` (the root map, the execution category map, entry, communication), six carry a `## Children` index the format removes, `wm-9sfmaphskg0c` adds `## Built`, and `wm-8m5cckpf4tc2` adds `## Weave log`. They were left alone: converting them changes tickets this task does not own, and the conversion was not part of this task's acceptance.

## Review

passed

- Goal: `weave-your-work/map/body.md` exists; all five sections carry purpose, format, and an example; the four fog types each have their own subsection; the file names no workflow rule and no front matter field. Read line by line against the acceptance signal.
- Convention: the only file the task changed is `weave-your-work/map/body.md`. The ticket edits were this run's own `Result`, `Review`, and status.

## Boundaries

- No front matter fields, dependency rules, or ownership. Those are the front matter reference.
- No lifecycle, statuses, or hand-offs. Those are the operating procedure reference.
- No task body format. That is task design.

## Progress

Update invalidated the prior passed verdict on the same subject: the acceptance signal forbids workflow rules and front matter fields in the body reference, but the confirmed map Review design now includes Review invalidation and the reference displays front matter. Reassess the signal against the confirmed design before re-review. The fog-empty wording was clarified; the previous Result remains a historical account. Related implementation: wm-q6477pe7x8tp.

Proposed repair for confirmation: keep the six body sections, Review verdict/evidence and struck-through history formats in `weave-your-work/map/body.md`; move operational instructions about who reviews, when invalidation occurs, and how status changes to the existing map-review and update procedures, without changing the agreed Review history behavior. Replace the full-ticket example's front matter with a body-only example, and point field questions to the map frontmatter reference. Check every body section's purpose, format, and example against the original acceptance signal; verify Review history and lifecycle instructions remain consistent, then re-review this task. Do not change update's separate skill-reference question, other map reviews, or the audit.
