---
schema: 1
id: wm-qmar7z6vvbyn
title: 'Implement: survey what the project can do, stop at a person''s task, and hand the result back'
category: spec
status: closed
owner: frank
creator: frank
created_at: 2026-11-17T13:52:00Z
updated_at: 2026-11-18T07:53:17Z
closed_at: 2026-11-18T07:53:17Z
---
## Problem Statement

`implement` is Matt's, unedited, and it is nine lines long. Four of them are
about code. It drives `tdd` at pre-agreed seams, runs typechecking, runs single
test files, runs the full test suite, and closes by calling `code-review`.

None of that survives, and one of the pieces is not ours to keep. `tdd` is a
named practice, red then green, and its vocabulary of seams comes from a
skill this set does not carry. General work has no single practice to drive: one
piece of work starts from an outline, another from a sample, another from a
prototype. Naming one practice would fit a minority of the work and mislead on
the rest.

What replaces it has to answer a question Matt did not have. Every ticket in his
set is worked by an agent, so a ticket is always something the agent can pick up.
Here, a great many tasks are a person's to do, and the moment an agent reaches one
of those it has nothing to do: the ticket is not its own, and every ticket after
it may be waiting on that person's answer.

The last gap is what happens next. The person goes away, does the work, and comes
back with a sentence like "I checked the labels and asked the supplier". They do
not have the ticket's identifier, and nothing in the set turns that sentence into
a written result and a closed ticket. The result is the only trace a hand-done
task leaves, so if nothing records it, the work is invisible to whoever reads the
tickets next.

## Solution

`implement` shrinks to what it alone can decide, and what it cannot do becomes a
second skill.

An agent does not arrive with a fixed toolset. Before starting, it surveys what
this project has given it: the skills installed, the MCP servers, the interfaces,
the command line. It works with what is there, says plainly when something is
beyond it, and when the person names a tool or a skill, that one wins. Nothing is
named inside the skill, because the list is the project's, not this set's.

When the ticket ahead is a person's, the agent stops at it, says which ticket it
is and what it asks for, and mentions that the person can run `hand-back` when it
is done. The agent does not move on to later tickets: they may depend on the one
it stopped at.

`hand-back` is new. Our own, not Matt's. A person runs it after doing the work and
describes what they did. The skill works out which ticket they mean by reading
what the tickets ask for, not by matching words, and when the meaning fits more
than one ticket it lists them and asks rather than choosing. It then reads the
ticket's acceptance and asks the person what the ticket needs to know, so the
person is told what to answer instead of being left to guess how much to write. It
writes the answer into the ticket's result, closes the ticket, and says which
ticket comes next.

## User Stories

1. As an agent starting a ticket, I want to know what tools this project has given
   me, so that I use them instead of working around them.
2. As an agent starting a ticket, I want to say plainly when something is beyond
   the tools I have, so that I do not pretend a task was done.
3. As a person who names a tool, I want the agent to use that tool, so that my
   instruction is not overridden by its preference.
4. As an agent reaching a ticket that a person must do, I want to stop and say so,
   so that I do not do work that is not mine.
5. As an agent reaching a ticket that a person must do, I want to not continue to
   later tickets, so that work does not run ahead of a ticket it may depend on.
6. As a person told to do a ticket, I want to know which ticket it is and what it
   asks for, so that I can get on with it without searching.
7. As a person told to do a ticket, I want to be told how to record what I did, so
   that the work I have already done is not lost.
8. As a person who has finished work, I want to say what I did in my own words, so
   that I am not filling in a form with fields I have to guess at.
9. As a person who has finished work, I want the skill to work out which ticket I
   mean, so that I do not have to look up its identifier.
10. As a person who has finished work, I want to be asked to confirm the ticket,
    so that my result is not written into the wrong one.
11. As a person who has done two things, I want to be shown both tickets and to
    pick, so that the skill does not choose for me.
12. As a person describing work that matches no ticket, I want to be told so, so
    that I can correct myself or open a ticket that is missing.
13. As a person recording a result, I want to be told what to answer, so that I
    know what the next ticket will need from me.
14. As a person recording a result, I want to be asked at least one round of
    questions, so that what I write is enough for someone else to act on.
15. As a person whose ticket's acceptance is vague, I want the skill to ask what
    the ticket was meant to achieve, so that I am not blocked by a poorly written
    ticket.
16. As a person who finished a ticket, I want the ticket closed once the result is
    written, so that the next reader knows it is done.
