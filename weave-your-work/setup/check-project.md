# Check a project

Read the project's state and report each check with its repair. This changes nothing.

## Steps

1. Run the checklist script from the project root:

   ```sh
   node <setup>/tools/check-setup.mjs --starred
   ```

   `--starred` runs the ten checks a session start covers. Use `--all` when a feature you expect to work does not. The script prints `ok`, `fail`, `not applicable`, or `unverified` for each check, and exits 1 when a check fails; on a failure it prints the repair.

2. Report every failing check with its repair. Do not run the repair, edit a config, or install anything: repairing the setup is the person's decision.
3. Mark a check not applicable only where it says so. A missing remote covers 8 and 16; a plan without server protection covers 9; a platform without a bundled service covers 16. Never mark a check passed without running it.

The checks themselves are `rules/rules-checklist.md`. This file does not restate them.

## When to run it

- At the start of a session: `--starred`.
- When a feature you expect to work does not: `--all`.
- Before and after any change to the installed set.

## What this flow does not do

- Repair anything.
- Decide that a project is configured. The script's answer is the answer.
