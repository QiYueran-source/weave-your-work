---
schema: 1
id: wm-kzef9tcn7dsf
title: Isolate the issue listener and checker per project
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T11:24:33Z
updated_at: 2026-11-10T11:33:31Z
closed_at: 2026-11-10T11:33:31Z
parent: wm-zhxe0hsnpf34
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Deliver a listener and checker that read the selected project's configuration and never a shared skill directory's copy.

1. Copy `weave-your-work/setup/bundle/tools/project-root.cjs` byte-for-byte to `weave-your-work/issue/bundle/tools/project-root.cjs`. Keep the `.cjs` extension so a `"type": "module"` package cannot change how Node loads it.
2. In `listener.mjs` and `check-pending.mjs`, resolve the project with `resolveProjectRoot`: an explicit `--project` wins; otherwise discover from the working directory. Replace `process.cwd()` and the roster read beside the tools.
3. Read the roster from `<root>/.work-weave/issue/handles.toml`. Resolve `[pending].path` against the root; default to `.work-weave/pending/pending-communications.md`. Read the expected repository from `<root>/.work-weave/local/issue-listener.env` key `REPOSITORY`, formatted `owner/repo`. Fail at startup when it is missing.
4. Reject an event whose `repository.full_name` is missing or differs from `REPOSITORY`: log the reason and append nothing. This is isolation, not authentication; keep the existing author check against the roster.
5. Add tests under `weave-your-work/issue/bundle/tools/tests/` for two project roots with separate rosters and queues, explicit and discovered roots, a missing or invalid `.work-weave`, and a missing or mismatched event repository. Keep the existing catch-up and security tests passing.

## Acceptance signal

`node --test` in `weave-your-work/issue/bundle/tools/` passes. The tests show that a listener for root A never reads root B's roster or writes root B's queue, and that a mismatched event leaves the queue unchanged and logs the mismatch. The tools run under a `"type": "module"` package.

## Result

Delivered `project-root.cjs` in the issue tools, project resolution in `listener.mjs` and `check-pending.mjs`, the roster at `.work-weave/issue/handles.toml`, the queue default at `.work-weave/pending/pending-communications.md`, settings from `.work-weave/local/issue-listener.env`, and rejection of events whose `repository.full_name` is missing or differs from `REPOSITORY`.

`node --test` in `weave-your-work/issue/bundle/tools/` passed 42 top-level tests (47 including subtests) on Linux, including two project roots with separate rosters and queues, explicit and discovered roots, missing and invalid `.work-weave`, missing and mismatched event repositories, a missing `REPOSITORY`, environment override, and `type: module` execution. Windows and macOS were not tested.

Decisions: `check-pending.mjs` does not require `REPOSITORY` because it only reads the queue; catch-up still derives its repository from `origin` and the repository check applies to webhook events; a rejected event returns 202 `queued 0` and logs the reason; `full_name` is compared exactly; `--project` accepts both separated and `=` forms; a malformed settings line stops startup.

## Review

passed

- Goal: the tests above exercise the acceptance signal, including two independent roots and a rejected mismatched event that leaves the queue unchanged. The listener and checker use the same resolver, and the tools run under a `type: module` package.
- Convention: the change stays inside the issue tools and their tests. No lock, service, setup-document, roster-data, or installed-rule change was made.

## Boundaries

- No service install, systemd unit, port selection, lock, or migration; those are separate tasks.
- No change to the issue frontmatter, routing rules, or author check.
- No deletion of an existing roster or queue.
- No edit to the setup bundle.
