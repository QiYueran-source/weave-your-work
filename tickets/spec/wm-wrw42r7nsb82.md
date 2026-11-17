---
schema: 1
id: wm-wrw42r7nsb82
title: Fix the drift the Matt alignment left behind
category: spec
status: open
owner: frank
creator: frank
created_at: 2026-11-17T13:16:12Z
updated_at: 2026-11-17T13:16:12Z
---
## Problem Statement

The three skills rewritten to follow Matt still carry instructions from the code
world, and two of the fixes made during the rewrite went unfinished.

`to-tickets` asks for the tickets to be published in dependency order, blockers
first. That ordering matters on a tracker that numbers its records as it creates
them, where the number is what a later record refers to. A tracker that assigns
an identifier at creation and records relations afterwards does not care, so the
reader is given an order with no consequence. The same skill's template offers
two ways to record blocking, one of which is absent from every project this set
sets up.

`grilling` reads the project's record settings before it writes its testimony.
Its testimony carries neither a field the settings declare nor a state the
settings move it through, so the read returns nothing it can use, and the skill
contradicts its own claim that it writes the testimony and nothing else.

`to-spec` names its delivery section `Acceptance` and then describes what the
second step did rather than what the section holds. Its first step lists five
inputs without saying what reading them is for. Its opening forbids an interview,
and its second step then asks the user to settle two things, which reads as a
contradiction to anyone who does not already know that forbidding a second
interview is not forbidding a question.

Three places outside the skill text describe the set as it was before the
rewrite and now disagree with it: the display description for `to-tickets` in
its agent manifest, the record checker, and the glossary.

## Solution

Each change removes a statement that no longer describes the set, or supplies
the one that was missing.

`to-tickets` loses the publishing order and keeps the rule it was standing in
for: create each record, then record the tickets that block it. Its template
keeps one way to record blocking.

`grilling` loses its read of the record settings. A testimony is still a record a
project writes, and how a project writes one is still in the settings; what
`grilling` does not need is that document's contents.

`to-spec` describes what its `Acceptance` section holds instead of which step
produced it, says what the first read is looking for, and names the interview
that is forbidden as the second one.

The manifest, the checker, and the glossary are brought back into line with the
set as it now stands.

## User Stories

1. As a person cutting tickets, I want the publishing step to tell me something
   that changes what I do, so that I do not look for a reason it has no effect.
2. As a person cutting tickets, I want one way to record blocking, so that I do
   not have to work out which of two applies to my project.
3. As a person running a discussion, I want the skill to read the project's
   settings only when it can use them, so that a read that returns nothing does
   not read as a step I skipped.
4. As a person reading a spec, I want each section of the template to say what it
   holds, so that I can write it without first working out which step fills it.
5. As a person running `to-spec`, I want to know what the first read is looking
   for, so that I know when I am done reading.
6. As a person running `to-spec`, I want the ban on interviewing to say which
   interview it bans, so that settling the delivery does not look forbidden.
7. As a person browsing skills, I want the display description to match what the
   skill does, so that I pick the right one.
8. As a maintainer, I want the record checker to report real problems and not
   the ones a retired record kind would have, so that a clean run means
   something.
9. As a maintainer, I want the glossary to define the words this set uses now, so
   that a reader is not taught a shape the set has dropped.
10. As a new reader, I want the glossary to define a spec and a ticket as this set
    treats them, so that the two are not confused with the retired map and task.

## Implementation Decisions

**Blocking is recorded after creation, and the skill says so.** The order in
which records are created carries no meaning, so the step says to create each
record and then record its blocking tickets. Blocking is the only relation
between tickets, and it is recorded on the record rather than written in a body
section.

**The ticket template keeps one form of `Blocked by`.** The alternative, a
section written only when the project cannot record the relation, is removed:
every project this set sets up can record it.

**`grilling` does not read the record settings.** The testimony is a record, but
it carries no field the settings declare and moves through no state they define.
The skill keeps the rule that the testimony is written as each round happens.

**`Acceptance` describes its contents.** It holds the delivery and the judgement
of it, in the words the second step settled. Whether a step produced it is not
what a reader comes to that section for.

**The first read is given a purpose.** It answers what the project calls things,
what it has already decided, and whether a spec for this change exists.

**The ban names the interview it bans.** `to-spec` forbids a second interview. It
still asks the user to settle the delivery and the judgement, and the opening
says so.

**The manifest follows the skill.** The display description for `to-tickets`
drops the word the skill dropped.

**The checker is brought to the current categories.** It checks the three
categories the project uses, and its per-category body checks name the sections
those categories carry.

**The glossary is rewritten for the current set.** The retired record kinds are
removed, and `spec` and `ticket` are defined as the set treats them.

## Acceptance

The delivery is four edited files and a rewritten glossary, and a reader can
tell it was delivered when no skill in the set asks for a publishing order it
cannot observe, offers two ways to record a relation every project can record
one way, or reads settings its record cannot use; when each section of the spec
template says what it holds; and when the manifest, the checker, and the glossary
agree with the skills.

The parts: `to-tickets` loses the order and keeps one `Blocked by` form;
`grilling` loses the settings read; `to-spec` gains a purpose for its read, a
contents description for `Acceptance`, and a named ban; the manifest description
matches the skill; the checker runs clean over the project's records; and the
glossary defines `spec` and `ticket` and no longer defines `map` or `task`.

The reading is the check. `node scripts/check-records.mjs` reports no finding,
and a grep for `tracer` across the skills and their manifests returns nothing.

## Out of Scope

- `implement`. It is still the upstream copy and is a separate piece of work.
- A router skill. The set has none, and adding one is its own decision.
- The bodies of the existing specs. They keep Matt's template, including
  `Testing Decisions` in the three written before it was renamed.
- `adr` and `setup` naming waymark. They write records and install the tracker,
  and the same rule that emptied `grilling` has not been applied to them.
- The template's `User Stories` section, which keeps Matt's wording.

## Further Notes

The first three findings were invisible from the skill text alone. The publishing
order is correct in Matt's set, where a local tracker numbers files as it writes
them; it stopped being correct when the tracker changed. The extra `Blocked by`
form was taken from his template along with the rule it hedged, and the hedge
covered a case this set does not have.
