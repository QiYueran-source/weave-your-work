---
schema: 1
id: wm-sem4xv8ewhe8
title: Make root install return only the weave skills
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T05:17:16Z
updated_at: 2026-11-10T06:10:38Z
closed_at: 2026-11-10T06:10:38Z
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

## Result

Committed as `48a432d`. The vendored set moved from `.agents/skills/` to `.agents/matt-skills/`, `skills.sh.json` narrows discovery to `./weave-your-work`, and `.agents/skills/` is gitignored except for `issue/bundle/tools/handles.toml`.

Measured on a fresh clone of the committed tree (`git archive` of the index into `/tmp`, then `git clone` of that):

- `skills add . --list` printed `Found 19 skills` and no `Skipped` line.
- The 19 names are byte-identical to the directories under `weave-your-work/` that hold a `SKILL.md`; `diff` of the two sorted lists is empty.
- Against `main` before this commit the same command printed `Found 39 skills`, every name from `.agents/skills/`, and none of the 19.

What the run turned up and settled:

- `.agents/skills/issue/` was a second copy of `weave-your-work/issue/`, tracked separately. It is now untracked like the rest of the installed copies. Its `.gitignore` exception is one file, `bundle/tools/handles.toml`, because that file is the roster of owners and GitHub logins shared by everyone using the project, and it is the one thing under `.agents/skills/` that an install does not recreate.
- The files on disk were left in place: the 40 vendored directories were copied back into `.agents/skills/` after the move, so the sessions running in this checkout keep their skills and only tracking changed. The consequence is that a local `add . --list` in this checkout prints 57, because the install target is populated here; a fresh clone prints 19. Same shape as matt's machine, where the installed copies live outside the repo rather than inside an ignored directory.
- `docs/smee-signature-research.md` cited `.agents/skills/issue/...` three times, twice in a way that pointed at a path under a tracked file. Both now point at `weave-your-work/issue/...`.
- The rename is invisible to `.agents/rules/rules-pending-communications.md`: the rule reads the roster from the project root, and that path still holds the file.

Not done here: the `setup` skill still tells a new project to look for `.agents/skills/`, which stays true for an installed project. `weave-your-work/setup/SKILL.md` says the checks look there, and they do.

## Review

passed

- Goal: A fresh clone of the committed tree prints `Found 19 skills`, no `Skipped` line, and the 19 names diff clean against the directories under `weave-your-work/` that hold a `SKILL.md`. Checked by exporting the index with `git archive` into `/tmp`, cloning that, and running `skills add . --list` against the clone. The same command on `main` before this commit printed 39, all matt's.
- Convention: The change touches only layout, the config file, `.gitignore`, a reference README, and three path citations in `docs/smee-signature-research.md`. No skill text and no front matter was edited, and `weave-your-work/` was not renamed, both as the Boundaries require.

## Boundaries

- No new skill is written and no existing skill's front matter is edited.
- `weave-your-work/` is not renamed, and the install command stays `qiyueran-source/weave-your-work` rather than growing a subpath.
- The vendored set is not deleted and not brought up to date with upstream.
