---
schema: 1
id: wm-0p0kkcgykds0
title: Update every reader, service unit, message, and guide to the new work-weave paths
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-20T02:38:19Z
updated_at: 2026-11-20T03:53:26Z
closed_at: 2026-11-20T03:52:15Z
parent: wm-pxg2hm3b1bwv
---
Part of wm-pxg2hm3b1bwv

## What to do

After the move, the installed tools, the settings, the service, and every
document that names one of these paths point at the new locations: the roster is
read from `shared/handles.toml`, the settings and unit live directly under
`personal/`, and the queue home is a directory under `personal/`.

## Acceptance criteria

- [x] The listener, the pending checker, and the configurator read the roster
      from `shared/handles.toml` and the settings from
      `personal/issue-listener.env`.
- [x] The service unit is written under `personal/` and linked again; the unit
      written under the old path is not left behind.
- [x] Error messages that name the roster name its new path.
- [x] The install guides, the session-start rule, and the message format file
      carry the new paths and no old one.
- [x] The tests that build a temporary checkout use the new layout and pass.

## The result

Every reader that belongs to this ticket names the new paths: check-setup and its
tests, the configurator and its tests, the install guides, the service guides,
the glossary, ADR, and message documents, the rules, and the roster example.

- `check-setup.mjs` reads the roster from `.work-weave/shared/handles.toml`, the
  ADR and glossary servers from `.work-weave/personal/<tool>/`, the unit and
  `issue-listener.env` from `.work-weave/personal/`, and check 18 asks
  `git check-ignore` for `.work-weave/personal/`. Its roster failures name the
  path.
- `configure.mjs` writes `personal/issue-listener.env` and the unit under
  `personal/`; after writing the new unit it removes the one at the old path and
  prints the unlink/link commands. `test-configure.mjs` builds the new layout and
  covers the removal.
- The guide, format, and rule files carry the new paths. The roster example says
  `shared/handles.toml` and queues at `personal/communication/pending.jsonl`.
- `scripts/check-records.mjs` reads the queue from its new path.
- `node weave-your-work/setup/tools/check-setup.mjs --all` reports checks 12 and
  16 with their new-path reasons, and no failure from a path that no longer
  exists. Checks 4 and 10 fail for unrelated reasons: `gh` is not signed in here,
  and `waymark validate` reports two long IDs among untracked tickets. Check 17
  is unverified because the webhook cannot be read without `gh`.
- `node --test weave-your-work/setup/tools/check-setup.test.mjs` and
  `node --test weave-your-work/setup/tools/issue/tests/test-configure.mjs` pass,
  as do the glossary, ADR, migration, and project-root tests.
- `git grep -n 'work-weave/issue/\|/local/issue-listener.env\|work-weave/runtime/'`
  returns only `listener.mjs`, `check-pending.mjs`, and the issue tests, which
  another ticket edits, plus historical tickets and the changelog.

## Blocked by

- wm-qcpqx8ed54jy
