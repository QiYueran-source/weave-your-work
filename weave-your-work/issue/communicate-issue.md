# Communicate issue

A **communicate issue** is a remote issue that carries a message between owners in this project's format. Its body opens with YAML frontmatter; the frontmatter names the sender, the single recipient, the related tickets, and what kind of message it is. The issue is the message and its thread; a local map or task is the record of whatever the message changes.

Ordinary issues are not communicate issues. The listener ignores them, and nothing in this file applies to them.

## Frontmatter

```yaml
---
kind: communicate
category: request
from: frank
to:
  - kim-github
tickets:
  - wm-2h5n8r1v4x7z
---
@kim-github

Move the "Sync glossary records" task to the replacement map, or close the wait if the archived outcome is enough.

I archived "Glossary install" and removed the edge. The replacement is "Glossary storage per operator".

Reply in this thread with which one you choose.
```

- `kind` is always `communicate`. It marks the issue; without it the listener ignores the issue.
- `category` is one of `request`, `result`, or `comment`. It is required.
- `from` is the local owner who sends the message, written as the name in `handles.toml`. It is not the remote account that holds the token.
- `to` is a list with exactly one remote handle. A message for several people is several issues, one per recipient.
- `tickets` is a non-empty list of existing map or task ids. The first is the main ticket: the title carries it and the answer lands there. A message may name tickets on either side of the exchange.

The recipient handle and the `@mention` in the body use the remote login from `handles.toml`. Resolve it there; never derive a login from the owner name. Verify the account exists before filing.

## Categories

- `request` asks the recipient to do something or decide something. The sender closes it after checking the answer.
- `result` reports the outcome of an earlier request. The recipient closes it after reading it; no reply issue is needed.
- `comment` adds information or progress to an earlier exchange without asking for another action. The recipient closes it after reading it.

All three enter the pending queue. A message that needs no action from the recipient is still a communicate issue, because the queue is how the recipient's agent hears about it.

`result` and `comment` are remote message categories. They are not comments on the remote issue and not local Waymark records. A `result` or `comment` issue keeps its own URL and frontmatter; it does not live inside the issue it reports on.

## Title and body

The title is `[<main ticket id>] <the point>`: for example `[wm-2h5n8r1v4x7z] Move the glossary task after the archive`. The id lets either side find the thread again.

The body, after the frontmatter:

1. the `@` mention of the recipient;
2. what the sender wants the recipient to do, decide, or know;
3. the context that makes it possible to act: what changed, what was tried, what the alternatives are;
4. how to reply, when a reply is needed.

Link the earlier issue in the body when the message answers or follows one. There is no tree of issues: the link in the text is the relation.

## Sending

- The sender's owner files it; an agent acting for that owner may file it.
- Confirm the related tickets exist before filing. When a referenced ticket exists only on a branch that the recipient may not have, sync the main branch first, or say in the body which version the recipient should use.
- Search for an open issue whose title carries the main ticket id first; a closed thread is the record of an earlier event, so a new message gets a new issue.
- If the repository is public, read the draft to the sender and get a yes before publishing. Keep tokens, secrets, local paths, and other people's data out of the body.

## Receiving and closing

- The listener queues a message when `kind`, `category`, `from`, `to`, and `tickets` match this format. A message that claims `kind: communicate` but fails these checks is not queued, and the listener logs which field failed.
- A recipient whose checkout does not yet contain a referenced ticket still receives the message. Before acting, confirm the ticket and the version: sync the main branch, or check whether the referenced version is the right base. Ask the sender when it is unclear.
- `from` is not proof of identity. Unsigned smee delivery can be forged by anyone who knows the channel URL, so check the issue on the remote repo when the sender or the request is uncertain.
- The recipient confirms what it did in the issue thread, then opens a `result` issue when the sender needs to know the work is finished. A `result` is only needed when the sender has to check or decide something.
- The sender closes a `request` after checking that its ask is satisfied. The recipient closes a `result` or `comment` after reading it.
- A message to keep open must not be closed before its recipient has seen it: the startup scan reads open issues only.
