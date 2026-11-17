---
schema: 1
id: wm-6y6jf37gykrf
title: Point the three record-writing skills at the settings
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-17T12:55:13Z
updated_at: 2026-11-17T12:56:14Z
closed_at: 2026-11-17T12:56:14Z
dependencies:
  - wm-x1ft55xgs8tr
---
Part of wm-tz1k7fzbzzq5

## What to do

A reader of any skill that writes a record is told where the project says how
records are written, and reads it before writing one. The same three lines
appear in all three skills, so no skill assumes the reader has seen another.

## Acceptance criteria

- [ ] `grilling`, `to-spec`, and `to-tickets` each contain the same short section
      naming `.work-weave/config/tracker.md` and saying to read it before writing.
- [ ] That section states no fallback for a missing file.
- [ ] A grep for `waymark` across the three skills returns nothing.
- [ ] `GLOSSARY.md` and `ADR.md` are still named where they were named.
