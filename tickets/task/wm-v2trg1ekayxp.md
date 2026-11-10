---
schema: 1
id: wm-v2trg1ekayxp
title: Write the handoff skill
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-10T06:52:20Z
updated_at: 2026-11-10T06:52:20Z
parent: wm-s4tvr121g3tv
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `weave-your-work/handoff/SKILL.md` and `weave-your-work/handoff/usage.md`, the skill that compacts a session into a document the next agent starts from.

1. State the trigger: the session is ending or its context is about to be lost, and the work continues in another one.
2. Say where the document goes: the operating system's temporary directory, `$TMPDIR` else `/tmp`, `%TEMP%` on Windows — never the workspace, and never a ticket.
3. Say what it must cite rather than restate: the map and task ids, the tickets, the ADRs, the commits and the diffs. Restating them makes a second copy that drifts.
4. Say what it must carry, because the tickets do not: where the session stopped, what was tried and dropped, what the next step is, which skills the next agent should load, and what not to redo.
5. Say it is redacted: no secrets, no keys, no personal data.
6. Say that naming what the next session is for tailors the document, and that no argument leaves a general hand-off.
7. Say what it does not do: it does not start the next agent, and it does not settle a decision — that goes in the ticket before the hand-off is written.
8. Write `usage.md` as one worked pass over this session's own map and testimony: the document that would have been written, with its citations.

## Acceptance signal

Both files exist and `npx skills add` parses the front matter without a skip. `SKILL.md` names the temporary-directory rule, the cite-don't-restate rule, the five things the document carries, the redaction rule, and the fact that it starts nothing. `usage.md` shows one document with every citation resolved to a real path or id in this repository. A reader who did not sit in the session can produce a hand-off from the file alone.

## Boundaries

- No change to any other skill.
- The hand-off document itself is not written into the repository.
