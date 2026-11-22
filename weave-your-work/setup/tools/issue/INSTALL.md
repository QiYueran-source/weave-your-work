# Issue listener install

Install the listener, its queue tools, and the checkout settings they read.

This is the only part of the set with a platform-specific step: the service that
keeps the listener running. `service/linux.md`, `service/macos.md`, and
`service/windows.md` cover each one; nothing here restates them.

Installing and starting are separate. This file installs. The listener runs only
when the person starts its service; the queue tools work without it.

## What this installs

| Path | Holds | Committed |
|---|---|---|
| `.work-weave/personal/issue/` | the listener, queue tools, and dependencies | no |
| `.work-weave/personal/issue-listener.env` | the repository, the Smee URL, and the port | no |
| `.work-weave/personal/work-weave-issue-<hash8>.service` | the generated unit on Linux | no |
| `.work-weave/shared/handles.toml` | the roster | yes |

`<hash8>` is the first eight hex characters of the SHA-256 of the project's
physical root, so each checkout gets its own unit.

## The tools

Node 20.18 or newer, or Node 22. The locked `smee-client` and `undici` refuse
older releases. Run every command from the project root; `<setup>` is resolved as
`INSTALL.md` says.

```sh
mkdir -p .work-weave/personal/issue
cp <setup>/tools/issue/*.mjs <setup>/tools/issue/*.json <setup>/tools/issue/project-root.cjs .work-weave/personal/issue/
cd .work-weave/personal/issue && npm ci --omit=dev
```

Do not run `npm install` under the skill directory: the skill may be installed
globally, and its dependencies would then serve every project on the machine.

Read the exit status of `npm ci`. A failed install can leave a partial
`node_modules`, so the directory appearing proves nothing.

The `project-root.cjs` copy must stay byte-identical to
`<setup>/tools/utils/project-root.cjs`. No test compares them; keep them equal by hand.

## The roster

Copy the template and fill it in:

```sh
cp <setup>/tools/issue/handles.toml.example .work-weave/shared/handles.toml
```

Replace the placeholder login with each owner's GitHub login. The listener matches
the roster against `git config user.name`, so an operator whose name is missing
from `[handles]` cannot send. The file is committed.

## The settings

`configure.mjs` writes `.work-weave/personal/issue-listener.env` and, on Linux,
the unit:

```sh
node .work-weave/personal/issue/configure.mjs --repository <owner>/<repo>
```

| Flag | Meaning | When left out |
|---|---|---|
| `--repository` | the `owner/repo` the listener serves | read from `origin` |
| `--smee-url` | the channel that forwards GitHub webhooks | kept from the existing settings, or empty |
| `--port` | the port the listener binds | kept from the existing settings, or a free port |
| `--project` | the project root | discovered from the working directory |

It refuses a port that is already occupied and writes no settings when it does.
The repository must be `owner/repo`.

The Smee URL is a channel address. Do not put it in Git, tickets, or logs.

## The MCP-free queue

The queue tools are command line only, and this part registers no MCP server:

```sh
node .work-weave/personal/issue/check-pending.mjs --project <project>
```

It prints the open communicate threads and nothing else. This is the command
`work-weave-rules-pending-communications.md` names.

## The service

The listener is a long-running process, and the setup does not start it. What
keeps it running depends on the platform, and only Linux has a tested answer:

| Platform | What runs it | Steps |
|---|---|---|
| Linux | A systemd user unit that `configure.mjs` generates | `service/linux.md` |
| macOS | A LaunchAgent template; **unverified** | `service/macos.md` |
| Windows | Nothing bundled; run it in a terminal | `service/windows.md` |

**Linux.** `configure.mjs` writes
`.work-weave/personal/work-weave-issue-<hash8>.service`, and `service/linux.md`
links it into the user service manager. Do not copy a unit from another checkout:
its paths and port belong to that checkout.

**macOS.** `service/macos.md` carries a LaunchAgent plist with every field to fill
in. That template has not been run on a Mac. Treat it as a starting point and test
it on the machine before relying on it; until then, run the listener in the
foreground:

```sh
node .work-weave/personal/issue/listener.mjs
```

**Windows.** There is no bundled service, and no template. Run the listener in a
terminal while you work; it stops when the terminal closes. The startup scan and
the live webhook path behave as they do on Linux. A Task Scheduler task or a
service wrapper is yours to write, and `service/windows.md` says what to keep when
you do. Running the same command from PowerShell is the whole of the fallback:

```powershell
node .work-weave\personal\issue\listener.mjs
```

The listener reads `.work-weave/personal/issue-listener.env` on every platform, so
it needs no variables in the shell. Do not put the Smee URL in a committed file or
in logs.

One process owns one queue. The listener creates
`.work-weave/personal/communication/.lock` and refuses to start when another live
listener on this host holds it. A second listener exits with `Another listener
holds the queue lock`; stop the first before starting another.

## Verify

```sh
node .work-weave/personal/issue/check-pending.mjs --project <project>
```

It prints nothing on a checkout with no open threads and no listener. That is a
passing answer, not a failure.
