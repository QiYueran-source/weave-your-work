---
schema: 1
id: wm-c01qcvb2tw7w
title: 'Implement-spec: work a frontier as a batch, one implement call per ticket'
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

`weave-your-work/implement-spec/SKILL.md` states the frontier as a batch and
says why working it at once needs no branch, so a reader knows what the run
does with a set of unblocked tickets rather than what it does with the first one.

## Acceptance criteria

- [x] The task-graph section says the frontier is a batch, not a queue, and that
      tickets with no edge between them are worked at the same time.
- [x] A batch section says to take every frontier ticket whose work an agent can
      do, one ticket per subagent in a fresh window where subagents exist, and
      the same window otherwise.
- [x] The batch section says what concurrency here is: several tickets worked at
      once, each keeping its own record, and nothing that needs a branch or a
      copy of the repository.
- [x] The each-ticket section says one ticket is one call to `implement`, and a
      subagent ends when that call returns.
- [x] The section says a ticket worked in a batch is not closed by the call, and
      gives the reason: a ticket closed before its batch is read is a result
      nobody has looked at.
- [x] No line restates `implement`'s rules; the call is the whole reference.
- [x] Every prose line is 80 columns or under, and the file keeps mode 644.

## The result

`implement-spec/SKILL.md` now states the frontier as a batch. The task-graph
section says a batch is not a queue and tickets sharing no edge are worked at
the same time; a new batch section takes every frontier ticket an agent can do,
one per subagent in a fresh window, and says what concurrency is here: several
tickets worked at once, each keeping its own record, nothing that needs a branch
or a copy of the repository. The each-ticket section says one ticket is one call
to `implement`, a subagent ends when that call returns, and a batched ticket is
not closed by the call because a ticket closed before its batch is read is a
result nobody has looked at. No line restates `implement`'s rules.

Verified by reading back: every prose line is 80 columns or under, and the file
is mode 644.

## Blocked by

- Part of wm-n5wyafybvx25 by name; no blocking edge between tickets.
