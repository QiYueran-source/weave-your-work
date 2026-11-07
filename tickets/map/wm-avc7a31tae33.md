---
schema: 1
id: wm-avc7a31tae33
title: Task execution skill
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-07T06:48:16Z
updated_at: 2026-11-07T09:00:48Z
parent: wm-87pgn0b75yy5
---
## Target

Design the task execution skill: define how an owner advances an executable task from start through its outcome.

## Acceptance direction

The task execution skill and its references define the execution lifecycle, and an example shows a task being advanced and its outcome recorded.

## Decisions so far

- The task owner is responsible for execution and may assign work to other people (user confirmed). The assignment and authority rules still need design.
- AI handles the parts it can complete; work requiring a person is handed to a human (user confirmed).
- A human-required step is notified through a GitHub issue; the issue mechanism is designed by the communication category and the concrete implementation comes later (user confirmed).
- The operating procedure for a task lives in this skill, not in the total Task skill (user confirmed).
- A task waiting on a person keeps status `in_progress`. The wait is recorded as a comment carrying the issue link, and a `waiting_on` field names the person or the thing it waits on (user confirmed).
- A run may advance more than one task; one task per session is not a rule. Whether this becomes two skills, one single-task and one many-task, is still open (user confirmed direction).
- When a task no longer holds, the executor stops and hands it back to the owner. The owner closes it and either reopens the work as a map or writes a new task. The executor does not rewrite the action and does not split the task (user confirmed).
- The skill is user-invoked, not model-invoked (user confirmed).
- Direction from the user, not yet designed:
  - Many tasks start in parallel, and the parallel work runs in subagents.
  - A finished task gets an implementation review, shaped like the map review.
  - When a person must review or act, the run interrupts.
  - Execution advances by grilling the work as it goes, and lands a weave log under the grill skill's rules.
  - A subagent cannot ask a question and cannot interrupt; it finishes in one pass. Only the main agent may interrupt.

## Not yet specified

- The cut between a single-task skill and a many-task skill: names, what each owns, and how the second calls the first.
- What a subagent receives and reports, and whether it may write the ticket and commit.
- How parallel work is isolated in git, if at all.
- The shape of the task review: where it lives, who runs it, its verdicts, and how it relates to the owner's acceptance.
- Which questions execution answers itself and logs, and which go back to the owner.
- What interrupts a run, and how it resumes.
- Whether a task with `needs_human` enters parallel dispatch.
- Whether a task carries dependency edges at all. `body.md` now says it does not; an earlier decision in the task design map says dependencies are written to task front matter.

## Out of scope

- Defining task body structure, kinds, reversibility, and acceptance signals.
- Deciding which tasks to create when splitting a map.
