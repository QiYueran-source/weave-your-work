# Handoff document

The record one session leaves for the next one, in the operating system's temporary directory (`$TMPDIR`, else `/tmp`; `%TEMP%` on Windows), never into the workspace and never as a ticket.

## The five sections

1. **Where the session stopped.** The last thing finished, and the thing in progress when the session ended.
2. **What was tried and dropped.** An approach abandoned, and why. Without this the next session tries it again.
3. **What comes next.** The one step to take first, not a plan.
4. **Which skills the next run loads.** By name.
5. **What not to redo.** A file already written, a command already run, a question already answered.

## What it cites instead of restating

Record ids, testimonies, ADRs, commits, and paths. Never a pasted ticket: a second copy drifts, and the next session edits one and reads the other.

No keys, no passwords, no tokens, no personal data. When a detail is needed to continue and is sensitive, name where it lives.

When the person says what the next session is for, tailor the document to it.

## Assertions

- A handoff document inside the workspace or a ticket store. `[check-records]`
- A section restating a record instead of citing it. `[review]`
- A secret, a token, or another person's data in the document. `[review]`
