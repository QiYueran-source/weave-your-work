---
schema: 1
id: wm-exfr2xxdkeje
title: 'Communicate: the account is the sender, the assignee is the recipient, and the queue holds open threads'
category: spec
status: in_progress
owner: frank
creator: frank
created_at: 2026-11-20T02:18:56Z
updated_at: 2026-11-20T03:54:07Z
---
---
schema: 1
id: wm-exfr2xxdkeje
title: 'Communicate: the account is the sender, the assignee is the recipient, and the queue holds open threads'
category: spec
status: open
owner: frank
creator: frank
created_at: 2026-11-20T02:18:56Z
updated_at: 2026-11-20T02:18:56Z
---
## Problem Statement

A person sends one message to another owner through a GitHub issue and waits for the answer. Today that path does not hold together.

The skill was written against the set before this rebuild. It says a local map or task is the record of what a message changes, files the wait in `Progress` and `waiting_on`, and moves the answer to `Decisions so far`; this set has specs and tickets, and neither field nor section exists. The half of the skill a recipient needs — read the thread, answer it, land what it settled — is two lines. The closing rule is stated three ways in one file: the sender closes a request, the recipient closes a result, and a thread with no local change closes as not planned.

The message itself carries three claims that nobody checks. `from` is a name written in the body by whoever opened the issue. `to` is a name the sender types into that same body. The listener reads a GitHub login from the event and against the roster, so a stranger is stopped, but a roster member can sign another roster member's name, and anyone who knows the channel can post any login at all.

The queue that the notification lands in is a Markdown file of `- {json}` lines. It only grows: a closed thread stays in it, and the session-start rule keeps reporting a thread the sender has already closed. Its path is written in several places, and the session-start rule carries a second copy of the default.

## Solution

Two people made of one skill: the person who sends, and the person who receives.

**Sending is one complete act.** Write the three front-matter fields, give the issue its title and body, set the recipient as the assignee, and open it. When it is open, it has already reached the person it was for, because the notification is immediate.

**Receiving is a list of behaviours, not a sequence.** A person who sees a message for them can reply in the thread, land what it settled on the record it names, or leave it. Each behaviour says when it is done. None of them closes the issue.

**The thread goes back and forth.** A reply is a comment on the same issue; a second message on the same subject is not a new issue. Only the sender decides the thread is settled, and only the sender closes it.

**Nothing about who is speaking is typed by hand.** The sender is the GitHub account that opened the issue, looked up in the roster — the table that already maps an owner to a login. The recipient is the assignee. The front matter is left with `kind`, `category`, and `tickets`: what kind of message it is, which category it falls in, and which records it is about.

**The local queue is a short list of open threads.** One JSON object per line, one file, `.work-weave/personal/communication/pending.jsonl`. A line carries where the thread is, who it is from and to as owners, its title, when it arrived, and when the sender closed it. A closed thread keeps its line, marked, so the next session does not report it again.

**The listener is the only thing that writes the queue.** It receives the event, checks it against GitHub, queues it, and marks a thread closed when the sender closes it. It writes its log to stderr, as it does now; the platform that runs it keeps the log.

## User Stories

