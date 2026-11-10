---
schema: 1
id: wm-4t2jjm21af74
title: Write the wait-what skill
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-10T06:52:28Z
updated_at: 2026-11-10T06:52:28Z
parent: wm-s4tvr121g3tv
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `weave-your-work/wait-what/SKILL.md` and `weave-your-work/wait-what/usage.md`, the skill that stops the work and shows the state of it in one table.

1. State the trigger: the person has lost the thread — "wait, what", "where are we", "I do not follow" — and wants the state, not an apology and not a re-pitch of the last message.
2. Say the source of the state: the tickets. `waymark tree --root <map>` for the shape, then the status, `Progress`, `Review`, and `waiting_on` of the tickets in play. Not the conversation, which the person has just read.
3. Fix the columns: node, status, what it is waiting on, who acts next. Fixed so two reports can be compared.
4. Give the output shape: a short table, one row per node that is still moving, closed work left out; at most a line under it for what the table cannot say.
5. Say what it does not do: it does not resume work, does not decide anything, and does not narrate what was already said.
6. Write `usage.md` as one worked pass: the table for this map as it stood before the split.

## Acceptance signal

Both files exist and `npx skills add` parses the front matter without a skip. `SKILL.md` names the four columns, the commands that fill them, the exclusion of closed work, and the no-resume rule. `usage.md` holds one table whose every row matches a ticket in this repository. A reader can produce the table from the file alone without rereading the conversation.

## Boundaries

- No change to any other skill.
- No new ticket, and no status change, while reporting.
