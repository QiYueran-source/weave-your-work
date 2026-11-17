---
schema: 1
id: wm-35mq3ayqbgxj
title: Merge every source into one ADR.md
category: ticket
status: open
owner: frank
creator: frank
created_at: 2026-11-17T06:13:05Z
updated_at: 2026-11-17T06:13:05Z
dependencies:
  - wm-hmmwpwfmm3pd
---
## Parent

Spec `wm-ms5r0fftcva8`: ADR: office-ready, per-operator sources, millisecond ids.

## What to build

An operator runs one command and the project root holds an `ADR.md` that shows
every ADR from every operator, in one place, without anyone editing a shared
file by hand.

This ticket also carries work already done before it was filed:
`adr/ADR-FORMAT.md` already states the view's layout, its grouping, and the rule
that a hand edit is overwritten. Read it against the spec before starting.

## Acceptance criteria

- [ ] `adr.js merge` writes `ADR.md` at the project root
- [ ] The view lists accepted entries newest first, then superseded ones
- [ ] Each entry names the source file it came from
- [ ] Every source entry appears exactly once
- [ ] A merge with no source files fails with a message and writes no view
- [ ] A hand-edited `ADR.md` is overwritten by the next merge
- [ ] A test covers each behaviour above against a temporary project

## Blocked by

- `wm-hmmwpwfmm3pd` — write an ADR to your own source file
