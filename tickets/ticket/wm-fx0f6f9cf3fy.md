---
schema: 1
id: wm-fx0f6f9cf3fy
title: Point a person's ticket at hand-back, and read the three skills end to end
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-17T13:57:14Z
updated_at: 2026-11-17T13:58:50Z
closed_at: 2026-11-17T13:58:50Z
dependencies:
  - wm-py6jm3b3cvae
---
Part of wm-qmar7z6vvbyn

## What to do

A ticket that a person works names the skill that records its result, so the
reader of a ticket knows how it comes back without being told elsewhere. With
that in place, the three skills are read end to end against the spec's acceptance.

## Acceptance criteria

- [ ] `to-tickets` says a task a person does records its result with `hand-back`.
- [ ] A grep across `implement`, `hand-back`, and `to-tickets` returns nothing for
      `tdd`, `seam`, `typecheck`, or `code-review`.
- [ ] `implement` and `hand-back` both name `.work-weave/config/tracker.md` and
      say to read it before writing a record.
- [ ] `hand-back` is described as this set's own skill, not a port, in the spec's
      record and nowhere contradicted by the skills.
