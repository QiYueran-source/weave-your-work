---
schema: 1
id: wm-e8gpxsyhcha6
title: 'to-tickets: a four-part ticket template starting with what to do'
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-17T09:52:25Z
updated_at: 2026-11-17T09:53:22Z
closed_at: 2026-11-17T09:53:22Z
dependencies:
  - wm-h7479mtnyr4v
---
Part of wm-b89wddd29gzk

## What to do

Someone writing a ticket from this skill finds one template with four parts, in
order: what to do, acceptance criteria, the result, and blocking. The first part
is named "What to do", not "What to build", because the work this set describes
is often not something constructed. It asks for the finished state, not the steps
taken to reach it.

The result is present and empty at cutting time, filled in when the task is done.
Blocking names the tickets that gate this one and is left out when the edges are
recorded on the record instead. Each ticket's body opens with the identifier of
the spec it came from.

The two tracker layouts Matt wrote collapse into one: one record per ticket, no
label, no parent section, no feature directory.

## Acceptance criteria

- [ ] One template remains, not two.
- [ ] Its parts, in order, are: what to do, acceptance criteria, the result,
      blocking.
- [ ] The first part is called "What to do" and asks for the finished state, not
      a list of steps.
- [ ] The result part says what to record: the same one or two lines naming what
      was left behind, present and empty until the task is finished.
- [ ] Blocking lists the tickets that gate this one, and says to leave it out when
      the edges are on the record.
- [ ] The body opens with the spec's identifier on its own line.
- [ ] No label, no parent section, and no feature-directory layout appears in the
      template or the steps.
