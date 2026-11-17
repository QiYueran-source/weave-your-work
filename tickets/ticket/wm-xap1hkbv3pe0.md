---
schema: 1
id: wm-xap1hkbv3pe0
title: 'Grilling: the interview method, inherited from upstream'
category: ticket
status: open
owner: frank
creator: frank
created_at: 2026-11-17T07:23:17Z
updated_at: 2026-11-17T07:23:17Z
parent: wm-14axybwpn8xa
---
## What to build

A `grilling` skill whose interview method is Matt's, unchanged: the design tree, the rounds, the frontier, the recommended answer on each question, the emoji round format, and the rule that a question depending on an open question waits for a later round. The only wording change is `user` to `person`.

This is the baseline the later tickets build on. A person can reach for the skill, run a discussion, and get asked a round of questions that behaves the way it did upstream.

## Acceptance criteria

- [ ] The rounds, frontier, format example, recommended-answer wording, and later-round rule match the upstream commit apart from `user` to `person`
- [ ] The emoji round format is intact
- [ ] The skill installs: `npx skills add` lists it and prints no `Skipped` line
