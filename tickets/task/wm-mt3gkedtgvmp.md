---
schema: 1
id: wm-mt3gkedtgvmp
title: Write the issue skill
category: task
status: in_progress
owner: frank
creator: frank
created_at: 2026-11-08T10:55:52Z
updated_at: 2026-11-08T16:03:02Z
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
4. `bundle/setup.md`: the install steps, the channel, the webhook, the secret, the smee client, the listener, the session rule, and the catch-up.
5. The Node bundle `bundle/tools/`: the smee client, the webhook receiver, the frontmatter parse, the `to` routing through the installed skill's `bundle/tools/handles.toml`, and the append to `[pending].path`.
6. In this repository: the installed skill's handles file contains `[pending].path`; `.gitignore` includes `pending/`; the rule file is `bundle/rules/rules-pending-communications.md`, and its installed copy is `.agents/rules/rules-pending-communications.md`.
7. Verify the listener locally with a sample payload.
8. Person: create the smee channel, add the webhook, store the secret, and file a test communicate issue; watch the queue.
9. Install with `npx skills add`; no link outside the directory.
10. Say what the skill does not do.

## Configuration migration (confirmed 2026-11-09)

- Issue setup asks the person responsible for the project which owners and remote handles to record, then creates `handles.toml` in the installed skill's `bundle/tools/`. Repeated setup preserves an existing file. The `skills add --copy` installer deletes the destination on update, so the setup instructions require saving the file outside that directory and restoring it after an update; automatic preservation is not guaranteed.
- Migrate this repository's existing mapping and queue setting without losing data; leave the queue at the repository's `pending/pending-communications.md`. Use a path relative to the project root so the queue location does not depend on where the skill is installed.
- Update the listener, issue instructions, setup guide, bundled session rule, and this repository's installed rule to read the same configuration. Update the worked example to explain the change.
- Check first setup and repeat setup, the preserved mapping, queue resolution from an installed skill, and the listener with a local sample. The live GitHub and smee test remains separate.
- Do not change the communication protocol or claim to have tested real webhook delivery.

## Session-start queue check (confirmed 2026-11-09)

- Add a read-only Node checker under `bundle/tools/` and its installed copy. Read `handles.toml` beside the script and resolve `[pending].path` from the project root; output the number of queue entries, their titles and links, or nothing for a missing or empty queue. Do not modify the queue or process an issue.
- Keep the session-start rule as the default. In `bundle/setup.md`, explain that an agent may adapt the checker to a harness's session-start hook only after checking that harness's documentation and verifying the output reaches the agent; otherwise the rule remains the fallback. No harness-specific plugin or file watcher is included.
- Test missing, empty and populated queues, custom paths, malformed input and read errors; check that the source and installed copies match. Record any harness integration not actually tested.

## Acceptance signal

`weave-your-work/issue/` holds `SKILL.md`, `github.md`, `gitee.md`, and `bundle/` with `setup.md`, `rules/`, and `tools/`. A communicate issue filed on GitHub with the frontmatter reaches the queue through smee; the session rule surfaces the count and titles at the next session; a decision that changes a map or task lands there; a rejection lands in the map's `Out of scope`; the issue closes. The listener queues a sample payload locally. Gitee's write path is a recorded gap.

## Boundaries

- No triage state machine; triage remains its own skill.
- No action on a queued issue without the person asking.
- The listener only queues and surfaces; it does not file, reply, or land.
- Gitee writes deferred.

## Progress

The listener passed local payload tests and a temporary live GitHub → smee → listener test on 2026-11-09; the test issue was closed and the temporary webhook removed. This did not configure a persistent channel or service, and session-start notification has not been verified.
The configuration migration is implemented: the tracked installed skill holds the existing owner mapping and a root-relative queue path. A local signed payload test covers the adjacent config, custom and default queue paths, reverse mapping, deduplication, and signature rejection. A temporary `skills add --copy` reinstall removed the config; backing it up and restoring it retained its contents. Setup describes creation and preservation, but the interactive setup has not been run with a project owner.

The read-only Node queue checker is implemented in the source and installed skill. Tests cover missing and empty queues, a custom root-relative path, titles with separators, control-character escaping, unchanged queue contents, invalid entries and configuration, and a queue read error. A copied skill includes the checker. No harness hook or new-session delivery has been tested.

Next: review the skill, decide how to address the listener security issues recorded in the map, and verify session-start notification in the intended harness.