1. As a person who needs another owner to decide something, I want to send it as one act that ends with the issue open and assigned to them, so that I do not have to work out what a half-sent message looks like.
2. As a person who needs another owner to decide something, I want my message to name the record it is about, so that the answer has a place to land.
3. As a person receiving a message, I want to reply in the thread, so that the conversation does not split into a second issue.
4. As a person receiving a message, I want to write what it settled on the record it names, so that the record is the durable half of the exchange.
5. As a person receiving a message, I want to leave it alone, so that silence is a legitimate response rather than a failure to act.
6. As a person who sent a request, I want to close it myself once the answer is on the record, so that nobody else ends my thread early.
7. As a person who sent a request, I want everyone in the thread to see who spoke, without anyone typing a name, so that an unsigned claim is not possible.
8. As a person in a public repository, I want a message from someone outside the roster to stay on the issue and out of my local queue, so that a stranger cannot put text on my machine.
9. As a person in a public repository, I want a message whose author does not match GitHub to be dropped, so that knowing the notification channel is not the same as being a member.
10. As a person on the roster, I want my message to be attributed to my own account and not to someone else's name, so that trust in one member does not become trust in all.
11. As a person receiving a message, I want to find it by being assigned, so that I do not have to scan a body for a mention.
12. As a person receiving a message, I want a mention in the body to carry no meaning of its own, so that one address per message is enough.
13. As a person starting a session, I want the queue to list open threads only, so that a thread I closed last week is not reported again.
14. As a person starting a session, I want each entry to name the sender and the recipient as owners, so that I do not have to look up a login.
15. As a person starting a session, I want a thread closed by its sender to be marked closed rather than dropped, so that the next scan does not queue it again.
16. As a person whose listener was off, I want the startup scan to recover the open threads, so that a missed event is not a lost message.
17. As a person whose startup scan fails, I want the queue left exactly as it was, so that a GitHub outage does not empty it.
18. As a person reading a queue line, I want to see when it arrived and when it closed, so that I can tell a fresh message from an old one.
19. As a person maintaining the set, I want one place that says where the queue lives, so that changing the path does not leave a reader on the old one.
20. As an agent reading the skill, I want the sending steps and the receiving steps in separate files, so that a run does not read the half it is not doing.
21. As an agent reading the skill, I want the format file to define what a message is and how the thread ends, so that I write a message the listener accepts.
22. As an agent reading the skill, I want the listener described as a running service rather than a step, so that I do not try to start it in a run.
23. As a person maintaining the listener, I want the checks it makes written once, so that the skill and the code agree on what a valid message is.
24. As a person reading a log, I want each dropped message and the reason for it on stderr, so that a silent drop is impossible.
25. As a person setting up a project, I want the roster documented as the one table that turns a login into an owner and back, so that I do not create a second mapping.

## Implementation Decisions

**A message is a GitHub issue with three front-matter fields.** `kind: communicate` marks it; `category` is `request`, `result`, or `comment`; `tickets` is a non-empty list of existing record ids, the first being the main record named in the title. `from` and `to` are removed. The author is the account that opened the issue. The recipient is the assignee.

**The roster is the mapping, in both directions.** The existing table of owner names to GitHub logins is read forwards to turn an author into an owner and backwards to turn an assignee into an owner. No second table is added. The example file gains a sentence saying both directions.

**The listener checks every event against GitHub.** It reads the author from the event, requires it in the roster, and then re-reads the issue from GitHub to confirm it exists and its author matches. A mismatch, a missing issue, or a failed read drops the message, writes one stderr line with the reason, and queues nothing.

**The listener receives opened and assigned events.** A message can exist before its assignee is set, so the assignment is its own trigger. The queue is keyed by issue URL and recipient, so a second event for the same thread adds nothing.

**Closing is the sender's.** The listener marks the queue line closed when the sender closes the issue. The recipient's replies, landings, and refusals do not close it.

**The startup scan reconciles, and a failed scan changes nothing.** A thread open on GitHub and absent from the queue is added; a queue line whose thread is no longer open is marked closed; a scan that fails leaves the file untouched and logs the failure.

**The queue is one JSONL file.** One JSON object per line, no list marker, no other format accepted on write. A line holds the issue URL, the sender and recipient as owner names, the recipient's owner for routing, the title, the arrival time, and the close time as a timestamp or null. Reading also accepts the older line shapes so a checkout written before this change keeps working; the next write rewrites the file in the new shape.

**Where the queue lives is stated once and configured once.** The default is `.work-weave/personal/communication/pending.jsonl`, overridable in the roster file, and the directory stays out of Git. Every default that exists today is replaced by that single default: the listener, the checker, the example roster, this repository's roster, and the session-start rule's fallback.

**The session-start rule reads the queue and stops.** It reports the open threads and does not act on any of them; the person opens the issue.

