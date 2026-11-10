---
schema: 1
id: wm-v7nhws0hemrn
title: Fail CI on anything an install would skip
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-10T05:17:22Z
updated_at: 2026-11-10T12:27:12Z
parent: wm-10np2bs10s0e
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Add a workflow that fails when a change would break an install, so a malformed `SKILL.md` cannot reach `main` and be discovered by a stranger instead.

1. Add `.github/workflows/verify.yml`, running on `pull_request` and on push to `main`, with `permissions: contents: read`.
2. It checks out, sets up Node 22 with the `npm` cache, and runs `npm ci`.
3. It installs the pinned skills CLI (`skills@1.7.6`) into a throwaway HOME: `HOME=$RUNNER_TEMP/home npx --yes skills@1.7.6 add . -g -y -a codex --json > "$RUNNER_TEMP/skills.json"`. `--list` and `--json` cannot be combined in this version: the CLI prints only an error and still exits 0, so the check reads the install result instead of the list.
4. `scripts/check-skills.mjs` reads that JSON and fails when any entry is not `installed`, when the installed names differ from the directories under `weave-your-work/` that hold a `SKILL.md`, or when a `SKILL.md` front matter is missing `name` or `description` or is not valid YAML. It uses the `yaml` package, declared in `package.json`.
5. The job fails when the install command exits nonzero, even when its JSON looks fine.

The check reads what the CLI does, not a copy of its rules. A skill the CLI would skip is a skill a stranger never gets, and exit 0 hides it: measured on `mattpocock/skills`, one unparseable `SKILL.md` produces a `Skipped` line while the install still succeeds with 38 of 39.

## Acceptance signal

A pull request that adds a `SKILL.md` with an unquoted `description` containing `: ` fails the verify job, and the log names the file and the parse error. The same pull request with the description quoted passes. Both runs are linked from the pull request, and a reader can open either log.

## Boundaries

- The workflow reports on pull requests; making it a required check is a repository setting, decided outside this task.
- No formatting, linting, or link checking.
- No publish step and no tag.
