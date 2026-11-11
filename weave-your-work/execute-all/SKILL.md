---
name: execute-all
description: Advance every task under a map at once, one subagent per task, and carry each one to a reviewed end.
---

# Execute all

A map's tasks are parallel branches, so the normal way to advance a map is to run them together. Take the tasks the run's owner owns, claim them all, send each to its own subagent, and carry each one to a reviewed end. The run's owner is the owner of the chosen map; the local operator is not the owner, and on a shared checkout they can differ.

Start a batch only when the person asks for one. Answering "what is left under this map" is a read, not a batch.

`execute-one-task` holds the steps of one task; `task-review` holds the judgment. This skill decides which tasks run, how they are sent, and what the main agent does as reports come back. Load the map and split skills for dependency and task-split checks; if either is unavailable, stop and ask the owner to install it.

## Which tasks

The tasks under the chosen map whose owner is the run's owner. Only `open` and `in_progress` are candidates; a closed task is never claimed. The owner may name a subset instead.

Left out:

- A task whose `waiting_on` names a person, until the owner clears that value after handling the answer. A task with a value is never selected.
- A task with `needs_human: true`. It is never sent to a subagent, because the field cannot tell a whole-human task from a partly-human one, so the rule is uniform.
- A task whose required map output is unavailable or unusable. Check each candidate's actual inputs against the parent chain and its map dependencies as `execute-one-task` directs; unrelated tasks may run. Tell the owner which input is missing and follow the map skill's `placement.md` for failed dependencies and disposition.
- A task that needs a sibling task's output. Hand it back as a split error; read `task.md` in the split skill.

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

When it stopped: the ticket keeps `Progress` and, for a person wait, `waiting_on`. The subagent is released and its slot goes to the next ticket. The owner clears `waiting_on` after handling the answer; the next run checks inputs and selects the task by the same rules.

## Reviewing a large batch

When the batch is too big to hold, split the finished tasks across a few reviewer subagents, each reviewing several. Give each reviewer the ticket ids and tell it to read `task-review`; every reviewer judges by the same axes and reports its verdict and evidence.

A reviewer does not write `## Review` or close. The main agent is the run's owner; it writes the review, and a passing task closes there. It then takes the next step, which is a fresh subagent for the named gap, or a wait when a person holds the answer.

## Interrupting

Only the main agent talks to a person. When a task needs one, pause that task, leave the others running, and say what the wait is for.

A stop about the map's direction stops the batch.

When the answer a task waits for arrives, the owner clears `waiting_on` before the next selection. The next run then picks the task up by the same rule as any other.

## Committing

One commit per finished task, staged from the file list in its report. The list is per task, so two tasks touching one file would put one task's half-finished work into the other's commit. That is what the collision list in `dispatch.md` is read against before dispatch.

## The end

The run ends when the queue is empty and every finished task has a verdict. Say four lines: how many tasks ran, how many closed, what waits and on whom, and what is still open under the map.

Nothing else is written. The map stays a record of its target, and the tickets carry what the run left.

## When not to use this

- One task. Use `execute-one-task`.
- A map whose tasks collide on everything. Read the collision list first; when two tasks cannot be sequenced, leave one for a later run.
