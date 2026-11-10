# Join a project

Take a clone of a project that already uses waymark to a checkout that passes the setup checks.

The project arrives with the tracker, the rules, and the skills committed. What a clone does not carry is everything that was never committed: the operator, the dependencies, the git hooks, the MCP registration, and the listener. Those are this flow's work.

This is not what to run on an empty directory, and not what to run on a project that has no tracker yet; that is [start-a-project.md](start-a-project.md).

Before step 1, settle the directory. Run `git rev-parse --show-toplevel` and print the absolute path it gives, then ask the person to confirm it is the clone they mean; a machine with several checkouts of the same project reaches this flow from whichever one the session started in. Run every step from there. A clone carries the rules but not the dependencies, and `rules-install.md` says where those go.

Each step names the check that proves it finished; the check's command lives in `.agents/rules/rules-checklist.md`. Do not restate those commands here; open the rule.

## 1. Confirm this is a clone of a waymark project

Three facts, and all three have to hold:

```sh
git remote get-url origin
test -f .waymark/config.toml && echo "tracker: present"
ls tickets/ | head -1
```

Check 8 for the remote, check 10 for the tracker. If the remote is missing, this is a directory that was never cloned — stop and say so, because the repair is not a step in this flow. If `.waymark/config.toml` is missing or `tickets/` is empty, the project was never initialized; stop and point at `start-a-project.md`.

Do not run `waymark init` here. The configuration is committed, and `--force` would rewrite it from scratch and drop the custom fields.

## 2. Set this clone's commit identity

The identity is not committed, so a fresh clone has only the global value, if that. Set it in this clone:

```sh
git config --local user.name "<owner>"
git config --local user.email "<address>"
```

Check 7.

The `<owner>` is not free: it is the name the project uses for people, and step 3 confirms it against the roster. `git config --local` keeps it out of the shared configuration, so this clone is the only thing that changes.

## 3. Confirm the identity pair and the roster

The operator waymark reports is derived from `git config user.name`, so the value from step 2 is already the operator; there is nothing to set.

Read the GitHub account:

```sh
gh api user --jq .login
```

Then read the roster and ask the person one question:

```sh
awk '/^\[handles\]/{h=1;next} /^\[/{h=0} h && /^[A-Za-z0-9_.-]+[ \t]*=/{print}' .work-weave/issue/handles.toml
```

The two names are not derivable from each other. `git config user.name` is whatever this machine was set to, and the login is whichever account `gh` is signed in as; nothing proves they are the same person. So state both back and ask:

> The operator on this machine is `<owner>`, and the GitHub account here is `<login>`. Are those the same person, and is `<owner>` on the project's roster?

Three outcomes:

- **The pair is right and the owner is on the roster.** Nothing to write. Check 11 passes.
- **The pair is right and the owner is missing.** Report it and stop. The roster is a shared, committed file, and adding yourself is a change to shared state: the person opens a branch, adds the line under `[handles]`, and files it as a pull request. This flow does not write that file.
- **The login is the wrong account.** That is `gh auth login` as the right account, not a roster edit. Say which half is wrong, because the two repairs are different.

The roster is also the listener's admission list: it queues an issue only when the author's login is one of the values, so an account that is missing cannot send a message, and an account that should not send belongs nowhere in it. Say that when you ask, because it is the reason not to add a name speculatively.

Check 11.

## 4. Install the dependencies that are not committed

`node_modules` is gitignored, so every clone starts without it. Find what needs installing rather than assuming where it lives:

```sh
find . -name package.json -not -path '*/node_modules/*' -not -path './.git/*'
```

Run `npm install` in each directory that comes back, and skip any directory whose `package.json` declares no dependencies. When nothing comes back, report "this project has no dependencies to install" and move on; do not run `npm install` at the root, because a root `package.json` may not be what the tools use.

Read each install's exit status, and stop on a non-zero one. A failed install can still leave a partial `node_modules`, so a directory that exists proves nothing: an unwritable npm cache leaves the directory holding some of the packages the file asks for, and the tool then fails at import.

