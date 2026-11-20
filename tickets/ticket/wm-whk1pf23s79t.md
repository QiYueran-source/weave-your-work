---
schema: 1
id: wm-whk1pf23s79t
title: The webhook gains the pull request and push events, and the guide says who reads the file
category: ticket
status: open
owner: frank
creator: frank
created_at: 2026-11-20T02:38:50Z
updated_at: 2026-11-20T02:38:50Z
parent: wm-cf08pxghnady
dependencies:
  - wm-bapr9rqqag8c
---
Part of wm-cf08pxghnady

## What to do

The install guide subscribes the existing webhook to pull request and push
events on the same channel, and says what the event file is for and what it is
not.

## Acceptance criteria

- [ ] The guide's hook read prints the subscribed events as well as the channel.
- [ ] A hook that lacks `pull_request` or `push` is repaired with an edit and no
      second hook is created.
- [ ] The guide states that the listener writes the event file and does not
      remind anyone, and that reading it belongs to a separate tool.
- [ ] The install checks report a hook that is missing the subscriptions.

## The result

## Blocked by

- wm-bapr9rqqag8c
