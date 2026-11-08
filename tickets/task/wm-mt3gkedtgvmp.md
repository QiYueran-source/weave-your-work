---
schema: 1
id: wm-mt3gkedtgvmp
title: Write the issue skill
category: task
status: in_progress
owner: frank
creator: frank
created_at: 2026-11-08T10:55:52Z
updated_at: 2026-11-08T11:11:21Z
parent: wm-25b3q7mg88c7
custom_fields:
  needs_human: true
  reversibility: two_way
  task_kind: delivery
  waiting_on: 'frank: Gitee token and Gitee test repository'
---
## Action

Write `weave-your-work/issue/`: carry a ticket's message to GitHub or Gitee, read the answer, and land the decision on the ticket that owns it.

1. State the trigger: a ticket needs another owner to decide or do something, or its owner is waiting on an answer that exists only in a remote thread.
2. The five actions in three moves — file, read and reply, land and close — each with a completion criterion.
3. The issue shape: the title carries the ticket id; the body carries the recipient, the ticket, the ask, and where the answer lands. No labels by default.
4. The decision test: an answer is a decision when it changes a ticket's text, status, or relations, or settles a fact the ticket already cites. Only the ticket's owner writes it.
5. Write-back: a map's `Decisions so far`, a task's affected section, or `Result` for a person's answer, with the issue URL as the source. A decision that changes no ticket stays remote.
6. `github.md`: the `gh` commands for file, list/search, view, comment, and close, with the JSON fields each one needs.
7. `gitee.md`: the REST calls for the same five actions, the token setup, and the response fields.
8. Verify every command against a scratch repository on GitHub and on Gitee. Person: set `GITEE_TOKEN` in the environment with a token that can read and write issues, name a Gitee repository the run may file a test issue in, and confirm the GitHub scratch repository.
9. Install with `npx skills add` and check that no link points outside the skill's directory.
10. Say what the skill does not do.

## Acceptance signal

`weave-your-work/issue/` holds `SKILL.md`, `github.md`, and `gitee.md`. A reader holding one ticket with a foreign dependent, one task with a `Person:` step, and one child waiting on a closed parent can take each through file, read, reply, land, and close on both platforms. Every command in the two references was run against a scratch repository and its output recorded. The skill installs with `npx skills add` without a YAML parse error and holds no link outside its own directory.

## Boundaries

- No triage, labels, assignment, or queue.
- No ticket creation from an issue; an accepted proposal goes through split.
- No automatic sync, polling, or webhooks.
- No writing a ticket the run does not own.

## Progress

Where it stands: GitHub's five actions are verified end to end; two blind reads walked the archive and human-step cases and the eight boundary gaps they found are fixed; Gitee's write path waits on a token and a test repository.
Next: run Gitee's create, comment, and close, record both platforms' outputs in `Result`, then close the task and the map.
