---
name: issue
description: >-
  Carry a ticket's question or notification to a GitHub or Gitee issue, read the
  answer, and land the decision on the ticket that owns it: file one issue per
  recipient, reply in the thread, record the outcome with the issue URL, and
  close it.
---

# Issue

An issue is a message to a person on the remote tracker. The ticket is the record. This skill carries the message out, reads the answer back, and lands the decision on the ticket that owns it.

GitHub and Gitee are the two platforms. The actions are the same on both; the commands are in `github.md` and `gitee.md`.

## When it runs

- A ticket needs another owner to decide or do something that cannot wait for a local merge: an archive removed a relation they depend on, a child wants a place under their closed map, a task needs a person's confirmation.
- A ticket's owner is waiting on an answer that exists only in a remote thread.
- A person wants to read or answer an issue that concerns a ticket, or that proposes one.

An issue with no ticket behind it is read and answered, but nothing lands locally: when an owner accepts the proposal, split creates the ticket, and the closing comment links it.

## Five actions, three moves

1. **File** — put a ticket's message on the remote tracker.
2. **Read and reply** — find the thread, read it, and answer in it.
3. **Land and close** — write the decision on the owning ticket, then close the thread.

A run is one pass through one of them. Filing and landing can be days apart, in different sessions; the ticket carries the URL between them, so neither needs the other in context.

## File

One issue per recipient per event. Two people who must both act get two issues, each addressed to one of them; one thread addressed to both leaves each waiting for the other. The owner of the run that has something to say files it; an agent acting for that owner may file on their behalf.

**Title.** `[<ticket id>] <what the recipient must decide or do>`. The id is the ticket that will carry the answer; when the message is about a different ticket, the body names that one too. It is how the remote side and the local side find each other again. Keep the action in the title; "Update" is not a title.

**Body.** Four parts, in this order:

1. Who it is for: `@handle` when the handle is known, the name otherwise.
2. Which tickets: the one that will carry the answer, `<id> "<title>"`, and the one the message came from when they differ.
3. What happened or what is asked: one paragraph a reader who has not seen the ticket can follow.
4. What the recipient must decide or do, and how to reply: answer in the thread; change the ticket when it is theirs.

A name without a handle does not notify anyone. When the recipient's remote handle is unknown, ask for it before filing. Write the body in the language the recipient reads.

The caller's contract sets the content:

- **Update's archive hand-over** — the relation that disappeared, the id that replaced the node, and the decision: re-point the edge, or drop the wait if the archived outcome is enough.
- **A task's human step** — the step, what to hand back, and that the hand-back is recorded in `Result`.
- **A foreign closed parent** — ask the owner to reopen the map, and say which child waits on it.
- **A question** — the question, the options you can see, and what each answer changes.

**Before.**

- Know the platform and the repository; `github.md` and `gitee.md` say how. The checkout's `origin` names the repository; a checkout with several remotes needs the person to name the one that holds the issue.
- Search for an open issue whose title already carries the ticket id. If one exists, reply there; a second thread splits the answer.
- If the repository is public, read the draft to the person and get a yes. A public issue is a publication, and it outlives the ticket. Keep tokens, secrets, local paths, and other people's data out of the body.

**After.** Record the issue URL where the wait lives:

- a task waiting on a person: `waiting_on` names the person, `Progress` carries the URL;
- a map waiting on a decision: the question goes in `Not yet specified` with the URL, and moves to `Decisions so far` when it is settled;
- a child waiting on a foreign parent: its body carries `Intended parent: <id>, waiting on <issue URL>`;
- a notification filed after a local change, such as an archive that removed a foreign edge: the URL goes on the live ticket that continues the change — the replacement node after a retire-and-replace, or the map or task that made the change. An archived ticket rejects body edits, so it cannot hold the receipt.

The URL and number are the receipt. Without them the thread is found only by memory.

**Done when** the issue exists and its URL sits on the ticket.

## Read and reply

Find the thread by the ticket id in the title, or by the URL the ticket carries. Read the issue body and every comment, oldest first.

Reply in the thread, once, with the answer or the next question. When the answer arrived in a meeting or a chat, put it in the thread: the remote side has one place, and it is the issue.

**Done when** every open question in the thread has an answer, or a named person who owes one.

## Land and close

Ask one question first: **does this change a ticket?**

An answer is a decision when it changes a ticket's text, status, or relations, or settles a fact the ticket already cites. Agreement, thanks, scheduling, and options that lost are not decisions; they stay in the thread, and the local side never copies them.

**No change.** Close the issue with a comment that says so. No decision is written; the ticket may still carry the URL as its receipt.

**A change.** The ticket's owner writes it:

- a map: a `Decisions so far` entry in its concrete form, with the issue URL as the source; the fog entry it settles is struck through;
- a task: the affected section — `Action`, `Acceptance signal`, or `Boundaries` — with the URL where the change is explained; a person's answer goes in `Result`, as the task body requires;
- a relation: the owner runs the waymark command, and the URL goes in the ticket that records the change — the child's `Intended parent` line, a task's `Progress` or `Result`, or the map's `Decisions so far`.

Both endings are changes. An acceptance runs `parent set`: the child's `Intended parent` line comes off, because the parent field now records the relation, and the closing comment keeps the pointer. A refusal runs no command: the `waiting on` half comes off the line, because the wait is over even though the intent was not granted, and the closing comment records the refusal.

A run that is not the owner stops at the issue. It replies, and it records on its own ticket what it is waiting for; it does not write the foreign ticket.

**Close.** A closing comment names the ticket and what changed: "Landed in `<id>` `<title>`: <one line>." Whoever sees the ask resolved closes it — the filer, or the recipient after changing their own ticket. Close as completed on GitHub; set `state=closed` on Gitee.

**Done when** the issue is closed, its closing comment names the ticket, and the ticket carries the decision — or, when the answer changed nothing, the closing comment says so.

## Failures worth naming

- No remote, or a host that is neither github.com nor gitee.com. Name the host; the person passes a repository explicitly.
- `gh` missing or not authenticated. `gh auth login`.
- `GITEE_TOKEN` missing. Create a token with the `issues` and `notes` permissions, in the environment or in a file outside the repository.
- A write that fails after the issue exists. Report the URL; the thread is real even when the local record did not land.
- A remote error. Show its text unchanged; a paraphrase hides the cause.

## Reporting

Three lines: what was filed or read, what changed on the ticket, and what is still waiting.

## What this skill does not do

- Triage, labels, assignment, or a queue. It moves a message between two people; it does not sort incoming work.
- Create a ticket from an issue. An accepted proposal goes through split.
- Poll, sync, or mirror. The thread is read when a run looks at it.
- Write a ticket the run does not own.
- Edit or delete another person's comment.

## Where the commands live

- `github.md`: the `gh` commands for the five actions, and the JSON fields each returns.
- `gitee.md`: the REST calls for the same five actions, the token setup, and the response fields.
