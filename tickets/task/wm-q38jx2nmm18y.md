---
schema: 1
id: wm-q38jx2nmm18y
title: Write setup's rule bundle
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-10T00:47:55Z
updated_at: 2026-11-10T01:13:52Z
parent: wm-ygnttse5hd5k
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write setup's bundle: `bundle/setup.md`, `bundle/rules/rules-git.md`, and `bundle/rules/rules-checklist.md`.

1. `bundle/setup.md` carries the five sections: What this installs (the two rule files into `.agents/rules/`), Tools (none), Rules (the copy command for Unix and PowerShell, with absent, identical, and different handling), External steps (none), Verify (the installed files match the bundle's copies).
2. `rules-git.md` states: the default branch is protected and changes reach it through pull requests; never commit or push to the default branch directly; do the work on your own branch; one commit per logical change, with a subject saying what changed and a body saying why.
3. `rules-checklist.md` carries the checks in the draft below, one per line, each with its command and expected result, starred where the session-start run covers them. It states the two triggers: session start runs the starred checks; a feature that turns out to be unavailable runs all of them. It is read-only: report the failing check and the command that fixes it, fix nothing.
4. The rule files carry no front matter and their names start with `rules`.

Every command below was run on 2026-11-10 against waymark 0.1.2 and `skills` 1.7.6; use these forms, they are verified, not sketched:

- Node floor: 22.20, from `skills`'s `engines`. The bundle tools alone accept 20.18.
- `gh api repos/<owner>/<repo>/branches/<default> --jq .protected` reads the protection flag and works for a non-admin member; `.../branches/<default>/protection` returns 404 for that account, so never use it.
- `gh api --jq` needs no external `jq`; it works with `jq` off `PATH`.
- `waymark config add field <key> <type>` and `config add category <key> <path>` both exit 3 when the key already exists, so a check reads `waymark config show` first.
- Waymark's generation after a fresh `init` is 1.8; this repository carries 1.9 because its own config evolved. Never pin the generation.
- The listener check is `systemctl --user is-active`; the listener setup documents no macOS or Windows equivalent yet.
- Protection reads the default branch's `protected` flag; it needs a GitHub remote, and with no remote the item is not applicable.

## Draft item list

The confirmed design says fifteen checks in five groups, but only the groups were named in discussion; the individual checks were never written down. This reconstruction yields sixteen, so fifteen was approximate. It also leaves out `curl`, which the issue bundle needs to create its smee channel. The person settles the final list. The star marks a check the session-start run covers.

**Tools**

- `git --version` prints a version. *
- `waymark --version` prints 0.1.2 or newer. *
- `node --version` prints v22.20.0 or newer, and `npm --version` prints a version. *
- `gh auth status` reports a logged-in account. *

**Repository**

- `git rev-parse --show-toplevel` prints the project directory. *
- `git config user.name` and `git config user.email` each print a value. *
- `git remote get-url origin` prints a URL; with no remote, this and the remote-only checks are not applicable.
- `gh api repos/<owner>/<repo>/branches/<default> --jq .protected` prints `true`.

**Tracker**

- `waymark validate` reports no error, and `waymark config show` lists `tickets`, the three categories, and the six custom fields. *
- `waymark config show` reports an operator.

**Skills and rules**

- The five skill directories exist under `.agents/skills/`. *
- The copies in `.agents/rules/` match each bundle's `rules/` file byte for byte. *
- `AGENTS.md` carries the rule pointer section. *

**Registered tools**

- The glossary MCP server answers with its four tools.
- `systemctl --user is-active issue-listener` prints `active`, and the repository's webhook points at the smee channel in `~/.config/work-weave/smee.env`.
- `git check-ignore` reports `node_modules/`, `GLOSSARY.md`, and `pending/pending-communications.md` as ignored. It answers for paths that do not exist yet.

Sixteen lines, plus `curl` if it becomes an item. The count is the person's to settle before the rule file is written.

## Acceptance signal

Copying `bundle/rules/*.md` into `.agents/rules/` reproduces both files byte for byte, and `bundle/setup.md`'s Verify section says how to check that. `npx skills add ./weave-your-work --list` still lists `setup`. The checklist rule carries the confirmed list, and no rule file points at a file outside `.agents/rules/`. Each check carries a command that runs on this machine and a stated expected result.

## Boundaries

- No flow documents.
- No language rule and no tool scripts.
- No fix of the missing macOS and Windows listener steps; report the gap, do not invent the steps.
