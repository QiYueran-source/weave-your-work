# The installed skill copies

`.agents/skills/` is not this repository's skill set. It is where `npx skills add` puts a copy of whatever it installs, and it exists here to test that an install works.

The only skill set in this repository is `weave-your-work/`. It is the source; the copies under `.agents/skills/` are output, and editing them changes nothing.

## Why they are not read from here

The copies under `.agents/skills/` are stale. They hold files this branch does not have (`res/map.md`, `res/task.md`) and lack files it does, so a reader who opens them reads a different set with the same names. That is why the copies were moved out of the workspace root, to `.inbox/.agents-skills/`, on 2026-11-12. `.inbox/` is ignored by Git; the copies were never tracked.

The copies of [`mattpocock/skills`](https://github.com/mattpocock/skills) that `weave-your-work/` learns from used to live in `.agents/matt-skills/`. That directory is gone: commit `bb4b5be` dropped it on 2026-11-12 because it drifted from this branch. Nothing of his set is kept here now; `docs/matt-methods/` names the file each answer was read from, and the file itself is fetched from his repository.

## Installing again

To test an install, run `npx skills add ./weave-your-work` from the repository root. It writes a fresh copy under `.agents/skills/`, which `.gitignore` keeps out of the repository. Delete it when the test is done; do not commit it, and do not read it as the set.
