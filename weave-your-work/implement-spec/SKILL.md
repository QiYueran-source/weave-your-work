---
name: implement-spec
description: "Work a whole spec in one run: read its tickets as a task graph, work the ones nothing blocks, and stop at the first ticket that is a person's."
disable-model-invocation: true
---

# Implement Spec

Work a whole spec in one run, instead of one ticket at a time.

`implement` does one ticket and stops. A person who has five tickets to get
through starts it five times. This starts once, and keeps going for as long as
the tickets keep coming.

## The spec

If the user passes a reference, read the spec and state its title before
starting. If no spec is named, ask which one. A run covers one spec.

## The task graph

The spec's tickets are not a list of steps. Read the tickets that came from the
spec, and the tickets that block them. What you are looking for is the set of
tickets with nothing unfinished in front of them: the tickets that can be
started now.

Work that set in dispatch order. Do not work the next one until the one before
it has finished, and do not work a ticket whose blocker is still open because it
looks small.

## Stop at a person's ticket

A ticket that is a person's stops the run. Say which ticket it is, what it asks
for, and that `hand-back` records the result once the work is done. Then stop.

Do not go around it. The tickets behind it may depend on it, and the ones beside
it are the person's to start when they can. A run that quietly skipped a
person's ticket and finished the rest has left the person with a spec that looks
done and is not.

Once the result is recorded and the ticket closed, a person can start the run
again. It picks up from the new set.

## Each ticket

Work every ticket the way `implement` does. What you have to work with, what is
out of reach, doing it, and closing it with a result: that is all `implement`,
and none of it is repeated here.

Read `implement` before the first ticket, and follow it for each one.

Close each ticket before starting the next. A ticket that is worked but not
closed still blocks everything behind it, and the run comes to a halt on its own
work.

## The project's records

How this project writes a record lives in `.work-weave/config/tracker.md`. Read
it before writing one.

## What this skill does not do

- Work in parallel. One ticket at a time, in the current working tree.
- Judge the spec, the tickets, or the cut. If a ticket is too large, or two
  tickets cannot both be worked, say so and stop.
- Work a ticket whose blocker is open. The blocking edge is what makes the
  order.
