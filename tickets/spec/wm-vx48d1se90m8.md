---
schema: 1
id: wm-vx48d1se90m8
title: Stop the automatic rule set and scope this repository to weave-your-work/
category: spec
status: closed
owner: frank
creator: frank
created_at: 2026-11-22T12:02:16Z
updated_at: 2026-11-22T12:13:18Z
closed_at: 2026-11-22T12:13:18Z
---
## Problem Statement

AGENTS.md makes every session read and follow `.agents/rules/`. The first rule
sends the agent to `.work-weave/`, and the change rules send it to `tickets/`. An
ordinary request about `weave-your-work/` therefore drags the agent through
`.agents/`, `.work-weave/`, `docs/`, and `tickets/` before it reaches the
directory the request is about. The owner reported that overhead as noise.

## Solution

A session opens on the working area alone. `AGENTS.md` states that
`weave-your-work/` is what a change means, and that no automatic rule set applies
yet. The rules that were in force move to the ignored inbox, intact, so any of
them can be brought back when a need shows up.

## User Stories

1. As the owner, I want a session to open on `weave-your-work/`, so that a
   request about the skill set does not start with three other trees.
2. As the owner, I want the retired rules kept on disk, so that switching them
   back on costs a move rather than a rewrite.
3. As an agent starting a session, I want one short file saying what to work on,
   so that I don't decide which of ten rules governs this request.
4. As a reader arriving later, I want the removal to be a record, so that the
   missing rules read as a decision and not as an accident.

## Implementation Decisions

- `.agents/` moved to `.inbox/archive/2026-11-22-rules-off/agents/`. The inbox is
  gitignored, so Git records the deletion and the files survive.
- `AGENTS.md` was replaced by a scope note naming `weave-your-work/` as the
  working area and saying no automatic rule set applies.
- No other root directory moved.

## Acceptance

The delivery: knock the automatic rule set off and scope the checkout to
`weave-your-work/`.

The judgement: `.agents/` is absent from the root, the ten rule files survive
under `.inbox/`, and `AGENTS.md` names the working area without pointing at a
rule directory.

## Out of Scope

- `docs/`, `tickets/`, `.waymark/`, `.work-weave/`, `weave-your-work/`,
  `work-weaver/`, and `scripts/` stay where they are.
- Rewriting the retired rules for the inbox. They were moved as they stood.
