---
name: implement-spec
description: "Work a whole spec in one run: work each batch of its frontier at once by calling implement for every ticket, let a merger settle what the batch's results say together, and close the batch's tickets once it has."
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

Do not work a ticket whose blocker is still open because it looks small or easy.

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

## Each ticket

Work every ticket by calling the Skill tool with `implement`. Not by following
its rules from memory, and not by restating them here: `implement` is what knows
how a ticket is worked, and a second copy of that would drift from it.

One ticket is one call. A subagent that works a ticket ends when that call
returns: it does not work the ticket next to it and does not start the run.

**A ticket worked in a batch is not closed by the call.** `implement` writes the
result and stops there; the batch closes the tickets, once the merger has read
them. A ticket closed before the batch is read is a ticket whose result nobody
has looked at yet.

## The merger

When every subagent in the batch has returned, hand their results to a merger.

The merger is not a git merge. Nothing is being combined into one file, and
there is no conflict for a tool to report. The merger reads the batch's results
together and says what they amount to:

- do they contradict each other;
- was the same thing done twice;
- do they hold together as one body of work, or do they need someone to choose.

A small difference, such as two ways of saying one thing, is settled in the
merger's own line with its reason. A contradiction is stated with both sides and
left for someone to choose, rather than being settled on the reader's behalf.

The merger reports to this run, not to a person: the run is what carries the
result forward to the next batch and into the final report.

## Closing a batch

After the merger has reported, close the tickets worked in that batch. A ticket
whose result the merger contradicted is still closed: it was worked, and the
contradiction is a finding about the set, not a failure of that ticket.

Then work out the frontier again. A ticket becomes reachable when its blockers
are closed, so closing the batch is what moves the frontier on.

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
at a person's ticket or was cut off partway through a batch.

## What the run reports

When no reachable ticket is left that the run can work, report:

- the batches worked, and the tickets in each;
- the tickets left to people, and what each needs;
- every contradiction the merger found, each with both sides;
- every finding `review` raised inside the run's tickets, with the ticket it is
  on.

A ticket too large to work means the spec is too large. Say so rather than
working part of one.

## The project's records

How this project writes a record lives in `.work-weave/config/tracker.md`. Read
it before writing one.

## What this skill does not do

- Cut, merge, or re-cut tickets. That is `to-tickets`.
- Work a ticket whose blocker is open.
- Rework a result someone else wrote, or settle a contradiction the merger
  found.
- Keep going once the frontier is nothing but people's tickets.
