# Keep the Default Branch Protected

The default branch holds what the team has agreed to. Changes reach it through a pull request that someone reviewed, never by a push from a working copy.

## What to do

1. Never commit to the default branch. Before working, check the branch you are on and move off the default branch:

   ```sh
   git branch --show-current
   ```

   If it prints the default branch name, create your own branch first:

   ```sh
   git switch -c "<your-branch>"
   ```

2. Do the work on your own branch, and keep one branch to one piece of work.
3. Open a pull request for the branch. Do not push the default branch, do not force-push it, and do not merge your own pull request when the team asks for a reviewer.
4. One commit per logical change. The subject says what changed; the body says why. A commit that mixes unrelated edits makes the review harder, so split it.

## When the repository has no remote

A project without a remote has no pull request to open and no default branch to protect. Commit on whatever branch you work on, and start following this rule when the project gains a remote.

## When the default branch is already unprotected

Report it to the person instead of relying on the protection alone. Do not push to it merely because the server would allow it.
