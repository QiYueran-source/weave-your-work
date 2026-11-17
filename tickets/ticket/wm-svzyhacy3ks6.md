---
schema: 1
id: wm-svzyhacy3ks6
title: 'to-spec: ownership rule, and a pass against the acceptance'
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-17T08:34:13Z
updated_at: 2026-11-17T08:44:47Z
closed_at: 2026-11-17T08:44:47Z
dependencies:
  - wm-pqt6q51hzwd3
---
Part of wm-ncx0qj6w1xgx

## What to build

The skill tells an operator who answers for the spec, and it tells two operators
what each may write. A spec's owner is the person writing it, unless the writer
says the spec belongs to someone else, in which case the writer names that person
and stays its creator. An operator writes the specs and tickets they own; taking
on a colleague's is a transfer of ownership, which the tracker records, rather
than an edit under the other name.

With the rules in place, the skill is read end to end against the spec's
acceptance and any place still describing a code repository is repaired.

## Acceptance criteria

- [ ] The skill says a spec has an owner, taken from the writer unless the writer
      names someone else.
- [ ] The skill says a writer naming another operator sets that operator as owner
      and remains the creator.
- [ ] The skill states the rule that an operator writes only their own records.
- [ ] The skill says taking on a colleague's record is a transfer of ownership
      rather than an edit, and notes that the tracker warns and writes anyway, so
      the rule is the whole mechanism.
- [ ] Read end to end, the skill has no instruction to explore a codebase, none to
      name a seam, no section asking for tests, no code examples under
      `Implementation Decisions`, and no parent relation between a spec and a
      ticket.
- [ ] The skill is one document with three steps and one template, and it says
      nothing about labels to apply at creation.
