# Use Git for All Changes

Every change to this repository goes through Git. Nothing is edited directly and left uncommitted.

## What to do

1. Commit complete work. A task is done only after its changes are committed.
2. Commit promptly. Commit whenever a piece of work is complete, not only at the end of the day.
3. Write a useful commit message: the subject says what changed, the body says why. See the `talk-like-a-human` skill for how to word it.
4. Keep commits focused: one logical change per commit. Do not bundle unrelated edits into a single commit.

## What to check before committing

- Stage only the files that belong to this change. No stray edits from other work.
- Review the staged diff before committing.
- Do not commit secrets, build output, or generated files that belong in `.gitignore`.
- Do not force-push or rewrite shared history.

## When a commit fails

If a commit is rejected or something about it is wrong, say so instead of working around it. Fix the underlying problem, then commit again.
