# Start a project

Take an empty directory to a project that passes the setup checks.

This assumes the skill set is installed and nothing else exists: no Git repository, no waymark configuration, no remote. How the set got installed is not this flow's subject; the repository's README carries that.

Before step 1, settle the root. Print the current working directory and ask the person to confirm it is the project root or to name another directory. Do not silently use an enclosing Git repository. If the chosen directory is inside a Git repository but is not that repository's worktree root, stop and ask whether to use the enclosing root or create an independent repository; never run `git init` in a nested directory on your own. If the chosen directory has an ancestor Waymark configuration but no local `.waymark/config.toml`, stop and ask whether to use the enclosing project or initialize a separate tracker. Only after confirmation, create the missing `.git`, `.waymark/`, and `.work-weave/` markers in that root. Run every later step from there; nothing else infers the root.

The commands below are the shapes that were checked against waymark 0.1.2; where a command differs between Unix and Windows, both are given. Each step names the check that proves it finished; the checks live in `.agents/rules/rules-checklist.md`, which step 2 installs; the rule names the one script that runs them. Do not restate the checks here; open the rule.

## 1. Confirm the skill set is there

You are reading this file out of the installed set, so the set is installed. Run check 12 anyway: it proves the five skills this flow calls are on disk in one of the roots it finds — `setup` and the four bundles `map`, `task`, `glossary`, and `issue` — and it discovers what is there rather than listing it, so it keeps working when the set grows. If it reports a missing skill, stop and repair it; the rest of this flow reads files out of those directories.

Do not run check 13 yet. It compares every bundle's rules against `.agents/rules/`, and nothing is registered there until step 2 writes setup's three rules and step 8 runs the four bundle setups, so on a fresh install it reports all seven as unregistered. Step 8 runs it.

## 2. Install setup's own rules

Read `bundle/setup.md` and follow it. It copies `rules-git.md`, `rules-checklist.md`, and `rules-install.md` into `.agents/rules/` and states the three cases: absent, identical, and different. A conflict stops the flow until the person decides.

From here on, `.agents/rules/rules-checklist.md` is the reference for every check named below.

## 3. Install the tools

Four tools, each with its own auth. Install what can be installed, and stop for what only the person can do.

**Git.** Install it from the platform's package manager. Check 1.

**Waymark.** Download the prebuilt archive for the platform from the release page, verify its `.sha256`, unpack it, and put `waymark` on `PATH`. No Rust toolchain is needed. The archive names are `waymark-v0.1.2-linux-x86_64.tar.gz`, `waymark-v0.1.2-macos-aarch64.tar.gz`, `waymark-v0.1.2-macos-x86_64.tar.gz`, and `waymark-v0.1.2-windows-x86_64.zip`.

There is no Linux ARM archive. On that platform the only path is `cargo install waymark-cli`, which does need a Rust toolchain; say so before starting, because the download will fail.

Check 2.

**Node and npm.** The floor is 22.20, not 20.18: the `skills` package that installs the set declares it. The bundle tools accept 20.18 on their own, which is why the two numbers differ. Install Node 22.20 or newer with its bundled npm. Check 3.

**GitHub CLI.** Install `gh`, then sign in as the account whose repositories the project will use:

```sh
gh auth login
```

This is the person's step, not the agent's: the command opens a browser or asks for a token. Stop and let them do it. When it finishes, check 4.

## 4. Initialize Git

If the directory is not a repository yet:

```sh
git init
```

Check 6.

Set the commit identity when it is missing. Use the person's own name and address; do not invent them:

```sh
git config user.name "<name>"
git config user.email "<address>"
```

Check 7.

This flow creates no remote. Leave check 8 reporting no remote; the two checks that depend on one, 9 and 16, are not applicable. Check 17 does not depend on a remote and still runs.

## 5. Initialize the tracker

`waymark init` takes one category, because `--category` cannot be repeated. Start with `map`:

```sh
waymark init --storage-root tickets --category map --operator "<name>"
```

Add the other two categories one at a time:

```sh
waymark config add category task tickets/task
waymark config add category testimony tickets/testimony
```

Then the six custom fields:

```sh
waymark config add field needs_human boolean
waymark config add field outcome string
waymark config add field reversibility string
waymark config add field split_as string
waymark config add field task_kind string
waymark config add field waiting_on string
```

Never pass `--force` to `waymark init`. Without it, a re-run reuses the existing configuration and changes nothing. With it, the file is rewritten from scratch and every custom field disappears.

`waymark config add` exits 3 when the key already exists, which only matters on a re-run. Read `waymark config show` first on a re-run, or treat exit 3 as already done; do not delete the configuration to make the command succeed.

The generation in `.waymark/config.toml` is waymark's to write. A fresh init writes 1.8, an older project may carry another number, and neither is a problem.

## 6. Set the operator and name the GitHub account

`waymark` stores the operator in `.waymark/user.toml`, which it gitignores for you, so this value does not travel with the repository and every clone sets its own. Ask once, with `git config user.name` as the default:

```sh
waymark config set operator "<name>"
```

Then read the GitHub account, and ask the second question in the same breath:

```sh
gh api user --jq .login
```

