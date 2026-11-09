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

## Communicate issue protocol (confirmed 2026-11-09)

- Write `communicate-issue.md` as the single definition of the format, keeping `SKILL.md` as the summary that points to it. A communicate issue is a GitHub issue whose body opens with frontmatter; ordinary issues are not communicate issues and the listener ignores them.
- Require `kind: communicate`, a `category` of `request`, `result`, or `comment`, a `from` naming the local owner, a `to` list holding exactly one GitHub handle, and a non-empty `tickets` list of existing map or task ids. The first ticket is the main one and the title carries it. All three categories enter the queue.
- Do not build a tree of issues: link a related issue in the body. A message for several people is several issues.
- The sender closes a `request` after checking the answer; the recipient closes a `result` or `comment` after reading it. A message that must stay open is not closed before its recipient has seen it, because the startup scan reads open issues only.
- Confirm referenced tickets before filing; sync the main branch or name the version when the recipient may not have it. On receipt, a missing ticket does not discard the message; confirm the ticket and version before acting.
- Reject the old format rather than supporting both. No open communicate issue exists in this repository, so nothing needs migrating. Existing queue entries stay untouched.
- Validate in the listener and log the failing field; do not use the GitHub issue author as `from`. `from` is a format check, not proof of identity.
- Redact the smee channel URL from the listener's log while keeping connection and error messages.
- Stop treating `issue_comment` as a listener event: messages travel as issues, and ordinary comments stay in the thread.
- Do not remove the local Waymark `comment` category in this step; its remaining uses are recorded separately.

## Test directory (confirmed 2026-11-09)

- Keep the security and catch-up regression tests, but move them from `bundle/tools/` to `bundle/tools/tests/` in both the source skill and the installed copy. Adjust their paths to the listener and dependencies, and update the research note's test link without changing the historical command.
- Run both test suites from their new locations, verify the two copies match, and leave the runtime tools, configuration, and queue unchanged.

## Session-start queue check (confirmed 2026-11-09)

- Add a read-only Node checker under `bundle/tools/` and its installed copy. Read `handles.toml` beside the script and resolve `[pending].path` from the project root; output the number of queue entries, their titles and links, or nothing for a missing or empty queue. Do not modify the queue or process an issue.
- Keep the session-start rule as the default. In `bundle/setup.md`, explain that an agent may adapt the checker to a harness's session-start hook only after checking that harness's documentation and verifying the output reaches the agent; otherwise the rule remains the fallback. No harness-specific plugin or file watcher is included.
- Test missing, empty and populated queues, custom paths, malformed input and read errors; check that the source and installed copies match. Record any harness integration not actually tested.

## Earlier listener security fix (superseded in part)

- Require a non-empty `WEBHOOK_SECRET` before the listener binds; reject requests with missing or invalid `X-Hub-Signature-256`, verifying the original request bytes before parsing or queueing. Do not add an unsigned mode.
- Write new queue records as one structured JSON object per Markdown list line, encoding every remote value so newlines, separators and control characters cannot create extra records. Keep the queue file and path. Update the checker to read both the new records and existing legacy lines without rewriting the existing file; old entries remain untrusted and their integrity cannot be retroactively guaranteed. Update the skill and setup documentation to explain the format and compatibility.
- Test listener startup with a missing or empty secret; missing, incorrect and valid signatures; Unicode payloads; malicious delimiters and line breaks in remote fields; multiple recipients and redelivery. Check that each new record remains one line and the checker reports existing and new entries. Run tests against temporary queues without altering this repository's queue, and keep the source and installed copies consistent.
- Do not install a persistent webhook or service, change unrelated delivery behavior, or claim a new live smee test unless one is performed.

## Internal smee delivery (confirmed 2026-11-09)

- Default to receiving smee events without a webhook secret or signature verification. If `WEBHOOK_SECRET` is set, retain strict signature verification for a byte-preserving transport; smee reserialization may cause valid signatures to fail. Keep JSON queue encoding, deduplication, legacy queue compatibility, and the rule that the agent does not act on entries until the person asks.
- Update the listener, tests, source and installed skill instructions and setup. Explain that anyone who knows the channel URL can send or view events, sender identity is not verified, smee is intended for development, and offline listeners may miss events; ask the person to verify uncertain messages on GitHub. Do not configure a real channel or modify the local queue.
- Test the default path without a secret, including missing or invalid signature headers and reserialized JSON; also test that a configured secret enforces signatures. Retain the queue safety and compatibility tests. Record what has not been verified with a live smee channel or session-start integration.

