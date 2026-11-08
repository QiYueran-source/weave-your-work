---
schema: 1
id: wm-mt3gkedtgvmp
title: Write the issue skill
category: task
status: in_progress
owner: frank
creator: frank
created_at: 2026-11-08T10:55:52Z
updated_at: 2026-11-08T13:41:38Z
parent: wm-25b3q7mg88c7
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
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

## Boundaries

- No triage state machine, no labels, no queue.
- No ticket creation from an issue; an accepted proposal goes through split.
- No automatic sync, polling, or webhooks.
- No writing a ticket the run does not own.

## Progress

Where it stands: the four design questions are settled as revisable decisions; six reads walked the callers, the proposal case, and the archive case with the roster, and the gaps they found are fixed; the skill asks first, mentions and assigns a verified handle, and lands a rejected proposal in the map's `Out of scope`. `.waymark/handles.toml` exists and resolves `frank`; GitHub's five actions and the assignee path are verified; Gitee's write path is deferred.
Next: get the user's confirmation on the two agent decisions — the triage landing and the handles roster — then write `Result` and `Review` and close the task and the map.
