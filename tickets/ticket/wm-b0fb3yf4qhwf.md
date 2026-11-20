---
schema: 1
id: wm-b0fb3yf4qhwf
title: Publish in creation order and keep one Blocked by form
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

Someone publishing a set of tickets is told to create each record and then
record the tickets that block it. The step says nothing about the order in which
records are created, because the order has no effect.

The ticket template offers one way to record blocking. The alternative it
offered, a section written only when the project cannot record the relation, is
gone.

## Acceptance criteria

- [ ] The publishing step no longer says to publish in dependency order or
      blockers first.
- [ ] The publishing step says to record the blocking tickets after creating the
      record.
- [ ] The `Blocked by` part of the template no longer offers leaving the part out.

## The result

`weave-your-work/to-tickets/SKILL.md` step 5 now says to create each record and
then record its blockers, and the template's `Blocked by` part offers one form.
