---
schema: 1
id: wm-qaa7hcegg5a7
title: Stop a run when only people's tickets are left, and report the four lists
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

A run ends when it can go no further and reports everything the person needs to
pick the spec up: the batches it worked, the tickets waiting on people, the
contradictions it found, and the findings `review` raised.

## Acceptance criteria

- [x] `weave-your-work/implement-spec/SKILL.md` says a person's ticket inside a
      batch is set aside rather than worked or skipped, and stays on the frontier.
- [x] It says the run goes on while a batch leaves reachable work an agent can
      do, and stops only when the next frontier holds nothing but people's
      tickets.
- [x] It says what to tell the person when it stops: which tickets, what each
      asks for, and that `hand-back` records the result.
- [x] It says the run does not go around a person's ticket, and does not stop
      early because one is on the way.
- [x] The final report carries four lists: the batches and their tickets, the
      tickets left to people, every contradiction with both sides, and every
      `review` finding with the ticket it is on.
- [x] It says a second run picks up from the frontier as it stands, whether the
      last run stopped at people or was cut off partway through a batch, and that
      results already written are not rewritten.
- [x] It says a ticket too large to work is reported as a spec that is too large,
      rather than working part of one.
- [x] It says a spec with no tickets under it is refused, with `to-tickets`
      named, rather than the run cutting its own.

## The result

`implement-spec/SKILL.md` carries this ticket's rules. A person's ticket in a
batch is set aside at "A batch", not worked and not passed over, and stays on
the frontier. "When the run stops" says the run goes on while a batch leaves
reachable work an agent can do, stops only when the next frontier holds nothing
but people's tickets, names those tickets and what each asks for, points at
`hand-back`, and says neither to go around them nor to stop early for one on
the way. "What the run reports" carries the four lists. The same section says a
second run picks up from the frontier as it stands, whether the last run stopped
at people or was cut off, and that a result already written is not written
again. A ticket too large is reported as a spec that is too large. A spec with
no tickets is refused at "The spec and its tickets", with `to-tickets` named.

Verified by reading the file: every item above is present at the section named.

## Blocked by

- None (can start immediately).
