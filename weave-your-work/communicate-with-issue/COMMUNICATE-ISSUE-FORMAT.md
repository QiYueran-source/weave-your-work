# Communicate issue

A GitHub issue that carries one message from one owner to another, and the thread that goes back and forth in it. This file defines the message; the skill's `SEND.md` writes one and its `RECEIVE.md` answers one.

## Front matter

```yaml
---
kind: communicate
category: request
tickets:
  - wm-2h5n8r1v4x7z
---
```

- `kind: communicate` marks the issue as a message. The listener ignores an issue without it.
- `category` is `request`, `result`, or `comment`. A request asks another owner for work or a decision; a result reports an outcome; a comment adds information to a thread.
- `tickets` is a non-empty list of ids of records that already exist, a spec or a ticket. The first is the main record: the title carries it, and the answer lands there.

Nothing else goes in the front matter. There is no `from` and no `to`.

## Who is speaking

- **The sender is the GitHub account that opened the issue.** The roster, the table of owner names to GitHub logins at `.work-weave/shared/handles.toml`, turns that login into an owner.
- **The recipient is the assignee.** The roster turns the assignee's login into an owner.

A name typed into the body claims nothing. A mention in the body carries no meaning of its own, and one address per message is enough.

## Title and body

Title: `[<main record id>] <the point>`.

The body opens with the ask, in one or two sentences, then names the records the message is about. A reader who stops after the first paragraph still knows what they are being asked.

## The thread

A message is a thread, not a single post.

- A reply is a comment on the same issue. A second message on the same subject is not a new issue.
- Only the sender decides the thread is settled, and only the sender closes the issue.
- A recipient who replies, lands, or declines leaves the issue open. Closing it is not theirs to do.
- A message that is not for this machine stays on GitHub: it is not queued, not replied to, and not closed.

## Where the queue lives

The local queue of open threads is written by the listener where it is installed, in the shape the install gives it. Nothing in this file describes it: the queue belongs to the installation, not to the message.

## Assertions

- An issue without `kind: communicate`, or with a `category` other than `request`, `result`, or `comment`. The listener that receives issues rejects it on install.
- A `tickets` entry that names no existing record. [review]
- A front matter that carries `from` or `to`, or any field beyond `kind`, `category`, and `tickets`. [review]
- A reply posted as a new issue on the same subject, or a recipient closing the issue. [review]
- A body that does not open with the ask and name the records it is about. [review]
