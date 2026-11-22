# Join a project

Take a clone of a project that already uses waymark to a checkout that runs the
set. The project arrives with the tracker and the rules committed. What a clone
does not carry is everything that was never committed: the operator, the
dependencies, the hooks, the MCP registrations, and the listener.

This is not for an empty directory, and not for a project with no tracker yet:
that is `START-A-PROJECT.md`.

Before step 1, settle the directory: run `git rev-parse --show-toplevel`, print the
absolute path, and ask the person to confirm it is the clone they mean. Run every
step from there.

## 1. Confirm this is a clone of a waymark project

```sh
git remote get-url origin
test -f .waymark/config.toml && echo "tracker: present"
ls tickets/ | head -1
```

Check 8 for the remote and check 10 for the tracker. A missing remote means this
was never cloned: stop, because the repair is not a step in this flow. A missing
configuration, or an empty `tickets/`, means the project was never initialized:
stop and point the person at `START-A-PROJECT.md`.

Do not run `waymark init` here. The configuration is committed, and `--force`
would rewrite it and drop the custom field.

Read `.waymark/config.toml` and the roster at `.work-weave/shared/handles.toml`
before going further. A clone whose configuration names categories or fields this
set no longer declares cannot be validated; report that and stop rather than
editing the committed configuration.

## 2. Set this clone's identity

Neither value is committed, so a fresh clone has only the global one, if that:

```sh
git config --local user.name "<name>"
git config --local user.email "<email>"
```

Check 7 is that both are set. These two strings must match what the listener will
compare against the roster, so settle them before the listener is installed.

## 3. Confirm the operator is on the roster

Read `[handles]` in `.work-weave/shared/handles.toml`. The listener matches
`git config user.name` against those entries, and an operator who is not listed
cannot send.

When this clone's name is missing from the roster, stop and ask the person. Adding
an entry changes a committed file that every other owner reads, so it is not this
flow's decision to make.

## 4. Install what the clone cannot carry

Follow `INSTALL.md`:

- the six rules: absent, write it; identical, skip it; different, ask (check 13);
- the tools, which run in place and copy nothing;
- the runtimes the project uses, each copying into `.work-weave/personal/` and
  running `npm ci --omit=dev` there.

Read each install's exit status and stop on a non-zero one: a failed install can
leave a partial `node_modules`, so the directory appearing proves nothing. A cache
directory the user cannot write is the usual cause; `npm ci --cache <a directory
you own> --omit=dev` gets past it.

`INSTALL.md` names the file to follow for each runtime.

## 5. The pieces only a person can do

The MCP registrations are harness config edits, and the listener needs a GitHub
webhook and, on Linux, a service. Leave both to the person and record them as
pending.

## 6. Build the generated views

`GLOSSARY.md` and `ADR.md` are generated from their committed sources and are
ignored by Git. After a pull, rebuild the ones this project uses:

```sh
node .work-weave/personal/glossary/glossary.js --project <root> merge   # glossary installed
node .work-weave/personal/adr/adr.js --project <root> merge             # ADR installed
```

A project that installed neither needs neither command. The post-merge hooks
rebuild them automatically when the person installed the hooks; say what to run
when they did not.

## 7. Check

Run the setup check from the project root:

```sh
node <setup>/tools/utils/check-setup.mjs --all
```

Report every failing check with its repair; do not repair it. Then give the person
one row per check.

## What this flow does not do

- Run `waymark init`, or rewrite a shared file.
- Create a remote.
- Add an operator to the roster, or settle who owns what.
