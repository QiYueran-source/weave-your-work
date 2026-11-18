---
schema: 1
id: wm-kkpdm0hek877
title: 'Review: two axes over a spec''s finished tickets, and nothing changed by the reading'
category: spec
status: closed
owner: frank
creator: frank
created_at: 2026-11-18T07:44:20Z
updated_at: 2026-11-18T08:14:21Z
closed_at: 2026-11-18T08:14:21Z
---
## Problem Statement

There is no review in this set. `implement` used to close by calling Matt's
`code-review`, and that call was removed when `implement` was rewritten, leaving
a named slot and nothing to put in it.

Matt's `code-review` reads a diff between two commits and judges it on two axes:
whether it follows the repository's coding standards, and whether it implements
the originating spec. The whole skill is built on the diff. A diff is where a
codebase records what changed, and it is the material both axes are measured
against.

Office work has no diff. A document edited in place leaves no record of the edit;
a training run leaves nothing to compare; a system going live changes a state,
not a file. Taking a fixed point and reading forward has no counterpart.

Matt's Standards axis is the other half of the problem. It carries twelve code
smells from Fowler, and most of them describe code structure: a method reaching
into another object's fields, a class that only delegates, a subclass that refuses
its inheritance. There is no office equivalent of a subclass, and a rule that
cannot be judged is not a rule.

The last gap is whose work a finding belongs to. Matt's findings are all on code a
subagent wrote, so fixing them is always the same act. Here a finished ticket may
have been a person's, and the thing that needs fixing may be something only that
person can supply.

## Solution

Review one spec's finished tickets on two axes, and change nothing while reading.

**Axis A asks whether a ticket's result meets its acceptance**, line by line. The
ticket already states both: acceptance when it is cut, result when it is finished.
That pair is the material, and it takes the place the diff held.

**Axis B asks whether the result is the thing the spec was for**, and splits into
two questions: does the result address the problem the spec's Problem Statement
names, and does the spec ask for things nobody wanted. The second is Matt's
scope-creep finding promoted to a standing question, since a change that does more
than asked is a change that drifted.

The two axes stay separate and are reported separately, never merged or ranked,
for Matt's reason: a result can meet every acceptance line and still be the wrong
change, and it can be exactly the right change written badly.

The smells survive three of twelve, and only the ones a reader can judge by
reading: a name that does not say what it is, the same thing written twice where
the two copies are for the same reader, and one record carrying several
unrelated things.

Review reports and does not repair. Fixing belongs to whoever called the review,
as it does upstream, where `code-review` reports and the caller dispatches the
fix. One difference: a finding on a ticket a person worked is reported as that
person's to fix, because the result is theirs.

## User Stories

1. As a person who has just finished a spec's tickets, I want to know whether the
   results meet what the tickets asked for, so that I am not relying on the word
   "done".
2. As a person who has just finished a spec's tickets, I want to know whether the
   work addresses the problem the spec set out to solve, so that a finished set of
   tickets does not pass for a solution.
3. As a person reading a review, I want met and unmet acceptance lines told apart,
   so that I can see what is left rather than only that something is wrong.
4. As a person reading a review, I want a finding to quote the line it rests on,
   so that I can check the judgement instead of trusting it.
5. As a person reading a review, I want work done beyond what the spec asked for
   reported, so that scope creep does not pass as thoroughness.
6. As a person reading a review, I want the two axes kept apart, so that a pass on
   one does not cover a failure on the other.
7. As a person reading a review, I want the worst finding within each axis named,
   so that I know where to start without the two axes being played off each other.
8. As a person whose ticket was worked by an agent, I want a finding on it to be
   reported as mine to dispatch, so that I know I can have it fixed.
9. As a person whose ticket I worked myself, I want a finding on it to be named as
   mine to fix, so that the review does not ask an agent to redo or second-guess
   my work.
10. As a person reading a review, I want a ticket with no result to be reported
    rather than skipped, so that silence is not mistaken for a pass.
11. As a person reading a review, I want to be told when the spec is missing, so
    that I do not read a one-axis review as a two-axis one.
