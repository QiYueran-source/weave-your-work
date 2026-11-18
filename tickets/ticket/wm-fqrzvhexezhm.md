---
schema: 1
id: wm-fqrzvhexezhm
title: Run a batch of a spec's frontier at once, and close it after reading the results together
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

`implement-spec` works a spec's frontier as batches: every ticket with no
unfinished blocker is worked at the same time, each by a call to `implement`, and
the batch's tickets close only after their results have been read together.

## Acceptance criteria

- [ ] `weave-your-work/implement-spec/SKILL.md` says the frontier is a batch, not
      a queue, and that tickets sharing no edge are worked at once.
- [ ] It says where the project provides subagents, one ticket goes to one
      subagent in a fresh context window, all of the batch at once; where it does
      not, the same tickets are worked one after another in this window.
- [ ] It says concurrency here needs no branch or copy of the repository, and
      why: a batch is several calls to services, searches, and reports, each
      keeping its own record.
- [ ] It says each ticket is worked by calling the Skill tool with `implement`,
      one ticket is one call, and the call does not close the ticket.
- [ ] It says the run reads a finished batch itself, answering whether the
      results contradict each other, whether the same thing was done twice, and
      whether they hold together as one body of work.
- [ ] It says a small difference is settled in one line with its reason and a
      contradiction is stated with both sides and left for someone to choose.
- [ ] It says the batch's tickets close after that reading, that a contradicted
      ticket still closes, and that closing is what moves the frontier on.
- [ ] No step restates `implement`'s rules; the run reaches them by the call.

## The result

## Blocked by

- None (can start immediately).
