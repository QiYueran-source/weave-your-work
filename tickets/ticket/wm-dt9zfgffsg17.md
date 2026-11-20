---
schema: 1
id: wm-dt9zfgffsg17
title: Add the ask-me router skill
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-20T13:43:39Z
updated_at: 2026-11-20T14:03:54Z
closed_at: 2026-11-20T14:03:54Z
custom_fields:
  needs_human: false
---
wm-s8cyfbp629nr

## What to do

Write `weave-your-work/ask-me/SKILL.md` and its `agents/openai.yaml`. The skill
takes a description of the situation, names the skill or the sequence of skills
that fits, says where the person's decisions sit in that sequence, and stops.

It holds the routes and the branch tests only. Before it says what a skill does
or recommends skipping it, it reads that skill's `SKILL.md`; its own summary
lines are for orientation, and its text says so.

The routes it covers:

- The mainline: the discussion that produces a spec (`grilling` or
  `grill-with-docs`), then `to-spec`, `to-tickets`, `implement` or
  `implement-spec`, then `review`.
- The branches opened on a state: `setup` when the project has no
  `.agents/rules/`; `hand-back` when a ticket is a person's to do;
  `communicate-with-issue` when another owner has to answer; `glossary` and
  `adr` below the line; `feed-me-back` when a skill itself went wrong.
- The branch tests: whether `setup` has run, whether the discussion has
  produced a spec, whether the spec is one ticket or several batches of the
  frontier, whether the ticket's `needs_human` is true, whether a term passed
  the glossary's check, whether a decision passed the three gates.

## Acceptance criteria

- [x] `weave-your-work/ask-me/SKILL.md` opens with YAML front matter whose
      `description` is quoted on one line and contains no unquoted `: `.
- [x] The front matter carries `disable-model-invocation: true`, and
      `weave-your-work/ask-me/agents/openai.yaml` carries
      `allow_implicit_invocation: false`.
- [x] The skill's text says it recommends and stops: it does not invoke the
      skill it names, write a record, or read the project's records.
- [x] Every skill the router names exists in `weave-your-work/`, and every
      claim it makes about a skill matches that skill's `SKILL.md`.
- [x] `npx skills add ./weave-your-work` lists `ask-me` with no `Skipped` line.
- [x] `node scripts/check-references.mjs .` reports no new finding.
- [x] The test copy the install wrote is deleted afterwards.

## What happened

`weave-your-work/ask-me/SKILL.md` and its `agents/openai.yaml` are written. The
skill carries the mainline, the branches opened on a state, the tests that
separate two skills that look interchangeable, and where the person's decisions
sit; it says it recommends and stops.

Every claim it makes was checked against the skill it names: `setup` for
`.agents/rules/` and its check script, `grilling` and `grill-with-docs` for what
each does, `implement` and `implement-spec` for the frontier batch, `review` for
the two axes, `hand-back` for a ticket a person worked, `communicate-with-issue`
for the roster and who closes an issue, `glossary` for the general-word test,
and `adr` for the three gates.

`npx skills add ./weave-your-work --agent '*' -y` reports 13 skills, lists
`ask-me`, and prints no `Skipped` line for a skill. `node scripts/check-references.mjs .`
reports 0 findings across 13 skills. The test copies under `.agents/skills/`,
`.claude/`, and `agent/` were deleted.

`npm test` reports one failure,
`every tool copy carries the same project-root resolver`: the issue copy at
`weave-your-work/setup/tools/issue/project-root.cjs` differs from the setup
copy. That is an uncommitted change in the setup work on this branch, outside
this ticket, and it fails the same way without this ticket's files.
