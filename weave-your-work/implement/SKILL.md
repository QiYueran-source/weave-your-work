---
name: implement
description: "Do the work one ticket asks for: find out which tools this project gives you, judge whether the work is within reach, and stop when the ticket is a person's to do. Use when a ticket is named, or when implement-spec reaches this skill for each of a spec's tickets."
---

# Implement

Do the work a ticket describes.

## The ticket

This skill works one ticket. To work a whole spec in one run, a person starts
`implement-spec`, which calls this skill once for each of the spec's tickets.

If the user passes a reference, read the ticket and state its title before
starting. If the reference is ambiguous, ask. If no ticket is named, take the
one the person means and say which it is.

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
ticket's result section asks for.

## Reading it before it closes

Once the result is written, call the Skill tool with `review`, over the ticket
and the spec it came from: the ticket's first line names that spec.

Report what review finds, and do not repair it inside this run: the run's job is
the ticket, and a run that repairs itself hides what review found. Where the
finding goes depends on who waited for the result. Standing alone, it goes to
the person who asked for the ticket. Called by `implement-spec`, it goes back to
that run, which carries it into the final report.

A ticket whose spec is missing is not held open for it. Say that review was
skipped and why.

**Then close the ticket, unless the run closes it.** Standing alone, closing is
the last thing done here. Called for a ticket in an `implement-spec` batch, this
skill stops once the result and the findings are handed back: the batch closes
its tickets together, after its results have been read as one set.

## The project's records

How this project writes a record lives in `.work-weave/config/tracker.md`.
Read it before writing one.
