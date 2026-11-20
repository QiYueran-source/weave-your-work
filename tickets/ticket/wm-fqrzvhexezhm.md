---
schema: 1
id: wm-fqrzvhexezhm
title: Run a batch of a spec's frontier at once, and close it after reading the results together
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

`implement-spec` works a spec's frontier as batches: every ticket with no
unfinished blocker is worked at the same time, each by a call to `implement`, and
the batch's tickets close only after their results have been read together.

## Acceptance criteria

- [x] `weave-your-work/implement-spec/SKILL.md` says the frontier is a batch, not
      a queue, and that tickets sharing no edge are worked at once.
- [x] It says where the project provides subagents, one ticket goes to one
      subagent in a fresh context window, all of the batch at once; where it does
      not, the same tickets are worked one after another in this window.
- [x] It says concurrency here needs no branch or copy of the repository, and
      why: a batch is several calls to services, searches, and reports, each
      keeping its own record.
- [x] It says each ticket is worked by calling the Skill tool with `implement`,
      one ticket is one call, and the call does not close the ticket.
- [x] It says the run reads a finished batch itself, answering whether the
      results contradict each other, whether the same thing was done twice, and
      whether they hold together as one body of work.
- [x] It says a small difference is settled in one line with its reason and a
      contradiction is stated with both sides and left for someone to choose.
- [x] It says the batch's tickets close after that reading, that a contradicted
      ticket still closes, and that closing is what moves the frontier on.
- [x] No step restates `implement`'s rules; the run reaches them by the call.

## The result

`implement-spec/SKILL.md` carries this ticket's rules. "The task graph" says the
frontier is a batch, not a queue, and that tickets sharing no edge may be
worked at once. "A batch" gives one ticket to one subagent in a fresh context
window, the whole batch at once, or the same tickets one after another where
the project has no subagents, and says concurrency needs no branch or copy of
the repository because a batch is calls to services, searches, and reports,
each keeping its own record.

"Each ticket" says every ticket is worked by calling the Skill tool with
`implement`, one ticket is one call, and the call does not close the ticket.
"Reading the batch, and closing it" has the run read the batch itself, asking
whether the results contradict each other, whether the same thing was done
twice, and whether they hold together; a small difference is settled in one line
with its reason, a contradiction is stated with both sides and left to someone,
the batch closes after that reading, a contradicted ticket still closes, and
closing is what moves the frontier on. No section restates `implement`'s rules.

Verified by reading the file: every item above is present at the section named.

## Blocked by

- None (can start immediately).
