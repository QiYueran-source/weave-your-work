---
schema: 1
id: wm-5agy2f6tjy74
title: 'Communicate with issue: Matt''s layout, and the front matter to match'
category: spec
status: closed
owner: frank
creator: frank
created_at: 2026-11-18T11:32:12Z
updated_at: 2026-11-18T11:33:23Z
closed_at: 2026-11-18T11:33:23Z
---
## Problem Statement

`communicate-with-issue` is the last skill in this set that keeps its record
definition in a `res/` folder. That folder is v1's layout. Every skill rebuilt
on Matt's set puts the format file beside the `SKILL.md` that acts on it —
`glossary/GLOSSARY-FORMAT.md`, `adr/ADR-FORMAT.md`,
`grilling/TESTIMONY-FORMAT.md` — and `.agents/rules/rules-structure.md` says a
record's definition is one file in its own skill's folder, beside that
`SKILL.md`. A reader who has learned the set's layout meets a different one
here.

The skill also carries v1's front matter. `family: reach` named a branch of a
router the set no longer has, and `invocation: user` is this set's own spelling
of a switch that Matt's skills spell `disable-model-invocation: true`. Every
skill copied from him — `review`, `implement`, `hand-back`, `to-spec`,
`to-tickets` — uses his key. The description ends with "Use when something has
to reach another owner, or when the queue holds a message", which is the trigger
list he keeps for skills a model may start by itself.

No `agents/openai.yaml` sits beside the `SKILL.md`, though every skill copied
from Matt has one, so the one skill a person reaches for to send a message is
also the one without the picker metadata its neighbours carry.

The listener's comment points at `communicate-issue.md`, a name no file in the
set carries, so the one pointer from code to the format file is wrong.

## Solution

Put `communicate-with-issue` on Matt's file layout and his front matter.

The format file moves beside the `SKILL.md` and is named for its record:
`COMMUNICATE-ISSUE-FORMAT.md`. Its content does not change; the record it
defines, the queue line, and the assertions stay as written. `SKILL.md` points
at the new name.

The front matter takes his keys: `disable-model-invocation: true` and no
`family`. The description becomes one line a person reads, saying what the skill
carries, with no trigger list.

`agents/openai.yaml` carries the display name, the one-line summary, and
`policy.allow_implicit_invocation: false`, the Codex half of the same switch.

The listener's comment names the file it now is.

## User Stories

1. As a person reading the set, I want every record definition to sit in the
   same place relative to its skill, so that I learn one layout, not two.
2. As a person picking the skill from a menu, I want a title and a one-line
   summary, so that I can tell it from the others.
3. As a model reading the skill, I want the format file named where the skill
   says it is, so that I open the file that exists.
4. As a person reading the front matter, I want one spelling of "may a model
   start this by itself", so that each skill answers the question once.
5. As a person maintaining the listener, I want its comment to name a real file,
   so that I can find the format it enforces.
6. As a person installing the set, I want the new front matter to parse, so that
   the skill is not skipped without a word.

## Implementation Decisions

- The file is named for the record it defines, as `GLOSSARY-FORMAT.md` and
  `ADR-FORMAT.md` are: `COMMUNICATE-ISSUE-FORMAT.md`.
- Only the file's location and name change. Its sections, the queue line, and
  the assertions stay as they are.
- The front matter drops `family`. Nothing in the v2 set routes by family, and a
  key nothing reads is a claim a reader has to go and check.
- The two invocation switches are written as a pair:
  `disable-model-invocation: true` in the front matter and
  `policy.allow_implicit_invocation: false` in `agents/openai.yaml`. One harness
  reads each, and a skill that is user-invoked in one and model-invoked in the
  other is a skill the two disagree about.
- The description stays one line and names what the skill carries, not when to
  reach for it.
- The listener's comment changes; the copied runtime under
  `.work-weave/runtime/issue/` is not edited, because a reinstall replaces it.

## Acceptance

A person can see the layout by opening the folder: it holds `SKILL.md`,
`COMMUNICATE-ISSUE-FORMAT.md`, and `agents/openai.yaml`, and no `res/`. The
front matter has `disable-model-invocation: true`, no `family` and no
`invocation`, and a description with no "Use when" list. `agents/openai.yaml`
parses and carries the three keys. `SKILL.md` names the format file it has, no
file in the set names `res/format.md`, and the listener's comment names the new
file. The installer lists the skill and skips nothing.

## Out of Scope

- What the format file says. Its fields, categories, queue line, and assertions
  are unchanged.
- The `family` and `invocation` keys still on `glossary`, `adr`, and `setup`.
  Those are this set's own skills, not copies of Matt's, and moving them is a
  separate decision.
- `docs/v2-conformance.md`. It records the earlier v2 branch, whose `map`,
  `task`, and `waymark` are no longer in this set.
- The listener's behaviour. Only its comment changes.

## Further Notes

`agents/openai.yaml` is the Codex half of a switch Matt writes twice: the front
matter tells Claude Code, and the YAML tells Codex. That is why the two are
edited as one, and why the skill is user-invoked in both harnesses or in
neither.
