---
schema: 1
id: wm-ncx0qj6w1xgx
title: 'to-spec: office-ready template, no tree, one operator per record'
category: spec
status: closed
owner: frank
creator: frank
created_at: 2026-11-17T08:07:18Z
updated_at: 2026-11-18T07:53:17Z
closed_at: 2026-11-18T07:53:17Z
---
## Problem Statement

`to-spec` in this set is an unedited copy of Matt's, and Matt wrote it for a code
repository. Five parts of it do not survive the move to office work.

The first step reads the codebase. There is no codebase to read, and the
instruction quietly tells the agent there is nothing else worth reading.

The second step asks the agent to name the seams it will test at. A seam is a
term from Matt's `codebase-design` vocabulary, where it means the boundary a
test crosses. Office work has no tests and no such boundary, so the step either
gets skipped or gets answered with something that sounds like a test and is not.

`Testing Decisions` asks what makes a good test, which modules will be tested,
and what the prior art for those tests is. An office task has no tests to make
this decision about.

The examples under `Implementation Decisions` are all code: modules,
interfaces, schema changes, API contracts. The section is still worth having, but
a reader who has never written a schema will not recognise their own work in it.

The separate problem is that nothing in the skill knows about more than one
person. One operator may write a spec that a colleague will carry, two operators
may write a spec at the same time, and neither case has a rule. The records do
carry an owner, but nothing in `to-spec` sets it or asks whether it should be
someone other than the writer.

## Solution

Keep Matt's seven sections. Change what they ask for, and who owns what.

The first step reads the project's current state instead of a codebase: the open
specs, the tickets, the glossary, the decision log, and any document the change
touches. The vocabulary the spec is written in comes from that read.

The second step becomes a question about the delivery: what is being handed over,
and how anyone will know it was handed over. It keeps two of Matt's three
constraints, translated. Accept the deliverable, not the step toward it, so the
unit is the paper handed in rather than the chapter written. Keep the judgement
to one line where possible. It drops the third, about preferring existing seams,
because it restates the first and presumes a seam exists.

`Testing Decisions` becomes `Acceptance`, and holds what the second step settled.

The examples under `Implementation Decisions` are replaced with office work. The
section still holds both what will be built and what was decided, because a
ticket cut from this spec needs both, and splitting them costs a reader two
places to look.

Two rules about ownership are stated. A spec has an owner, taken from the
person writing it unless they say otherwise. One operator writes only their own
records; taking over someone else's work is a transfer of ownership, made
visibly, not an edit under someone else's name.

No tree is introduced. A spec and the tickets cut from it are separate records
with no relation between them beyond the spec's identifier written in each
ticket's body. The tickets relate to each other only through hard dependencies.

## User Stories

1. As a person who has just finished a discussion, I want to turn it into a spec
   without being asked again, so that what we settled is written down before it
   is forgotten.
2. As a person who has just finished a discussion, I want the spec to use the
   words the project already uses, so that a reader does not have to learn a
   second vocabulary to read it.
3. As a person writing a spec, I want to read the project's records before
   writing, so that I do not describe a change that contradicts a decision
   already taken.
4. As a person writing a spec, I want to see which specs are already open, so
   that I do not write a second copy of one that exists.
5. As a person writing an office spec, I want the examples to be office work, so
   that I can recognise where my own material goes.
6. As a person writing a spec, I want to state what is delivered and how anyone
   will know it was delivered, so that a reader does not have to guess at the
   finish line.
7. As a person reading a spec, I want the delivery stated at the level of the
   finished thing, so that a chapter finished is not mistaken for a paper done.
8. As a person reading a spec, I want one line that says what "done" looks like,
   so that two readers do not disagree about whether it is finished.
9. As a person handing a spec to a colleague, I want the owner on the record, so
   that a reader knows who answers for it.
10. As a person writing a spec for someone else, I want to name that person as
    the owner, so that the record does not say I am answerable for work I am not
    carrying.
11. As an operator, I want a rule that I write only my own records, so that two
    people cannot quietly rewrite the same spec.
12. As an operator taking over a colleague's spec, I want the transfer to be a
    visible action, so that a reader can see who took it and when.
13. As a person cutting tickets from a spec, I want the spec and the tickets to be
    separate records with no tree between them, so that moving a ticket does not
    mean moving a parent.
14. As a person cutting tickets from a spec, I want each ticket to say which spec
    it belongs to, so that a reader can trace the work back.
15. As a person reading a list of tickets, I want their order to come from their
    dependencies alone, so that I do not have to reason about two kinds of
    relation at once.
16. As a person reading a spec, I want to know what was ruled out, so that I do
    not propose it again as new.
17. As a person reading a spec months later, I want it to describe what is
    delivered rather than where it lives, so that it still reads correctly after
    the file has moved.
18. As a person reading a spec months later, I want the decisions recorded with
    the alternatives that lost, so that I know what was already considered.
19. As a person who is told a spec is ready for an agent, I want to see that
    without a label to look up, so that the state of the record is the whole
    answer.
20. As a person writing a spec, I want the spec to record what it decided rather
    than a plan, so that a reader can tell a settled choice from an intention.
