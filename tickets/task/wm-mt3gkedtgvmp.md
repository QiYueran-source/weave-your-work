---
schema: 1
id: wm-mt3gkedtgvmp
title: Write the issue skill
category: task
status: in_progress
owner: frank
creator: frank
created_at: 2026-11-08T10:55:52Z
updated_at: 2026-11-08T14:06:34Z
parent: wm-25b3q7mg88c7
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
  waiting_on: 'frank: review the issue skill and the two design decisions'
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
8. Verify every GitHub command against a scratch repository. Gitee's write path is deferred to the end-to-end batch; its reads and write endpoints are checked.
9. Install with `npx skills add` and check that no link points outside the skill's directory.
10. Say what the skill does not do.

## Acceptance signal

`weave-your-work/issue/` holds `SKILL.md`, `github.md`, and `gitee.md`. A reader holding one ticket with a foreign dependent, one task with a `Person:` step, and one child waiting on a closed parent can take each through file, read, reply, land, and close on GitHub. Every GitHub command was run against a scratch repository and its output recorded. Gitee's write path is a recorded gap, exercised in the end-to-end batch. The skill installs with `npx skills add` without a YAML parse error and holds no link outside its own directory.

## Result

`weave-your-work/issue/` holds `SKILL.md` (155 lines), `github.md` (89), and `gitee.md` (125). It installs with `npx skills add` and the copied files match the source.

GitHub's five actions were run end to end on a private scratch repository on 2026-11-08: `gh issue create` printed the URL, `--search` missed the new issue for a few seconds and the open-issue list found it, `gh issue view --json` returned the body and comments, `gh issue comment` posted, and `gh issue close --comment --reason completed` closed with the comment. `--assignee` was run separately: the issue's `assignees` field carried the account, and `gh api users/<login>` returned the canonical login. The repository was archived after the runs.

Gitee's list, view, comments, and user lookup were run against `oschina/git-osc`; its create, update, and comment endpoints returned 401 rather than 404 with an invalid token, confirming the paths and methods. The write path is the deferral the user made on 2026-11-08.

Six blind reads walked the archive, human-step, foreign-parent, outside-proposal, proposal re-read, and archive-with-roster cases; each could execute the skill, and the boundary gaps they found are fixed. `.waymark/handles.toml` holds the sample mapping and parses as TOML.

The skill does not use the comment category; whether it stays belongs to the execution map.

## Review

needs discussion

- Goal: the skill is built and GitHub-verified, but the owner has not read it; the earlier `passed` verdict was written before that review and is withdrawn.
- Convention: the close was premature; the ticket is reopened for the owner's review of the skill and the two design decisions.

## Boundaries

- No triage state machine, no labels, no queue.
- No ticket creation from an issue; an accepted proposal goes through split.
- No automatic sync, polling, or webhooks.
- No writing a ticket the run does not own.

## Progress

Where it stands: reopened after a premature close; the owner has not reviewed the skill or the two design decisions.
Next: the owner reads the skill and says what to change.
