# Join a project

Take a clone of a project that already uses waymark to a checkout that runs the set. The project arrives with the tracker and the rules committed; what a clone does not carry is everything that was never committed: the operator, dependencies, hooks, the MCP registration, and the listener.

This is not for an empty directory, and not for a project with no tracker yet; that is `configure-project.md`. The clone carries the root map, so this flow opens no map. A clone whose tickets hold no root map is a third case: configure it here, then open the root with `open-map`.

Before step 1, settle the directory: `git rev-parse --show-toplevel`, print the absolute path, and ask the person to confirm it is the clone they mean. Run every step from there.

## 1. Confirm this is a clone of a waymark project

```sh
git remote get-url origin
test -f .waymark/config.toml && echo "tracker: present"
ls tickets/ | head -1
```

Check 8 for the remote, check 10 for the tracker. A missing remote means this was never cloned: stop, because the repair is not a step in this flow. A missing configuration or an empty `tickets/` means the project was never initialized: stop and point at `configure-project.md`.

Do not run `waymark init` here. The configuration is committed, and `--force` would rewrite it and drop the custom fields.

## 2. Set this clone's identity

Not committed, so a fresh clone has only the global value, if that:

```sh
git config --local user.name "<name>"
git config --local user.email "<email>"
```

Check 7. Then confirm the pair: the operator is `<name>` and the GitHub account is `<gh api user --jq .login>`. From the roster, read `.work-weave/issue/handles.toml`: an operator missing from `[handles]` cannot send. The listener matches `git config user.name` against the roster, so a mismatch works until the listener starts.

## 3. Install what the clone cannot carry

Follow `install.md`:

- the eight rules — absent, write; identical, skip; different, ask (check 13);
- the tools run in place, nothing to install;
- the runtimes the project uses: `install-glossary.md` and `install-issue.md`, each copying into `.work-weave/runtime/` and running `npm ci --omit=dev` there.

Read each install's exit status and stop on a non-zero one: a failed install can leave a partial `node_modules`, so the directory appearing proves nothing. A cache directory the user cannot write is the usual cause; `npm ci --cache <a directory you own>` gets past it.

## 4. The two pieces only a person can do

The MCP server registration is a harness config edit, and the listener needs a GitHub webhook and a service. Leave both to the person and record them as pending.

## 5. Build the generated view

`GLOSSARY.md` is generated and gitignored. After a pull, rebuild it:

```sh
node .work-weave/runtime/glossary/glossary.js --project <root> merge
```

The post-merge hook does this automatically when the person enabled it; say what to run when they did not.

## 6. Check

Run `check-project.md`. Report every failure with its repair; do not repair it. Then give the person one row per check.

## What this flow does not do

- Run `waymark init`, or rewrite shared files.
- Create a remote.
- Open a map. The clone carries one.