21. As a person writing a spec into an existing project, I want an empty section
    to stay empty rather than be filled with a sentence saying nothing, so that a
    reader can see what the discussion did not reach.
22. As a person writing a spec, I want the document to name who it affects, so
    that the people whose work changes hear about it.

## Implementation Decisions

**The skill keeps Matt's shape: three steps, then the template.** The steps
change; the count and order do not.

**Step 1 reads the project's current state.** The sources are the open specs and
tickets in the tracker, `GLOSSARY.md`, `ADR.md`, and any document the change
touches. The read is for three things: the vocabulary, the decisions already
taken, and whether a spec for this change already exists. An agent that has
already read them in this session does not read them again.

**Step 2 settles the delivery and its acceptance, and confirms both with the
person.** Two constraints carry over from Matt's seam rules, translated. The
first is that the delivery is judged at the finished thing, not at a step toward
it. The second is that the judgement is one line where possible. The third
constraint, preferring an existing seam, is dropped: office work has no seam to
prefer, and the instruction restates the first.

**The template keeps seven sections.** `Implementation Decisions` keeps its name.
`Testing Decisions` is renamed `Acceptance` and holds what step 2 settled. The
remaining five sections keep their names.

**`Acceptance` holds the delivery and its judgement.** One sentence naming what
is handed over, and one to three lines saying how a reader tells it was handed
over. It answers to the second step and nothing else.

**`Implementation Decisions` keeps both halves.** It holds what is built and what
was decided, in one section, because a ticket cut from the spec needs both and a
reader should not look in two places.

**Its examples become office work.** Seven code examples become six office ones:
what is being made and what will change around it; who is affected and how their
work changes; facts clarified from records, correspondence, or agreements;
practices settled, with the alternatives rejected and why; changes to what a
record holds, such as a new field or a new category; and agreements made with an
outside party. Matt's seventh, specific interactions, is dropped: it describes
who calls whom, which office work expresses as a change to someone's work, and
that is already the second example.

**The ban on locations stays, and the reason broadens.** A spec body does not
name a place. Matt's reason is that the place changes. A second reason applies
here: the place may not be available to the reader at all. So the spec says what
is to be obtained, not where it sits. Skill text is the opposite case and does
name places, because a skill that does not say where a file lives makes the agent
guess.

**The exception is a concrete shape, not a code snippet.** When a shape says
something prose cannot, such as the columns of a table or the values a state
takes, the spec may include it, trimmed to the part that carries the decision,
with a line saying where it came from.

**A spec has an owner.** It is the operator who writes it, unless the writer says
the spec belongs to someone else. A writer naming another operator sets the owner
at creation; the writer stays the creator, which the tracker records separately.

**A spec and its tickets have no relation between them.** A ticket names its spec
in its body. The tickets relate to each other only through hard dependencies, so
a reader ordering work reasons about one kind of relation.

**One operator writes one operator's records.** An operator writes the specs and
tickets they own. Taking on someone else's is a transfer of ownership, which the
tracker records, rather than an edit made under the other name. Nothing enforces
this: the tracker warns and writes anyway. The rule is the whole mechanism, as it
is for every other record in this set.

**No label is applied at creation.** The spec is `open`. A record that carries
its own state needs no second vocabulary to say the same thing.

## Acceptance

The delivery is a rewritten `to-spec`, and a reader can tell it was delivered
when the three steps and the seven sections read as office work and carry no
trace of a code repository.

That is one judgement on the finished skill. Its parts: the three steps read
without a seam, a codebase, or a test; the section called `Acceptance` exists and
holds a delivery and its judgement; `Implementation Decisions` lists six office
examples; the ownership rule is present; and nothing introduces a parent
relation between a spec and a ticket.

The judgement is made by reading the file, not by running anything. The prior
art is the set's other rewritten skills: `glossary`, `grilling`, and the ADR work
each arrived at the same shape, and a reader who compared them would apply the
same bar here.

## Out of Scope

- `to-tickets`, `implement`, and the rest of the mainline. They follow this spec
  and are specified separately.
- Any relation between a spec and a ticket in the tracker, including a parent
  relation and a soft link.
- Anything that enforces the ownership rule at the tool level.
- A second spec template for a change smaller than a project-wide one. One
  template serves both; a small change leaves sections short.
- The glossary's current entries, which describe the previous version of this set.

## Further Notes

The seam turned out to be defined in `codebase-design`, not in `to-spec`. That
skill is the vocabulary layer for module, interface, depth, seam, adapter,
leverage, and locality, and `tdd`, `implement`, `diagnosing-bugs`, and
`improve-codebase-architecture` all draw on it. The words only work together:
there is no seam without an interface and no interface without a module. A set
that carries none of those four skills carries none of the words either, so the
step is removed rather than translated. What survives of it is the two
constraints that hold without the vocabulary, and they are stated in office
language, as a judgement at the finished thing and a judgement kept short.

Matt's `Implementation Decisions` says "a list of implementation decisions that
were made" and then lists modules that will be *built*. The section therefore
holds both what is delivered and what was settled, and this spec follows that
rather than splitting the two.

The ban on locations was first read as applying to everything, including skill
text. It applies to the spec body only. A skill that does not name where its
files live forces the agent to guess, and guessing is the failure the ban is
trying to prevent.
