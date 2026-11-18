---
schema: 1
id: wm-n5wyafybvx25
title: 'Implement-spec: work a spec''s frontier, and read the results together'
category: spec
status: open
owner: frank
creator: frank
created_at: 2026-11-18T07:49:48Z
updated_at: 2026-11-18T08:08:36Z
---
## Problem Statement

`implement` does one ticket. Ten tickets cut from one spec means ten runs, and
nothing carries the account of what the first nine left behind into the tenth.

Matt answers this with `implement-spec`: it reads the tickets as a task graph,
runs implementer subagents across the ready frontier, lands everything on an
integration branch, and merges each result in with a merger subagent. Most of it
is about branches and worktrees. A `git merge` conflict is discovered by the tool
and settled by a person or an agent; the branch is what makes parallel work safe.

Office work has no branches to merge and no worktree to isolate a run. But the
problem the merger exists for is real and has no tool to catch it: two tickets
worked separately can leave results that contradict each other, and nothing in a
file will say so. In a codebase, two agents editing different files merge
cleanly even when their changes together are wrong. Here they edit the same
records, and the same silence applies.

So there are two gaps. Nobody works a spec's tickets in order without being
asked each time, and nobody reads the tenth ticket's result against the first
nine.

## Solution

A skill a person runs on a spec's tickets: it works them in the order their
blocking edges allow, works each one by calling `implement`, reads each finished
result against the ones already finished, and reports what it sees.

It works the frontier: every ticket whose blockers are done. A ticket that is a
person's stops the run at that ticket, because `implement` stops at one, and the
person is told rather than skipped over.

After each ticket is finished, its result is read beside the results already
finished. Two things are reported: whether the results contradict each other, and
whether the same thing was done twice. Its judgement is stated in the report, in
one line for a small difference such as two ways of saying one thing, and in full
for a contradiction that needs someone to choose. Nothing is written: the reading
takes no records, edits no ticket, and changes no result.

When every reachable ticket is finished, the run reports the frontier it worked,
the tickets it left to people, and the contradictions it found.

## User Stories

1. As a person holding a spec, I want its tickets worked in the order their
   blocking edges allow, so that I do not have to name each one.
2. As a person holding a spec, I want the run to stop at a ticket that is a
   person's, so that work does not depend on a ticket nobody has done yet.
3. As a person holding a spec, I want to be told which tickets are waiting on me,
   so that I can do them and start the run again.
4. As an agent working a ticket in a run, I want the same rules as a single-ticket
   run, so that one way of working covers both.
5. As a person who asks for a run on a spec that has no tickets, I want to be told
   to cut them first, so that I do not get a run that invents its own tickets.
6. As a person reading the run's report, I want each finished result read against
   the ones already finished, so that a contradiction is found while it is still
   cheap.
7. As a person reading the run's report, I want a contradiction stated with both
   sides, so that I can choose rather than investigate.
8. As a person reading the run's report, I want a small difference settled with
   one line and a reason, so that I am not asked to decide things that need no
   decision.
9. As a person reading the run's report, I want the same thing done twice
   reported, so that I can take one of the two.
10. As a person reading the run's report, I want the frontier that was worked
    named, so that I know what the run covered.
11. As a person reading the run's report, I want the tickets left to people named,
    so that I know what remains before the spec is done.
12. As a person whose record the run touched, I want nothing written by the
    reading, so that a report never leaves me a diff to reconcile.
13. As a person running a spec a second time, I want it to pick up where the last
    run stopped, so that finishing a person's ticket is enough to continue.
14. As a person with a spec whose tickets do not fit one run, I want the run to
    say so rather than stopping silently, so that I know the spec is too large.
15. As a person reading the set, I want the batch skill to work a ticket by
    calling the single-ticket skill, rather than holding a second copy of its
    rules, so that the two cannot drift apart.
16. As a person who chose to run without subagents, I want that to be allowed, so
    that the run does not require a tool the project may not have.

## Implementation Decisions

**The unit is one spec.** The skill takes a spec and works the tickets cut from it.
It does not work across specs.

