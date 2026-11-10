---
name: wait-what
description: "Stop the work and show where it stands: read the state off the tickets, not the conversation, and report it in one short table with fixed columns."
---

# Wait what

The person has lost the thread. They are not asking what you said last — they read that. They are asking where the work stands right now, and the answer is in the tickets.

Answer with the state, not with an apology and not with a re-pitch of the previous message. Then wait. This skill reports; it does not resume.

`usage.md` walks one report over this repository, from the three commands to the table they produce.

## When it runs

- "Wait, what?" "Where are we?" "I don't follow." "Back up."
- The person asks what is left, what is blocked, or who is waiting on whom.
- The conversation has scrolled past the state and the tree is the shortest way back to it.

It runs even when the answer is short. A single row is still a table.

## Where the state comes from

The tickets. Not the conversation, which the person has just read, and not your memory of it, which drifts.

```bash
waymark tree --root <map>          # the shape, and what is closed
waymark list --parent <map>        # status, and whether each child is ready
waymark show <id>                  # Progress, Review, waiting_on
```

Read `show` for the tickets that are in play: they carry `Progress`, the latest `Review`, and `waiting_on`, which the tree and the list do not. A ticket whose `waiting_on` is set is waiting on a person; that is a different row from one waiting on its own work.

When the run is not about a map, read the task's own ticket and its parent. The parent's `Target` says what the work is for, and that is often the thing the person has lost.

## The table

Four columns, in this order:

| Node | Status | Waiting on | Next |
|---|---|---|---|

- **Node**: the id and the title, shortened to what a reader recognizes.
- **Status**: `open`, `in_progress`, or `closed`. Closed rows are left out.
- **Waiting on**: the person named in `waiting_on`, or the work that blocks it, or `—` when nothing does.
- **Next**: who acts next — `me`, a person's name, or the skill that owns the step.

One row per node that is still moving. A map with nothing moving gets one row saying so, not an empty table.

The columns are fixed so two reports can be read against each other. Do not add a fifth column for a detail that belongs in a sentence under the table, and do not reorder them to tell a story.

Below the table, at most two lines: what the table cannot say — a decision that is stuck, a contradiction between two tickets. Not a summary of the work.

## What it does not do

- Resume the work. Reporting is not permission to continue; the person says what happens next.
- Decide anything. A question the person must answer stays a question.
- Narrate what was already said. The conversation is above; the table is not a retelling of it.
- Change a ticket. Reading `Progress` is not licence to write it.
