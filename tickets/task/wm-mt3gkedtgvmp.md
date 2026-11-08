---
schema: 1
id: wm-mt3gkedtgvmp
title: Write the issue skill
category: task
status: in_progress
owner: frank
creator: frank
created_at: 2026-11-08T10:55:52Z
updated_at: 2026-11-08T14:56:58Z
parent: wm-25b3q7mg88c7
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Build the communicate-issue skill and its listener from the 2026-11-08 grill.

1. `SKILL.md`: the trigger, the frontmatter form, the five actions — file, listen, read and reply, land, close — and the local-artifact test.
2. `github.md`: the commands for file, search/view, comment, close, the mention and assignee, the frontmatter, and the catch-up query.
3. `gitee.md`: the reads; the writes marked deferred.
4. `smee-setup.md`: the channel, the webhook, the secret, the smee client, the listener, the session rule, and the catch-up.
5. The listener: parse the frontmatter, route `to` through `.waymark/handles.toml`, append to the `[pending].path` queue.
6. In this repository: `.waymark/handles.toml` gains `[pending].path`; `.gitignore` gains `pending/`; `.agents/rules/06-pending-communications.md` is added.
7. Verify the listener locally with a sample payload; the live smee and GitHub path waits on the owner's channel and webhook.
8. Install with `npx skills add`; no link outside the directory.
9. Say what the skill does not do.

## Acceptance signal

`weave-your-work/issue/` holds `SKILL.md`, `github.md`, `gitee.md`, `smee-setup.md`, and the listener. A communicate issue filed on GitHub with the frontmatter reaches the queue through smee; the session rule surfaces the count and titles at the next session; a decision that changes a map or task lands there; a rejection lands in the map's `Out of scope`; the issue closes. The listener queues a sample payload locally. Gitee's write path is a recorded gap.

## Boundaries

- No triage state machine; triage remains its own skill.
- No action on a queued issue without the person asking.
- The listener only queues and surfaces; it does not file, reply, or land.
- Gitee writes deferred.

## Progress

Where it stands: the 2026-11-08 grill settled the design; the first draft is parked at `.inbox/issue/`; the handles config, the gitignore entry, and the session rule are in place; the build starts.
Next: write the skill files and the listener, test the local queue, then the live smee path with the owner.
