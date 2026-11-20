---
schema: 1
id: wm-aw4skbzryy8a
title: Add the feed-me-back skill
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-20T13:43:39Z
updated_at: 2026-11-20T14:12:42Z
closed_at: 2026-11-20T14:12:42Z
custom_fields:
  needs_human: false
---
wm-s8cyfbp629nr

## What to do

Write `weave-your-work/feed-me-back/SKILL.md` and its `agents/openai.yaml`. The
skill reports a problem with a skill, or a skill that worked better than
expected, to `QiYueran-source/weave-your-work`. A problem in a project's own
records is not its job.

Every step, in order:

1. Say which account will send, with `gh api /user --jq .login`, and read it
   back to the person.
2. Ask once whether the report is a bug or a good word.
3. Check for a duplicate first: `gh search issues --repo
   QiYueran-source/weave-your-work "<symptom words>"` and `gh issue list --repo
   QiYueran-source/weave-your-work --state all`. A matching open issue gets a
   comment by the answer path in `communicate-with-issue`, not a new issue.
4. Draft the issue in the conversation: what was run, what happened, what was
   expected and the line of the skill that says it, and where it happened.
5. Send only after an explicit yes for the exact text, with `gh issue create
   --repo QiYueran-source/weave-your-work --title … --body-file … --label …`,
   after reading the label from `gh label list --repo
   QiYueran-source/weave-your-work`.
6. Ask once whether the repository should be starred, and say which it was.

Every `gh` call names `--repo QiYueran-source/weave-your-work`: the skill runs
inside whatever project the person is in.

## Acceptance criteria

- [x] `weave-your-work/feed-me-back/SKILL.md` opens with YAML front matter
      whose `description` is quoted on one line and contains no unquoted `: `.
- [x] The front matter carries `disable-model-invocation: true`, and
      `weave-your-work/feed-me-back/agents/openai.yaml` carries
      `allow_implicit_invocation: false`.
- [x] Every `gh` command in the skill names `--repo
      QiYueran-source/weave-your-work`.
- [x] The skill states that nothing is sent without an explicit yes for the
      exact text, and that one yes buys one issue at that title and label.
- [x] The skills it points at (`communicate-with-issue`) exist in
      `weave-your-work/`, and the part it reuses is named, not restated.
- [x] `npx skills add ./weave-your-work` lists `feed-me-back` with no
      `Skipped` line.
- [x] `node scripts/check-references.mjs .` reports no new finding.
- [x] The test copy the install wrote is deleted afterwards.

## The result

`weave-your-work/feed-me-back/SKILL.md` and its `agents/openai.yaml` are
written. The skill's single `gh` command block names
`--repo QiYueran-source/weave-your-work` on every call, and the steps send
nothing without an explicit yes for the exact text.

The thread answer it points at is `communicate-with-issue`'s Answer section, and
the skill names that section instead of restating it.

`npx skills add ./weave-your-work --agent '*' -y` reports 14 skills, and the
installed copy holds `feed-me-back` and `ask-me` beside the twelve.
`node scripts/check-references.mjs .` reports 0 findings across 14 skills. The
test copies under `.agents/skills/`, `.claude/`, and `agent/` were deleted.
