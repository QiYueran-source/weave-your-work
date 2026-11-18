---
schema: 1
id: wm-qaa7hcegg5a7
title: Stop a run when only people's tickets are left, and report the four lists
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

A run ends when it can go no further and reports everything the person needs to
pick the spec up: the batches it worked, the tickets waiting on people, the
contradictions it found, and the findings `review` raised.

## Acceptance criteria

- [ ] `weave-your-work/implement-spec/SKILL.md` says a person's ticket inside a
      batch is set aside rather than worked or skipped, and stays on the frontier.
- [ ] It says the run goes on while a batch leaves reachable work an agent can
      do, and stops only when the next frontier holds nothing but people's
      tickets.
- [ ] It says what to tell the person when it stops: which tickets, what each
      asks for, and that `hand-back` records the result.
- [ ] It says the run does not go around a person's ticket, and does not stop
      early because one is on the way.
- [ ] The final report carries four lists: the batches and their tickets, the
      tickets left to people, every contradiction with both sides, and every
      `review` finding with the ticket it is on.
- [ ] It says a second run picks up from the frontier as it stands, whether the
      last run stopped at people or was cut off partway through a batch, and that
      results already written are not rewritten.
- [ ] It says a ticket too large to work is reported as a spec that is too large,
      rather than working part of one.
- [ ] It says a spec with no tickets under it is refused, with `to-tickets`
      named, rather than the run cutting its own.

## The result

## Blocked by

- None (can start immediately).
