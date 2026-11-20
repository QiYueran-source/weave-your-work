---
schema: 1
id: wm-whk1pf23s79t
title: The webhook gains the pull request and push events, and the guide says who reads the file
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-20T02:38:50Z
updated_at: 2026-11-20T04:06:31Z
closed_at: 2026-11-20T04:06:31Z
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

- [x] The guide's hook read prints the subscribed events as well as the channel.
- [x] A hook that lacks `pull_request` or `push` is repaired with an edit and no
      second hook is created.
- [x] The guide states that the listener writes the event file and does not
      remind anyone, and that reading it belongs to a separate tool.
- [x] The install checks report a hook that is missing the subscriptions.

## The result

`install-issue.md` reads the hooks with `--jq -c '.[] | {id, url: .config.url, events, active}'`,
so the read shows the subscriptions as well as the channel; a hook on the channel
missing `pull_request` or `push` is repaired with one `PATCH` that sends all three
events (`events[]` replaces the list, so sending only the missing one would drop
`issues`), and the guide says why a second hook is never the answer. A new section,
"The event file", states the three events, the two line kinds, the one collaborators
read per opening, that the listener warns nobody, that reading the file belongs to a
separate tool, and what `[events] path` and `[events] limit` do. Verify step 5 opens a
pull request and reads the last line of `events.jsonl`.

Check 17 in `check-setup.mjs` now reads each hook's id, URL and events (one compact
object per line, `scanHooks`), matches the hook on the channel, and reports whichever
of `issues`, `pull_request` or `push` is missing, with the `PATCH` as its repair. It
stays read-only, and still reports unverified when `permissions.admin` is `false`.
`rules-checklist.md` 17 says the same. The test file gains nine check-17 cases, run
against a fake `gh` and `systemctl` on `PATH`: both events missing, one missing, all
three present, a hook on another channel, the right hook beside another one, events
out of order, an unreadable listing, unverified, and a real failure when the read
errors on an account that can see webhooks.

Ran: `node --test weave-your-work/setup/tools/check-setup.test.mjs` (16 pass) and
`node weave-your-work/setup/tools/check-setup.mjs --all` (check 17 unverified, "the
account cannot see webhooks"; 4 and 10 fail for reasons outside this ticket).

Open: the listener treats `main` as the default branch, which the guide now states;
a roster setting for it is not built here.

## Blocked by

- wm-bapr9rqqag8c
