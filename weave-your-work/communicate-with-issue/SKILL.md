---
name: communicate-with-issue
description: "Send one owner a message as a GitHub issue, and answer one in its thread."
disable-model-invocation: true
---

# Communicate with issue

A message is one GitHub issue from one owner to another, and a reply is a
comment on that issue.

A message holds a front matter that marks it as a message, a title that states
its point, and a body that opens with the ask. That shape is
`COMMUNICATE-ISSUE-FORMAT.md`; read it before writing or answering one.

## Send

1. **Pick the recipient.** The recipient is an owner in the roster,
   `.work-weave/shared/handles.toml`, the one table that turns an owner into a
   GitHub login and a login into an owner; do not keep a second one. Read the
   owner's login from `[handles]`. When no recipient is named, ask which owner
   the message is for.

2. **Write the title and the body.** The title is the point, in the person's
   words. The body opens with the ask, in one or two sentences, and then says
   what it is about. Do not put a sender name or a recipient name in the body:
   the author and the assignee say who is who.

3. **Open the issue.**

   ```sh
   gh issue create \
     --title "<the point>" \
     --assignee <recipient login> \
     --body-file <the issue text>
   ```

   Use `--body-file` with a file holding the front matter and the body
   together, not an inline `--body`: the text carries newlines and quotes, and
   the front matter must sit at the top of the body where the listener reads
   it.

4. **Confirm it exists.**

   ```sh
   gh issue view <number> \
     --json number,title,assignees,author,state
   ```

   Check four things: the state is `OPEN`, the author is the account you are
   signed in as, the assignee is the recipient login, and the title is the
   point. If the assignee is missing, add it with `gh issue edit <number>
   --add-assignee <recipient login>` and check again.

The act is done when the issue is open and assigned. The recipient has the
notification already; nothing else has to be sent.

## Answer

1. **Read the thread.**

   ```sh
   gh issue view <number> --comments
   ```

   Read the whole thread, not only the opening body: the ask may have moved
   in the comments.

2. **Reply in the thread.**

   ```sh
   gh issue comment <number> --body-file <the reply text>
   ```

   The reply is an answer, not a restatement of the question. If you are
   declining or asking something back, say that in one sentence first.

3. **Do not close the issue.** Closing is the sender's. When someone else
   opened the issue and the ask is settled, reply and mention the sender so
   they close it:
   `@<their login> settled; close this when you agree`.

## Failures

- **The recipient is not in the roster.** Stop and say so. Do not guess a
  login, and do not fall back to a name typed into the body.
- **The recipient has no login in the roster,** or the login resolves to no
  GitHub account. Say which owner and which login failed, and ask which login
  is right.
- **The recipient cannot be assigned** because they have no access to the
  repository. Do not open a message they cannot receive. Say that, and let the
  person decide: add their access, or send to another owner.
- **The issue is created without the front matter.** Edit the body before doing
  anything else: a message without `kind: communicate` is not a message.
- **The issue was closed by someone who is not its author.** It is answered and
  not closed again. Reply in the thread when more needs saying; otherwise leave
  the closed issue as it is.

## What the queue holds

The queue has one line per open issue the owner is party to, sent or received.
A line is added when the issue is opened and carries only what was true then:
the issue's URL, its author, its assignee, its title, and when it arrived.
Comments and later changes are not in it, so read the thread with `gh` before
acting. A line stays until the issue closes.

## What this skill does not do

- Read the queue. The session-start rule reads it and opens the session with
  the open threads.
- Run or watch the listener. It is a service installed once per checkout, and
  it is described where it is installed.
- Close an issue someone else opened. Only its author closes it.
