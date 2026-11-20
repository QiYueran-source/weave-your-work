---
schema: 1
id: wm-tz1k7fzbzzq5
title: Skills point at the project config instead of carrying waymark commands
category: spec
status: closed
owner: frank
creator: frank
created_at: 2026-11-17T12:53:05Z
updated_at: 2026-11-18T07:53:17Z
closed_at: 2026-11-18T07:53:17Z
---
## Problem Statement

One skill of this set carries a command line for the tracker it happens to run
on. `grilling` says a testimony is created with `waymark create --category
testimony`, and `to-tickets` names the `needs_human` field. Both are waymark's,
down to the spelling, and both stop meaning anything the moment a project tracks
its records some other way.

The skill and the tool are two different things with two different lifetimes. A
skill says what a testimony is and when it is written. A tool says which command
writes it. The first changes when the method changes; the second changes when
someone picks a different tracker, which the method knows nothing about.

Nothing in the set names where the project's own answers live either. A reader
looking for how records are written has no single place to go, and each skill
that writes a record carries its own copy of the answer.

## Solution

Skills describe records; the project describes the tracker.

A new directory holds the project's own settings for this set: which tracker the
records live in, the command that writes one, the fields a record carries, and
the statuses it moves through. Its first document covers records. Skills name the
path to it and read it before writing, and carry no tracker command, field name,
or status value of their own.

Where the settings live is fixed by this set, not by the project: the config
directory under the set's own working directory. A skill states that path, so a
reader is never left guessing where to look. A skill does not say what to do when
the file is absent. A project without it has not been set up, and that is visible
when the read fails rather than something a skill recovers from.

## User Stories

1. As a person running a skill on a project that tracks records with something
   other than waymark, I want the skill to describe what a record is, so that the
   method still applies.
2. As a person running a skill on a project that tracks records with something
   other than waymark, I want the skill to not name a command that does not exist
   there, so that the agent does not run it and fail.
3. As a person setting up a project, I want one document to say how records are
   written, so that I change one place and every skill follows.
4. As a person setting up a project, I want the document to name the fields a task
   carries, so that the rule about who works a task has somewhere to point.
5. As an agent writing a record, I want the skill to tell me where the project's
   settings are, so that I do not have to guess.
6. As an agent writing a record, I want the settings document to give me the exact
   command, so that I do not invent one.
7. As an agent meeting a project with no settings document, I want the read to
   fail plainly, so that I do not fill in a guess that later reads as a decision.
8. As a maintainer of this set, I want a skill to be readable on its own, so that
   a reader who has not read the others still knows what to do.
9. As a maintainer, I want the same three-line pointer in every skill that writes
   a record, so that the instruction does not drift between copies.
10. As a maintainer, I want the set's settings directory to sit beside its other
    working files, so that what this set puts in a project is in one place.
11. As a reader of a skill, I want to see a method described without a particular
    tool's vocabulary, so that I can tell a rule from a command.
12. As a person who owns a project, I want to change trackers without editing
    every skill, so that the switch is one edit.
13. As a person reading a testimony's rules, I want them to say when the record is
    created, so that the timing rule survives a change of tracker.
14. As a person reading a ticket's rules, I want them to say a task is marked with
    who works it, so that the rule survives a change of tracker.
15. As a person who installed this set into a project, I want its files kept apart
    from the project's own content, so that I can tell which files came from here.

## Implementation Decisions

**A config directory holds the project's settings.** It sits under the set's
working directory, beside the glossary sources, the decision log, and the runtime:
`.work-weave/config/`.

**Its first document covers records.** `.work-weave/config/tracker.md` says which
tracker the records live in, the command that writes each kind, the fields a
record carries, and the statuses it moves through. It is written for waymark,
which is what the setup skill installs.

**Skills state the path and stop there.** The three skills that write a record
add a short section naming `.work-weave/config/tracker.md` and saying to read it
before writing. Three lines, the same in all three.

**No fallback is stated.** A skill that finds no settings document does nothing
about it. The read fails, which is the correct signal that the project was not
set up. A skill that recovered by guessing would hide that.

**The tracker command leaves the skills.** `grilling` loses the command that
creates a testimony and keeps the timing rule: the record is created once the
subject can be named in one sentence, after the first round is planned and before
the first answer is recorded.

**The field name leaves the skills and the meaning stays.** `to-tickets` stops
naming `needs_human` and says a task is marked with who works it, a person or an
agent. The field that carries the mark, its type, and its default are in the
settings document.

**Status values leave too.** No skill names `open`, `in_progress`, or `closed`.
Where a skill needs to refer to a record's state it refers to the state.

**The copy is deliberate.** The same three lines appear in three skills rather
than in a fourth skill that the others call. A reader of one skill is not assumed
to have read another, and the cost of three repeated lines is small.

**`GLOSSARY.md` and `ADR.md` stay named in the skills.** They are this set's own
convention rather than a tracker's, and they do not move when a project picks a
different tracker.

## Acceptance

The delivery is three edited skills and one new settings document, and a reader
can tell it was delivered when no skill in the set contains a tracker command, a
tracker's field name, or a tracker's status value, and every skill that writes a
record names where the project's settings are.

The parts: `grilling` keeps its timing rule and loses its command; `to-tickets`
keeps the rule about who works a task and loses the field name; both, and
`to-spec`, name `.work-weave/config/tracker.md` and say to read it; and the file
itself says which tracker, which commands, which fields, and which statuses.

The reading is the check. A grep for `waymark` across the three skills returns
nothing.

## Out of Scope

- The setup skill writing this document. It is written by hand here and installed
  later.
- The rules directory. It stays where it is.
- A settings document for anything other than records.
- Any skill other than the three that write records.
- Moving the glossary or decision sources.

## Further Notes

The path is written into the skills even though it is a location, because a skill
that does not say where to look forces the agent to guess. The ban on locations
applies to a spec's body, where a location may change or become unreachable. A
skill's settings path is this set's own convention and does not move.

Matt's equivalent sentence is "the issue tracker should have been provided to
you", with the tracker document's location decided at setup time and written into
`AGENTS.md`. This set fixes the location instead, so the sentence can be
shorter; the two-line version buys the same thing with one less hop.