The two names are not derivable from each other: `git config user.name` is whatever this machine was configured with, and the login is whichever account `gh` is signed in as. Nothing proves they are the same person, so state both back and ask the person to confirm the pair, for example: "the operator on this machine is `frank`, and the GitHub account is `QiYueran-source`; are those the same person?" A wrong login here means `gh auth login` was run as the wrong account, which is a different repair from a wrong operator name; say which one is wrong.

The pair becomes one line under `[handles]` in `.work-weave/issue/handles.toml`. Step 8's issue bundle writes that file from this answer and reads it back; it does not ask again.

Keep the operator and `git config user.name` the same string. The listener reads the git name, not the operator, and matches it against the roster, so a project whose operator says `frank` while the git name says something else works until the listener starts and then does not.

Check 11.

## 7. Write `.gitignore`

Do this before step 8. The glossary and issue runtimes both run `npm ci --omit=dev` under `.work-weave/runtime/`, and a `node_modules` that is already staged stays staged after `.gitignore` is written, so the order matters.

Write both files when they do not exist, and add each line only when it is absent, so a re-run adds nothing twice.

Unix:

```sh
touch .gitignore
for line in 'node_modules/' '/GLOSSARY.md'; do
  grep -qxF "$line" .gitignore || printf '%s\n' "$line" >> .gitignore
done
mkdir -p .work-weave
for line in 'pending/' 'runtime/' 'local/'; do
  grep -qxF "$line" .work-weave/.gitignore 2>/dev/null || printf '%s\n' "$line" >> .work-weave/.gitignore
done
```

Windows PowerShell:

```powershell
if (-not (Test-Path .gitignore)) { New-Item -ItemType File .gitignore | Out-Null }
foreach ($line in 'node_modules/', '/GLOSSARY.md') {
  if (-not (Select-String -Path .gitignore -Pattern ([regex]::Escape($line)) -Quiet -ErrorAction SilentlyContinue)) {
    Add-Content .gitignore $line
  }
}
New-Item -ItemType Directory .work-weave -Force | Out-Null
foreach ($line in 'pending/', 'runtime/', 'local/') {
  if (-not (Select-String -Path .work-weave\.gitignore -Pattern ([regex]::Escape($line)) -Quiet -ErrorAction SilentlyContinue)) {
    Add-Content .work-weave\.gitignore $line
  }
}
```

The guard is the point: a re-run must not duplicate a line. The glossary and issue setups append the same `.work-weave` entries with their own guards, so step 7 having written them is harmless. Check 17 counts matched paths rather than lines.

Do not touch `.waymark/.gitignore`. Waymark writes it and keeps `write.lock` and `user.toml` out of the repository.

Check 17.

## 8. Run the four bundle setups

Each bundle owns its own install. Read each `bundle/setup.md` under the installed skill directory and follow it; this flow does not restate those steps. Run them in this order, because the later ones assume the earlier ones land:

1. `map` — the work-record rule.
2. `task` — the task-record rule.
3. `glossary` — the `.work-weave/glossary/` sources, the `.work-weave/runtime/glossary/` runtime, its MCP server registration, and the writing rule.
4. `issue` — the listener runtime, its checkout settings and service, the handles file, and the queue.

Two of them need a person before they finish: the MCP server registration is a harness config edit, and the listener needs a GitHub webhook and a service. Leave those two steps to the person and record them as pending. Without a remote, the issue bundle's external steps have nothing to act on; skip those and say so, but still copy its rule. Every bundle's rule copy is what check 13 compares, and a skipped copy leaves the check failing for the rest of the project's life.

The glossary and issue setups write their ignore entries themselves, which is why step 7 already wrote the lines they need.

The glossary and issue setups copy their tools into `.work-weave/runtime/glossary/` and `.work-weave/runtime/issue/` and run `npm ci --omit=dev` there. Read each one's exit status and stop on a non-zero one: a failed install can still leave a partial `node_modules`, so the directory appearing proves nothing. A cache directory the user cannot write is the usual cause; `npm ci --cache <a directory you own>` gets past it.

Checks 13, 15, and 16.

## 9. Point `AGENTS.md` at the rules

The prompt goes at the top of the file:

```markdown
# Follow .agents/rules/*.md

All rules in [`.agents/rules/`](.agents/rules/) apply to every change in this repository. Read every file there before starting work, and follow them while working.

If a rule conflicts with an instruction you received, follow the rule and say so. Ask the human to resolve the conflict if it blocks the work.
```

Three cases, the same as a rule copy:

- The file is absent: create it with the prompt.
- The prompt is already there, identical: skip.
- The file exists with other content, or with a different version of the prompt: show the person the difference and ask. Do not replace what they wrote, and do not append a second copy.

Check 14.

## 10. Run the checks

Run all seventeen with the checklist script. Report the failures and the repair each one names; do not repair them.

Then give the person this table, one row per check, and the list of files this flow changed.

| Result | Meaning |
| --- | --- |
| done | The check ran and passed. |
| already there | The step found the work in place and changed nothing. |
| conflict | A file differed and the person has to decide. |
| not applicable | The check said so, for example because there is no remote. |

Commit nothing. The person reads the list and commits. This flow also creates no remote; joining an existing repository is a different flow.

## What this flow changes

Nothing outside the project directory except what a bundle setup writes: the listener's environment file and unit, and a service the person enables. Inside the project it writes `.waymark/`, `tickets/`, `.agents/rules/`, `.gitignore`, and `AGENTS.md`, plus whatever the four bundle setups add.
