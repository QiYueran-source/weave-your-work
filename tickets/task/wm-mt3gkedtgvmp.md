---
schema: 1
id: wm-mt3gkedtgvmp
title: Write the issue skill
category: task
status: in_progress
owner: frank
creator: frank
created_at: 2026-11-08T10:55:52Z
updated_at: 2026-11-08T15:38:34Z
parent: wm-25b3q7mg88c7
custom_fields:
  needs_human: true
  reversibility: two_way
  task_kind: delivery
  waiting_on: 'frank: smee channel and webhook'
---
## Action

Build the communicate-issue skill and its listener from the 2026-11-08 grill.

1. `SKILL.md`: the trigger, the frontmatter form, the five actions — file, listen, read and reply, land, close — and the local-artifact test.
2. `github.md`: the commands for file, search/view, comment, close, the mention and assignee, the frontmatter, and the catch-up query.
3. `gitee.md`: the reads; the writes marked deferred.
4. `smee-setup.md`: the channel, the webhook, the secret, the smee client, the listener, the session rule, and the catch-up.
5. The Node bundle `bundle/`: the smee client, the webhook receiver, the frontmatter parse, the `to` routing through `.waymark/handles.toml`, and the append to `[pending].path`.
6. In this repository: `.waymark/handles.toml` gains `[pending].path`; `.gitignore` gains `pending/`; the rule template is `bundle/rules/06-pending-communications.md`, and its installed copy is `.agents/rules/06-pending-communications.md`.
7. Verify the listener locally with a sample payload.
8. Person: create the smee channel, add the webhook, store the secret, and file a test communicate issue; watch the queue.
9. Install with `npx skills add`; no link outside the directory.
10. Say what the skill does not do.

## Acceptance signal

`weave-your-work/issue/` holds `SKILL.md`, `github.md`, `gitee.md`, `smee-setup.md`, and the listener. A communicate issue filed on GitHub with the frontmatter reaches the queue through smee; the session rule surfaces the count and titles at the next session; a decision that changes a map or task lands there; a rejection lands in the map's `Out of scope`; the issue closes. The listener queues a sample payload locally. Gitee's write path is a recorded gap.

## Boundaries

- No triage state machine; triage remains its own skill.
- No action on a queued issue without the person asking.
- The listener only queues and surfaces; it does not file, reply, or land.
- Gitee writes deferred.

## Progress

Where it stands: the skill files, the Node listener in `bundle/`, the handles config, the gitignore entry, and the session rule template are written; the listener passed a local test (a valid signature queues, a bad signature returns 401, a non-communicate issue is skipped); the live smee and GitHub path waits on the owner's channel and webhook.
Next: the owner sets up smee and the webhook, files a test communicate issue, and reviews the skill.
