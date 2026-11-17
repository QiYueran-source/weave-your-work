---
schema: 1
id: wm-xb54fqbk0en2
title: Take the record-settings read out of grilling
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-17T13:16:30Z
updated_at: 2026-11-17T13:21:22Z
closed_at: 2026-11-17T13:21:22Z
---
Part of wm-wrw42r7nsb82

## What to do

`grilling` no longer tells the reader to read the project's record settings
before writing a testimony. A testimony carries no field those settings declare
and moves through no state they define, so the read returns nothing the skill can
use.

The skill keeps its rule about when the testimony is written, and keeps its claim
that it writes the testimony and nothing else.

## Acceptance criteria

- [ ] `grilling` contains no reference to `.work-weave/config/tracker.md`.
- [ ] The rule about when the testimony is created is unchanged.
- [ ] `to-spec` and `to-tickets` still name the settings file.

## The result

`weave-your-work/grilling/SKILL.md` no longer names `.work-weave/config/tracker.md`;
its timing rule for the testimony is untouched.
