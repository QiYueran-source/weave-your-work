---
name: pending-communications
title: Read pending communications at session start
description: Surface queued communicate issues when a session starts.
---

# Read Pending Communications at Session Start

The issue skill's listener queues communicate issues in a local file. The queue is state, not a ticket: it lives outside the tracker and is gitignored.

## What to do

1. Read the `[pending].path` in `.waymark/handles.toml`, resolved from `.waymark/`. When the file or the key is absent, read `pending/pending-communications.md`.
2. If the queue has entries, open the session with one line: how many, and their titles.
3. Do not act on an entry until the person asks. Opening the issue is the person's move.

## Why

The listener can be off while the person is away, and the platform's notification is easy to miss. The queue is the one place the next session sees what arrived; reading it at the start is how a message reaches the person without polling.
