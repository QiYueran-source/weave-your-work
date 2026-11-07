---
name: execute-all
description: Advance every task under a map at once, one subagent per task, and carry each one to a reviewed end.
disable-model-invocation: true
---

# Execute all

A map's tasks are parallel branches, so the normal way to advance a map is to run them together. Take the tasks the operator owns, claim them all, send each to its own subagent, and carry each one to a reviewed end.

`execute-one-task` holds the steps of one task; `task-review` holds the judgment. This skill decides which tasks run, how they are sent, and what the main agent does as reports come back.

## Which tasks

The tasks under the chosen map whose owner is the operator. Status does not filter: a task already `in_progress` is picked up again, because the operator owning it is what makes it theirs to advance. The owner may name a subset instead.

Left out:

- A task whose `waiting_on` names a person or a thing, until that value is cleared.
- A task with `needs_human: true`. It is never sent to a subagent, because the field cannot tell a whole-human task from a partly-human one, so the rule is uniform.

Claim every chosen task with `waymark start` before any of them goes out. The claim is what keeps two runs from picking up the same task.

## Sending

`dispatch.md` holds the distribution: what a subagent receives, how many run at once, what it may write, and what it reports. Read it once before the first dispatch.

A subagent runs `execute-one-task` and stops at `Result`: the judgment belongs to the main agent.

## Receiving a report

A report comes back with the five things `dispatch.md` names.

When it finished:

1. Commit what it lists: stage those paths and commit with a message that names the task.
2. Review the task with `task-review`, against the ticket.
3. Act on the verdict. `passed` closes the ticket. `needs changes` goes to a fresh subagent with the named gap. `needs discussion` stops that task and waits on the person. `wrong direction` closes it as a failed attempt.

When it stopped: the ticket keeps `Progress` and `waiting_on`, the subagent is released, and its slot goes to the next ticket. The answer that ends the wait is not this run's business; the next run re-dispatches, and the task is picked up again by the same rule that chose it the first time.

## Reviewing a large batch

When the batch is too big to hold, split the finished tasks across a few reviewer subagents, each reviewing several. Give each reviewer the ticket ids and tell it to load `task-review`; every reviewer judges by the same rules.

A reviewer does what `task-review` says: it writes `## Review`, and a passing task closes there. The main agent hears the verdict and takes the next step, which is a fresh subagent for the named gap, or a wait when a person holds the answer.

## Interrupting

Only the main agent talks to a person. When a task needs one, pause that task, leave the others running, and say what the wait is for.

A stop about the map's direction stops the batch.

When the answer a task waits for arrives, whoever advances it clears `waiting_on`; the next run then picks the task up by the same rule as any other.

## Committing

One commit per finished task, staged from the file list in its report. The list is per task, so two tasks touching one file would put one task's half-finished work into the other's commit. That is what the collision list in `dispatch.md` is read against before dispatch.

## The end

The run ends when the queue is empty and every finished task has a verdict. Say four lines: how many tasks ran, how many closed, what waits and on whom, and what is still open under the map.

Nothing else is written. The map stays a record of its target, and the tickets carry what the run left.

## When not to use this

- One task. Use `execute-one-task`.
- A map whose tasks collide on everything. Read the collision list first; when two tasks cannot be sequenced, leave one for a later run.
