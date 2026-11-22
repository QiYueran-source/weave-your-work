---
schema: 1
id: wm-gkx8ep14myek
title: Move .agents into the inbox and replace AGENTS.md with a scope note
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-22T12:02:31Z
updated_at: 2026-11-22T12:13:22Z
closed_at: 2026-11-22T12:13:22Z
---
wm-vx48d1se90m8

## What to do

The session opens on `weave-your-work/` and nothing else. `.agents/` is gone from
the repository root, its rule files are kept on disk under the ignored inbox, and
`AGENTS.md` says what the checkout is for.

## Acceptance criteria

- [ ] `ls -a` no longer lists `.agents` at the repository root.
- [ ] `.inbox/archive/2026-11-22-rules-off/agents/rules/` holds all ten rule files.
- [ ] `AGENTS.md` no longer points at `.agents/`.
- [ ] Every other root directory is unchanged.

## The result

`.agents/` is gone from the root and its ten rule files sit in
`.inbox/archive/2026-11-22-rules-off/agents/rules/`. `AGENTS.md` is the scope
note, with no rule link left in it.

## Blocked by

None (can start immediately).
