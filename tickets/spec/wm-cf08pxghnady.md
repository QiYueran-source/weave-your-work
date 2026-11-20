---
schema: 1
id: wm-cf08pxghnady
title: 'Events: the listener records pull requests and default-branch moves, and warns nobody'
category: spec
status: closed
owner: frank
creator: frank
created_at: 2026-11-20T02:32:44Z
updated_at: 2026-11-20T04:10:36Z
closed_at: 2026-11-20T04:10:36Z
---
---
schema: 1
id: wm-cf08pxghnady
title: 'Events: the listener records pull requests and default-branch moves, and warns nobody'
category: spec
status: open
owner: frank
creator: frank
created_at: 2026-11-20T02:32:44Z
updated_at: 2026-11-20T02:32:44Z
---
## Problem Statement

Two people work in the same repository and want to know when the remote has moved. Today nothing tells them. A pull request opens and the people who can merge it find out only if they happen to look. A pull request merges, the default branch changes, and every other checkout keeps working on its own copy until whoever holds it notices by other means.

The local listener in this set receives issue events only. Its webhook subscription names one event, `issues`, so pull requests and pushes never reach it. Extending it to those events is not a rewrite: the same channel, the same service, and the same checkout settings carry them.

The other half of the problem is a boundary that was never drawn. The listener today is described as if it warns a session, but it cannot. It writes a file, and the session reads it later. A listener that tried to do more would have to know which harness is running, whether a session is open, and how to reach into it, and would have to be rewritten for every harness that exists.

## Solution

**The listener writes to local files. It does not warn anyone.** When an event arrives, the listener confirms it against GitHub and appends a line to a local file. That is its whole job. What reads those files, when, and how it shows them to a person is another tool's problem, and that tool can be replaced without touching the listener.

**Pull request opened: the people who can merge it are told to review it.** Reviewing and merging are a person's work. The listener does not review, approve, or merge; it records who has merge rights at the moment the event arrived, so whoever reads the file knows who should look.

**Pull request merged, default branch moved: everyone sees it.** Every checkout must catch up with the remote. The event file says the branch moved and to which commit. What each person does about it — pull, merge into their branch, resolve a conflict — is theirs to decide.

**Conflict is possible and tolerated.** Nothing stops a pull request because of a possible conflict, and nothing tells a person how to resolve one. The listener records that the branch moved; it does not predict what will happen in a given checkout.

**Two files, one writer.** `.work-weave/personal/communication/` holds `pending.jsonl`, the open threads from the other spec, and `events.jsonl`, the pull request and default-branch events. Only the listener writes them. Nothing in `events.jsonl` records who has read it.

## User Stories

1. As a person who can merge pull requests, I want to know when one opens, so that I can review it without scanning GitHub.
2. As a person who can merge pull requests, I want to know which one is waiting, so that I can tell one pull request from another.
3. As a person who cannot merge pull requests, I want not to be told about every pull request, so that my attention stays on my own work.
4. As a person who merged a pull request, I want everyone's checkout to learn the default branch moved, so that the divergence stays short.
5. As a person whose checkout is behind, I want to see which commit the default branch moved to, so that I know what to pull.
6. As a person whose checkout is behind, I want to be told at the next session rather than interrupted, so that the notice arrives when I am at the keyboard.
7. As a person who merges the default branch into my branch, I want a conflict to be my decision, so that no tool refuses the work on my behalf.
8. As a person dealing with a conflict, I want nothing specialised for it, so that I use the message the set already carries.
9. As a person reading the event file, I want each line to say what happened and when, so that I can tell a fresh event from an old one.
10. As a person reading the event file, I want it bounded in size, so that it does not grow without end.
11. As a person setting up a project, I want to set how many events are kept, so that the file fits the repository.
12. As a person setting up a project, I want the webhook subscription to gain the new events without a second hook, so that one channel stays enough.
13. As a person with an existing listener, I want setup to add the missing subscriptions to the hook it finds, so that an upgrade needs no manual dashboard work.
14. As a person running the listener on a machine without merge rights, I want the event recorded anyway, so that the file is the same everywhere.
15. As a person who replaces the reminder tool, I want the listener unchanged, so that the two can evolve separately.
16. As a person debugging the listener, I want a dropped event and its reason in the log, so that a missing event is traceable.
17. As a person on a public repository, I want an event that GitHub cannot confirm to be dropped, so that the file holds only real events.

