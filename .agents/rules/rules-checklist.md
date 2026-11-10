# Run the Setup Checks

Run these checks at the start of a session, and run every one of them when a feature turns out to be unavailable. They say whether the project is still configured, not whether the code works.

## What to do

1. At session start, run the starred checks. They are local and cheap, and they catch a tool that vanished, a rule copy that drifted, or a tracker that stopped validating.
2. When something you expect to work does not, run all seventeen. The unstarred ones cover the pieces that only matter when you reach for them: curl, the remote, the protection flag, the operator, the MCP server, the listener, and the ignore rules.
3. Report the failures. Name the check and the command that repairs it. Do not run the repair, do not edit a config, and do not install anything. Repairing the setup is the person's decision; this rule only reports.
4. Mark a check not applicable only where the check says so. A missing remote covers two of them, checks 9 and 16. Never mark a check passed without running it.

Every command below was run against waymark 0.1.2 and `skills` 1.7.6. The commands are written to be pasted as they are, except for the one spot in check 15 marked `<skill>`, which takes the installed skill's directory.

## Tools

**1. Git is available.** *

```sh
git --version
```

Passes when it prints a version.

**2. Waymark is installed and recent.** *

```sh
waymark --version 2>/dev/null
```

Passes when it prints `waymark 0.1.2` or newer. Read the version from stdout: the binary can also write a dynamic-linker warning to stderr, and that warning is not a version.

**3. Node and npm clear the floor.** *

```sh
printf '%s\n' "22.20.0" "$(node --version | sed 's/^v//')" | sort -V -C && echo ok
npm --version
```

Passes when the first command prints `ok`. `sort -V -C` succeeds when its input is already sorted, so this passes on 22.20.0 and on anything newer. The floor comes from the `skills` package that installs the set; the bundle tools alone accept 20.18.

**4. The GitHub CLI is signed in.** *

```sh
gh auth status
```

Passes when it exits 0 and names a logged-in account.

**5. curl is available.**

```sh
curl --version
```

Passes when it prints a version. The issue bundle creates its smee channel with curl; nothing else uses it.

## Repository

**6. The directory is a Git repository.** *

```sh
git rev-parse --show-toplevel
```

Passes when it prints the project directory.

**7. A commit identity is set.** *

```sh
git config user.name
git config user.email
```

Passes when both print a value.

**8. The repository knows its remote.**

```sh
git remote get-url origin
```

Passes when it prints a URL. Exit 2 means there is no remote, which makes checks 9 and 16 not applicable; it is not a failure. Check 17 answers either way: the ignore rules are local, so it runs before the repository has a remote or a commit.

**9. The default branch is protected.**

```sh
R=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null)
B=$(gh repo view --json defaultBranchRef -q .defaultBranchRef.name 2>/dev/null)
gh api "repos/$R/branches/$B" --jq .protected
```

Passes when it prints `true`. Read the branch, never the `/protection` endpoint: that endpoint answers 404 for a non-admin member who can still read the branch's `protected` flag.

## Tracker

**10. The tracker validates and is configured.** *

```sh
waymark validate --json | python3 -c "import json,sys; d=json.load(sys.stdin)['data']; print('healthy=', d['healthy'], 'errors=', d['counts']['errors'])"
waymark config show --json | python3 -c "
import json, sys
d = json.load(sys.stdin)['data']['project']
print('categories:', sorted(d['categories']))
print('fields:', sorted(d['fields']))
print('storage_root:', d['storage_root'])
"
```

Passes when the first prints `healthy= True errors= 0`, and the second prints `storage_root: tickets`, the categories `['map', 'task', 'testimony']`, and the six fields `['needs_human', 'outcome', 'reversibility', 'split_as', 'task_kind', 'waiting_on']`. Read the JSON, never the exit code: `waymark validate` exits 0 whether or not it found anything.

**11. The operator is set, and the listener's roster knows it.**

```sh
op=$(waymark config show --json | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['effective']['operator'])")
echo "operator: $op"
f=.work-weave/issue/handles.toml
if [ ! -e "$f" ]; then echo "handles: absent, nothing to match"; exit 0; fi
keys=$(awk '/^\[handles\]/{h=1;next} /^\[/{h=0} h && /=/{sub(/[ \t]*=.*/,"");gsub(/[ \t"]/,"");print}' "$f")
if [ -z "$keys" ]; then echo "handles: the [handles] table is empty"; exit 1; fi
for k in $keys; do
  [ "$(printf '%s' "$k" | tr 'A-Z' 'a-z')" = "$(printf '%s' "$op" | tr 'A-Z' 'a-z')" ] && { echo "handles: $k"; exit 0; }
done
echo "handles: NO MATCH, owners are $(echo $keys | tr ' ' ', ')"; exit 1
```

Passes when it prints `operator: <name>` and then either `handles: absent, nothing to match` or `handles: <key>`. An unset operator prints `operator: None`; the human output says `- unset (unset)` and writes it to stderr.

