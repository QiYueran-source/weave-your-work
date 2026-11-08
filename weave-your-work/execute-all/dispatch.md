# Dispatch

The distribution half of `execute-all`: what a subagent gets, how many run at once, and what comes back. Read it once before the first dispatch.

## What a subagent receives

- Its ticket id.
- The parent map's `Target` and `Acceptance direction`.
- The skills to load: `execute-one-task`. Not `task-review`: its run ends at `Result`.
- The paths of this repo's rule files.

These are pointers. The ticket, the map, and the rules are where the content lives, so the prompt names them instead of repeating them.

## How many run at once

Four by default. Each task that finishes or stops frees its slot for the next ticket in the queue. The cap is about attention and collision risk, not the length of the queue.

The waymark store takes one write lock at a time, for one read-modify-write window. If a command reports a lock timeout, retry it once.

## What a subagent may write

- Its own ticket: `Result`, `Progress`, and `waiting_on`, plus the claim.
- The files its work needs.

It may not write another ticket, the map, `## Review`, or `outcome`, and it does not close the ticket. It does not commit.

There is no branch and no worktree: every subagent works in the same checkout, which is why the collision list is read before dispatch.

## What it reports

Five things, plainly:

1. Whether the task finished.
2. Where it stopped and why, when it did.
3. The files it touched.
4. What it could not settle.
5. What the evidence shows: the result read against the `Acceptance signal`.

The file list is what the main agent commits, so it has to be complete and no wider than the task's own work.

## The collision list

Read this against the batch before dispatch. Two tasks collide when they touch:

- the same repository file
- the same ticket
- the same external record
- the same account or credential
- the same interface with a call limit
- the same shared folder
- the same person's time
- the working tree of the same clone while another run has uncommitted changes
- work another task in the batch produces, when this task reads it, runs it, or checks the result

A collision does not stop the batch: dispatch one of the pair, let it finish, then dispatch the other. Work that cannot be sequenced that way is not a batch task, and `execute-one-task` takes it alone.

## What a subagent must not do

- Ask a person, wait on one, or interrupt. There is nobody to ask, and its run is over the moment it stops.
- Decide whether to involve a person. That is the main agent's call.
- Review its own work, or close its ticket.
