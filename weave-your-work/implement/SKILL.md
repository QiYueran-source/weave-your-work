---
name: implement
description: "Do the work one ticket asks for: find out which tools this project gives you, judge whether the work is within reach, and stop when the ticket is a person's to do."
disable-model-invocation: true
---

# Implement

Do the work a ticket describes.

## The ticket

If the user passes a reference, read the ticket and state its title before
starting. If the reference is ambiguous, ask. If no ticket is named, take the one
the person means and say which it is.

## What you have to work with

Before judging the work, look at what this project has given you: the skills
installed, the MCP servers, the interfaces, and the command line. Work with what
is there.

A tool the person names wins over your own preference. If they say to use a
particular skill or a particular service, use it.

## What is out of reach

Judge before you start whether the ticket is within reach of what you have. Say
plainly when it is not, and what would make it reachable. When you judge it
reachable and find midway that it is not, stop there and say so too: saying it
early is cheaper than saying it after half the work.

## A ticket that is a person's

Some tickets are a person's to do. Stop at one of those. Say which ticket it is,
what it asks for, and that `hand-back` records the result once it is done.

Do not go on to later tickets. They may depend on the one you stopped at.

## Doing it and closing it

Do the work the ticket asks for.

Then write the result into the ticket: what was left behind, in the shape the
ticket's result section asks for. Then close the ticket.

## The project's records

How this project writes a record lives in `.work-weave/config/tracker.md`. Read it
before writing one.
