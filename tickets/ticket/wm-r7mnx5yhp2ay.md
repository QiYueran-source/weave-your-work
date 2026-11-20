---
schema: 1
id: wm-r7mnx5yhp2ay
title: 'Grilling: end on an empty frontier and a written testimony'
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-17T07:23:41Z
updated_at: 2026-11-17T07:28:17Z
closed_at: 2026-11-17T07:28:17Z
parent: wm-14axybwpn8xa
dependencies:
  - wm-7de24s214ntw
---
## What to build

The discussion ends when the frontier is empty and the testimony is written, and the run hands back what it produced: the decisions that settled with the question each came from, the questions still open, and the work the discussion handed off. The skill writes the testimony and nothing else; terms go to the glossary and decisions to ADR, run by the caller.

## Acceptance criteria

- [ ] The end condition is the empty frontier together with a written testimony
- [ ] Each settled line carries the question it came from and where it lands
- [ ] Handed-off work is written as `work: <what>` lines for the caller to open
- [ ] The skill states that it writes nothing but the testimony
