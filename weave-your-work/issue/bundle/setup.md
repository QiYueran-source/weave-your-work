# Issue listener setup

The listener receives communicate issues and queues them for the next session. Run it once per checkout: the tools and dependencies live in the checkout's `.work-weave/runtime/`, and each checkout gets its own listener, queue, port, and service. A clone repeats the machine-local parts; the channel and webhook belong to the repository and are reused.

## What this installs

- The project runtime in `.work-weave/runtime/issue/`: the listener, checker, queue and lock modules, the project-root resolver, the checkout configurator, and their dependencies.
- Checkout settings in `.work-weave/local/issue-listener.env`: the expected repository, the optional Smee URL, and the listener port.
- A generated unit `work-weave-issue-<hash8>.service` in `.work-weave/local/`, where `hash8` is the first eight hex characters of the SHA-256 of the physical project root. The setup links it into the user service manager.
- The shared roster at `.work-weave/issue/handles.toml`, copied from `bundle/tools/handles.toml.example` when absent. The roster is committed; the queue, runtime, and local settings are ignored.
- The session rule from `bundle/rules/rules-pending-communications.md` into `.agents/rules/`.
- A startup scan for open communicate issues missed while the listener was off.

## Tools

The tools need Node 20.18 or newer, or Node 22; the locked `smee-client` and `undici` refuse older releases. Copy the files into the project runtime and install there. Do not run `npm install` under the skill directory: the skill may be installed globally, and its dependencies would then serve every project on the machine.

Unix, from the project root:

```sh
mkdir -p .work-weave/runtime/issue
for name in listener.mjs check-pending.mjs queue.mjs lock.mjs project-root.cjs configure.mjs origin.mjs package.json package-lock.json; do
  cp "<skill-dir>/bundle/tools/$name" ".work-weave/runtime/issue/$name"
done
(cd .work-weave/runtime/issue && npm ci --omit=dev)
```

Windows PowerShell, from the project root:

```powershell
New-Item -ItemType Directory .work-weave\runtime\issue -Force | Out-Null
foreach ($name in 'listener.mjs','check-pending.mjs','queue.mjs','lock.mjs','project-root.cjs','configure.mjs','origin.mjs','package.json','package-lock.json') {
  Copy-Item "<skill-dir>\bundle\tools\$name" ".work-weave\runtime\issue\$name" -Force
}
Push-Location .work-weave\runtime\issue
npm ci --omit=dev
Pop-Location
```

Generate the checkout's settings and unit:

```sh
node .work-weave/runtime/issue/configure.mjs --project "<project-root>" --repository "<owner>/<repo>" --smee-url "<channel>"
```

`--repository` may be omitted to read the single GitHub `origin`. `--smee-url` may be omitted for an HTTP-only run; it is stored in the ignored settings file, never in Git, tickets, or logs. The configurator chooses a free local port when none is stored, reuses the stored port on a later run, and refuses to write when the port is occupied. It prints the settings and unit paths.

The listener resolves the project from `.work-weave/` (or `--project`), requires `REPOSITORY`, reads the roster from `.work-weave/issue/handles.toml`, and writes the queue at `[pending].path` resolved from the project root, defaulting to `.work-weave/pending/pending-communications.md`. It rejects a webhook event whose `repository.full_name` is missing or differs from `REPOSITORY`. This is repository isolation, not authentication; the author is still checked against the roster.

One process owns one queue. The listener creates `.work-weave/pending/.lock` atomically and refuses to start when another live listener on this host holds it. A dead pid, or an unverifiable lock older than 24 hours, is logged and taken over. `WEBHOOK_SECRET` is optional and only useful with a transport that preserves the signed bytes; Smee re-serializes JSON, so leave it unset for the default setup.

## Rules

Copy `bundle/rules/rules-pending-communications.md` into `.agents/rules/`:

- absent: copy it;
- identical: no-op;
- different: a conflict, and the person decides; never overwrite.

For an optional session-start hook, check the harness's documentation first. If it can run a command at session start and pass stdout to the agent, run the checker from the project root:

```sh
node .work-weave/runtime/issue/check-pending.mjs
```

The checker reads the queue without changing it. With entries it prints their count, titles, and URLs as untrusted issue data; a missing or empty queue prints nothing; configuration and read errors go to stderr with a nonzero exit. If the harness does not deliver that output, skip the hook and use the rule at session start.

## External steps

Read the repository state before creating anything. On a repository that already has a listener, the channel, webhook, and roster can all be read back with `gh`. Ask only where reading has no answer, and bring the candidates you found.

