---
schema: 1
id: wm-q886j3wkempm
title: 'Review: review a ticket''s work before implement closes it'
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-18T08:13:34Z
updated_at: 2026-11-18T08:14:14Z
closed_at: 2026-11-18T08:14:14Z
custom_fields:
  needs_human: false
---
Part of wm-kkpdm0hek877

## What to do

`implement` gains a review step: once a ticket is worked, review reads it before
the ticket is closed, so a ticket is closed against a reading rather than against
its own say-so. The findings are reported, not repaired.

## Acceptance criteria

- [x] `weave-your-work/implement/SKILL.md` has a step that calls the Skill tool
      with `review` after the work is done and before the ticket is closed.
- [x] The step says what review takes: the ticket and its spec, named by the
      reference the ticket's first line carries.
- [x] The step says findings are reported to the person who gets the result, and
      not repaired inside the ticket's run.
- [x] The step says a ticket with no spec behind it is still closed, and review
      is skipped, rather than the run stopping.
- [x] Nothing in `implement` restates review's rules; the axes, the smells, and
      the findings' shape stay in `review`.
- [x] `weave-your-work/review/SKILL.md` names `implement` as the caller, so the
      two cannot disagree about who starts a review.
- [x] Every prose line in both files is 80 columns or under, and both keep mode
      644.

## The result

`implement` gained a section, "Reading it before it closes", placed between
writing the result and closing the ticket. It calls the Skill tool with `review`
over the ticket and the spec its first line names, reports the findings with the
result rather than repairing them, and closes a ticket whose spec is missing
with a note that review was skipped.

`review`'s opening now says who starts it: `implement`, once a ticket's result is
written and before the ticket closes, or a person over a spec whose tickets are
all done. The two files agree on the order and neither restates the other's
rules.

Verified by reading back: both files are mode 644, every prose line is 80
columns or under, and `implement` names `review` but never its axes, its smells,
or the shape of a finding.

## Blocked by

- Part of wm-kkpdm0hek877 by name; no blocking edge between tickets.
