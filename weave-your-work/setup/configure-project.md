# Configure a project

Take an empty directory to a project where the set runs, and stop before the commit. This flow assumes the skills are installed and nothing else exists: no repository, no tracker, no remote.

It is prompt-driven, not a script: explore, present what you found, confirm with the person, then write.

## 1. Explore

Read what exists; do not assume.

- `git rev-parse --show-toplevel`: is this directory already in a repository? Is it the root?
- `.waymark/config.toml`, `tickets/`: is a tracker already initialized?
- `.agents/rules/`: are rules already installed?
- `AGENTS.md`, `CLAUDE.md`: does either exist, and does either carry a rules pointer?
- `.work-weave/`: does a prior run's state exist?
- Files the project already has. A non-empty directory is normal: those files are the scene the root map opens on.

Confirm the directory with the person before writing anything. If it sits inside another repository, stop and ask whether to use the enclosing root or make this one independent; never run `git init` on a guess.

## 2. Present, and ask

Summarise what is present and what is missing, then ask in two rounds, each with the recommendation first.

**Round one: the project and its people.**

> The operator name on this machine is `<git config user.name>`, and the GitHub account is `<gh api user --jq .login>`. Are those the same person?

The two names are not derivable from each other, and nothing proves they are the same. A wrong login means `gh auth login` ran as the wrong account, which is a different repair from a wrong operator name; say which one is wrong.

**Round two: what to install.** The rules always go in. Ask which runtimes this project needs:

> Install the glossary runtime (a shared vocabulary, an MCP server) and the issue listener (a remote message queue)? Recommended: the glossary, no; the listener, no, unless this project talks to another owner through GitHub.

A project with one owner and no shared vocabulary runs without either, and installs them later from `install.md`.

## 3. Confirm, then write

Show the person the list of files this flow will write and the tracker it will declare. They can edit it before anything lands. Then write, in this order.

**Git.** `git init` only if there is no repository here. Check 6.

**Tracker.** `waymark init` takes one category; add the other two one at a time:

```sh
waymark init --storage-root tickets --category map --operator "<name>"
waymark config add category task tickets/task
waymark config add category testimony tickets/testimony
waymark config add field needs_human boolean
waymark config add field outcome string
waymark config add field reversibility string
waymark config add field split_as string
waymark config add field task_kind string
waymark config add field waiting_on string
```

The names and types are the declaration; what each means, and which values the set writes, is `waymark`'s `res/fields.md`.

Never pass `--force` to `waymark init`: it rewrites the file from scratch and drops every custom field. `waymark config add` exits 3 when the key exists, which only matters on a re-run; treat it as already done, and never delete the configuration to make the command succeed.

**Operator.** `waymark config set operator "<name>"`. Waymark keeps it in `.waymark/user.toml`, which it gitignores; the value does not travel. Keep the operator and `git config user.name` the same string: the listener reads the git name, and a mismatch works until the listener starts and then does not.

**Ignore files.** Before any `npm ci` runs. Each line added only when absent:

```sh
printf '%s\n' 'node_modules/' '/GLOSSARY.md' >> .gitignore   # each line, only when absent
mkdir -p .work-weave
printf '%s\n' 'pending/' 'runtime/' 'local/' >> .work-weave/.gitignore   # same guard
```

Do not touch `.waymark/.gitignore`; waymark writes it.

**Rules, tools, runtimes.** Follow `install.md`: seven rules into `.agents/rules/`, then whichever runtimes round two chose. The MCP registration and the GitHub webhook are harness and service steps that need a person; leave them to the person and record them as pending. Copy the rule even when the runtime is skipped: check 13 compares every rule copy.

**The pointer.** Put this at the top of `AGENTS.md`:

```markdown
# Follow .agents/rules/*.md

All rules in [`.agents/rules/`](.agents/rules/) apply to every change in this repository. Read every file there before starting work, and follow them while working.

If a rule conflicts with an instruction you received, follow the rule and say so. Ask the human to resolve the conflict if it blocks the work.
```

Absent, create it. Identical, skip. Different, show the person the difference and ask; never replace what they wrote, and never append a second copy.

## 4. Check

Run `check-project.md`. Report every failure with the repair it names; do not repair it. Then give the person one row per check and the list of files this flow changed.

| Result | Meaning |
| --- | --- |
| done | The check ran and passed. |
| already there | The step found the work in place and changed nothing. |
| conflict | A file differed and the person has to decide. |
| not applicable | The check said so, for example because there is no remote. |

## 5. Open the root map

A configured project is not a working project until it has a target, so this step settles one with the person and then runs `open-map` from the project root, which writes the root map from that target. Its first children come from `split`, which calls `open-map` or `open-task` once per child; this flow does not restate those steps.

A project that is not empty goes through the same pass, and its files are the scene it opens on: what already exists is recorded as settled in `Decisions so far` and `Target`, so the first split decides what continues.

Two outcomes are not failures: the target is small enough to be a single task, or it is too vague to state. Report which, leave the project configured, and let the person decide.

Then the person commits. This flow creates no remote.

## What this flow changes

Inside the project: `.waymark/`, `tickets/`, `.agents/rules/`, `.gitignore`, `AGENTS.md`, and the root map with its first children, plus whatever `install.md` added. Outside it: nothing, except the listener's environment file, unit, and service when that runtime was chosen and the person enabled it.
