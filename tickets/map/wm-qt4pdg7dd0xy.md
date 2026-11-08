---
schema: 1
id: wm-qt4pdg7dd0xy
title: Execute all skill
category: map
status: closed
owner: frank
creator: frank
created_at: 2026-11-07T09:41:55Z
updated_at: 2026-11-07T16:21:59Z
closed_at: 2026-11-07T15:09:25Z
parent: wm-avc7a31tae33
---
## Target

Design the whole-map execution skill: run every task under a map at once, each one in its own subagent, and collect what comes back. Its dispatching rules live beside it in `dispatch.md`, not in a skill of their own.

Why: a map's tasks are parallel branches, so the normal way to advance a map is to run them together rather than one after another.

## Acceptance direction

`weave-your-work/execute-all/` exists with `SKILL.md` and `dispatch.md`. A run over a map with several open tasks starts them together, and the two files say what happens to a task that stops and what the main agent writes at the end.

All children are complete and no further child is needed.

## Decisions so far

- This skill runs every task under a map at once; `execute-one-task` is the other shape, one whole task (user confirmed).
- Each task runs in its own subagent, in one pass, with no questions and no interrupt (user confirmed).
- Each subagent loads `execute-one-task` for the steps; this skill points at it instead of restating them (user confirmed).
- The dispatching rules are a reference file, `dispatch.md`, inside this skill's directory rather than a sibling skill (user confirmed).
- A run takes every task under the chosen map whose owner is the operator. Status does not filter it: a task already `in_progress` is picked up again, because the operator owning it is what makes it theirs to advance (user confirmed). The owner may name a subset instead.
- A task whose `waiting_on` names a person or a thing stays out of the automatic batch until that value is cleared; the owner may still name it explicitly (user confirmed).
- Every chosen task is claimed before any of them is sent out, and no more than four run at once by default (user confirmed).
- `needs_human` tasks are never sent to a subagent; the field cannot tell a whole-human task from a partly-human one, so the rule is uniform (user confirmed).
- A task is not isolated by a git worktree, because it may act on an API or another system where a branch isolates nothing (user confirmed).
- Collisions are judged, not checked. A reference lists what can collide and the main agent reads it against the batch before dispatch (user confirmed). The list names at least: the same repository file, the same ticket, the same external record, the same account or credential, the same interface with a call limit, the same shared folder, the same person's time, and the working tree of the same clone when another run has uncommitted changes.
- A subagent receives its ticket id, the parent map's `Target` and `Acceptance direction`, the procedure to load, and the rule file paths. It writes its own ticket, body and `waiting_on` and the claim status, and the files its work needs; it may not write another ticket or the map, and it does not commit. `## Review`, `outcome`, and the close belong to the review that follows. It reports whether it finished, where it stopped and why, the files it touched, what it could not settle, and what the evidence shows (user confirmed).
- A subagent does not decide whether to involve a person. The main agent chooses: re-dispatch with fuller input, interrupt and ask a person, or hand the task back to the owner. Only the main agent talks to a person (user confirmed).
- An interrupt pauses only the task that hit the person, and the run ends with the list of what it waits on. A stop about the map's direction stops the batch (user confirmed).
- The run ends with the work reviewed, not when the actions are done. A finished task is not complete until it has been checked (user confirmed).
- A run writes nothing outside the tickets: the map stays a functional record of the target, and each task ticket carries what its run left — `Result`, `Review`, and `Progress` with `waiting_on` when it stops (user confirmed). This replaced the earlier decision that the main agent writes the batch outcome on the parent map.
- A testimony is a record of a grill: information a person supplied while a decision was made. What an agent did during a run is not a testimony: it is already on the ticket, and copying it is overhead (user confirmed).
- A subagent that stops is released when it reports: nothing can end its wait inside it, and the answer arrives later, so the task is re-dispatched to a fresh subagent rather than resumed (user confirmed).
- A stopped task gives up its slot to the next ticket in the queue, so one person's delay does not hold the batch (user confirmed).
- The main agent commits, one task at a time as reports arrive, mostly the ticket files and also the local changes that belong to that task. The file list in the report is what gets staged, which is why the collision list is read before dispatch (user confirmed).
- The review is sized to the batch: the main agent reviews itself when the batch is small enough to hold, and splits the finished tasks across a few reviewer subagents when it is not, each reviewer taking several tasks (user confirmed).
- The two files split by reader. `SKILL.md` holds the run: when to use it, which tickets, claiming them all before dispatch, the review, the commits, the stops, and how the run ends. `dispatch.md` holds the distribution: the concurrency cap and how a freed slot is refilled, what a subagent receives, what it may write, how it reports, and the collision list (user confirmed).

## Not yet specified

- ~~What the run loop holds, and what `dispatch.md` holds.~~ Resolved: the run in `SKILL.md`, the distribution in `dispatch.md` (see Decisions so far).
- ~~Where the run's own outcome is written, now that a run writes nothing outside the tickets.~~ Resolved: nowhere; the tickets carry it and the map stays functional (see Decisions so far).
- ~~What a run does when one task stops while the others continue.~~ Resolved: the subagent is released, the slot goes to the next ticket, and the stopped task keeps `Progress` and `waiting_on` (see Decisions so far).

(none; the design is settled and the work is filed as a child)

## Out of scope

- The steps that advance one task.
- Reviewing a finished task.