Running the tool is not proof either, for the same reason the exit status matters: an import that cannot resolve prints `ERR_MODULE_NOT_FOUND` and exits 0, so a missing dependency reads as a silent success. Check 15 is the exception — it starts the glossary MCP server and counts the tools it answers with, so it fails when that bundle's dependencies are incomplete.

Check 3 first if this is a new machine; the tools need Node 22.20 or newer.

## 5. Install the post-merge hook

The glossary rebuilds `GLOSSARY.md` from `.work-weave/glossary/*.jsonl` after a pull, and the hook is what runs it. The hook lives in `.git/hooks`, which is not committed, so a clone has none.

```sh
hook=$(git rev-parse --git-path hooks/post-merge)
if [ ! -e "$hook" ]; then
  runtime=$(cd .work-weave/runtime/glossary && pwd)
  sed "s#@GLOSSARY_RUNTIME@#$runtime#g" "$runtime/post-merge.sh" > "$hook"
  chmod +x "$hook"
fi
```

The template lives in the project runtime at `<root>/.work-weave/runtime/glossary/post-merge.sh`, and `@GLOSSARY_RUNTIME@` becomes that directory's absolute path. Never overwrite an existing hook: a clone of a project that customized it would lose that work.

Windows PowerShell:

```powershell
$hook = git rev-parse --git-path hooks/post-merge
if (-not (Test-Path $hook)) {
  $runtime = (Resolve-Path .work-weave\runtime\glossary).Path
  (Get-Content "$runtime\post-merge.sh") -replace '@GLOSSARY_RUNTIME@', $runtime | Set-Content $hook
}
```

Git for Windows runs hooks with its bundled `sh`, so the shell hook works there. A Git distribution without that shell needs WSL or Git Bash; there is no PowerShell hook, because Git runs the file named `post-merge` and reads its shebang.

Without the hook, run the merge command after every pull instead. Say that when you skip it.

## 6. Build `GLOSSARY.md`

`GLOSSARY.md` is gitignored and generated, so a clone starts without it:

```sh
node .work-weave/runtime/glossary/glossary.js merge --project .
```

Check 15 proves the MCP server, which reads the same data. If the merge reports no glossary entries, that is not a failure: the project has none yet.

## 7. Leave the two pieces only the person can do

Both are outside the repository, and both need an account or a service.

**The MCP server registration.** The harness config that lists MCP servers is per-machine and outside the project. Read `<skill>/bundle/setup.md` for the snippet and hand it over; do not write into a harness config you were not told to touch.

**The listener's channel, webhook, and service.** The channel and webhook are repository state and survive the clone: if the project already has a listener, the `gh` reads in check 16 find them, and creating a second one is wrong. What does not survive is this machine's half — `~/.config/work-weave/smee.env` and the service.

On Linux, the unit needs `WorkingDirectory` set to this clone; check 16 compares it. On macOS and Windows there is no `systemctl` step: run the listener in a terminal while you work, and say that the queue still fills. A launch agent or a scheduled task would have to be written by the person; do not invent one.

Check 16.

## 8. Run the checks

Run all seventeen from `.agents/rules/rules-checklist.md`, not only the starred ones: a clone is the one moment when nothing local has been proven yet. Report the failures with the command that repairs each one; do not repair them.

Then give the person the same four-state table the other flow uses:

| Result | Meaning |
| --- | --- |
| done | The check ran and passed. |
| already there | The step found the work in place and changed nothing. |
| conflict | A file differed and the person has to decide. |
| not applicable | The check said so, for example because there is no remote. |

Commit nothing, and do not push the branch you are on. What this flow writes is local: `.git/config` for the identity, `node_modules` in each tools directory, `.git/hooks/post-merge`, and `GLOSSARY.md`. None of it is tracked, so there is nothing to commit; say that, so the person does not go looking.

## What this flow does not do

- It does not install the skills. A clone carries them; check 12 proves they are all still there.
- It does not register a rule. The rules are committed under `.agents/rules/`; check 13 proves the copies still match their bundles.
- It does not add the person to `handles.toml`. That is a shared change and goes through a branch and a pull request.
- It does not create a channel or a webhook. One per repository, and the project already has them.
