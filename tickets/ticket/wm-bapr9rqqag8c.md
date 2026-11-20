---
schema: 1
id: wm-bapr9rqqag8c
title: The listener records pull request and default-branch events, and warns nobody
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-20T02:38:46Z
updated_at: 2026-11-20T03:48:54Z
closed_at: 2026-11-20T03:48:54Z
parent: wm-cf08pxghnady
---
Part of wm-cf08pxghnady

## What to do

The listener receives a pull request opening and a pull request merge or a push
to the default branch, and writes each to one bounded event file. It warns
nobody.

## Acceptance criteria

- [x] A pull request opened event writes one line naming the number, the title,
      and the roster logins that hold write or admin on the repository.
- [x] Merge rights are read from GitHub at the moment the event arrives; a
      collaborator listing that fails writes no line and logs the failure.
- [x] A merge and a push to the default branch write the same kind, naming the
      commit the default branch now points at.
- [x] A push to any other branch writes no line.
- [x] An event the listener cannot confirm against GitHub writes no line and
      logs one.
- [x] The event file is `.work-weave/personal/communication/events.jsonl`, one
      JSON object per line, keeping the newest N events with N configurable in
      the roster and defaulting to 100.
- [x] The listener records nothing about who has read the file, starts no child
      process, and sends nothing to a session.

## The result

`events.mjs` beside the queue module reads and writes one JSON object per line,
with kinds `pull-request-opened` and `default-branch-moved`, keeping the newest
N with N from the roster's `[events] limit` and a default of 100. The listener
receives the pull request and push webhooks, confirms a pull request against
GitHub, reads the merge rights with one collaborator listing, and writes
`personal/communication/events.jsonl`. It starts nothing and notifies nobody.

Verified by `tests/test-events.mjs` (15 cases) and the existing issue suites,
all passing.

Two readings worth a second opinion. The commit recorded for a merge is GitHub's
confirmed merge commit, so a commit landing on the default branch after that
merge is not the commit this line names. And the default branch is `main`, with
no roster setting to change it.

## Blocked by

- None (can start immediately).
