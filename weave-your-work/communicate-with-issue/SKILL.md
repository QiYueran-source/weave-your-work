---
name: communicate-with-issue
description: "Send one owner a message as a GitHub issue, and answer one in its thread."
disable-model-invocation: true
---

# Communicate with issue

A message is one GitHub issue from one owner to another. It says a thing in the front matter, a title that carries a record, and a body that opens with the ask.

What a message is — its front matter, its title, its body, and how the thread ends — is `COMMUNICATE-ISSUE-FORMAT.md`. Read it before writing or answering one.

## Where to go

- **Send a message.** Read `SEND.md`. Sending is one act: pick the recipient, write the issue, assign it, open it, confirm it exists.
- **Receive a message.** Read `RECEIVE.md`. Receiving is a list of behaviours, not a sequence: reply, land, or leave it.

A person does one or the other in a run. Read the file for the half you are doing.

## The records a message names

A message names a spec or a ticket. The first id in `tickets` is the main record: the title carries it, and the answer lands there. The words map and task are not records in this set and do not belong in a message.

## What this skill does not do

- Read the local queue. The listener writes it where it is installed, and the session-start rule reports what is open in it. This skill neither writes nor reads it.
- Run or watch the listener. It is a service installed once per checkout; it is described where it is installed, not here.
- Close a thread on the recipient's side. Only the sender closes.
