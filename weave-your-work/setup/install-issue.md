# Issue listener install

The listener receives communicate issues and queues them for the next session. Run it once per checkout: the tools and dependencies live in the checkout's `.work-weave/personal/`, and each checkout gets its own listener, queue, port, and service. A clone repeats the machine-local parts; the channel and webhook belong to the repository and are reused.

## What this installs

- The project runtime in `.work-weave/personal/issue/`: the listener, checker, queue and lock modules, the project-root resolver, the checkout configurator, and their dependencies.
- Checkout settings in `.work-weave/personal/issue-listener.env`: the expected repository, the optional Smee URL, and the listener port.
- A generated unit `work-weave-issue-<hash8>.service` in `.work-weave/personal/`, where `hash8` is the first eight hex characters of the SHA-256 of the physical project root. The setup links it into the user service manager. A unit written under the old path is removed by the configurator after the new one is written, and the link is made again.
- The shared roster at `.work-weave/shared/handles.toml`, copied from `tools/issue/handles.toml.example` when absent. The roster is committed; everything under `.work-weave/personal/` is ignored.
- The session rule from `rules/rules-pending-communications.md` into `.agents/rules/`.
- A startup scan for open communicate issues missed while the listener was off.

## Tools

The tools need Node 20.18 or newer, or Node 22; the locked `smee-client` and `undici` refuse older releases. Copy the files into the project runtime and install there. Do not run `npm install` under the skill directory: the skill may be installed globally, and its dependencies would then serve every project on the machine.

Unix, from the project root:

```sh
mkdir -p .work-weave/personal/issue
for name in listener.mjs events.mjs check-pending.mjs queue.mjs lock.mjs project-root.cjs configure.mjs origin.mjs package.json package-lock.json; do
  cp "<setup>/tools/issue/$name" ".work-weave/personal/issue/$name"
done
(cd .work-weave/personal/issue && npm ci --omit=dev)
```

Windows PowerShell, from the project root:

```powershell
New-Item -ItemType Directory .work-weave\personal\issue -Force | Out-Null
foreach ($name in 'listener.mjs','events.mjs','check-pending.mjs','queue.mjs','lock.mjs','project-root.cjs','configure.mjs','origin.mjs','package.json','package-lock.json') {
  Copy-Item "<setup>\tools\issue\$name" ".work-weave\personal\issue\$name" -Force
}
Push-Location .work-weave\personal\issue
npm ci --omit=dev
Pop-Location
```

Generate the checkout's settings and unit:

```sh
node .work-weave/personal/issue/configure.mjs --project "<project-root>" --repository "<owner>/<repo>" --smee-url "<channel>"
```

`--repository` may be omitted to read the single GitHub `origin`. `--smee-url` may be omitted for an HTTP-only run; it is stored in the ignored settings file, never in Git, tickets, or logs. The configurator chooses a free local port when none is stored, reuses the stored port on a later run, and refuses to write when the port is occupied. It prints the settings and unit paths, and when the old unit still exists it names the one it removed and the commands that relink the service.

The listener resolves the project from `.work-weave/` (or `--project`), requires `REPOSITORY`, reads the roster from `.work-weave/shared/handles.toml`, and writes the queue at `[pending].path` resolved from the project root. When the roster names no `[pending].path`, the path is the queue's default, `.work-weave/personal/communication/pending.jsonl`, which `queue.mjs` defines once and the listener and checker both read from there. It rejects a webhook event whose `repository.full_name` is missing or differs from `REPOSITORY`. This is repository isolation, not authentication; the author is still checked against the roster.

One process owns one queue. The listener creates `.work-weave/personal/communication/.lock` atomically and refuses to start when another live listener on this host holds it. A dead pid, or an unverifiable lock older than 24 hours, is logged and taken over. `WEBHOOK_SECRET` is optional and only useful with a transport that preserves the signed bytes; Smee re-serializes JSON, so leave it unset for the default setup.

## Rules

Copy `rules/rules-pending-communications.md` into `.agents/rules/`:

- absent: copy it;
- identical: no-op;
- different: a conflict, and the person decides; never overwrite.

For an optional session-start hook, check the harness's documentation first. If it can run a command at session start and pass stdout to the agent, run the checker from the project root:

```sh
node .work-weave/personal/issue/check-pending.mjs
```

The checker reads the queue without changing it. With open threads it prints how many are open, then their titles and URLs as untrusted issue data; a closed thread keeps its line in the file and is not printed. A missing queue, or one with no open thread, prints nothing; configuration and read errors go to stderr with a nonzero exit. If the harness does not deliver that output, skip the hook and use the rule at session start.

## External steps

