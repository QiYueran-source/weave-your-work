---
name: hand-back
description: "Record what a person finished on one of their own tickets: work out which ticket they mean, ask what the ticket needs to know, write the result, close it, and name the next one. A person runs this after doing the work; an agent working a ticket does not."
disable-model-invocation: true
---

# Hand Back

A ticket that a person works sits there while the agent waits. When the work is
done, it comes back through here: the result is written into the ticket, the
ticket is closed, and the next ticket is named.

A person runs this. An agent has no finished work to report, and its ticket's
result is readable already.

## 1. Find the ticket

The person describes what they did in their own words, and will usually not have
the ticket's identifier. Read what the open tickets that are a person's ask for,
and judge which one they mean **by meaning, not by matching words**.

Asked, someone says "I asked the supplier". The ticket says "confirm the quote".
Those are the same errand, and a search for shared words finds neither.

Three outcomes:

- **One ticket fits.** Say which one it is, and what it asks for, and confirm
  before going on.
- **Several fit.** List them and let the person pick. Do not choose between them.
- **None fits.** Say so. The person may have misremembered, or a ticket may be
  missing.

If the person describes two separate pieces of work, say so and take one first.
One ticket per run: the result belongs to one ticket's acceptance, and two
results written at once get mixed.

## 2. Read what the ticket wants

Read the ticket's acceptance criteria. They are what the result has to answer.

## 3. Ask what the ticket needs to know

Ask the person for the facts, derived from the acceptance. Tell them what you are
asking for and why, so they know what to answer rather than how much to write.

An acceptance line that reads "capacity known" is answered by the number and
what was read to get it. Ask for those.

When the acceptance is too vague to derive a question from, ask what the ticket
was meant to achieve, and take the answer as the thing to record.

Ask at least one round. Do not leave the person to write unprompted: what comes
back unprompted is "done", and the next reader cannot use it.

## 4. Write the result

Write the answer into the ticket's result part, in the shape the ticket asks for.
The shape belongs to the ticket, not to this skill.

Keep it to what the ticket needs. Process detail that no later ticket needs does
not go in.

## 5. Close it, and say what is next

Close the ticket. Then name the next ticket that can be worked, so the person can
start the agent again without working out the order.

## The project's records

How this project writes a record lives in `.work-weave/config/tracker.md`. Read it
before writing one.

## What this skill does not do

- Judge whether a result is good, or check it. Writing it down and closing the
  ticket are the whole job.
- Decide that a task is finished when the person says it is not.
- Take a result for an agent's ticket. An agent's result is readable; asking a
  person to retype it invents a difference.

Nothing here is enforced by the tools. A person running it, and an agent not
running it, are both carried by this text and by the front matter that says a
model does not reach for it.
