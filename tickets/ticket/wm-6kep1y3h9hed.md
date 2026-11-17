---
schema: 1
id: wm-6kep1y3h9hed
title: 'to-tickets: the steps, and a pass against the acceptance'
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-17T09:52:25Z
updated_at: 2026-11-17T09:53:22Z
closed_at: 2026-11-17T09:53:22Z
dependencies:
  - wm-e8gpxsyhcha6
---
Part of wm-b89wddd29gzk

## What to do

Someone running this skill finds steps that work on office tasks. Context comes
from the session and from any reference passed in. The cut is worked out and then
put to the person in three questions about granularity, blocking edges, and
whether to merge or split further. Publishing writes one record per ticket, each
naming its spec's identifier.

The publish step says that a ticket too large to cut means the spec is too large,
and that saying so is better than forcing a cut.

With the steps in place the skill is read end to end against its spec's
acceptance, and anything still describing a code repository is repaired.

## Acceptance criteria

- [ ] The steps work from the conversation and from any reference passed in.
- [ ] The cutting and confirmation steps ask whether the granularity is right,
      whether the blocking edges are correct, and whether to merge or split.
- [ ] Publishing writes one record per ticket, each body opening with the spec's
      identifier.
- [ ] The skill says that a ticket too large to cut means the spec is too large.
- [ ] Read end to end, the skill contains no codebase exploration, no prefactor
      instruction, no CI, no parent relation, no triage label, and no
      feature-directory layout.
- [ ] Read end to end, the skill carries the four cutting rules, the arranger
      rule, and the result rule.
