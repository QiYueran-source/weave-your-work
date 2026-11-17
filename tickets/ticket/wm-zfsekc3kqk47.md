---
schema: 1
id: wm-zfsekc3kqk47
title: 'Rewrite implement: survey the tools, stop at a person''s ticket'
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-17T13:57:14Z
updated_at: 2026-11-17T13:58:02Z
closed_at: 2026-11-17T13:58:02Z
---
Part of wm-qmar7z6vvbyn

## What to do

An agent running `implement` finds five things to do: know which ticket it is
working, survey what this project has given it, judge whether the work is within
reach, do it, and record the result and close the ticket.

It names no practice. Whatever the project offers, skills, MCP servers,
interfaces, or a command line, is what it works with, and a tool the person named
wins over the agent's own preference. Something out of reach is said before
starting, and again if it turns up midway.

A ticket that is a person's stops the agent. It says which ticket, what it asks
for, and that `hand-back` records the result, and it does not go on to later
tickets.

## Acceptance criteria

- [ ] The skill has five instructions, in this order: know the ticket, survey the
      tools, judge what is reachable, do the work, record and close.
- [ ] The survey names skills, MCP servers, interfaces, and a command line as
      what to look at.
- [ ] The skill says a tool the person named is used ahead of the agent's own
      preference.
- [ ] The skill says what is out of reach is stated before starting, and again if
      it turns up midway.
- [ ] The skill says a person's ticket stops the agent, that it names the ticket
      and what it asks for, and that it mentions `hand-back`.
- [ ] The skill says the agent does not go on to later tickets after stopping.
- [ ] The skill contains no `tdd`, no `seam`, no `typecheck`, and no
      `code-review`.
