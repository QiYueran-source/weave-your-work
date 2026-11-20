---
schema: 1
id: wm-rjybt5np5sn2
title: Install the ADR tool into a project
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-17T06:13:15Z
updated_at: 2026-11-17T06:19:10Z
closed_at: 2026-11-17T06:19:10Z
dependencies:
  - wm-35mq3ayqbgxj
  - wm-hmmwpwfmm3pd
---
## Parent

Spec `wm-ms5r0fftcva8`: ADR: office-ready, per-operator sources, millisecond ids.

## What to build

A project that runs setup gets a working ADR tool under its runtime directory,
and a person who pulls a teammate's ADR sees it in `ADR.md` without running
anything by hand.

## Acceptance criteria

- [ ] Setup copies the ADR tool and the project root resolver into
      `.work-weave/runtime/adr/`
- [ ] The install document states that no MCP server is registered for ADRs
- [ ] `/ADR.md` is added to the root `.gitignore`; `.work-weave/adr/*.jsonl` is
      committed
- [ ] A post-merge hook rebuilds `ADR.md` and leaves a project with no ADR
      sources alone
- [ ] The setup check reports the ADR runtime as present once installed
- [ ] Running the tool from a project with no `.work-weave/adr/` gives the
      message the install document names

## Blocked by

- `wm-hmmwpwfmm3pd` — write an ADR to your own source file
- `wm-35mq3ayqbgxj` — merge every source into one ADR.md
