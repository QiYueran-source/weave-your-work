---
schema: 1
id: wm-mcds523m21ht
title: Send and receive a message, and the front matter loses its from and to
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-20T02:38:28Z
updated_at: 2026-11-20T02:41:42Z
closed_at: 2026-11-20T02:41:42Z
parent: wm-exfr2xxdkeje
---
Part of wm-exfr2xxdkeje

## What to do

The skill lets a person send a message as one complete act and receive one as a
list of behaviours, and the file that defines a message no longer has a sender
or a recipient written by hand.

## Acceptance criteria

- [x] The message format file defines the front matter as `kind`, `category`,
      and `tickets` and no longer names `from` or `to`.
- [x] The format file states the thread rule: replies are comments on the same
      issue, and only the sender closes.
- [x] The skill routes to a sending file and a receiving file; sending covers
      writing the front matter, the title, the body, the assignee, and opening
      the issue; receiving lists replying, landing on the record, and leaving it,
      each with its own done condition.
- [x] The listener is described where it is installed, not as one of the skill's
      actions.
- [x] The skill names the record kinds this set uses (spec, ticket), never a map
      or task.
- [x] A copy of a message's format lives in one file only.
- [x] The skill's front matter keeps `disable-model-invocation: true` and gains
      an `agents/openai.yaml` with `policy.allow_implicit_invocation: false`.

## The result

The skill is a router over SEND.md and RECEIVE.md, with the format file beside
it: `weave-your-work/communicate-with-issue/` holds SKILL.md,
COMMUNICATE-ISSUE-FORMAT.md, SEND.md, RECEIVE.md, and agents/openai.yaml.

The front matter is `kind`, `category`, and `tickets`; the sender is the account
that opened the issue and the recipient is the assignee; only the sender closes
the thread. The listener appears only as something the skill does not run. The
front matter parses with the `yaml` package, and the four commands in SEND.md
are gh issue create, gh issue view, gh issue edit, and gh issue comment.

Verified by reading the files back and parsing both YAML blocks. The listener
still requires the removed fields, so a message in this shape is rejected until
wm-p7bdkvhvhydt lands; that is the ticket this one hands to.

## Blocked by

- None (can start immediately).
