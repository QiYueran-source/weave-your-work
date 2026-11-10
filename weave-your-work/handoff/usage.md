# Using handoff

One worked pass over this repository. The session that split the session-skills map ended mid-way, and the work continued in a fresh one.

## What the document said

Written to `/tmp/handoff-session-skills.md`:

```md
# Handoff: session skills map

## Where this stopped

`wm-s4tvr121g3tv` is `in_progress` and split into two tasks. Both are `open`
and neither has been claimed:

- `wm-v2trg1ekayxp` Write the handoff skill
- `wm-4t2jjm21af74` Write the wait-what skill

The discussion that decided all of this is `wm-tky1bkwh57xp`, closed.

## What was tried and dropped

Three skills were taken from Matt's set at the start: chief-of-staff, handoff,
wait-what. chief-of-staff was dropped after two rounds: `execute-all` already
picks a map's tasks by owner and status, claims them, and sends each to its own
subagent, and the part it adds belongs to `split`. Retro went with it, because
its only caller was chief-of-staff. Do not reopen this.

wait-what was rewritten rather than ported. Matt's version re-pitches the
previous message; this one stops the work and shows the state of it in a table.

## What comes next

Write `weave-your-work/handoff/SKILL.md` and `usage.md`, then the same pair for
wait-what. The map's review point requires both, with `usage.md` beside each.

## Skills to load

- `handoff` for the task shape, if the next session is writing one rather than
  reading one.
- `execute-one-task` to advance `wm-v2trg1ekayxp`, which holds the steps.
- `task-review` once it reports back.

## Do not redo

- The map body is settled. Its `Decisions so far` holds nine entries, seven of them
  current, and its `Not yet specified` has nothing left unstruck.
- `split_as` is `task`. Do not add a child map under it.
- The testimony `wm-tky1bkwh57xp` is closed and linked; nothing needs rewriting.
```

## Why it looked like that

- The five sections are the five things the tickets do not hold. Every ticket reference is an id, not a restatement: the map's target is not repeated, and neither is the review point.
- "Do not redo" is the section that earns the document. The three dropped skills cost four rounds of discussion, and the next session would otherwise reopen them.
- `/tmp/handoff-session-skills.md` is outside the repository, so `git status` never sees it and no commit carries it.

## What it did not do

It did not start the next session, and it did not settle anything. The last decision of the session — that the worked pass goes in each skill's own `usage.md` rather than in the examples directory — was written into `wm-s4tvr121g3tv` before the handoff was written, and the document only points at it.