**The tickets already exist.** `to-tickets` is what cuts them, and it is a separate
skill a person runs first. When the run is given a spec with no tickets under it,
it says so and names `to-tickets`; it does not cut the tickets itself. This is
Matt's division and it is kept: a run that cuts its own tickets makes the tickets
it can work rather than the tickets the work needs.

**It works the frontier, in dependency order.** A ticket is reachable when its
blocking edges are all finished. Tickets with no edge between them may be worked
in any order.

**A ticket is worked by calling `implement`.** Not by restating its rules: the run
calls `implement` for the ticket and lets it do what it does. A copy would drift,
and the two must always agree. This is the counterpart of Matt's implementer
subagents each calling `tdd`.

**A person's ticket stops the run.** `implement` stops at such a ticket, so the run
stops too. The report names the tickets left to people.

**After each ticket, the finished results are read together.** The read answers two
questions: do the results contradict each other, and was the same thing done
twice. This step is the counterpart of the merger, which exists upstream because
two changes can be each correct and wrong together.

**The read reports and does not act.** A small difference, such as two ways of
saying one thing, is settled in one line with its reason. A contradiction is
stated with both sides and left for someone to choose. Nothing is written: no
record, no ticket, no result.

**A contradiction does not stop the run.** The tickets after it may be unaffected,
and the contradiction is carried to the final report. Stopping would trade a
possible second problem for a certain lost batch.

**The skill is called by a person only.** It is the whole-spec path, and starting
one is a decision a person makes. Nothing else in the set calls it.

**`implement` may be called by a model.** The run has to reach it, and a harness
that hides a skill from other skills would make the run impossible. A ticket is
still one run of `implement`, so nothing about a single-ticket run changes.

**Subagents are optional.** Where the project provides them, a ticket may be worked
in one. Where it does not, the run works tickets in the same window. The decision
is the agent's, judged against what the project has.

**The final report carries three things.** The frontier worked, the tickets left
to people, and every contradiction found, each with both sides.

**A second run continues.** It starts from the frontier as it stands, so finishing
a person's ticket and starting the run again is the whole resumption.

**A ticket too large to work is a finding about the spec.** When the tickets do not
fit one run, the report says so rather than working part of one.

## Acceptance

The delivery is a new batch skill, and a reader can tell it was delivered when a
spec's tickets can be worked in dependency order through the frontier, each
result read beside the ones before it, with a report that names what was worked,
what waits on people, and where the results disagree.

Its parts: the unit is one spec; a spec with no tickets is refused with
`to-tickets` named; the order is the frontier by blocking edges; a ticket is
worked by calling `implement` and its rules are not copied; a person's ticket
stops the run; the read after each ticket looks for contradiction and repetition;
the read writes nothing; a contradiction does not stop the run; and the final
report carries the three lists.

The reading is the check, plus one run over a spec whose frontier is a single
chain: the report names the chain, and names any person's ticket it stopped at.

## Out of Scope

- Cutting tickets. That is `to-tickets`, and the run refuses without it.
- Reproducing the merger. It settles a git conflict; this skill's read has no
  conflict to settle, only a contradiction to report.
- Branches, worktrees, and integration. Office work has none.
- The `tdd` call, which `implement` no longer makes either.
- Calling review. Review is its own skill and takes a spec, not a run.
- Working tickets across several specs.
- Repairing a contradiction the read finds.

## Further Notes

Matt's `implement-spec` is nine steps, and four of them are about git: create the
branch, merge each result in, keep the batches green, clean the worktrees. What
survives is the shape: read the graph, work the frontier, and keep what the
finished work says consistent with what was already finished.

The merger there is a subagent because implementing is parallel and conflicts must
be settled as they arrive. Here the run is serial, a ticket at a time, so the read
is a step rather than a second arranger.

Matt's `implement-spec` takes tickets and only tickets; `to-tickets` is a separate
skill with its own entry, and nothing in the run cuts a ticket. That is kept as it
is. Upstream each implementer calls `tdd`; here each ticket is a call to
`implement`, which is where the run's rules live.

The rule that the run must not copy `implement`'s rules is the same rule that
keeps `to-tickets`'s four parts in one place: two copies of a rule drift, and the
one read less often is the one that is wrong.
