---
schema: 1
id: wm-v7nhws0hemrn
title: Fail CI on anything an install would skip
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-10T05:17:22Z
updated_at: 2026-11-10T05:17:22Z
parent: wm-10np2bs10s0e
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Add a workflow that fails when a change would break an install, so a malformed `SKILL.md` cannot reach `main` and be discovered by a stranger instead.

1. Add `.github/workflows/verify.yml`, running on `pull_request` and on push to `main`, with `permissions: contents: read`.
2. It checks out, sets up Node 22, installs the `skills` CLI at a pinned version, and runs `skills add . --list --json --yes` against the checkout, failing the job on a nonzero exit or on any `Skipped` entry in the JSON.
3. It compares the skill names the CLI found against the directory list under `weave-your-work/`: every directory holding a `SKILL.md` must appear in the CLI's list, and every listed name must have a directory. A mismatch fails the job.
4. It parses each `SKILL.md` front matter for the two required fields and fails on a missing `name`, a missing `description`, or a `description` that YAML cannot read.

The check reads what the CLI does, not a copy of its rules. A skill the CLI would skip is a skill a stranger never gets, and exit 0 hides it: measured on `mattpocock/skills`, one unparseable `SKILL.md` produces a `Skipped` line while the install still succeeds with 38 of 39.

## Acceptance signal

A pull request that adds a `SKILL.md` with an unquoted `description` containing `: ` fails the verify job, and the log names the file and the parse error. The same pull request with the description quoted passes. Both runs are linked from the pull request, and a reader can open either log.

The second half: the job also fails on the current `mattpocock/skills` set, so the check is known to catch the failure it was written for rather than passing on everything.

## Boundaries

- The workflow reports on pull requests; making it a required check is a repository setting, decided outside this task.
- No formatting, linting, or link checking.
- No publish step and no tag.
