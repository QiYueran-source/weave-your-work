---
schema: 1
id: wm-b7fs674ymgmx
title: Say what to-spec's sections hold, and which interview is banned
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-17T13:16:30Z
updated_at: 2026-11-17T13:21:22Z
closed_at: 2026-11-17T13:21:22Z
---
Part of wm-wrw42r7nsb82

## What to do

Three sentences in `to-spec` say the wrong thing about their own section.

The `Acceptance` part of the template describes which step produced the section
instead of what the section holds. It says what the section holds: the delivery
and the judgement of it.

The first step lists five things to read and never says what reading them is
for. It says the read answers what the project calls things, what it has already
decided, and whether a spec for this change exists.

The opening forbids interviewing and the second step then asks the user to settle
two things. The opening names the interview it forbids as the second one, so
settling the delivery does not read as forbidden.

## Acceptance criteria

- [ ] The `Acceptance` template part says what the section holds, not which step
      produced it.
- [ ] The first step says what the read answers.
- [ ] The opening names the forbidden interview as the second one, and the second
      step still asks the user to settle the delivery and the judgement.

## The result

`weave-your-work/to-spec/SKILL.md`: the opening bans the second interview and says
step 2 still settles the delivery, and `## Acceptance` now says what it holds
rather than which step produced it.
