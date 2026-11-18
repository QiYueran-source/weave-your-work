---
name: implement-spec
description: "Work a whole spec in one run: work its tickets in the order their blocking edges allow by calling implement for each, read each finished result against the ones before it, and stop at the first ticket that is a person's."
disable-model-invocation: true
---

# Implement Spec

Work a whole spec in one run, instead of one ticket at a time.

`implement` does one ticket and stops. A person who has five tickets to get
through starts it five times. This starts once, and keeps going for as long as
the tickets keep coming.

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

Work the frontier in dependency order. Do not work a ticket whose blocker is
still open because it looks small or easy. Tickets that share no edge may be
worked in any order.

## Each ticket

Work every ticket by calling the Skill tool with `implement`. Not by following
its rules from memory, and not by restating them here: `implement` is what knows
how a ticket is worked, and a second copy of that would drift from it.

One ticket is one call, and it returns before the next one starts. Close it
before starting the next: a ticket worked but not closed still blocks everything
behind it, and the run stops on its own work.

## Run the tickets in subagents

Where the project provides subagents, work each ticket in one. Where it does
not, work them in this window. Judge that against what the project actually has.

Each subagent starts with a fresh context window, and its task is one ticket: it
works that ticket by the same call, and it neither works the ticket next to it
nor starts the run.

## Read the finished results together

After each ticket is finished, read its result beside the results already
finished. Two questions:

- Do the results contradict each other?
- Was the same thing done twice?

This is the counterpart of the merger: two results can each be right and wrong
together, and nothing in the record will say so.

Report, and do not act. A small difference, such as two ways of saying one
thing, is settled in one line with its reason. A contradiction is stated with
both sides and left for someone to choose. Write nothing: no record, no ticket,
no result.

A contradiction does not stop the run. The tickets after it may be unaffected,
and it carries to the final report. Stopping would trade a possible second
problem for a certain lost batch.

## Stop at a person's ticket

A ticket that is a person's stops the run, because `implement` stops at one. Say
which ticket it is, what it asks for, and that `hand-back` records the result
once the work is done. Then stop.

Do not go around it. The tickets behind it may depend on it, and the ones beside
it are the person's to start when they can. A run that quietly skipped a
person's ticket and finished the rest has left the person with a spec that looks
done and is not.

Once the result is recorded and the ticket closed, a person starts the run
again. It picks up from the frontier as it stands.

## What the run reports

When nothing on the frontier is left that the run can work, report:

- the frontier worked, in the order it was worked;
- the tickets left to people;
- every contradiction found, each with both sides.

A ticket too large to work means the spec is too large. Say so rather than
working part of one.

## The project's records

How this project writes a record lives in `.work-weave/config/tracker.md`. Read
it before writing one.

## What this skill does not do

- Cut, merge, or re-cut tickets. That is `to-tickets`.
- Work in parallel. One ticket at a time, in the current working tree.
- Repair anything the reading finds, or rework a result someone else wrote.
- Keep going past a person's ticket, however small the rest looks.
