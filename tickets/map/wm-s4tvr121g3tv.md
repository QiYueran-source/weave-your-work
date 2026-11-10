---
schema: 1
id: wm-s4tvr121g3tv
title: 'Session skills: drive a whole map, re-pitch a message, hand off the session'
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-10T06:26:41Z
updated_at: 2026-11-10T06:32:14Z
parent: wm-wjwa9081hse1
---
## Target

Work that outlives a single ticket has a home in the set: a long run advances a whole map and keeps what it learns, a person who did not follow a message gets it again in plain words, and the next agent starts from a written hand-off instead of rebuilding the session from the tickets.

Why: the set advances one ticket at a time and has no notion of a session. What a person learns between tickets — which change to the environment would make the next task easier, what they actually needed to hear — is lost at the context limit, and the next agent starts by reconstructing it.

## Acceptance direction

All children are complete and no further children are needed.

Review point: each of the three skills carries a `SKILL.md` under `weave-your-work/` whose description names the state that triggers it; a worked example under `use-weave-your-work-examples/` walks each one once; and each names the skill that owns the work it hands over instead of doing that work itself.

## Notes

- Sources: `.agents/matt-skills/chief-of-staff`, `.agents/matt-skills/handoff`, `.agents/matt-skills/claude-handoff`, `.agents/matt-skills/wait-what`.
- None of the three keeps `disable-model-invocation`: every skill in this set is model-invocable, settled on the root map on 2026-11-09.
- Existing counterparts: `execute-all` and `execute-one-task` advance tasks; no skill advances a session. `issue` is the only other skill that writes outside the ticket store.

## Decisions so far

- The three skills form one group under a single child map rather than one map each. (user confirmed, 2026-11-10)
- `chief-of-staff` is kept to advance the whole map, not a single task. (user confirmed, 2026-11-10)
- `handoff` is kept. (user confirmed, 2026-11-10)
- `wait-what` is kept. (user confirmed, 2026-11-10)
- `handoff` and `wait-what` copy Matt's text, with no redesign beyond what the set's own files require. (user confirmed, 2026-11-10)

## Not yet specified

- Decision to make: how `chief-of-staff` divides the work with `execute-all` and `execute-one-task`.
  Why it matters: all three would answer "which tasks run now", and a batch that can start from either one cannot say what its boundary is.
- Decision to make: what `chief-of-staff` keeps its memory in — a free wiki as Matt's does, or the tickets and testimonies this set already has.
  Why it matters: two memories drift apart, and the record-in-tickets rule puts every settled detail in a ticket.
- ~~Decision to make: where `handoff` writes its document. Matt writes to the OS temporary directory, which loses a settled decision the rule says belongs in a ticket.~~ Resolved on 2026-11-10: the copy keeps Matt's location. `handoff` is not in conflict with `03-record-in-tickets.md`: it forbids duplicating a spec, ticket, ADR or commit, and points at them by path instead, so the decisions stay in the tickets and the document carries the session state those tickets do not hold.
- Decision to make: whether `handoff` also starts the next agent, as `claude-handoff` does.
  Why it matters: `claude --bg` is Claude Code's command; this harness starts a subagent, which inherits the conversation rather than the document.
- Decision to make: whether `wait-what` keeps asking for the glossary's words, now that terms live in `glossary/<operator>.jsonl` behind the `glossary` skill.
  Why it matters: Matt's text names `GLOSSARY.md` and `GLOSSARY-MAP.md`, and this project has neither.
- Decision to make: whether `retro` joins too, since Matt's `chief-of-staff` runs one on about a session in five.
  Why it matters: `chief-of-staff`'s own procedures turn on it, and no skill here improves the environment after a run.

## Out of scope

- Matt's writing skills (`writing-fragments`, `writing-beats`, `writing-shape`): this set covers wording through `talk-like-a-human` and does not cover writing an article.
- Codebase-specific sessions (TDD, code review, debugging): the root map already excludes software-specific workflows.