The roster half matters because nothing else checks it. `waymark create` accepts any owner string and `waymark validate` does not look at the value, so a typo stays invisible until the listener refuses to start: it matches `git config user.name` against the `[handles]` keys, and a name that is not there stops the service. The comparison folds case here for the same reason the listener does; the owner string waymark stores keeps its case, and waymark's own `--owner` matching does not fold it.

## Skills and rules

**12. Every installed skill is still there.** *

```sh
python3 -c "
import os, subprocess, sys
roots = []
for base, dirs, files in os.walk('.'):
    if set(base.split(os.sep)) & {'.git', 'node_modules'} or base.count(os.sep) > 3:
        dirs[:] = []
        continue
    for d in list(dirs):
        if d != 'skills':
            continue
        p = os.path.relpath(os.path.join(base, d))
        names = {e for e in os.listdir(p) if os.path.isfile(os.path.join(p, e, 'SKILL.md'))}
        if names:
            roots.append((p, names))
if not roots:
    raise SystemExit('no skills directory holding <name>/SKILL.md')
bad = False
known = set()
for p, names in roots:
    fresh = [n for n in names if os.path.realpath(os.path.join(p, n)) not in known]
    for n in names:
        known.add(os.path.realpath(os.path.join(p, n)))
    if not fresh:
        print(f'{p}: {len(names)} skills, all reached again through another root, nothing new to compare')
        continue
    tracked = subprocess.run(['git', 'ls-files', p], capture_output=True, text=True).stdout.split()
    seen = {line.split('/')[2] for line in tracked if line.count('/') >= 2}
    if not seen:
        print(f'{p}: {len(names)} skills, none tracked yet, nothing to compare')
        continue
    missing = sorted(seen - names)
    print(f'{p}: {len(names)} skills, missing: {missing or \"none\"}')
    bad = bad or bool(missing)
raise SystemExit(1 if bad else 0)
"
```

Passes when every root it prints says `missing: none`, `none tracked yet` for a set that has not been committed, or `all reached again through another root` for a directory holding the same skills a second time. It finds the roots by looking for any directory named `skills` that holds `<name>/SKILL.md`, three levels deep at most, skipping `.git` and `node_modules`, so `.agents/skills` and an agent's own directory are both covered without naming either. A skill already counted under an earlier root is not counted again, compared by real path: `skills add` without `-a` writes copies into `.agents/skills` and symlinks to them in `.claude/skills`, and the second root would otherwise look like a set with no manifest. The manifest is what Git tracks under that root, not `skills-lock.json`: the lock file records only what `skills add` wrote, which was two entries when the set held 41 skills.

**13. Every bundle's rules are registered.** *

```sh
for f in .agents/skills/*/bundle/rules/*.md; do
  [ -e "$f" ] || continue
  cmp -s "$f" ".agents/rules/$(basename "$f")" || echo "NOT REGISTERED: $f"
done
```

Passes when it prints nothing. This walks whatever bundles are installed, so a bundle that gains, loses, or renames a rule needs no edit here.

**14. `AGENTS.md` points at the rules.** *

```sh
grep -c 'Follow .agents/rules' AGENTS.md
```

Passes when it prints a number above zero.

## Registered tools

**15. The glossary MCP server answers.**

```sh
node .work-weave/runtime/glossary/server.js --project . \
  <<< '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' 2>/dev/null \
  | grep -o '"name":"glossary_[a-z]*"' | wc -l
```

Passes when it prints `4`, for `glossary_lookup`, `glossary_list`, `glossary_write`, and `glossary_merge`. Run it from the project root: the server comes from the project runtime, and its dependencies are installed there. This starts the server directly, so it needs no MCP client and no harness restart.

**16. The listener runs and the webhook reaches it.**

```sh
systemctl --user is-active issue-listener
systemctl --user show issue-listener -p WorkingDirectory --value
R=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null)
gh api "repos/$R/hooks" --jq '.[].config.url'
```

Passes when the first prints `active`, the second prints this project's root, and the fourth prints the `SMEE_URL` from `~/.config/work-weave/smee.env`. Compare the second against `git rev-parse --show-toplevel`; `active` alone does not say which checkout the service serves. The queue path resolves from the listener's working directory, so a unit bound to another clone is `active` while this project's queue never grows. A 404 on the hooks read is not a failure by itself: read the account's permissions first.

```sh
R=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null)
gh api "repos/$R" --jq .permissions.admin
```

If that prints `false`, the account cannot see webhooks at all, so report the check as unverifiable and name the missing permission as the reason. If it prints `true` and the hooks read still returned 404, the check fails. The listener has a `systemctl` step only on Linux; on macOS and Windows report the gap and name the alternative: run the listener in a terminal while you work, so the queue still fills, and say that a login-time launch agent or a scheduled task would have to be written by the person. Do not invent a service step and do not call the missing unit a failure of the project.

**17. The queue and the build output are ignored.**

```sh
git check-ignore node_modules/ GLOSSARY.md .work-weave/pending/pending-communications.md 2>/dev/null | wc -l
```

Passes when it prints `3`. Count the output; never read the exit code, because `git check-ignore` exits 0 when any one of the paths matches, which cannot tell three registered rules from one. It answers for paths that do not exist yet, so it runs before anything installs dependencies.
