---
name: implement-spec
description: "Work a whole spec in one run: work each batch of its frontier at once by calling implement for every ticket, read the batch's results together, and close the batch once it has."
disable-model-invocation: true
---

# Implement Spec

Work a whole spec in one run, instead of one ticket at a time.

`implement` does one ticket and stops. A person who has five tickets to get
through starts it five times. This starts once, and works them in batches.

## The spec and its tickets

If the user passes a reference, read the spec and state its title before
starting. If no spec is named, ask which one. A run covers one spec.

This skill works tickets, and it does not cut them. If the spec has no tickets
under it, say so and name `to-tickets`: a run that cut its own tickets would
make tickets it can work rather than the tickets the work needs.

## The task graph

The spec's tickets are not a list of steps. Read the tickets that came from the
spec, and the tickets that block them. What you are looking for is the frontier:
the tickets with no unfinished blocker.

The frontier is a batch, not a queue. Tickets that share no edge may be worked
at the same time, and working them that way is the point of the run.

Do not work a ticket whose blocker is still unfinished because it looks small or
easy. Unfinished, not open: a batch closes its tickets together, and the one you
are holding was open while it was being worked.

## A batch

For each batch, take every ticket on the frontier whose work an agent can do. A
ticket that is a person's is set aside, not worked and not passed over: it stays
on the frontier for the next batch.

Where the project provides subagents, work the batch in them: one ticket per
subagent, each starting with a fresh context window, all running at once. Where
it does not, work them in this window one after another. Judge that against what
the project actually has.

Concurrency here is not several hands on one working tree. It is several
tickets being worked at once while each keeps its own record: a call to a
service, a search, a report. Nothing in that needs a branch or a copy of the
repository.

## What a subagent may write

That also means nothing isolates the batch. There is no worktree to keep two
subagents out of the same record, and a tracker that takes the last write wins
does not tell either of them that the other one wrote.

So give every subagent its limit in its brief. It opens with a map of the work
before anything else:

1. **Read the tickets first, and say who owns what.** Read the spec's tickets
   and the tickets around them, including the ones in other categories, and
   state which ticket is yours and which belong to somebody else. Your ticket
   is the only one you are responsible for. Do not work another ticket, even
   one nobody has picked up, and do not do the part of somebody else's work
   that would unblock yours.
2. **Leave other people's work alone.** Do not edit or close any record that is
   not your ticket. That includes the spec, other tickets, and the records
   other operators keep.
3. **Anything new that is not yours, do not touch.** If the working area holds
   something that appeared while you worked and is not your doing, work out
   whether it came from another task, and say what you worked out. Then leave
   it: do not edit it, close it, delete it, or revert it, and do not build on it
   as if it were yours. Whether or not you are sure where it came from, the
   answer is the same.
4. **Close nothing, and say what you could not do.** Your ticket stays open
   until the batch has been read, and a subagent that stops early says which
   record it was and what stopped it.

Nothing is gained by having two subagents write one record: the run reads the
batch's results once they are all back, and that reading is where two accounts
of one thing get reconciled, not a second writer.

## Each ticket

Work every ticket by calling the Skill tool with `implement`. Not by following
its rules from memory, and not by restating them here: `implement` is what knows
how a ticket is worked, and a second copy of that would drift from it.

One ticket is one call. A subagent that works a ticket ends when that call
returns: it does not work the ticket next to it and does not start the run.

**A ticket worked in a batch is not closed by the call.** The batch closes its
tickets once their results have been read together, and reading them together is
what this run does next.

## Reading the batch, and closing it

When every subagent in the batch has returned, read the batch's results
together. This is the run's counterpart of Matt's merger, and it answers:

- do the results contradict each other;
- was the same thing done twice;
- do they hold together as one body of work, or does something need a person to
  choose.

It reports to this run, not to a person, because the run is what carries the
result forward.

A small difference is settled in one line with its reason. A contradiction is
stated with both sides and left for someone to choose: the reading does not
settle it on their behalf.

Then close the batch. The run has the same four rules the subagent was given,
one level up:

- **Close only the tickets the batch worked.** A ticket that was left out of the
  batch, because its work is a person's, is not closed here; it stays on the
  frontier for the next batch.
- **Close only a ticket that finished and wrote its result.** A ticket whose
  subagent stopped early is left open, and it stays on the frontier, so the next
  batch picks it up again. Say in the report that it was tried and did not
  finish, and say what stopped it.
- **Close a ticket the reading contradicted.** It was worked, and the
  contradiction is a finding about the set, not a failure of that ticket.
- **Change nothing else.** No other record is edited or closed on the strength
  of the reading: the reading's job is to report, and a contradiction belongs to
  the person who will choose between its two sides.

Closing the batch is what moves the frontier on: a ticket becomes reachable when
its blockers are closed.

A ticket that was tried in two batches and did not finish either time is not
tried a third. Report it with what stopped it on each attempt and leave it out
of the frontier, so the run stops failing at it and finishes what it can.

## When the run stops

The run goes on for as long as a batch leaves reachable work an agent can do.

It stops when the next frontier holds nothing but tickets that are a person's.
Say which tickets those are, what each asks for, and that `hand-back` records
the result once the work is done. Then stop.

Do not go around them, and do not stop early because one of them is on the way.
The tickets behind a person's ticket may depend on it; the ones beside it can be
worked before it.

Once the results are recorded and the tickets closed, a person starts the run
again. It picks up from the frontier as it stands, whether the last run stopped
at a person's ticket or was cut off partway through a batch. A result already
written is not written again.

## What the run reports

When no reachable ticket is left that the run can work, report:

- the batches worked, and the tickets in each;
- the tickets left to people, and what each needs;
- every contradiction found in a batch, each with both sides;
- every finding `review` raised inside the run's tickets, with the ticket it is
  on.

A ticket too large to work means the spec is too large. Say so rather than
working part of one.

## Closing the spec

Close the spec when all its work is finished and its acceptance is met: every
ticket it was cut into is closed, and nothing `review` raised against them is
still open.

Do not close it on any other ground. Tickets left to people mean the work is
not finished yet, however few of them there are, and a contradiction means the
set is not settled yet. Leave the spec open and say what is still in the way.

The acceptance is what decides, not the number of tickets closed: a spec whose
tickets all closed with unmet acceptance has not finished.

## The project's records

How this project writes a record lives in `.work-weave/config/tracker.md`. Read
it before writing one.

## What this skill does not do

- Cut, merge, or re-cut tickets. That is `to-tickets`.
- Work a ticket whose blocker is unfinished.
- Rework a result someone else wrote, or settle a contradiction the batch
  reading found.
- Keep going once the frontier is nothing but people's tickets.