17. As a person who finished a ticket, I want to be told which ticket is next, so
    that I can start the agent again without working out the order myself.
18. As a person returning to the project, I want one ticket recorded per run, so
    that results do not get mixed between tickets.
19. As a reader of a finished ticket, I want the result in the shape the ticket
    asked for, so that I can point at what was left behind.
20. As a reader of the set, I want the skills that describe doing work to carry no
    word for a practice this project may not use, so that the set applies to work
    that is not software.
21. As an agent, I want to never run `hand-back` on my own behalf, so that a
    result in a ticket is always something a person actually did.
22. As a person holding a list of tickets, I want the person's tickets to be
    visible as waiting on me, so that the queue of my own work is not hidden among
    agent tasks.

## Implementation Decisions

**`implement` keeps its name and its job.** It does the work a ticket or a spec
describes. What it stops doing is naming how.

**Its steps become five.** Know which ticket, survey what the project offers,
judge whether it can be done, do it, record the result and close it.

**Surveying the tools comes before judging the work.** The survey covers the
skills installed, the MCP servers, the interfaces, and the command line. A tool
the person named is used ahead of the agent's own preference.

**Being unable to do something is stated before starting, and again if it turns
up midway.** The first is preferred: the cost of saying so early is lower than the
cost of saying so after half the work.

**A person's ticket stops the agent.** It says which ticket it is, what the
ticket asks for, and that `hand-back` records the result. It does not continue to
later tickets, because they may depend on the stopped one.

**`tdd` is not replaced by anything.** No practice is named. The ticket says what
to do; how to do it is the project's business.

**The checks leave.** Typechecking, single test files, and the full test suite
describe a codebase. Nothing takes their place.

**`code-review` leaves, and review is deferred.** The place it held, after the
work and before closing, is where a review will go. Nothing is decided about it
here.

**`hand-back` is a new skill of this set, not a port.** It has no counterpart
upstream.

**Its first act is to work out which ticket is meant.** It reads what the
tickets ask for and judges by meaning, not by matching words: someone who says "I
asked the supplier" is answering a ticket that says "confirm the quote". One match
is stated back for confirmation, several are listed for the person to pick, and no
match is said plainly.

**It then asks what the ticket needs to know.** The questions are derived from the
ticket's acceptance, so the person is told what to answer. When the acceptance is
too vague to derive a question, it asks what the ticket was meant to achieve.

**One round at least.** The person is asked, not left to write unprompted.

**One ticket per run.** When a person describes two finished tasks, the skill
says so and takes one first.

**The result goes where the ticket asks for it**, in the shape the ticket
defines, then the ticket is closed, then the next ticket is named.

**`hand-back` is invoked by a person.** It is marked so a model does not reach for
it. This is stated in the description; nothing enforces it, as with every other
rule in this set that the tools do not carry.

**`to-tickets` gains one line.** A task a person does says its result is recorded
by `hand-back`, so the ticket itself names how it comes back.

## Acceptance

The delivery is a rewritten `implement`, a new `hand-back`, and one added line in
`to-tickets`. A reader can tell it was delivered when the set has a skill that
does the work and a skill that takes a person's finished work back into the
tickets, and when neither names a practice, a seam, a test suite, or a review
skill.

Its parts: `implement` surveys the project's tools, judges the work, stops at a
person's ticket without continuing, and closes a finished ticket with a result.
`hand-back` finds the ticket by meaning, asks at least one round, writes the
result, closes, and names the next. `to-tickets` points a person's ticket at
`hand-back`. A grep across the three skills returns nothing for `tdd`, `seam`,
`typecheck`, or `code-review`.

## Out of Scope

- Review, and where it happens. The slot is named and left empty.
- `implement-spec` and running many tickets in parallel. It is not ported.
- The ownership rule, which belongs in the rules rather than in a skill.
- Changing how a person's ticket is marked. `to-tickets` already settled that.
- Any change to `to-spec`.

## Further Notes

`hand-back` exists because this set allows a ticket to be a person's, which
Matt's set does not. Every rule it carries comes from that difference: the ticket
must be found rather than passed in, the result must be asked for rather than read
off a diff, and the next ticket must be found again by whoever picks the work up.

The shortest honest version of `implement` is close to a shell. Its real content
is the two decisions an agent cannot make for itself: what this project allows it
to do, and whose ticket the one ahead is.
