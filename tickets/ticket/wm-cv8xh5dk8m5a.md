---
schema: 1
id: wm-cv8xh5dk8m5a
title: Close a spec only when its work is finished and its acceptance is met
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-18T08:47:55Z
updated_at: 2026-11-18T09:06:56Z
closed_at: 2026-11-18T09:06:56Z
custom_fields:
  needs_human: false
---
Part of wm-n5wyafybvx25

## What to do

`implement-spec` closes the spec it worked, and only when the work is finished
and the acceptance is met. Every other ending leaves the spec open and says what
is still in the way.

## Acceptance criteria

- [x] `weave-your-work/implement-spec/SKILL.md` has a step that closes the spec.
- [x] It states the condition as two parts: every ticket the spec was cut into is
      closed, and nothing `review` raised against them is still open.
- [x] It states that a spec with tickets left to people is not finished, however
      few they are.
- [x] It states that a spec with a contradiction still unsettled is left open.
- [x] It states that the count of closed tickets does not decide it: tickets all
      closed with unmet acceptance do not finish a spec.
- [x] It says that when the spec is left open, the run says what is still in the
      way.
- [x] It does not hand the decision to `review` or to a person; the run that holds
      the frontier is the one that judges it.

## The result

`implement-spec/SKILL.md` has a section, "Closing the spec", placed after "What
the run reports". It states the condition in two parts: every ticket the spec
was cut into is closed, and nothing `review` raised against them is still open.

It states that tickets left to people mean the work is not finished, however
few they are, and that a contradiction means the set is not settled, with the
run leaving the spec open and saying what is still in the way. It states that
the acceptance decides, not the count of closed tickets: a spec whose tickets
all closed with unmet acceptance has not finished. The decision is not handed to
`review` or to a person: the run holds the frontier, so the run judges it.

Verified by reading the file: every item above is present in that section.

## Blocked by

- None (can start immediately).
