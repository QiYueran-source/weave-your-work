---
schema: 1
id: wm-x1ft55xgs8tr
title: Write the project's record settings, and take waymark out of the skills
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-17T12:55:13Z
updated_at: 2026-11-17T12:55:50Z
closed_at: 2026-11-17T12:55:50Z
---
Part of wm-tz1k7fzbzzq5

## What to do

A project set up with this set has one document saying how its records are
written: which tracker holds them, the command that writes each kind, the fields
a record carries, and the statuses it moves through. It lives beside the set's
other working files, in the config directory under the working directory.

The two skills that carried waymark's own words stop carrying them and keep their
rules. `grilling` says when a testimony is created and no longer which command
creates it. `to-tickets` says a task is marked with who works it and no longer
which field holds the mark.

## Acceptance criteria

- [ ] `.work-weave/config/tracker.md` exists and opens with a heading and one
      line saying records are tracked with waymark in the repository.
- [ ] It gives the command that writes a testimony, a spec, and a ticket, one
      line each.
- [ ] It names the `needs_human` field, its type, its default, and what it means.
- [ ] It names the three statuses and the commands that move a record between
      them.
- [ ] `grilling` no longer contains the string `waymark` and still says the
      testimony is created once the subject can be named in one sentence, after
      the first round is planned and before the first answer is recorded.
- [ ] `to-tickets` no longer names `needs_human` and still says a task is worked
      by one arranger, a person or an agent, and that the arranger is marked on
      the record.
- [ ] `to-tickets` no longer names `open`, `in_progress`, or `closed`.
