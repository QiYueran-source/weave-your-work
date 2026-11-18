---
schema: 1
id: wm-n5wyafybvx25
title: 'Implement-spec: work a spec''s frontier in batches, and close each one after the merger reads it'
category: spec
status: closed
owner: frank
creator: frank
created_at: 2026-11-18T07:49:48Z
updated_at: 2026-11-18T09:07:03Z
closed_at: 2026-11-18T09:07:03Z
---
## Problem Statement

`implement` does one ticket. Ten tickets cut from one spec means ten runs, and
nothing carries the account of what the first nine left behind into the tenth.

Matt answers this with `implement-spec`: it reads the tickets as a task graph,
runs implementer subagents across the ready frontier, lands everything on an
integration branch, and merges each result in with a merger subagent. Most of it
is about branches and worktrees. A `git merge` conflict is discovered by the
tool and settled by a person or an agent; the branch is what makes parallel work
safe.

Office work has no branches to merge and no worktree to isolate a run, so none
of that machinery survives. But the two problems it exists for are real here.
Nobody works a spec's tickets in order without being asked each time, and nobody
reads the tenth ticket's result against the first nine: two results can each be
right and wrong together, and nothing in a file will say so.

Concurrency is still worth having, and it is a different thing here. Nothing is
being written into one working tree by several hands at once; a batch of tickets
is several calls to services, several searches, several reports, each keeping
its own record. That needs no branch. It does need something to read the batch's
results together before anyone treats them as done.

## Solution

A skill a person runs on a spec: it works each batch of the frontier at once by
calling `implement` for every ticket in it, reads the batch's results together,
closes the batch, and goes on to the next one. When the spec's work is finished
and its acceptance is met, it closes the spec.

The frontier is a batch, not a queue. Tickets with no edge between them are
worked at the same time.

A ticket worked in a batch is not closed by its call. `implement` writes the
result and returns; the batch closes its tickets after the results have been
read together. A ticket closed before its batch is read is a ticket whose result
nobody has looked at.

The run reads the batch itself. Nothing is being combined into a file and there
is no conflict for a tool to report; what the run needs is one reader of what
the batch amounts to. That is Matt's merger, minus the subagent. It settles
small differences in one line, states contradictions with both sides, and closes
the batch, which is what moves the frontier on.

The run stops when the next frontier holds nothing an agent can do: only tickets
that are a person's. A person's ticket on the way does not stop a batch, and
does not get skipped over; it waits for the next batch, and the run stops when
it is all that is left.

## User Stories

1. As a person holding a spec, I want its frontier worked a batch at a time, so
that a spec of ten tickets is not ten waits. 2. As a person holding a spec, I
want the batch's results read together before its tickets are closed, so that a
contradiction is found while it is cheap. 3. As a person reading the run's
report, I want a contradiction stated with both sides, so that I can choose
rather than investigate. 4. As a person reading the run's report, I want a small
difference settled with one line and a reason, so that I am not asked to decide
things that need no decision. 5. As a person holding a spec, I want the run to
stop when only my tickets are left, so that I am told what waits on me rather
than being skipped. 6. As a person holding a spec, I want one of my tickets on
the way not to stop the run, so that the tickets beside it still get worked. 7.
As a person reading the run's report, I want the batches and their tickets
named, so that I know what the run covered. 8. As a person reading the run's
report, I want the findings review raised inside the run's tickets, so that a
reading nobody saw does not get lost. 9. As an agent working a ticket in a
batch, I want the same rules as a single-ticket run, so that one way of working
covers both. 10. As a person running a spec a second time, I want it to pick up
from the frontier as it stands, so that finishing a ticket and starting again is
the whole resumption. 11. As a person whose run was cut off partway through a
batch, I want the tickets already worked to keep their results, so that the work
is not thrown away. 12. As a person who asks for a run on a spec that has no
tickets, I want to be told to cut them first, so that I do not get a run that
invents its own. 13. As a person reading the set, I want the batch skill to work
a ticket by calling the single-ticket skill, rather than holding a second copy
of its rules, so that the two cannot drift apart.

## Implementation Decisions

**The unit is one spec.** The skill takes a spec and works the tickets cut from
it. It does not work across specs.

**The tickets already exist.** `to-tickets` cuts them and is a separate skill a
person runs first. Given a spec with no tickets, the run says so and names
`to-tickets`; it does not cut them itself. This is Matt's division, kept: a run
that cuts its own tickets makes tickets it can work rather than tickets the work
needs.

**The frontier is a batch.** Every ticket with no unfinished blocker is worked
at the same time. Where the project provides subagents, one ticket per subagent,
each in a fresh context window; where it does not, the same window, one after
another.

**Concurrency needs no branch.** The batch is several tickets being worked at
once while each keeps its own record: calls to services, searches, reports.
Worktrees and integration branches exist to keep several writers out of one file
tree, and there is no file tree here to protect. What concurrency does need is
someone to read the batch together, and that is the merger.

