---
schema: 1
id: wm-p7bdkvhvhydt
title: The listener takes the sender from GitHub and the recipient from the assignee
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-20T02:38:32Z
updated_at: 2026-11-20T03:38:42Z
closed_at: 2026-11-20T03:38:42Z
parent: wm-exfr2xxdkeje
---
Part of wm-exfr2xxdkeje

## What to do

The listener decides who sent a message from the GitHub account and who receives
it from the assignee, checks every event against GitHub before queueing it, and
marks a thread closed when its sender closes it.

## Acceptance criteria

- [x] The listener requires `kind`, `category`, and `tickets`; a message that
      names a sender or a recipient in its front matter still queues.
- [x] The sender recorded is the owner the roster maps the issue's author to; an
      author outside the roster queues nothing.
- [x] An event whose issue GitHub will not confirm, or whose author differs from
      the event's, queues nothing and logs one line.
- [x] The recipient is the assignee, mapped through the roster; an issue assigned
      to nobody, or to a login outside the roster, queues nothing.
- [x] An `assigned` event queues a message that was opened without an assignee.
- [x] The same thread queues at most one line, whatever the event order.
- [x] A closed event marks the thread's line closed and writes no new line.
- [x] The startup scan adds a thread missing from the queue, marks one no longer
      open, and changes nothing when the read fails.
- [~] The listener writes nothing outside its queue file and its log. It still
      runs `git` and `gh`, which the spec names as the seams; it starts no other
      process.

## The result

`listener.mjs`, `queue.mjs`, and `check-pending.mjs` in
`weave-your-work/setup/tools/issue/`: the format check takes `kind`, `category`,
and `tickets`; the sender is the roster owner for the issue's author and the
recipient the roster owner for the assignee; every event is read back from
GitHub first; an assigned event queues a message opened without one; a sender's
close sets `closed_at` and adds no line; the startup scan adds, marks, and
leaves the file alone when the read fails.

Verified by the issue tests: catchup 13, security 32, project isolation 9,
configure 6, lock 6, origin 4, no failures.

One clause is met differently from the ticket's wording. The listener still runs
`git config`, `git remote get-url`, and `gh api`; starting no process at all was
never true of it, and `gh` is the seam the spec names. Two behaviours are worth
knowing: the scan marks a thread closed when GitHub stops listing it even if
nobody closed it, and a webhook that queues a thread while the scan is reading
is never overwritten by that scan.

The listener takes identity from GitHub and nothing else. `listener.mjs` builds
each queue line from the issue's `user.login` mapped forwards through the roster
(the `from` owner) and its `assignee.login` mapped backwards through the same
table (the `to` owner), and keeps a line only when the recipient is this
checkout's owner. `communicationFields` now requires `kind`, `category`, and
`tickets` and ignores `from` and `to` when they are present.

Every `opened` and `assigned` event is re-read with
`gh api repos/<repo>/issues/<n>` before anything is written; a read that fails,
or an author that differs from the event's, writes one `Skipped issue #n: ...`
line to stderr and queues nothing. `closed` marks the line with the event's
`closed_at` when the closer is the issue's author, and writes no new line. The
startup scan adds a listed thread the queue lacks, marks a queued thread of this
repository that the listing no longer reports as open, and leaves the file
untouched when a page fails, because the mark is computed only after every page
has arrived.

`queue.mjs` reads the older `- {...}` and pipe lines and rewrites them in the
current shape on the next write, so a closed thread keeps its line. Lines carry
`closed_at` as null or a timestamp. The listener and `check-pending.mjs` read
the roster from `.work-weave/shared/handles.toml` when it exists and fall back
to `.work-weave/issue/handles.toml`, because the roster path is a separate
ticket.

One behaviour is not in this ticket: the startup scan marks a queued thread
closed when GitHub no longer lists it, even if the sender never closed it.
That follows the spec's "a queue line whose thread is no longer open is marked
closed", and differs from criterion 6, which covers the `closed` event.

Tests: `test-catchup.mjs` 13 pass, `test-security.mjs` 32 pass,
`test-project-isolation.mjs` 9 pass, and the unchanged files 16 pass, all run
with `node --test <file>`. Both fakes `gh` answer the single-issue read as well
as the listing.

## Blocked by

- None (can start immediately).
