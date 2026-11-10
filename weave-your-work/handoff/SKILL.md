---
name: handoff
description: "Compact a session into a handoff document when the work continues in another one: cite the tickets instead of restating them, and say where the session stopped and what comes next."
---

# Handoff

A session ends, and the work does not. The next agent starts with an empty context and the tickets, which say what the work is but not where this session left it.

The handoff document is that missing part. It is not a copy of the tickets and not a summary of the conversation; it is what neither carries.

`usage.md` shows one document written for this repository, and why each of its sections is there.

## When it runs

- The session is ending, and the work continues in another one.
- The context is nearly full and the work is not finished.
- The person asks to hand this to someone else, or to a fresh agent.

## Where the document goes

The operating system's temporary directory: `$TMPDIR` when it is set, else `/tmp`; `%TEMP%` on Windows.

Not the workspace. A handoff is about one session and is stale as soon as the next one starts; in the repository it becomes a file nobody deletes and everyone reads too late. Not a ticket either: tickets hold settled decisions and survive the session, and a handoff is neither settled nor durable.

## What the document carries

Everything here is something the tickets do not hold:

1. **Where the session stopped.** The last thing that was finished, and the thing that was in progress when the session ended.
2. **What was tried and dropped.** An approach abandoned, and why. Without this the next session tries it again.
3. **What comes next.** The one step to take first, not a plan.
4. **Which skills the next agent loads.** By name — `handoff` is not the reader; naming the skill that owns the next step saves a search.
5. **What not to redo.** A file already written, a command already run, a question already answered.

When the person says what the next session is for, tailor the document to that: a handoff written for "finish the split" and one written for "review what was built" are different documents.

## What it cites instead of restating

Name the map and task ids, the testimonies, the ADRs, the commits, and the paths. Do not paste them.

A restated ticket is a second copy, and a second copy drifts: the next session edits one and reads the other. A citation cannot go stale without the reader seeing it.

So the document says `wm-s4tvr121g3tv` opened its split, and not what that map's target is. A reader who needs the target opens the ticket.

## Redaction

No keys, no passwords, no tokens, no personal data. The document sits in a temporary directory the next agent reads, and the people who share the machine read it too. When a detail is needed to continue and sensitive, name where it lives instead of writing it.

## What it does not do

- Start the next session. The document is handed over when a person opens it; nothing here launches an agent.
- Settle a decision. A decision reached in the session is written into its ticket first — the ticket is the record, and the document points at it.
- Replace the tickets. A document that could be thrown away without losing a decision is a good one.