**A subagent writes only its own ticket's record.** Nothing isolates a batch:
there is no worktree between two subagents, and a tracker that takes the last
write wins says nothing about the other writer. So the brief carries a map of
the work before anything else: read the spec's tickets and the tickets around
them and say which is yours; leave every other record alone, the spec and other
operators' records included; do not work another ticket even to unblock your
own. It also carries a rule for what appears while it works: decide whether it
came from another task and say so, then leave it either way, without editing,
closing, reverting, or building on it. Close nothing, and say which record and
what stopped you when you stop early. The batch's reading is where two accounts
of one thing get reconciled, and a second writer is not that.

**A ticket is worked by calling `implement`.** Not by restating its rules: the
run calls `implement` for the ticket and lets it do what it does. This is the
counterpart of Matt's implementer subagents each calling `tdd`.

**A batched ticket is not closed by its call.** `implement` writes the result
and returns. The batch closes its tickets once the merger has read them. Closing
before the read would make the frontier advance on tickets nobody had looked at.

**The batch is read by the run, not by a separate agent.** The run reads the
batch's results together and states what they amount to: contradictions with
both sides, small differences settled in one line, repetition named. Nothing is
reported to a person at this point, and contradictions are left for someone to
choose. Matt's merger is a subagent because his implementers run in parallel
worktrees and their merges have to be settled as they arrive; here the run is
already the one holding the batch's results, so a second agent would add a hop
without adding a reader.

**Closing the batch moves the frontier.** A ticket becomes reachable when its
blockers are closed, so the run closes a batch and then works out the next
frontier. This is also where a blocked ticket learns it is unblocked.

**The run is bound by the same rules it gives a subagent.** Close only the
tickets the batch worked, and only ones that finished and wrote their result. A
ticket whose subagent stopped early stays on the frontier and is picked up by
the next batch. A ticket the reading contradicted is closed like any other, and
nothing else is edited or closed on the strength of the reading. A ticket tried
in two batches that did not finish either time is not tried a third: it is
reported with what stopped it each time, and left out of the frontier.

**A person's ticket in a batch is set aside.** It is not worked and not passed
over: it stays on the frontier. The run stops when the next frontier holds
nothing but such tickets.

**The skill is called by a person only.** Starting a run is a decision a person
makes. Nothing else in the set calls it.

**`implement` may be called by a model.** The run has to reach it. A ticket is
still one run of `implement`, so nothing about a single-ticket run changes
except who closes it.

**The final report carries four things.** The batches and their tickets, the
tickets left to people, every contradiction with both sides, and every finding
`review` raised inside the run's tickets.

**A second run continues.** It starts from the frontier as it stands, whether
the last run stopped at people or was cut off partway through a batch. Results
already written are not rewritten.

**A ticket too large to work is a finding about the spec.** The run says so
rather than working part of one.

**The spec closes when its work is finished and its acceptance is met.** Every
ticket it was cut into is closed, and nothing `review` raised against them is
still open. Tickets left to people mean it is not finished, however few; a
contradiction means the set is not settled. The count of closed tickets does not
decide it: a spec whose tickets all closed with unmet acceptance has not
finished.

## Acceptance

The delivery is a batch skill, and a reader can tell it was delivered when a
spec's frontier can be worked a batch at a time, each batch read before its
tickets close, with a report naming the batches, the people's tickets, the
contradictions, and the review findings, and when a finished spec closes itself
and an unfinished one does not.

Its parts: the unit is one spec; a spec with no tickets is refused with `to-
tickets` named; the frontier is a batch worked at once; a ticket is worked by
calling `implement` and the call does not close it; the run reads the batch and
closes its tickets, which moves the frontier; the run stops only when the
frontier is nothing but people's tickets; the report carries the four lists; and
the spec closes only when every ticket is closed and nothing review raised is
still open.

The reading is the check, plus one run over a spec whose frontier is a single
chain: the run takes one batch of one ticket at a time, names each batch, and
stops at the person's ticket.

## Out of Scope

- Branches, worktrees, and integration. There is no file tree to protect.
- Cutting tickets. That is `to-tickets`, and the run refuses without it.
- Settling a contradiction the merger finds.
- Working tickets across several specs.
- Reworking a result someone else wrote.

## Further Notes

Matt's `implement-spec` is nine steps, and four are about git: create the
branch, merge each result in, keep the batches green, clean the worktrees. What
survives is the shape: read the graph, work the frontier at once, and keep what
the finished work says consistent with what was already finished.

His merger settles conflicts as they arrive; the run here reads a batch once it
has all come back, because nothing is landing in one place and there is no
conflict to report. Both exist for the same reason: two results can each be
right and wrong together.

The order changed once already. The first version was serial and stopped at the
first ticket that was a person's, which is what makes sense when one ticket is
worked at a time. Batches make that rule wrong: one person's ticket would hold
back every ticket beside it. The run now sets those aside and stops when they
are all that is left.

Matt's `implement-spec` takes tickets and only tickets; `to-tickets` keeps its
own entry, and nothing in the run cuts a ticket. That is kept as it is. Upstream
each implementer calls `tdd`; here each ticket is a call to `implement`, which
is where the rules live.
