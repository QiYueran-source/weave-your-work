---
name: to-tickets
description: Break a plan, a spec, or the current conversation into a set of tickets, each one whole task that can be worked by one arranger and each declaring the tickets that block it, then publish them to the project tracker.
disable-model-invocation: true
---

# To Tickets

Break a plan, a spec, or a conversation into **tickets**. A ticket is one whole task: when it is done, the thing it names can be done. Each ticket declares the tickets that **block** it.

## Process

### 1. Gather context

Work from whatever is already in the conversation context. If the user passes a reference (a spec path, an issue number or URL) as an argument, fetch it and read its full body and comments.

### 2. Read the project's current state (optional)

If you have not already read it, read what the project has: the glossary, the decision log, and the records near this work. Ticket titles and descriptions use that vocabulary, and respect the decisions already settled.

### 3. Cut whole tasks

Break the work into tasks, each one whole.

<whole-task-rules>

- **Whole.** When the task is done, the thing it names can be done, even if the thing is small.
- **Not a step.** A task that only prepares for another task is folded into the task it prepares for.
- **Not two tasks.** A task holding two complete tasks is cut again.
- **Sized.** A task fits one context window, or one stretch of a person's time. This is the ceiling; wholeness is the floor.

</whole-task-rules>

The two cutting errors mirror each other: one makes a list of steps, the other makes a task nobody can finish in one go. A task that only prepares for something is wrong for the same reason a task holding two things is wrong.

Give each ticket its **blocking edges**: the other tickets that must complete before it can start. A ticket with no blockers can start immediately. Blocking is the only relation between tickets.

<one-arranger>

Every task is worked by one arranger: a person or an agent, never both. A mixed task stops at the half the agent cannot do, so a task needing a person is its own task, however small. Reading a label takes a minute and is still a ticket.

Record the arranger on the record, in the field the project keeps for it. A task an agent can do alone leaves it at its default.

</one-arranger>

<the-result>

Every task ends with **a result**: what was left behind, in a form a later reader can point at. Write one or two lines.

The result is written when the task is finished, not when it is cut. For an agent's task the change is often readable already; for a task done by hand the result is the only trace there is: the number, the name, the decision, or the reference that lets someone check it. A task a person does records its result with `hand-back`, which asks for it and closes the ticket.

</the-result>

### 4. Quiz the user

Present the proposed breakdown as a numbered list. For each ticket, show:

- **Title**: short descriptive name
- **Who works it**: a person or an agent
- **Blocked by**: which other tickets (if any) must complete first
- **What it leaves behind**: the result a finished ticket would have

Ask the user:

- Does the granularity feel right? Is every ticket whole, and none of them two tasks in one?
- Are the blocking edges correct: does each ticket only depend on tickets that genuinely gate it?
- Should any tickets be merged or split further?

Iterate until the user approves the breakdown.

### 5. Publish the tickets to the project tracker

Publish the approved tickets. One record per ticket: create the record, then
record the tickets that block it. The order the records are created in carries
no meaning.

Each record's body opens with the identifier of the spec it came from, on a line of its own, then the four parts below. Mark the records whose tasks a person works.

Work the **frontier**: any ticket whose blockers are all done. For a purely linear chain that means top to bottom.

A ticket too large to cut means the spec is too large. Say so, and stop, rather than forcing a cut.

## The project's records

How this project writes a record lives in `.work-weave/config/tracker.md`. Read it
before writing one.

<ticket-template>

<spec identifier>

## What to do

The finished state this ticket reaches, from the point of view of whoever uses it. Not a list of steps.

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2

## The result

Left empty when the ticket is published. Whoever finishes the ticket fills it in: one or two lines naming what was left behind, in a form a later reader can point at.

## Blocked by

- A reference to each blocking ticket, or "None (can start immediately)".

</ticket-template>

How a finished ticket is checked is not this skill's job. This skill says what counts as done; the check is a separate job.

Avoid specific locations and code: a location changes, and the reader may not be able to reach it at all. Exception: a concrete shape that says something prose cannot, such as the columns of a table or the values a state takes. Inline only the part that carries the decision.
