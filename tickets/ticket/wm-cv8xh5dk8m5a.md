---
schema: 1
id: wm-cv8xh5dk8m5a
title: Close a spec only when its work is finished and its acceptance is met
category: ticket
status: open
owner: frank
creator: frank
created_at: 2026-11-18T08:47:55Z
updated_at: 2026-11-18T08:48:20Z
custom_fields:
  needs_human: false
---
Part of wm-n5wyafybvx25

## What to do

`implement-spec` closes the spec it worked, and only when the work is finished
and the acceptance is met. Every other ending leaves the spec open and says what
is still in the way.

## Acceptance criteria

- [ ] `weave-your-work/implement-spec/SKILL.md` has a step that closes the spec.
- [ ] It states the condition as two parts: every ticket the spec was cut into is
      closed, and nothing `review` raised against them is still open.
- [ ] It states that a spec with tickets left to people is not finished, however
      few they are.
- [ ] It states that a spec with a contradiction still unsettled is left open.
- [ ] It states that the count of closed tickets does not decide it: tickets all
      closed with unmet acceptance do not finish a spec.
- [ ] It says that when the spec is left open, the run says what is still in the
      way.
- [ ] It does not hand the decision to `review` or to a person; the run that holds
      the frontier is the one that judges it.

## The result

## Blocked by

- None (can start immediately).
