---
name: review
description: "Read a spec's finished tickets on two axes: whether each result meets its own acceptance, and whether the work addresses the problem the spec names."
disable-model-invocation: true
---

# Review

Read a spec's finished tickets and report what the reading finds. Change
nothing while reading.

`implement` calls this once a ticket's result is written, before it closes the
ticket. A person can also run it over a spec whose tickets are all done.

A document edited in place leaves no record of the edit, and a system going
live changes a state, not a file, so there is nothing to take a fixed point
from. What is left is the pair a ticket already states: its acceptance when it
was cut, and its result when it was finished.

## The material

Read the spec and the tickets cut from it. The spec states the problem the work
was for; each ticket states what it asked for and what it left behind.

If there is no spec, say so and stop: without it the second axis cannot run, and
a one-axis reading presented as a whole one is worse than no reading.

## Axis A: the result against the acceptance

Take each ticket's acceptance lines one at a time and judge each against that
ticket's result. A line is one of three things:

- **met**: the result is the thing the line asked for;
- **unmet**: the result is there and is not that thing;
- **not judgeable**: the result does not say enough to decide.

Not judgeable is a finding, not a pass. A result the reader cannot check has
failed at the one job the result has.

A ticket closed with no result at all is a finding of its own. Silence reads
as a pass to someone who was not looking.

## Axis B: the work against the problem

Ask two questions of the whole set:

- Does the result address the problem the spec's Problem Statement names?
- Does the spec ask for things the problem does not require?

The second is scope creep, and it is a finding even when everything asked for
was delivered. Work that does more than the problem needs has gone where the
spec did not send it, which is the same failure as work that answers the wrong
problem.

## Three smells

Under both axes, three things are worth reporting, and only these three. They
describe records, not code, and each is a judgement call rather than a rule:

- **A name that does not say what the thing is.** The reader has to open the
  record to learn what it is for.
- **The same thing written twice for the same reader.** Two copies will drift,
  and the one read less often is the one that will be wrong.
- **One record carrying unrelated things.** It is half read, and it is cut
  rather than skimmed.

A copy written for a different reader is not duplication. A rule repeated in
several skills so each reads on its own is there on purpose.

The other nine of Matt's twelve describe code structure: a subclass, a method
reaching into another object's fields. There is no office equivalent of a
subclass, and a rule that cannot be judged by reading does not belong in a
review made of reading.

## Every finding names three things

A finding is not usable unless the reader can go and check it. Each one names:

- the ticket it is on, or the spec line it is about;
- who worked it: an agent that ran `implement`, or the person who did it and
  recorded it with `hand-back`;
- whose it is to fix. A finding on an agent's ticket is the caller's to
  dispatch. A finding on a person's ticket is that person's, because the result
  is theirs.

Quote the line the finding rests on. A judgement a reader cannot check is a
judgement they have to trust.

## The report

Report the two axes under separate headings. Under each, its findings and a
one-line summary: how many, and the worst one.

Do not merge the axes, and do not rank them against each other. A result can
meet every acceptance line and still be the wrong work; it can be exactly the
right work written so badly that nobody can use it. One number hides one of
those.

## What review does not do

- Write, edit, close, or open anything. A review is a reading, and reading never
  leaves a trace to reconcile.
- Repair what it finds. Fixing belongs to whoever read the report.
- Score the spec, or give a pass or fail on it.
- Read work that has no spec, beyond saying the spec is missing.
