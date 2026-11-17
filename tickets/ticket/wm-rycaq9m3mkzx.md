---
schema: 1
id: wm-rycaq9m3mkzx
title: Supersede an older ADR without editing it
category: ticket
status: open
owner: frank
creator: frank
created_at: 2026-11-17T06:13:10Z
updated_at: 2026-11-17T06:13:10Z
dependencies:
  - wm-35mq3ayqbgxj
  - wm-hmmwpwfmm3pd
---
## Parent

Spec `wm-ms5r0fftcva8`: ADR: office-ready, per-operator sources, millisecond ids.

## What to build

One operator replaces an earlier decision with a new one, and the earlier
decision stays readable and marked as replaced, without anyone editing the file
of the person who wrote it.

## Acceptance criteria

- [ ] `adr.js write --supersedes <id>` records the old id on the new entry
- [ ] The merge shows the old entry as superseded and names the entry that
      replaced it
- [ ] The superseded entry's source line is byte-for-byte unchanged
- [ ] Two entries describing the same decision under two ids both survive the
      merge
- [ ] A superseded entry stays in the view, not dropped
- [ ] A test covers each behaviour above against a temporary project, including
      a source file written by a second operator that the run never modifies

## Blocked by

- `wm-hmmwpwfmm3pd` — write an ADR to your own source file
- `wm-35mq3ayqbgxj` — merge every source into one ADR.md
