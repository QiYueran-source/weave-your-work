---
schema: 1
id: wm-h8yejt98fbeg
title: Task dispatch skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-07T09:42:01Z
updated_at: 2026-11-07T09:45:48Z
parent: wm-avc7a31tae33
---
## Target

Design the dispatch skill: pick the tasks a run will advance, claim them, decide which may run at once, send them out, collect the reports, and interrupt for a person when it is the main agent's call.

Why: the step skills advance one task; without this skill a map's tasks never run together and nobody decides what may collide.

## Acceptance direction

`weave-your-work/task-dispatch/` exists, and a run over a map with several open tasks claims them, runs the safe subset at once, and ends with a report of what finished and what waits.

All children are complete and no further child is needed.

## Children

(none yet)

## Decisions so far

- A run takes every task under the chosen map whose owner is the operator. Status does not filter it: a task already `in_progress` is picked up again, because the operator owning it is what makes it theirs to advance (user confirmed, replacing the earlier open-and-unclaimed rule).
- The owner may name a subset instead of taking everything.
- Dispatch claims every chosen task before sending any of them out, and caps how many run at once (default 4, user confirmed).
- `needs_human` tasks are never sent to a subagent; the field cannot tell a whole-human task from a partly-human one, so the rule is uniform (user confirmed).
- A task is not isolated by a git worktree, because it may act on an API or another system where a branch isolates nothing (user confirmed).
- Collisions are judged, not checked. A reference lists what can collide, and the main agent reads it against the batch before dispatch (user confirmed). The list names at least: the same repository file, the same ticket, the same external record, the same account or credential, the same interface with a call limit, the same shared folder, the same person's time, and the working tree of the same clone when another run has uncommitted changes.
- A subagent reports where it stopped and why; the main agent chooses to re-dispatch with fuller input, interrupt and ask a person, or hand the task back to the owner (user confirmed).
- An interrupt pauses only the task that hit the person, and the run ends with the list of what it waits on. A stop about the map's direction stops the batch (user confirmed).

## Not yet specified

- What keeps a task waiting on a person out of the next batch, now that status no longer filters.
- How the four skills reference each other, given the step skills do the referencing.
- What the report at the end of a run contains.
- How a resumed run picks up after an interrupt, now that no execution log is written.
- Whether dispatch records its decisions anywhere, now that there is no execution log.

## Out of scope

- The steps and gates that advance one task.
- Reviewing a finished task.