## Implementation Decisions

**The listener's job is to write files.** It receives a webhook event, confirms it against GitHub, and appends one line to a local file. It starts no process, sends no message to a session, and knows nothing about which harness runs on the machine.

**The boundary is recorded in the spec, not enforced by code.** Reading the files, choosing who sees what, and deciding how to surface it belong to whatever reminder tool the project uses. This spec delivers the files; it does not deliver a reminder.

**Two event kinds are added.** A pull request opened, and a pull request merged or the default branch moved. A branch push to the default branch is the same event as a merge from a checkout's point of view, so both are recorded with the kind that says the branch moved and the commit it moved to.

**Each line records what happened, when, and to what.** The kind, the pull request or commit reference, the time, and the account that caused it. A pull request event also records the logins that hold merge rights at that moment, so that a reader can tell who should look without asking GitHub again.

**Merge rights are read from GitHub at the moment the event arrives.** One call lists the repository's collaborators; the roster's logins filter it; an account with write or admin permission is recorded. No separate list of merge rights is kept, because a second list drifts from GitHub.

**The event file is bounded.** One JSON object per line, one file, `.work-weave/personal/communication/events.jsonl`. It keeps the most recent N events, N configurable in the roster file with a default of 100, and the trim happens as part of the write so the file never exceeds the limit.

**The events file records no reader state.** No read marker, no per-person seen flag. Anyone who wants "what has changed since I last looked" keeps that elsewhere.

**The webhook gains subscriptions, not a second hook.** Pull request and push events join the existing issue subscription on the same channel. Setup reads the existing hook and adds the missing events; a hook that is missing them is repaired, never duplicated.

**Conflict is not an event.** The listener records that the branch moved. It does not record whether a given checkout will conflict, cannot know it, and writes nothing about it.

**The reminder tool is out of scope by design.** Swapping it changes nothing in the listener, the files, or the skills.

## Testing Decisions

**What a good test is here.** It starts a real listener against a temporary checkout, sends an event over HTTP, and reads the event file back. It asserts the line a person would read, not an internal call. GitHub is a fake `gh` on `PATH`, the seam the startup scan already uses; the fake gains the collaborator listing and the pull-request read.

**The seam.** The same one, and no new one: the `gh` executable on `PATH`.

**What is tested.**

- A pull request opened event writes one line with the number, the title, and the accounts holding merge rights.
- A pull request merged event writes one line naming the commit the default branch now points at.
- A push to the default branch writes the same kind as a merge.
- A push to another branch writes no line.
- A collaborator listing that fails writes no line and logs the failure.
- The roster's logins filter the collaborator listing: an account outside the roster is not recorded as having merge rights.
- Writing past the configured limit leaves exactly the configured number of lines, the newest kept.
- An event for a pull request GitHub will not confirm is dropped and logged.
- The listener starts no child process and writes nothing outside its two files.

**Prior art.** The startup scan's tests already run a real listener against a fake `gh`; the event tests copy that shape. The bound and the trim are covered by writing more lines than the limit into a prepared file and reading it back.

## Acceptance

The delivery is a listener that receives pull request and default-branch events and writes them to one bounded local file, and setup that subscribes the existing webhook to those events.

A reader can tell it was handed over by opening a pull request in a test repository, seeing one line in the event file that names it and the accounts with merge rights; by merging it and seeing one line naming the new commit on the default branch; and by running the listener tests with the fake `gh` and seeing every case above pass.

## Out of Scope

- Reminding anyone. Reading the event file and surfacing it belongs to a separate reminder tool.
- Session hooks, ticks, background agents, and anything that wakes a session.
- Reviewing, approving, or merging a pull request.
- Predicting or resolving conflicts in a checkout.
- Recording who has read the file.
- Other webhook events, such as reviews, checks, or comments.
- A second webhook or a second channel.
- Signature verification and tunnels, which the message spec also leaves out.

## Further Notes

The two files differ in lifetime, which is why they are two. A line in the message queue ends when its sender closes the thread; that is a state the thread reaches. A line in the event file is history: the branch moved once, at a commit, and that fact does not later become false. Keeping both in one file would mean one shape for two lifetimes.

"Who can merge" is read as write or admin on the repository, which is close enough to "can merge into the default branch" for a repository whose protection is the default. A project that protects its branch more narrowly, with required reviewers on a specific team, will want a different reading of that call. It was not built here because nothing in this set protects branches that way.
