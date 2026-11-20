---
kind: communicate-issue-format
category: format
---

# Communicate issue

A GitHub issue that carries one message from one owner to another, and the
thread that goes back and forth in it. This file defines the message; the
skill's `SKILL.md` sends one and answers one.

## Front matter

```yaml
---
kind: communicate
category: request
---
```

- `kind: communicate` marks the issue as a message. The listener skips an issue
  without it.
- `category` is `request`, `result`, or `comment`. A request asks another owner
  for work or a decision; a result reports an outcome; a comment adds
  information to a thread.

Nothing else goes in the front matter. There is no `from` and no `to`.

## Who is speaking

- **The sender is the GitHub account that opened the issue.** The roster, the
  table of owner names to GitHub logins at `.work-weave/shared/handles.toml`,
  turns that login into an owner.
- **The recipient is the assignee.** The roster turns the assignee's login into
  an owner.

A name typed into the body claims nothing. A mention in the body carries no
meaning of its own, and one addressee per message is enough.

## Title and body

Title: `<the point>`.

The body opens with the ask, in one or two sentences, then says what the
message is about. A reader who stops after the first paragraph still knows what
they are being asked. When the message is about a spec, a ticket, or another
record, the body names it in prose.

## The thread

A message is a thread, not a single post.

- A reply is a comment on the same issue, never a second issue. A second issue
  on the same subject is a duplicate.
- Only the sender decides the thread is settled, and only the sender closes the
  issue. A recipient who has answered replies and mentions the sender so they
  close it.
- A message that is not for this machine stays on GitHub: it is not queued, not
  replied to, and not closed.

## What the queue holds

The local queue holds one line per open issue this machine's owner is party to,
sent or received. A line records the issue's creation and nothing after it: the
comments and the later changes to the issue are not in the queue, and a reader
who needs them opens the thread on GitHub. The line stays until the issue
closes.

## Assertions

- An issue without `kind: communicate`, or with a `category` other than
  `request`, `result`, or `comment`. The listener skips it.
- A front matter that carries `from` or `to`, or any field beyond `kind` and
  `category`. [review]
- A reply posted as a new issue on the same subject, or a recipient closing the
  issue. [review]
- A body that does not open with the ask. [review]