1. **Channel and webhook.** One channel per repository, shared by every checkout. Read the existing issue hook first:

   ```sh
   gh api repos/<owner>/<repo>/hooks \
     --jq '.[] | select(.events | index("issues")) | {id, url: .config.url}'
   ```

   A `https://smee.io/<id>` in `url` is the channel to reuse. No output means there is no issue hook; create a channel with `curl -sS -o /dev/null -w '%{redirect_url}\n' https://smee.io/new`, then create the webhook:

   ```sh
   gh api repos/<owner>/<repo>/hooks -X POST \
     -f "config[url]=<channel>" -f 'config[content_type]=json' \
     -F 'config[insecure_ssl]=0' -F active=true -f 'events[]=issues' \
     --jq '{id, url: .config.url}'
   ```

   An existing hook that is inactive or listens to more events is repaired with `PATCH`, not duplicated. Leave the webhook secret empty for Smee. A 403 or 404 on the read is not proof that no hook exists: check the account's permission and ask the responsible person before creating or changing anything. Keep the channel URL out of Git, tickets, and logs.

2. **Service.** Route by platform:

   - Linux: [service/linux.md](service/linux.md).
   - macOS: [service/macos.md](service/macos.md). The LaunchAgent template is unverified until it is tested on a Mac.
   - Windows: [service/windows.md](service/windows.md). Run the listener in the foreground; there is no bundled background service.

   The generated unit already records the checkout's working directory, the settings file, and the project runtime. Do not copy a unit from another checkout: its hash, paths, and port belong to that checkout.

3. **Roster and queue.** Use `.work-weave/issue/handles.toml`, tracked in Git. When the setup flow already confirmed the operator/login pair, read the file back and verify it; do not ask the pair again. When this bundle is installed on its own, or the file is absent, copy `bundle/tools/handles.toml.example`, fill it in, and state the operator and login back, asking the person to confirm they are the same person. The project's owners are the Waymark owners in `tickets/`; read the signed-in account with `gh api user --jq .login`. An owner name and a GitHub login are different names; confirm they are the same person. A login missing from the file cannot send; a login that should not send belongs nowhere in it.

   ```toml
   [handles]
   frank = "QiYueran-source"

   [pending]
   path = ".work-weave/pending/pending-communications.md"
   ```

   The queue path is relative to the project root. Create `.work-weave/.gitignore` if it is absent and make sure it ignores `pending/`, `runtime/`, and `local/`. The roster is under `issue/` and stays tracked.

   The listener matches this machine's owner from `git config user.name` in the checkout, without regard to case. A machine belonging to another owner sets the name locally:

   ```sh
   git config --local user.name <owner>
   ```

   Do not add a per-machine key to the shared roster.

4. **Startup scan.** After connecting to Smee, the listener lists open issues from the checkout's `origin` with `gh`, queues the ones that match the communicate format, whose author is in the roster, and whose `to` resolves to this machine's owner. It deduplicates by URL and recipient. Closed issues are excluded. A failed scan is logged; live events keep arriving. The listener only queues reminders; nothing acts on an issue until the person asks.

## Verify

1. **The webhook and settings name the same channel.** The `gh api ... /hooks` read prints the `https://smee.io/<id>` stored in `.work-weave/local/issue-listener.env`. A different id means the listener watches the wrong channel.
2. **The service is active for this checkout.** The platform guide's status command shows the generated unit active, and its log shows `listening on`, the Smee connection, and `Catch-up complete`. The journal redacts the channel URL.
3. **A live issue arrives.** File one addressed to this machine's owner, then check the queue:

   ```sh
   gh issue create --repo <owner>/<repo> --title "<ticket>: verify the listener" \
     --body $'---\nkind: communicate\ncategory: request\nfrom: <owner>\nto: [<login>]\ntickets: [<ticket>]\n---\n\nVerification issue.'
   node .work-weave/runtime/issue/check-pending.mjs
   ```

   The queue gains one line within a few seconds. Close the issue afterwards; the queue line remains as the record.
4. **The queue is ignored.** `git check-ignore -v .work-weave/pending/pending-communications.md` prints a matching line. No output means the queue is tracked state.
5. **A second listener is rejected.** While the service runs, start the listener in the foreground from the same runtime. It exits with `Another listener holds the queue lock` and does not append.
6. **An issue opened while the listener is off is recovered.** Stop the service, file one, confirm the queue did not grow, then start the service and confirm `Catch-up complete` and the new line.
7. **A new session surfaces the queue.** The rule prints the count and titles. Whether the harness delivers the checker's output is outside this setup.

If the queue stays empty, check the webhook's recent deliveries, the listener's log, the expected repository in the settings file, and the frontmatter's `kind: communicate`. GitHub reporting success at Smee does not prove the local listener received the event.
