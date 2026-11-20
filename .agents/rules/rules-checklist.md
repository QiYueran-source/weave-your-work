# Run the Setup Checks

Run these checks at the start of a session, and run every one of them when a feature turns out to be unavailable. They say whether the project is still configured, not whether the code works.

## Run the script

Run the setup skill's check script from the project root:

```sh
node <setup-skill>/tools/check-setup.mjs --starred
```

`--starred` runs the ten checks a session start covers. Use `--all` when something you expect to work does not. The script prints `ok`, `fail`, `not applicable`, or `unverified` for each check, and exits 1 when a check fails; on a failure it prints the repair. It reads state and repairs nothing.

`<setup-skill>` is `.agents/skills/setup` for a project install, `~/.agents/skills/setup` for a global one, or `%USERPROFILE%\.agents\skills\setup` for a global one on Windows. The script uses only Node and calls `git`, `gh`, `waymark`, and `curl` directly, so it does not depend on a shell.

## What to do

1. At session start, run the starred checks.
2. When a feature you expect to work does not, run all eighteen.
3. Report the failing check and its repair. Do not run the repair, edit a config, or install anything. Repairing the setup is the person's decision.
4. Mark a check not applicable only where it says so. A missing remote covers 8 and 16; a plan without server protection covers 9; a platform other than Linux covers 16 and 17. Never mark a check passed without running it.

## The checks

The starred checks are 1, 2, 3, 4, 6, 7, 10, 12, 13, and 14.

### Tools

1. **Git is available.** * `git --version` prints a version. Repair: install Git.
2. **Waymark is installed and recent.** * `waymark --version` prints `waymark 0.1.2` or newer on stdout. The binary can also write a linker warning to stderr; read stdout. Repair: install waymark 0.1.2 or newer.
3. **Node and npm clear the floor.** * Node is 22.20.0 or newer and `npm --version` prints a version. Compare the numbers, not the strings. Repair: install Node 22.20 or newer with its bundled npm.
4. **The GitHub CLI is signed in.** * `gh auth status` exits 0 and names a logged-in account. Repair: `gh auth login`.
5. **curl is available.** `curl --version` prints a version. The issue listener creates its smee channel with curl; nothing else uses it. Repair: install curl.

### Repository

6. **The directory is a Git repository.** * `git rev-parse --show-toplevel` prints the project directory. Repair: run the setup flow or `git init` in the project root.
7. **A commit identity is set.** * `git config user.name` and `git config user.email` print a value each. Repair: set both.
8. **The repository knows its remote.** `git remote get-url origin` prints a URL. No origin makes checks 9 and 16 not applicable; it is not a failure. Repair: add the origin remote.
9. **The default branch is protected.** The branch's `protected` flag is true. A private repository on a free plan cannot have server protection: the flag is false and the protection endpoint answers 403 with `Upgrade to GitHub Pro or make this repository public`; that is not applicable, and the project relies on `rules-git.md` and its own hook. Read the branch, not the protection endpoint: the endpoint answers 404 for a non-admin member who can still read the branch. A 404 or 403 without the plan message is unverified, not a failure. Repair: protect the default branch, or use the local fallback.

### Tracker

10. **The tracker validates and is configured.** * `waymark validate --json` reports `healthy: true` and `counts.errors: 0`. `waymark config show --json` reports `storage_root: tickets`, the categories `map`, `task`, and `testimony`, and the six fields `needs_human`, `outcome`, `reversibility`, `split_as`, `task_kind`, and `waiting_on`. Read the JSON; `waymark validate` exits 0 whether or not it found anything. Repair: run the tracker steps in `start-a-project.md`.

### Skills and rules

12. **Every installed skill is still there.** * For every directory named `skills` within three levels (skipping `.git` and `node_modules`) and for `~/.agents/skills` (`%USERPROFILE%\.agents\skills` on Windows), each `<name>/SKILL.md` is present; each project root's tracked skills have `missing: none`, the root has no tracked skills yet, or the root repeats skills already reached through another root. The six skills the setup flow calls — `setup`, `waymark`, `map`, `task`, `glossary`, and `issue` — appear in at least one root. A skill source checkout (`weave-your-work/` and `skills.sh.json`) skips the required set. Repair: reinstall the missing skills.
13. **Every setup rule is registered.** * For `<root>/setup/rules/*.md` in the project and global installs, `.agents/rules/<name>` exists and matches byte for byte. Repair: run the setup install that copies the missing rule.
14. **AGENTS.md points at the rules.** * `AGENTS.md` contains the line `All rules in [`.agents/rules/`](.agents/rules/) apply to every change in this repository.`, in any wrapping. Repair: write the prompt at the top of the file.

### Registered tools

15. **The glossary MCP server answers.** It lists three tools: `glossary_list`, `glossary_write`, and `glossary_merge`. Repair: run the glossary install in setup and start its server from the project runtime.
16. **The listener runs for this checkout.** On Linux, the generated unit is active and its `WorkingDirectory` is this project root. `active` alone does not say which checkout the service serves. On macOS and Windows there is no bundled service: the check is not applicable, and the alternative is to run the listener in a terminal while you work; a launch agent or scheduled task is the person's to write. Repair: start the listener for this checkout.
17. **The webhook sends every event the listener needs.** On Linux only, because the settings file that names the channel lives on a checkout that runs a listener; on macOS and Windows it is not applicable. On Linux, a missing remote makes it not applicable, as check 16 says. The repository hook whose URL matches the `SMEE_URL` in `.work-weave/personal/issue-listener.env` lists `issues`, `pull_request`, and `push` in its events. `issues` fills the queue; `pull_request` and `push` write the event file, so a hook missing either of them fails with the `PATCH` that adds the missing events to the hook that is there; a second hook is never the repair. A 404 or 403 on the hooks read is not a failure by itself: read `permissions.admin` first; `false` means unverified, because the account cannot see webhooks. Repair: patch the existing hook.
18. **The queue and the build output are ignored.** `git check-ignore` prints all four paths: `node_modules/`, `GLOSSARY.md`, `ADR.md`, and `.work-weave/personal/`. One line in `.work-weave/.gitignore` covers the queue, the settings, the unit, and every installed tool copy. Count the printed paths, not the exit code: `git check-ignore` exits 0 when any one matches. Repair: add the missing ignore rules.
