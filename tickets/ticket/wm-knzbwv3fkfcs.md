---
schema: 1
id: wm-knzbwv3fkfcs
title: The listener queues every open issue its owner is party to
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-20T08:56:23Z
updated_at: 2026-11-20T09:10:25Z
closed_at: 2026-11-20T09:10:25Z
parent: wm-212r50h4z0bm
---
Part of wm-212r50h4z0bm

## What to do

The queue holds every open issue this machine's owner is party to, whether they
opened it or were assigned it. `tickets` stops being required in the front
matter. The close rule does not move.

Read `tickets/spec/wm-212r50h4z0bm.md` for the decisions; this ticket carries
only what to change and how it is checked.

## Files

- `weave-your-work/setup/tools/issue/listener.mjs`
- `weave-your-work/setup/tools/issue/tests/test-catchup.mjs`
- `weave-your-work/setup/tools/issue/tests/test-security.mjs`

## What changes

`queueIssue` (around line 495–510): replace the assignee-only check with
`const involved = from === machineOwner || to === machineOwner`, and log
`Skipped <label>: <from> to <to> does not involve <machineOwner>` when it fails.

`communicationFields` (around line 277): stop requiring `tickets`. Keep
`kind` and `category` required exactly as they are. The returned value no
longer needs to carry `tickets`.

The startup log around line 856: `queueing messages assigned to` becomes
`queueing issues involving`.

## Acceptance criteria

- [x] An issue this machine's owner opened and assigned to another roster
      member queues one line, with `from` this owner and `to` the other.
- [x] An issue assigned to this machine's owner queues as before.
- [x] An issue whose author and assignee are both other roster members adds no
      line.
- [x] An issue from outside the roster adds no line, whichever end the stranger
      is on.
- [x] A message whose front matter has `kind` and `category` and no `tickets`
      queues.
- [x] A message with no `category` is still refused.
- [x] The startup scan queues an open issue the owner sent and the queue lacks.
- [x] A line for an issue the owner sent is marked closed by the scan when
      GitHub no longer lists it open.
- [x] A close event by someone other than the issue's author is still refused.
- [x] `node --check listener.mjs` passes and every test file under
      `weave-your-work/setup/tools/issue/tests/` passes.

## Notes

`test-catchup.mjs:290` currently asserts that an issue assigned to bob is not
queued on alice's machine; narrow it to "both parties are other members", and
add the outgoing case beside it. Every fixture with `tickets` in the body drops
it, and the "no tickets" case is removed because the field no longer exists.

Do not edit `.work-weave/personal/issue/`. It is reinstalled from the install
guide, not patched in place.

## The result

`queueIssue` now queues an issue when either its author or its assignee is this
machine's owner, and logs `<from> to <to> does not involve <owner>` otherwise.
`communicationFields` requires `kind` and `category` and no longer `tickets`.
The startup log reads `queueing issues involving <owner>`. The close rule is
unchanged: `handleEvent` still refuses a closer who is not the issue's author,
and the startup scan marks the line instead.

Verified by the issue tests: catch-up 16, security 34, project isolation 10,
configure 8, lock 6, origin 4, events 15, no failures. The tests cover the
outgoing webhook, the outgoing startup scan, the stranger at either end, a
message with no `tickets`, a message with no `category`, a recipient's close
being refused, and the sender's own close marking the line.
