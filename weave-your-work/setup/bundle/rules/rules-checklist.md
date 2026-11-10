# Run the Setup Checks

Run these checks at the start of a session, and run every one of them when a feature turns out to be unavailable. They say whether the project is still configured, not whether the code works.

## What to do

1. At session start, run the starred checks. They are local and cheap, and they catch a tool that vanished, a rule copy that drifted, or a tracker that stopped validating.
2. When something you expect to work does not, run all seventeen. The unstarred ones cover the pieces that only matter when you reach for them: curl, the remote, the protection flag, the operator, the MCP server, the listener, and the ignore rules.
3. Report the failures. Name the check and the command that repairs it. Do not run the repair, do not edit a config, and do not install anything. Repairing the setup is the person's decision; this rule only reports.
4. Mark a check not applicable only where the check says so. A missing remote covers three of them. Never mark a check passed without running it.

Every command below was run against waymark 0.1.2 and `skills` 1.7.6. The commands are written to be pasted as they are, except for the two spots marked `<skill>`, which take the installed skill's directory.

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

Passes when it prints a URL. Exit 2 means there is no remote, which makes checks 9, 16, and 17 not applicable; it is not a failure.

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

**11. The operator is set.**

```sh
waymark config show --json | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['effective']['operator'])"
```

Passes when it prints a name. An unset operator prints `None`; the human output says `- unset (unset)` and writes it to stderr.

## Skills and rules

**12. Every installed skill is still there.** *

```sh
python3 -c "
import json, os, sys
try: d = json.load(open('skills-lock.json'))
except FileNotFoundError: sys.exit('skills-lock.json is missing')
missing = [n for n in d['skills'] if not os.path.isdir('.agents/skills/' + n)]
print('missing:', missing or 'none')
"
```

Passes when it prints `missing: none`. The lock file lists what the install put there, so this check holds no skill names and needs no edit when the set changes.

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
node <skill>/bundle/tools/server.js --project . \
  <<< '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' 2>/dev/null \
  | grep -o '"name":"glossary_[a-z]*"' | wc -l
```

Passes when it prints `4`, for `glossary_lookup`, `glossary_list`, `glossary_write`, and `glossary_merge`. This starts the server directly, so it needs no MCP client and no harness restart. Replace `<skill>` with the installed glossary skill directory.

**16. The listener runs and the webhook reaches it.**

```sh
systemctl --user is-active issue-listener
R=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null)
gh api "repos/$R/hooks" --jq '.[].config.url'
```

Passes when the first prints `active` and the third prints the `SMEE_URL` from `~/.config/work-weave/smee.env`. A 404 on the hooks read is not a failure by itself: read the account's permissions first.

```sh
R=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null)
gh api "repos/$R" --jq .permissions.admin
```

If that prints `false`, the account cannot see webhooks at all, so report the check as unverifiable and name the missing permission as the reason. If it prints `true` and the hooks read still returned 404, the check fails. The listener has a `systemctl` step only on Linux; on macOS and Windows report the gap and do not invent a service step.

**17. The queue and the build output are ignored.**

```sh
git check-ignore node_modules/ GLOSSARY.md pending/pending-communications.md 2>/dev/null | wc -l
```

Passes when it prints `3`. Count the output; never read the exit code, because `git check-ignore` exits 0 when any one of the paths matches, which cannot tell three registered rules from one. It answers for paths that do not exist yet, so it runs before anything installs dependencies.
