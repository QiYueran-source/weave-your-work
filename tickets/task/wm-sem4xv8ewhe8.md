---
schema: 1
id: wm-sem4xv8ewhe8
title: Make root install return only the weave skills
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-10T05:17:16Z
updated_at: 2026-11-10T05:17:16Z
parent: wm-10np2bs10s0e
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Make `npx skills add qiyueran-source/weave-your-work` return exactly the skills under `weave-your-work/` and nothing else.

1. Move the vendored reference set from `.agents/skills/` to `.agents/matt-skills/` with `git mv`, so it stays in the repository and stays readable but stops being a discovery container.
2. Add `.agents/skills/` to `.gitignore`. It becomes the install target: absent in a clone, filled by the first install, never committed.
3. Add `skills.sh.json` at the repo root carrying `{"$schema": "https://skills.sh/schemas/skills.sh.schema.json", "paths": ["./weave-your-work"]}`.
4. Add `.agents/matt-skills/README.md` saying what the directory is: copies of `mattpocock/skills` kept as a reading reference, install them from the source instead, and why the directory is not named `.agents/skills/`.
5. Repoint the one document that cites the old path: `docs/smee-signature-research.md` names `.agents/skills/issue/bundle/tools/tests/test-security.mjs` twice, and the tracked file is under `weave-your-work/issue/`.

The files already on disk under `.agents/skills/` stay where they are for the sessions running in this checkout; only their tracking changes.

## Acceptance signal

A fresh `git clone` of the branch, run through `node <skills-cli>/bin/cli.mjs add . --list`, prints `Found 19 skills`, prints no `Skipped` line, and the 19 names equal `ls weave-your-work` minus `ask-me` (which holds no `SKILL.md`). The same command run against the current `main` prints `Found 39 skills` with every name from `.agents/skills/`, so the two logs side by side show the change.

A reader can check it without the branch: after the merge, `npx skills add qiyueran-source/weave-your-work --list` on any machine prints the same 19 names.

## Boundaries

- No new skill is written and no existing skill's front matter is edited.
- `weave-your-work/` is not renamed, and the install command stays `qiyueran-source/weave-your-work` rather than growing a subpath.
- The vendored set is not deleted and not brought up to date with upstream.
