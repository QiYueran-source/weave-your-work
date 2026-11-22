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
# Move .agents into the inbox and replace AGENTS.md with a scope note

Spec: wm-vx48d1se90m8

## Action

1. `mv .agents .inbox/archive/2026-11-22-rules-off/agents`, keeping the files on
   disk. The inbox is gitignored, so Git records `.agents/` as deleted.
2. Replace `AGENTS.md` with the text below.

```markdown
# Working in this repository

The working area is `weave-your-work/`, the source of the skill set. Anyone
asking for a change here means a change to that directory.

No automatic rule set applies in this repository right now. Rules from
`.agents/rules/` were moved to the inbox and are off; add new ones when a
need shows up.
```

## The result

`.agents/` is gone from the root and its ten rule files sit in
`.inbox/archive/2026-11-22-rules-off/agents/rules/`. `AGENTS.md` is the scope
note, with no rule link left in it.

## Acceptance

- `ls -a` no longer lists `.agents` at the repository root.
- `.inbox/archive/2026-11-22-rules-off/agents/rules/` holds all ten rule files.
- `AGENTS.md` no longer points at `.agents/`.
- Every other root directory is unchanged.

## Out of scope

`docs/`, `tickets/`, `.waymark/`, `.work-weave/`, `weave-your-work/`,
`work-weaver/`, and `scripts/` stay where they are.