12. As a person whose work was reviewed, I want the review to change nothing, so
    that reading never leaves a trace I have to reconcile.
13. As a reader of a record, I want a name that says what the thing is, so that I
    do not have to open it to find out.
14. As a reader of a record, I want the same thing written twice for the same
    reader reported, so that the two copies do not drift apart.
15. As a reader of a record, I want one record carrying several unrelated things
    reported, so that it is cut rather than half read.
16. As a person who copied a rule into several skills on purpose, I want that
    copy not reported as duplication, so that the review does not undo a decision
    made for a reason.
17. As a person dispatching a fix, I want the findings in one report with the
    tickets named, so that I can hand each one to the right place.
18. As a person who reviews casually, I want review to work on a finished spec
    without a fixed point or a branch, so that it applies to work that leaves no
    diff.

## Implementation Decisions

**The material is one spec and its tickets.** A review is about a spec and the
tickets cut from it, each ticket's acceptance read against its result. No commit
range, no fixed point, no branch.

**Axis A judges acceptance line by line.** Each acceptance line is either met by
the ticket's result, unmet, or not judgeable from what the result says. The third
is reported, not treated as a pass.

**A ticket with no result is a finding, not a skip.** A ticket closed without a
result says nothing, and silence reads as a pass to someone who was not looking.

**Axis B asks two questions.** Does the result address the problem the spec's
Problem Statement names, and does the spec ask for things the problem does not
require. Findings on the second are scope creep, and they are findings even when
everything asked for is delivered.

**The axes are never merged or reranked.** Each axis is reported under its own
heading, with a one-line summary giving its count and its worst finding. No single
winner is chosen across the two.

**Three smells survive, and they are judgement calls.** A name that does not say
what the thing is; the same thing written twice where both copies serve the same
reader; one record carrying several unrelated things. The other nine describe code
structure and are dropped rather than translated. A copy written for a different
reader, such as a rule repeated in several skills so each reads on its own, is not
duplication.

**Every finding names the ticket it is on and who worked it.** A finding on an
agent's ticket is the caller's to dispatch. A finding on a person's ticket is
named as that person's to fix.

**Review changes nothing.** It writes no record, edits no file, and closes no
ticket. A review is a reading.

**The skill is called by a person.** It is reachable by a model, but a person
starts it. Neither `implement` nor `implement-spec` calls it, as neither does
upstream: dispatch lives with whoever reads the report.

**A missing spec is stated.** When there is no spec to read, the Spec axis cannot
run, and the report says so rather than presenting a single-axis result as a whole
one.

## Acceptance

The delivery is a new review skill, and a reader can tell it was delivered when
one spec's finished tickets can be read against their acceptance and against the
spec's problem, and the reading changes nothing.

Its parts: the material is a spec and its tickets, not a diff; the two axes are
reported under separate headings and never ranked together; three smells survive
and none of them describes code structure; every finding names its ticket and who
worked it; and no step writes, edits, or closes anything.

The reading is the check, plus one run: reviewing a spec whose tickets are all
closed produces two headed sections and a finding count per axis.

## Out of Scope

- Repairing anything the review finds. That is the caller's.
- What the caller is. A person starts review; no other skill calls it.
- Any grading, scoring, or pass/fail verdict on a spec.
- Reviewing work that has no spec, beyond saying the spec is missing.
- Storing the review as a record.
- The remaining nine code smells.

## Further Notes

The two axes settled the other way round from Matt's. He judges a diff against the
coding standards and against the spec; both are about the change. Here the first
axis became delivery against acceptance and the second became the result against
the problem, because the standards an office project has are its own rules rather
than a shared body of advice, and a change can land on every acceptance line while
answering the wrong problem.

Matt's scope-creep finding was the odd one out. It sat inside the Spec axis
between two other questions, and what it describes, doing more than was asked, is
the same failure as drifting from the problem: the work goes somewhere the spec
did not send it. It became a standing question on the second axis rather than a
smell.

The nine dropped smells were dropped for one reason, not nine: a rule that cannot
be judged by reading has no place in a review made of reading.