## Startup catch-up (confirmed 2026-11-09)

- On listener startup, use authenticated GitHub access to list all open issues in the current project's repository, with pagination, and filter issue frontmatter for `kind: communicate` and recipients. Do not rely on mention search or scan other repositories. Reuse queue encoding and exact `(url, to)` deduplication; preserve existing entries and the human-approval rule. The current project means the repository identified from its Git remote; do not guess if it cannot be identified.
- Coordinate the startup scan and live stream to avoid a gap for issues created during startup. If the repository cannot be resolved or the scan fails, report the error clearly rather than claiming catch-up succeeded. Do not add polling or reconnect catch-up; closed issues remain outside this scan.
- Update the source and installed listener and their setup and skill instructions. Test pagination, filtering, multi-recipient routing, existing entries, repeated startup, scan failure, and an issue arriving during startup in isolated queues. Then test an issue created while offline in a private GitHub repository; leave the existing local queue and persistent configuration unchanged. Session-start notification remains a separate test.
- The person confirmed this implementation and test plan.

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

The security fix now rejects startup without a secret, checks the received bytes, and stores new entries as JSON list items. Seven local integration tests cover missing and invalid signatures, split UTF-8, malicious fields, multiple recipients, redelivery, mixed legacy entries, missing final newlines, and malformed queues. The local test also confirms that signing noncanonical JSON and forwarding a reserialized body causes rejection; it does not contact smee.

The upstream smee server emits parsed JSON and the bundled client reserializes it, which can invalidate GitHub's signature even when a delivery is legitimate. [Research](../../docs/smee-signature-research.md) records the sources and candidate alternatives. The default smee path now accepts events without verification; a configured secret still enables strict verification. Local tests cover both modes and queue safeguards.

On 2026-11-09, an unsigned GitHub issues webhook delivered a new communicate issue through a temporary smee channel to the installed listener code using an isolated configuration and queue. The queue contained one entry with the expected URL, title, sender, recipient, and owner; GitHub reported HTTP 200 for the delivery. The test issue was closed, the webhook removed, and the private test repository archived. The existing local queue was not changed. This tests one live delivery, not offline recovery or session-start notification.

On 2026-11-09, two private test issues were opened while the listener was offline. GitHub reported successful webhook delivery to temporary smee channels, but the first issue did not appear in the isolated queue after the listener reconnected. The documented open-mention catch-up search did not return the first issue in seven attempts over about one minute, or the second in eleven attempts over about three minutes. Repository-scoped searches without the mention filter found each open issue. After both issues were closed and the repositories archived, closed-mention searches found them; this does not establish whether indexing delay, issue state, or another factor caused the earlier misses. Both issues were closed and both temporary webhooks removed; the existing queue was not changed. Recovery into the queue and deduplication could not be tested through the documented search, and a cross-account test remains open.

A later private live test created an issue while the listener was offline, then started the listener with a temporary smee channel and isolated Git configuration and queue. Startup catch-up recovered the issue with the expected sender, recipient, owner, and URL. A second startup added no duplicate; the checker reported the recovered entry. The test issue was closed, its webhook removed, the private repository archived, and the isolated files removed. This tests one self-addressed issue, not cross-account delivery, closed issues, or reconnect recovery.

The isolated startup tests cover paginated results, mapped recipients, malformed issues, duplicate entries across restarts, a live webhook during a delayed scan, and GitHub or repository errors. After moving the tests into `tools/tests/`, the installed security and catch-up tests passed, as did the source catch-up tests; both source tests match their installed copies.

The communicate issue protocol is implemented in `communicate-issue.md` and the listener. Tests cover each category, ordinary issues, a missing or unknown `category`, several or non-list `to` values, empty `tickets`, an empty `from`, and a missing title; each invalid message is skipped. The smee channel URL stays out of the log. The source and installed security and catch-up suites pass from `tools/tests/`.

Next: deploy a listener for this repository and verify a full exchange; the session-start rule was reported to work by the owner but has not been recorded in this repository's tests.
