---
schema: 1
id: wm-pqt6q51hzwd3
title: 'to-spec: the seven sections speak office work'
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-17T08:34:13Z
updated_at: 2026-11-17T08:44:30Z
closed_at: 2026-11-17T08:44:30Z
dependencies:
  - wm-4s5gt06kjwkw
---
Part of wm-ncx0qj6w1xgx

## What to build

Someone writing a spec from the template finds seven sections, and each one asks
for something they can supply from office work. A section named `Acceptance` holds
the delivery and the judgement on it. `Implementation Decisions` lists six shapes
of work a reader recognises: what is being made and what changes around it, who
is affected, facts clarified, practices settled with the alternatives that lost,
changes to what a record holds, and agreements with an outside party.

The section counts seven either way. One code section was renamed, not added to
and not taken away.

The template's two rules on what not to write are stated with reasons a reader of
office work accepts: a spec body names no place, because a place changes and may
not be reachable; and it carries no code, except a concrete shape where that says
something prose cannot.

## Acceptance criteria

- [ ] The template holds seven sections: Problem Statement, Solution, User
      Stories, Implementation Decisions, Acceptance, Out of Scope, Further Notes.
- [ ] `Acceptance` says it holds what the second step settled: the delivery, and
      one to three lines on how a reader tells it was handed over.
- [ ] `Implementation Decisions` keeps its name and holds both what is built and
      what was decided, in one section.
- [ ] `Implementation Decisions` lists six examples, all office work: what is
      being made and what changes around it; who is affected and how their work
      changes; facts clarified; practices settled with rejected alternatives and
      why; changes to what a record holds; agreements with an outside party.
- [ ] The seventh code example, specific interactions, is gone, and its content is
      covered by the "who is affected" example.
- [ ] The ban on place names is stated with both reasons, and it is stated for the
      spec body rather than for all text.
- [ ] The exception allows a concrete shape, such as the columns of a table or the
      values a state takes, trimmed to the part that carries the decision, with a
      line saying where it came from.
- [ ] `User Stories` keeps Matt's format, his demand for a long list, and his
      example.
- [ ] No section asks for a test, a module, an interface, or a schema.
