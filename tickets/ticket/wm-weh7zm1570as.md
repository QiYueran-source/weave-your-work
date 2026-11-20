---
schema: 1
id: wm-weh7zm1570as
title: The queue is one JSONL file of open threads, and the checker reads it
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-20T02:38:36Z
updated_at: 2026-11-20T03:58:10Z
closed_at: 2026-11-20T03:58:10Z
parent: wm-exfr2xxdkeje
dependencies:
  - wm-p7bdkvhvhydt
---
Part of wm-exfr2xxdkeje

## What to do

The local queue is one JSONL file that holds the open threads and keeps a closed
one as a marked line, and the checker lists only the open ones.

## Acceptance criteria

- [ ] The queue file is `.work-weave/personal/communication/pending.jsonl`, one
      JSON object per line, written with a serializer and no list marker.
- [ ] A line carries the URL, the sender and recipient as owner names, the title,
      the arrival time, and the close time as null or a timestamp.
- [ ] Reading the older queue shape still works; the next write leaves the file
      in the new shape.
- [ ] The pending checker lists open threads and not closed ones.
- [ ] The record check no longer validates the queue, because it is local state.
- [ ] The queue path is configured in the roster and the default appears in one
      place only.

## The result

## Blocked by

- wm-p7bdkvhvhydt
