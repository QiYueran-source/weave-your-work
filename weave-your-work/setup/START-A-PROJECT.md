# Start a project

Take an empty directory to a project where the set runs. This flow assumes the
skills are installed and nothing else exists: no repository, no tracker, no
`AGENTS.md`.

It is prompt-driven, not a script: explore, present what you found, confirm with
the person, then write.

## 1. Explore, and settle the root

Read what exists; do not assume.

- `git rev-parse --show-toplevel`: is this directory already in a repository? Is
  it the root?
- `.waymark/config.toml`, `tickets/`: is a tracker already initialized?
- `.agents/rules/`: are rules already installed?
- `.work-weave/`: does a prior run's state exist?
- `AGENTS.md`, `CLAUDE.md`: does either exist?
- Files the project already has. A non-empty directory is normal.

Show the absolute path and ask the person to confirm it is the project root. Do
not silently select an enclosing Git repository. If the directory sits inside
another repository and has no worktree root of its own, stop and ask whether to
use the enclosing root or make this one independent; never run `git init` on a
guess.

## 2. Present, and ask

Summarise what is present and what is missing. Then ask two questions, each with
the recommendation first.

**The operator.** The machine's Git name and the GitHub account are two
different names:

> The operator name on this machine is `<git config user.name>`. Which GitHub
> account is that person?

The two are not derivable from each other. The answer goes in two places: the
`[handles]` roster and `waymark config set operator`. They must be the same
string, because the issue listener matches the roster against the Git name.

**The runtimes.** The rules always go in. Ask which optional runtimes this
project needs:

> Install the glossary (a shared vocabulary and its MCP server), the ADR tool
> (decision records), and the issue listener (a remote message queue for talking
> to other owners on GitHub)? Recommended: glossary, only if this project has
> vocabulary worth keeping; ADR, only if it records decisions; listener, no,
> unless someone else will send you issues.

A project with one owner and no shared vocabulary runs without any of them. Each
can be installed later; `SKILL.md` says how.

## 3. Confirm, then write

Show the person the list of files this flow will write. They can edit it before
anything lands. Then write in this order.

### 3.1 Git

`git init` only when this directory is not already a repository.

### 3.2 `.work-weave/`

Build the directory before the tracker, because every runtime and rule reads
from it.

```sh
mkdir -p .work-weave/shared .work-weave/personal
printf '%s\n' 'personal/' > .work-weave/.gitignore
```

`shared/` is committed and holds what every clone needs. `personal/` is ignored
and holds this checkout's runtime copies, settings, and queue. Create both even
when no runtime is chosen: a later install expects them to be there, and an empty
`shared/` costs nothing.

Create these subdirectories only when the matching runtime is chosen:

```sh
mkdir -p .work-weave/shared/glossary .work-weave/personal/glossary   # glossary
mkdir -p .work-weave/shared/adr .work-weave/personal/adr             # ADR
mkdir -p .work-weave/personal/issue .work-weave/personal/communication  # listener
```

Write `.work-weave/shared/handles.toml` from the template in
`tools/issue/handles.toml.example`, with the person's name and GitHub login. The
file is committed; it is the roster the listener reads.

Write `.work-weave/shared/tracker.md`: how a record is created, which fields
exist, the statuses, and how relations are recorded. It describes this project's
tracker and is the file a later session reads instead of guessing.

### 3.3 Tracker

The issue tracker this set uses is waymark, from `QiYueran-source/waymark`. Prefer
that one: the categories, the fields, and the commands below are its own, and no
other tracker has them. Install it from its release page before this step and
confirm `waymark --version` prints at least `0.1.2`.

`waymark init` takes one category; add the other two one at a time.

```sh
waymark init --storage-root tickets --category spec --operator "<git name>"
waymark config add category ticket tickets/ticket
waymark config add category testimony tickets/testimony
waymark config add field needs_human boolean
```

Four things about these commands, all of them measured against waymark 0.2.0:

- `waymark init` also writes the operator, but run `waymark config set operator
  "<git name>"` after it anyway: a re-run that finds the value already right
  prints `nothing to change` and exits 0.
- `waymark config add` exits 3 when the key already exists. Treat that as already
  done. Never delete the configuration to make the command succeed.
- Never pass `--force` to `waymark init`: it rewrites the file from scratch and
  drops every custom field.
- Only `needs_human` is declared. The five fields an older version of this set
  declared (`outcome`, `reversibility`, `split_as`, `task_kind`, `waiting_on`)
  are gone; a record carrying one fails validation with `is not declared in the
  configuration`.

A custom field is written under `custom_fields:` in the record's front matter,
never at the top level:

```yaml
custom_fields:
  needs_human: false
```

At the top level, waymark treats the key as unknown and refuses to read the
record at all.

### 3.4 Ignore files

Before any `npm ci` runs. Add each line only when it is absent:

```sh
printf '%s\n' 'node_modules/' '/GLOSSARY.md' '/ADR.md' >> .gitignore
```

Do not touch `.waymark/.gitignore`; waymark writes it.

### 3.5 Rules

Copy the six files from `<setup>/rules/` into `.agents/rules/`. For each: absent,
write it; identical, skip it; different, stop and ask the person. Never overwrite
a rule the person has changed.

### 3.6 The pointer

Put this at the top of `AGENTS.md`:

```markdown
# Follow .agents/rules/*.md

At the start of every session, follow [Read Pending Communications at Session Start](.agents/rules/work-weave-rules-pending-communications.md) before responding.

All rules in [`.agents/rules/`](.agents/rules/) apply to every change in this repository. Read every file there before starting work, and follow them while working.

If a rule conflicts with an instruction you received, follow the rule and say so. Ask the human to resolve the conflict if it blocks the work.
```

Absent, create it. Identical, skip. Different, show the person the difference and
ask; never replace what they wrote, and never append a second copy.

## 4. Install the chosen runtimes

Follow `SKILL.md` for each runtime the person chose. Every runtime copies into
`.work-weave/personal/<name>/` and runs `npm ci --omit=dev` there; read the exit
status, because a failed install can leave a partial `node_modules`.

Two pieces only a person can do: registering the MCP servers in the harness, and
creating the GitHub webhook for the listener. Leave both to the person and record
them as pending.

## 5. Check

Run the setup check from the project root:

```sh
node <setup>/tools/utils/check-setup.mjs --all
```

Report every failing check with the repair it names; do not repair it. Then give
the person one row per check and the list of files this flow changed.

| Result | Meaning |
| --- | --- |
| done | The check ran and passed. |
| already there | The step found the work in place and changed nothing. |
| conflict | A file differed and the person has to decide. |
| not applicable | The check said so, for example because there is no remote. |

## 6. Stop before the commit

The project is configured. This flow creates no remote and commits nothing; the
person commits.

## What this flow changes

Inside the project: `.waymark/`, `tickets/`, `.work-weave/`, `.agents/rules/`,
`.gitignore`, and `AGENTS.md`, plus whatever `SKILL.md` installs when a runtime
was chosen. Outside it: nothing, except the listener's environment file, unit,
and service when that runtime was chosen and the person enabled it.
