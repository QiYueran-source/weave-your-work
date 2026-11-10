---
schema: 1
id: wm-q38jx2nmm18y
title: Write setup's rule bundle
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T00:47:55Z
updated_at: 2026-11-10T01:39:34Z
closed_at: 2026-11-10T01:39:34Z
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
3. `rules-checklist.md` carries the seventeen checks below, one per line, each with its command and expected result, starred where the session-start run covers them. It states the two triggers: session start runs the starred checks; a feature that turns out to be unavailable runs all of them. It is read-only: report the failing check and the command that fixes it, fix nothing.
4. The rule files carry no front matter and their names start with `rules`.
5. The checks are written for a new project, not for this repository. Two of them discover their targets instead of naming them, so adding a skill or a bundle does not require editing setup.

## The seventeen checks

Confirmed on 2026-11-10, in five groups. Each line is the command and the result that passes it. The star marks a check the session-start run covers. `→` reads as "prints" or "reports".

**Tools**

1. `git --version` → a version. *
2. `waymark --version` → `waymark <version>` on **stdout**, 0.1.2 or newer. The binary also writes a dynamic-linker warning to stderr on this machine; the check reads stdout or the exit code, never the combined stream. *
3. `node --version` → v22.20.0 or newer, and `npm --version` → a version. To compare:

    ```bash
    printf '%s\n' "22.20.0" "$(node --version | sed 's/^v//')" | sort -V -C && echo ok
    ```

    `ok` passes. `sort -V -C` succeeds when its input is already sorted, so this passes on equality and on anything newer. *

4. `gh auth status` → a logged-in account and exit 0. *
5. `curl --version` → a version. The issue bundle creates its smee channel with curl, and nothing else uses it. *

**Repository**

6. `git rev-parse --show-toplevel` → the project directory. *
7. `git config user.name` and `git config user.email` → a value each. *
8. `git remote get-url origin` → a URL. Exit 2 means no remote, which makes checks 9, 16, and 17 not applicable; it is not a failure.
9. The default branch is protected:

   ```bash
   R=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null)
   B=$(gh repo view --json defaultBranchRef -q .defaultBranchRef.name 2>/dev/null)
   gh api "repos/$R/branches/$B" --jq .protected
   ```

   `true` passes. Never use the `/protection` endpoint: it answers 404 for a non-admin member who can read the branch itself.

**Tracker**

10. The tracker is healthy and configured:

    ```bash
    waymark validate --json | python3 -c "import json,sys; d=json.load(sys.stdin)['data']; print('healthy=', d['healthy'], 'errors=', d['counts']['errors'])"
    waymark config show --json | python3 -c "
    import json, sys
    d = json.load(sys.stdin)['data']['project']
    print('categories:', sorted(d['categories']))
    print('fields:', sorted(d['fields']))
    print('storage_root:', d['storage_root'])
    "
    ```

    `healthy= True errors= 0` passes the first. The second passes when `storage_root` is `tickets`, the categories are exactly `['map', 'task', 'testimony']`, and the fields are exactly the six. `waymark validate` exits 0 whether or not it found anything, so the check reads the JSON verdict and never the exit code. *

11. `waymark config show --json | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['effective']['operator'])"` → a name, not `None`. The human output prints `operator  - unset (unset)` on stderr, so the check reads the JSON and never the text.

**Skills and rules**

12. Every skill the install recorded is present:

    ```bash
    python3 -c "
    import json, os, sys
    try: d = json.load(open('skills-lock.json'))
    except FileNotFoundError: sys.exit('skills-lock.json is missing')
    missing = [n for n in d['skills'] if not os.path.isdir('.agents/skills/' + n)]
    print('missing:', missing or 'none')
    "
    ```

    `missing: none` passes. The lock file lists what the install put there, so this check needs no skill names and survives the set growing or shrinking. *

13. Every bundle's rules are registered, discovered rather than listed:

    ```bash
    for f in .agents/skills/*/bundle/rules/*.md; do
      [ -e "$f" ] || continue
      cmp -s "$f" ".agents/rules/$(basename "$f")" || echo "NOT REGISTERED: $f"
    done
    ```

    No output passes. A skill that gains, loses, or renames a rule needs no edit here. *

14. `AGENTS.md` carries the rule pointer section: `grep -c 'Follow .agents/rules' AGENTS.md` → 1 or more. *

**Registered tools**

15. The glossary MCP server answers with its four tools:

    ```bash
    node <skill>/bundle/tools/server.js --project . \
      <<< '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' 2>/dev/null \
      | grep -o '"name":"glossary_[a-z]*"' | wc -l
    ```

    `4` passes. This runs the server directly, so it needs no MCP client and no harness restart. The four tools are `glossary_lookup`, `glossary_list`, `glossary_write`, and `glossary_merge`.

16. The listener runs and the repository's webhook reaches it:

    ```bash
    systemctl --user is-active issue-listener
    R=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null)
    gh api "repos/$R/hooks" --jq '.[].config.url'
    ```

    `active` passes the first. For the second, the printed URL must match the `SMEE_URL` in `~/.config/work-weave/smee.env`. **A 404 on the hooks read is not a failure by itself:** read `gh api "repos/$R" --jq .permissions.admin` first. `false` means the account cannot see webhooks, so report the check as unverifiable and name the permission as the reason; `true` with a 404 is a real failure. The listener has no macOS or Windows equivalent in the bundle yet, so on those platforms the check reports the gap.

17. The queue and build output are ignored:

    ```bash
    git check-ignore node_modules/ GLOSSARY.md pending/pending-communications.md 2>/dev/null | wc -l
    ```

    `3` passes. The count is what matters: `git check-ignore` exits 0 when **any** of the paths matches, so the exit code cannot tell three matched rules from one, and the printed list is the only signal. It answers for paths that do not exist yet, so this runs before any `npm install`, and it runs whether or not there is a remote.

## Verified command shapes

Run on 2026-11-10 against waymark 0.1.2 and `skills` 1.7.6.

- Node floor: 22.20, from `skills`'s `engines`. The bundle tools alone accept 20.18.
- `gh api --jq` needs no external `jq`; it works with `jq` off `PATH`. The word `jq` in the bundle setups is always this flag, never the tool.
- `waymark config add field <key> <type>` and `config add category <key> <path>` both exit 3 when the key already exists, so a check reads `waymark config show` first.
- Waymark's generation after a fresh `init` is 1.8; never pin it.
- `gh api repos/<owner>/<repo>/branches/<default> --jq .protected` works for a non-admin member; `.../protection` returns 404 for that account.
- `gh repo view` exits 1 with no remote, which is how the not-applicable checks detect that state.

## Acceptance signal

Copying `bundle/rules/*.md` into `.agents/rules/` reproduces both files byte for byte, and `bundle/setup.md`'s Verify section says how to check that. `npx skills add ./weave-your-work --list` still lists `setup`. The checklist rule carries all seventeen checks, and no rule file points at a file outside `.agents/rules/`. Each check carries a command that runs on this machine and a stated expected result. No check names a skill or a bundle individually; both discovery checks pick up additions without an edit.

## Boundaries

- No flow documents.
- No language rule and no tool scripts.
- No fix of the missing macOS and Windows listener steps; report the gap, do not invent the steps.
- No fix of the issue bundle's unguarded `pending/` append; report it, do not edit that bundle.
