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
Stop the automatic rule set and scope this repository to weave-your-work/

## Problem

AGENTS.md makes every session read and follow .agents/rules/. The first rule
sends the agent to .work-weave/, and the change rules send it to tickets/. So an
ordinary request about weave-your-work/ first drags the agent through .agents/,
.work-weave/, docs/, and tickets/, which is the noise the owner is complaining
about.

## Solution

1. Move .agents/ to .inbox/archive/2026-11-22-rules-off/agents. It is gitignored
   and stays on disk.
2. Rewrite AGENTS.md to say the working area is weave-your-work/ and that no
   automatic rule set applies. Rules get added again when there is a need.
3. Leave every other directory at the repository root.

## Acceptance

The delivery: knock the automatic rule set off and scope the checkout to
`weave-your-work/`.

The judgement: `.agents/` is absent from the root, the ten rule files survive
under `.inbox/`, and `AGENTS.md` names the working area without pointing at a
rule directory.

## Out of scope

- docs/, tickets/, .waymark/, .work-weave/, weave-your-work/, work-weaver/, scripts/
  do not move.
- No ticket is written for this change: step 2 removes the record-keeping rule
  that would ask for one, so the spec above is the only record.
