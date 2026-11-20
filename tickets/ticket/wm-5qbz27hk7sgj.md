---
schema: 1
id: wm-5qbz27hk7sgj
title: 'Communicate with issue: Matt''s layout and front matter'
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-18T11:32:18Z
updated_at: 2026-11-18T11:33:23Z
closed_at: 2026-11-18T11:33:23Z
parent: wm-5agy2f6tjy74
---
Part of wm-5agy2f6tjy74

## What to do

Put `weave-your-work/communicate-with-issue/` on Matt's file layout and his
front matter. The record definition moves beside `SKILL.md` as
`COMMUNICATE-ISSUE-FORMAT.md`; the front matter carries
`disable-model-invocation: true` with no `family` and no `invocation`; the
description is one human-facing line; `agents/openai.yaml` sits beside the
skill; and the listener's comment names the format file that exists.

## Acceptance criteria

- [x] `res/format.md` is gone and `COMMUNICATE-ISSUE-FORMAT.md` holds the same
      content.
- [x] `SKILL.md` points at `COMMUNICATE-ISSUE-FORMAT.md`.
- [x] Front matter has `disable-model-invocation: true`, no `family`, no
      `invocation`, and a description with no "Use when" list.
- [x] `agents/openai.yaml` parses out of the box, with `display_name`,
      `short_description`, and `policy.allow_implicit_invocation: false`.
- [x] `setup/tools/issue/listener.mjs` names the new file in its comment.
- [x] The install lists the skill and skips nothing.

## The result

`weave-your-work/communicate-with-issue/` holds `SKILL.md`,
`COMMUNICATE-ISSUE-FORMAT.md`, and `agents/openai.yaml`; `res/` is gone and the
format file's content is unchanged, moved with `mv`.

The front matter is `name`, `description`, and `disable-model-invocation: true`.
The description is one line that names what the skill carries. `agents/openai.yaml`
carries `display_name`, `short_description`, and
`policy.allow_implicit_invocation: false`.

The comment above `communicationFields` in
`weave-your-work/setup/tools/issue/listener.mjs` names
`communicate-with-issue`'s `COMMUNICATE-ISSUE-FORMAT.md` instead of the file
that never existed.

Verified by reading back: a `grep` for `res/format.md`, `res/`, and
`communicate-issue.md` across `weave-your-work/` finds nothing; both YAML files
parse with the `yaml` package; `node --check` passes on the listener. The
installer ran on the skill folder and printed `Found 1 skill` with the new
description and no `Skipped` line, then stopped before copying on an unrelated
error, `skills-lock.json: unsupported lock version 2 (expected 1)`. The skill
parsed; the lock file is a separate problem this ticket does not touch.
