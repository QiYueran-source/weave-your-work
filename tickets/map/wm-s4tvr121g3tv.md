---
schema: 1
id: wm-s4tvr121g3tv
title: 'Session skills: re-pitch a message and hand off the session'
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-10T06:26:41Z
updated_at: 2026-11-10T06:43:35Z
parent: wm-wjwa9081hse1
---
## Target

Work that outlives a single ticket has a home in the set: a person who has lost the thread reads the current state off one short table instead of scrolling back, and the next agent starts from a written hand-off instead of rebuilding the session from the tickets.

Why: the set advances one ticket at a time and has no way to say "stop, show me where this stands" or "carry this to whoever comes next". So the state is re-derived by hand from the tree, and every new session starts by reading back through the tickets to work out where the last one stopped.

## Acceptance direction

All children are complete and no further children are needed.

Review point: each of the two skills carries a `SKILL.md` under `weave-your-work/` whose description names the state that triggers it; a worked example under `use-weave-your-work-examples/` walks each one once; and neither names a file this project does not have.

## Notes

- Sources: `.agents/matt-skills/handoff`, `.agents/matt-skills/claude-handoff`, `.agents/matt-skills/wait-what`. `chief-of-staff` is not used; see `Decisions so far`.
- Neither skill keeps `disable-model-invocation`: every skill in this set is model-invocable, settled on the root map on 2026-11-09.
- Neither keeps `argument-hint` or an `agents/openai.yaml`: no skill in this set has either. Every skill carries exactly `name` and a quoted `description`.
- Existing counterparts: `talk-like-a-human` is the standing rule for how writing reads; `wait-what` is the reader asking to see the state. Different trigger, so they do not overlap.
- The vocabulary has two front ends here: `glossary/<operator>.jsonl` per operator, and a generated, gitignored `GLOSSARY.md` at the project root. Nothing needs a per-message word list, because `talk-like-a-human` covers naming.

## Decisions so far

- ~~The three skills form one group under a single child map rather than one map each. (user confirmed, 2026-11-10)~~ Superseded on 2026-11-10: two skills remain after `chief-of-staff` was dropped, and they still share this one map.
- `handoff` is kept. (user confirmed, 2026-11-10)
- `wait-what` is kept. (user confirmed, 2026-11-10)
- ~~`handoff` and `wait-what` copy Matt's text, with no redesign beyond what the set's own files require. (user confirmed, 2026-11-10)~~ Superseded on 2026-11-10: true of `handoff`, false of `wait-what`, which is rewritten; see below.
- `handoff` copies Matt's text, with no redesign beyond what the set's own files require. (user confirmed, 2026-11-10)
- `wait-what` is rewritten rather than ported: the person has lost the thread, the skill stops the work, reads the state off the tickets, and reports it in one short table. Matt's version re-pitches the previous message instead. (user confirmed, 2026-11-10)
- `wait-what` keeps no language standard of its own: no ASD-STE100, no glossary reference. Wording is covered by `talk-like-a-human`, and naming by `02-english.md`. (user confirmed, 2026-11-10)
- `chief-of-staff` is not added. `execute-all` already advances a map's tasks, picks them by owner and status, and sends each to its own subagent, which is most of what the skill would do. (user confirmed, 2026-11-10)

## Not yet specified

- ~~Decision to make: how `chief-of-staff` divides the work with `execute-all` and `execute-one-task`.~~ Resolved on 2026-11-10: it does not divide it, because the skill is dropped; `execute-all` keeps the whole answer.
- ~~Decision to make: what `chief-of-staff` keeps its memory in — a free wiki as Matt's does, or the tickets and testimonies this set already has.~~ Resolved on 2026-11-10: moot for now, since the skill is dropped. If it returns, the answer is the tickets, because a second memory drifts from the first.
  Why it matters: two memories drift apart, and the record-in-tickets rule puts every settled detail in a ticket.
- ~~Decision to make: where `handoff` writes its document. Matt writes to the OS temporary directory, which loses a settled decision the rule says belongs in a ticket.~~ Resolved on 2026-11-10: the copy keeps Matt's location. `handoff` is not in conflict with `03-record-in-tickets.md`: it forbids duplicating a spec, ticket, ADR or commit, and points at them by path instead, so the decisions stay in the tickets and the document carries the session state those tickets do not hold.
- Decision to make: whether `handoff` also starts the next agent, as `claude-handoff` does.
  Why it matters: `claude --bg` is Claude Code's command; this harness starts a subagent, which inherits the conversation rather than the document.
- ~~Decision to make: whether `wait-what` keeps asking for the glossary's words.~~ Resolved on 2026-11-10: neither reference survives. The rewrite names no file outside the tickets, and `talk-like-a-human` already requires one name for one thing.
- ~~Decision to make: what language standard `wait-what` asks for. Matt's copy mandates ASD-STE100 Simplified Technical English, which is an English standard with an approved-word list and short-sentence limits; this project replies in Chinese and writes in English.~~ Resolved on 2026-11-10: no standard of its own. It asks for a table and short lines, which is a shape rather than a word list, and the wording rules stay with `talk-like-a-human`.
- ~~Decision to make: whether `retro` joins too, since Matt's `chief-of-staff` runs one on about a session in five.~~ Resolved on 2026-11-10: no. A retro's only caller was `chief-of-staff`, and no skill here improves the environment after a run.
- Decision to make: whether `chief-of-staff` comes back once the set has a skill that cuts a new layer from a closed one, which is the part `execute-all` does not reach.
  Why it matters: it is the difference between advancing a map's tasks and advancing the map, and only the second one ends at the map's target.

## Out of scope

- Matt's writing skills (`writing-fragments`, `writing-beats`, `writing-shape`): this set covers wording through `talk-like-a-human` and does not cover writing an article.
- Codebase-specific sessions (TDD, code review, debugging): the root map already excludes software-specific workflows.
