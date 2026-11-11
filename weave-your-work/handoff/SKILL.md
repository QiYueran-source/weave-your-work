---
name: handoff
description: "Write a handoff document when the work continues in another session: cite the records instead of restating them, and say where the session stopped, what was dropped, and what comes next. Use when a session is ending, the context is nearly full, or the work moves to a fresh agent."
family: reach
invocation: user
---

# Handoff

A session ends, and the work does not. The next agent starts with an empty context and the records, which say what the work is but not where this session left it.

The handoff document is that missing part. It is not a copy of the records and not a summary of the conversation; it is what neither carries. Its five sections are `res/body.md`.

## When it runs

- The session is ending, and the work continues in another one.
- The context is nearly full and the work is not finished.
- The person asks to hand this to someone else, or to a fresh agent.

## Steps

1. **Read the records the session touched.** The ids, the testimonies, the ADRs, the commits, the paths.
2. **Write the five sections**, in that order, tailored to what the person says the next session is for. A handoff written for "finish the split" and one written for "review what was built" are different documents.
3. **Cite, never paste.** Name the record id; a reader who needs its content opens it.
4. **Redact.** No keys, no passwords, no tokens, no personal data. When a detail is needed and sensitive, name where it lives.
5. **Save it in the operating system's temporary directory**: `$TMPDIR` when it is set, else `/tmp`; `%TEMP%` on Windows. Not the workspace, and not a ticket.

## Transformation

```
before: a session ending, and records that do not say where it stopped
after:
- one file outside the repository, carrying the five sections
- every claim in it names the record or path it comes from
- what comes next is one step, not a plan
```

## What this skill does not do

- Start the next session. The document is handed over when a person opens it.
- Settle a decision. A decision reached in the session is written into its record first.
- Replace the records. A document that could be thrown away without losing a decision is a good one.
