---
schema: 1
id: wm-azmygg9vtsym
title: 'Implement-spec: close a batch after the merger, and stop only at a frontier of people''s tickets'
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-18T08:24:51Z
updated_at: 2026-11-18T08:25:24Z
closed_at: 2026-11-18T08:25:24Z
custom_fields:
  needs_human: false
---
Part of wm-n5wyafybvx25

## What to do

`weave-your-work/implement-spec/SKILL.md` closes a batch after the merger has
read it, and stops only when the frontier is nothing but people's tickets, so a
person's ticket on the way no longer holds back the ones beside it.

## Acceptance criteria

- [x] A closing section says the batch's tickets are closed after the merger
      reports, and that closing the batch is what moves the frontier on.
- [x] It says a ticket whose result the merger contradicted is still closed, with
      the reason: the contradiction is a finding about the set, not a failure of
      that ticket.
- [x] The batch section says a person's ticket is set aside, not worked and not
      passed over, and stays on the frontier for a later batch.
- [x] The stop section says the run stops when the next frontier holds nothing
      but people's tickets, names them and what each asks for, and does not stop
      early because one of them is on the way.
- [x] The stop section says a second run picks up from the frontier as it stands,
      whether the last run stopped at people or was cut off partway through a
      batch.
- [x] The final report names the batches and their tickets, and the findings
      `review` raised inside the run's tickets with the ticket each is on.
- [x] The "what this skill does not do" list covers the frontier rule, reworking
      a result, settling a contradiction, and going past a frontier of people's
      tickets.
- [x] Every prose line is 80 columns or under, and the file keeps mode 644.

## The result

`implement-spec/SKILL.md` has a "Closing a batch" section: the batch's tickets
close after the merger reports, and closing them is what moves the frontier on;
a ticket whose result the merger contradicted is still closed, because the
contradiction is a finding about the set rather than a failure of that ticket.

The stop section is now "When the run stops": the run continues while a batch
leaves reachable work an agent can do, and stops when the next frontier holds
nothing but people's tickets. It says a person's ticket in a batch is set aside
rather than passed over, does not stop the batch, and the run does not stop
early because one is on the way. A second run picks up from the frontier as it
stands, whether the last run stopped at people or was cut off partway through a
batch.

The final report carries four lists: the batches and their tickets, the tickets
left to people, every contradiction, and every finding `review` raised inside
the run's tickets. The closing list covers the frontier rule, reworking a
result, settling a contradiction, and going past a frontier of people's tickets.

Verified by reading back: every prose line is 80 columns or under, and the file
is mode 644.

## Blocked by

- Part of wm-n5wyafybvx25 by name; no blocking edge between tickets.