Read the repository state before creating anything. On a repository that already has a listener, the channel, webhook, and roster can all be read back with `gh`. Ask only where reading has no answer, and bring the candidates you found.

1. **Channel and webhook.** One channel per repository, shared by every checkout. Read the existing hook first:

   ```sh
   gh api repos/<owner>/<repo>/hooks \
     --jq -c '.[] | {id, url: .config.url, events, active}'
   ```

   Each line is one hook. A `https://smee.io/<id>` in `url` is the channel to reuse; `events` says what it sends. The listener needs three: `issues` fills the queue, and `pull_request` and `push` write the event file described under [The event file](#the-event-file). A hook on the channel that lacks either of the last two is incomplete: the queue still fills, and the event file stays empty.

   No line naming the channel means there is no hook to reuse. Create a channel with `curl -sS -o /dev/null -w '%{redirect_url}\n' https://smee.io/new`, then create the webhook:

   ```sh
   gh api repos/<owner>/<repo>/hooks -X POST \
     -f "config[url]=<channel>" -f 'config[content_type]=json' \
     -F 'config[insecure_ssl]=0' -F active=true \
     -f 'events[]=issues' -f 'events[]=pull_request' -f 'events[]=push' \
     --jq '{id, url: .config.url, events}'
   ```

   When a hook on the channel exists but is missing `pull_request` or `push`, repair it with an edit. Send every event the hook needs, not only the missing one: `events[]` fields replace the whole list, so sending `pull_request` alone would drop `issues`.

   ```sh
   gh api repos/<owner>/<repo>/hooks/<id> -X PATCH \
     -f 'events[]=issues' -f 'events[]=pull_request' -f 'events[]=push' \
     --jq '{id, url: .config.url, events, active}'
   ```

   An inactive hook on the channel is repaired the same way, adding `-F active=true`. Never create a second hook: two hooks on one channel deliver every event twice, and the queue and the event file then gain duplicate lines. Leave the webhook secret empty for Smee. A 403 or 404 on the read is not proof that no hook exists: check the account's permission and ask the responsible person before creating or changing anything. Keep the channel URL out of Git, tickets, and logs.

2. **Service.** Route by platform:

   - Linux: [service/linux.md](service/linux.md).
   - macOS: [service/macos.md](service/macos.md). The LaunchAgent template is unverified until it is tested on a Mac.
   - Windows: [service/windows.md](service/windows.md). Run the listener in the foreground; there is no bundled background service.

   The generated unit already records the checkout's working directory, the settings file, and the project runtime. Do not copy a unit from another checkout: its hash, paths, and port belong to that checkout.

3. **Roster and queue.** Use `.work-weave/shared/handles.toml`, tracked in Git. When the setup flow already confirmed the operator/login pair, read the file back and verify it; do not ask the pair again. When this install runs on its own, or the file is absent, copy `tools/issue/handles.toml.example`, fill it in, and state the operator and login back, asking the person to confirm they are the same person. The project's owners are the Waymark owners in `tickets/`; read the signed-in account with `gh api user --jq .login`. An owner name and a GitHub login are different names; confirm they are the same person. A login missing from the file cannot send; a login that should not send belongs nowhere in it.

   ```toml
   [handles]
   frank = "QiYueran-source"

   [pending]
   path = ".work-weave/personal/communication/pending.jsonl"

   [events]
   path = ".work-weave/personal/communication/events.jsonl"
   limit = 100
   ```

   The queue path is relative to the project root. `[pending].path` is optional: leave it out and the listener uses its default, the same path the example above names. Create `.work-weave/.gitignore` if it is absent and make sure it ignores `personal/` and nothing else: the roster is under `shared/` and stays tracked. `[events]` is described under [The event file](#the-event-file).

   The listener matches this machine's owner from `git config user.name` in the checkout, without regard to case. A machine belonging to another owner sets the name locally:

   ```sh
   git config --local user.name <owner>
   ```

   Do not add a per-machine key to the shared roster.

4. **Startup scan.** After connecting to Smee, the listener lists open issues from the checkout's `origin` with `gh`, queues the ones that match the communicate format, whose author is in the roster, and whose `to` resolves to this machine's owner. It deduplicates by URL and recipient. Closed issues are excluded. A failed scan is logged; live events keep arriving. The listener only queues reminders; nothing acts on an issue until the person asks.

## The event file

The listener writes a second file, `.work-weave/personal/communication/events.jsonl`, for three things: a pull request opening, a pull request merging, and a push to the default branch. Each is one JSON object on one line. It is history, not a queue: a line says what happened, when, and to what, and does not later become false.

- A pull request opening writes `{"kind": "pull-request-opened", "number", "title", "url", "author", "at", "merge_rights": [...]}`. Reviewing and merging are a person's work, so the line names who could do it: `merge_rights` holds the roster logins that GitHub says have write or admin on the repository. The listener reads that with one collaborators call and the roster filters it; an account outside the roster is not recorded, and a collaborators read that fails writes no line and logs why. Merge rights are read once per opening, so the file from a machine without merge rights looks the same as from one with them.
- A merge and a push to the default branch write the same kind, `{"kind": "default-branch-moved", "commit", "author", "at"}`, naming the commit the branch now points at. A push to any other branch writes nothing.
- An event GitHub cannot confirm is dropped and logged, and so is a line that cannot be written. A dropped event is a log line and nothing in the file.

**The listener warns nobody.** It starts no process, messages no session, and knows nothing about the harness on the machine. Reading this file and showing it to a person is a separate tool's work: that tool decides who sees which line, when, and how; replacing it changes nothing here. Nothing in the file records who has read it, so a reader that wants "what changed since I last looked" keeps that elsewhere.

The file is bounded. `[events] path` in the roster sets where it is written, relative to the project root and inside it, and `[events] limit` sets how many lines it keeps, 100 when unset. The trim happens in the same write as the append, so the file never holds more than the limit and the newest lines are the ones kept. A limit that is not a whole number of at least 1 is refused at startup, as is an empty path or one that leaves the project root. The listener's startup log names the file it writes. `events.jsonl` sits beside the queue and is covered by the same `.work-weave/.gitignore` line that ignores `personal/`.

## Verify

1. **The webhook and settings name the same channel.** The `gh api ... /hooks` read prints the `https://smee.io/<id>` stored in `.work-weave/personal/issue-listener.env`, and the same hook lists `issues`, `pull_request`, and `push` in `events`. A different id means the listener watches the wrong channel; a missing `pull_request` or `push` means `events.jsonl` stays empty; a missing `issues` means the queue does.
2. **The service is active for this checkout.** The platform guide's status command shows the generated unit active, and its log shows `listening on`, the Smee connection, and `Catch-up complete`. The journal redacts the channel URL.
3. **A live issue arrives.** File one addressed to this machine's owner, then check the queue:

   ```sh
   gh issue create --repo <owner>/<repo> --title "<ticket>: verify the listener" \
     --body $'---\nkind: communicate\ncategory: request\n---\n\nConfirm the listener queues this issue, then close it. Troubleshooting: [<ticket>].'
   node .work-weave/personal/issue/check-pending.mjs
   ```

   The queue gains one line within a few seconds. The front matter carries `kind` and `category` and nothing else: the sender is the account that opened the issue, and the recipient is its assignee, so assign it to this machine's owner when you open it. Close the issue afterwards as the account that opened it; that close marks the line closed, it stays in the file, and the checker stops reporting it. The ticket, not the queue, is the record.
4. **The queue is ignored.** `git check-ignore -v .work-weave/personal/communication/pending.jsonl` prints a matching line. No output means the queue is tracked state.
5. **An opened pull request writes one line.** Push a branch with one commit and open a pull request against the default branch:

   ```sh
   git switch main && git pull --ff-only && git switch -c verify-listener
   git commit --allow-empty -m "verify the listener" && git push -u origin verify-listener
   gh pr create --repo <owner>/<repo> --title "verify the listener" --body "Verification pull request." --base main
   tail -n 1 .work-weave/personal/communication/events.jsonl
   ```

   The last line within a few seconds is one object with `"kind":"pull-request-opened"` and its `merge_rights` naming the roster logins that hold write or admin. A merge or a push to `main` writes `"kind":"default-branch-moved"` instead: the listener treats `main` as the default branch, and a repository whose default branch has another name gets no line from a merge or push. One line, not two: a second line for the same pull request means the repository has two hooks on the channel. Close the pull request afterwards and delete the branch; the line stays as the record.
6. **A second listener is rejected.** While the service runs, start the listener in the foreground from the same runtime. It exits with `Another listener holds the queue lock` and does not append.
7. **An issue opened while the listener is off is recovered.** Stop the service, file one, confirm the queue did not grow, then start the service and confirm `Catch-up complete` and the new line.
8. **A new session surfaces the queue.** The rule prints the count and titles. Whether the harness delivers the checker's output is outside this setup.

If the queue stays empty, check the webhook's recent deliveries (the hook's `events` must include `issues`), the listener's log, the expected repository in the settings file, and the frontmatter's `kind: communicate`. If the event file stays empty after a pull request opens, check that the hook sends `pull_request` and `push`, that the listener's log names the event file it writes, and that `gh` on the listener's machine can read the repository's collaborators. GitHub reporting success at Smee does not prove the local listener received the event.
