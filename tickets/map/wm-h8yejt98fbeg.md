---
schema: 1
id: wm-h8yejt98fbeg
title: Task dispatch skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-07T09:42:01Z
updated_at: 2026-11-07T09:44:43Z
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

- One batch defaults to every open, unclaimed task under the chosen map; the owner may name a subset (user confirmed).
- Dispatch claims every chosen task before sending any of them out, and caps how many run at once (default 4, user confirmed).
- `needs_human` tasks are never sent to a subagent; the field cannot tell a whole-human task from a partly-human one, so the rule is uniform (user confirmed).
- A task is not isolated by a git worktree, because it may act on an API or another system where a branch isolates nothing (user confirmed).
- Collisions are judged, not checked: a reference lists what can collide and the main agent reads it against the batch it is about to run (user confirmed).
- A subagent reports where it stopped and why; the main agent chooses to re-dispatch with fuller input, interrupt and ask a person, or hand the task back to the owner (user confirmed).
- An interrupt pauses only the task that hit the person, and the run ends with the list of what it waits on. A stop about the map's direction stops the batch (user confirmed).

## Not yet specified

- How the four skills reference each other, given the step skills do the referencing.
- The collision list: which classes of thing it names.
- What the report at the end of a run contains.
- How a resumed run picks up after an interrupt, now that no execution log is written.
- Whether dispatch records its decisions anywhere, now that there is no execution log.

## Out of scope

- The steps and gates that advance one task.
- Reviewing a finished task.