**The listener logs to stderr.** No file, no rotation, no new platform-specific step. The install guide gains one line per platform naming where the platform keeps that stream.

**The skill keeps one host for the record.** The format file stays beside the skill and owns what a message is, how the thread ends, and which assertions are checked. The actions name the format file, never a path into it.

**The skill's actions are split by who runs them.** The main skill file routes: sending reads the sending file, receiving reads the receiving file. The listener stops being one of the skill's actions and is described where it is installed.

**A message that is not for this machine stays on GitHub.** It is not queued, not replied to, and not closed.

**No local pointer is added to the record.** The issue is the wait; the ticket that names it by id is enough to find it. A record that already exists is not reshaped for this.

## Testing Decisions

**What a good test is here.** It starts a real listener process against a temporary checkout, feeds it an event over HTTP, and reads the queue file back. It asserts what a person would see — a line, a closed marker, an empty file — never an internal function or a log message's exact wording. The GitHub side is a fake `gh` on `PATH`, which is already how the startup scan is tested; the change extends that fake to answer a single-issue read as well as the open-issue listing.

**The seam.** One seam, and it already exists: the `gh` executable on `PATH`. Everything the listener asks GitHub goes through it. No new injection point is added to the listener, so the tests keep their current shape and the listener keeps no test-only branch.

**What is tested.**

- An event from an author outside the roster queues nothing.
- An event whose author is in the roster but whose issue cannot be re-read queues nothing.
- An event whose re-read author differs from the event author queues nothing.
- A valid event from a roster member queues one line, with the sender and recipient as owner names.
- A second event for the same thread adds no line.
- An assigned event queues a message that was opened without an assignee.
- A closed event marks the line closed and leaves it in the file.
- The startup scan adds a thread missing from the queue, marks a closed one, and leaves the file untouched when the read fails.
- The checker lists open threads only.
- Reading the older line shape still works and the next write uses the new shape.

**What changes in the existing tests.** The case that lets one roster member sign another member's name is removed, because that behaviour is what this spec ends. The queue path appears in three test fixtures and moves with the default. The closed-event case currently asserts that a closed event queues nothing; it now asserts that the existing line is marked and no new line is added.

## Acceptance

The delivery is a pair of skills and a listener that carry a message between two owners with the GitHub account as the only claim of identity, and a queue that holds open threads only.

A reader can tell it was handed over by sending one message from a roster account to another owner and seeing it arrive once in that machine's queue with both owners named, by closing it from the sender's side and seeing the line marked closed and no longer reported, and by running the issue tests with the fake `gh` and seeing every case above pass.

## Out of Scope

- Sending on another owner's behalf. Signing as someone else is what this spec ends.
- An organisation-membership check in addition to the roster.
- Signature verification. Smee re-serialises the payload, so GitHub's signature cannot match; that needs a tunnel, and it is not being built.
- Tunnels, and any host other than GitHub's issues.
- Waking a running session on an event. The event reaches the queue; the person opens the session.
- Moving the record's shape. No new field, section, or status is added to a spec or a ticket.
- The listener copy installed in a checkout. It is reinstalled from the install guide; it is not edited in place.
- The older queue's entries beyond keeping them readable.

## Further Notes

The security model was read out in the discussion. The channel address is the shared secret, and it is not in Git: the webhook configuration needs repository admin to read, and the channel URL travels only in a local, ignored settings file. Against that, the roster and the re-read are the two checks. The roster stops someone outside it; the re-read stops a payload that claims a roster login but corresponds to no issue GitHub has. What remains: anyone who holds the channel address and a roster login can still make one message appear to come from that login, because the re-read only asks whether GitHub agrees about the author of an issue that the same payload may have pointed at. This is recorded here so that the next reader knows where the wall is.

The two behaviours the discussion rejected are worth naming. Keeping `to` in the body and mentioning the person would have preserved a claim nobody can verify; assigning is the structural version of the same thing. Keeping the queue growing and deleting closed threads would have re-queued every closed thread at the next startup scan, because the scan cannot tell a deleted line from one it never wrote.
