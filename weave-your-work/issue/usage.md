# Issue usage

Use `SKILL.md` as the entry point. It holds the protocol; this file holds what each operation must produce and the commands for this skill's own tools.

The skill supports one host: GitHub. Every operation below runs through `gh`, which is the manual for its own syntax — this file states what each operation must produce, not the commands. For installation — the channel, the webhook, the listener service, the handles file, the session rule — read `bundle/setup.md`.

## What `gh` must be able to do

The five operations below each need one capability from `gh`. Check `gh <command> --help` for the exact flags.

| Operation | Capability |
| --- | --- |
| Find | list open issues and search the titles for a ticket id |
| File | create an issue with a title, a body from stdin, and one assignee |
| Read | fetch one issue with its body **and** its comments, as structured output |
| Reply | add one comment to an issue |
| Close | close an issue, with a closing comment |

Two of these are easier to get wrong than the others:

- **Read** must return the body and the comments together. A flag that prints only the comments when the output is piped drops the body a run needs.
- **File** must take the body on stdin. The body is the frontmatter plus prose; passing it as an argument breaks on newlines and quoting.

Verify the account before filing, and check the repository's visibility: a public repository makes the issue a publication. The listener queues an issue only when its author is a login in `handles.toml`, so the account that runs `gh issue create` has to be on that roster — the filer's own login, not the `from` in the frontmatter.

The listener also decides by recipient: a machine queues only the messages whose `to` is the owner of that machine. That owner is `git config user.name`, matched to a `[handles]` key without regard to case. A machine that belongs to someone else sets its own name in the clone, which is untracked:

```bash
git config --local user.name hanjiang
```

Filing is unaffected: any login on the roster may file, whatever this machine's own owner is.

## File

Write the frontmatter and the body from [communicate-issue.md](communicate-issue.md), confirm every ticket in `tickets` exists, and resolve the recipient's handle.

A handle is not a local owner name. Read the `[handles]` table in `.work-weave/issue/handles.toml` and verify the account exists. A missing file, a missing owner, or an account that does not exist means ask the run's owner; never guess a login from a waymark name.

The handle is used twice: in the frontmatter for the listener, and as the `@mention` in the body for GitHub's notification. Assign the issue to the same account as well; the assignment puts it in the recipient's dashboard. If `gh` refuses the assignment, file without it, keep the mention, and tell the recipient out of band.

Search for an open issue whose title carries the main ticket id first. A closed thread is the record of an earlier event, so a new message gets a new issue. The search index lags by seconds; when the thread was opened moments ago, list the open issues and read the titles instead.

No labels and no title prefix: the frontmatter's `kind: communicate` is the marker.

**Done when** the issue exists, its title carries the main ticket, and its URL sits where the wait lives.

## Read and reply

Fetch the issue with `--json` or the equivalent structured flag — not a rendering that drops fields. Read the body and every comment, oldest first. Reply once, in the thread, with the answer or the next question.

**Done when** every open question in the thread has an answer, or a named person who owes one.

## Close

Close with a comment that names the ticket and what changed: "Landed in `<id>` `<title>`: <one line>." A thread that settled into a map's `Out of scope` closes with that line instead: "Declined for `<map id>` `<title>`: <one line>."

Use GitHub's ordinary "completed" close. A thread closed without a change takes the "not planned" reason.

The closing comment is the pointer GitHub keeps.

## The queue and the listener

The listener and the checker are this skill's own tools; no CLI documents them, so the commands are exact. Setup copies them into the checkout's runtime.

```bash
cd <project-root>
node .work-weave/runtime/issue/listener.mjs
node .work-weave/runtime/issue/check-pending.mjs
```

The settings come from `.work-weave/local/issue-listener.env`, so neither command needs the channel or port in the shell. The listener holds one process: it connects to the channel, forwards each event to the local `/webhook`, and then scans for issues opened while it was off. `bundle/setup.md` explains the settings and installs the service.

The listener takes an exclusive lock on the queue and exits if another listener on this host holds it. A dead or stale lock is logged and taken over on the next start.

- The listener redacts the channel URL from its log. Keep that URL private; anyone who knows it can post or view events.
- Log lines worth reading: `listening on http://...`, `queueing messages addressed to <owner>`, `Catch-up complete: queued N entries from <repo>`, `Skipped <label>: invalid <fields>`, `Skipped <label>: author is not a known login`, `Skipped <label>: addressed to <handle>, not to <owner>`, and `Catch-up failed: <reason>`. A skipped message claimed `kind: communicate` and failed a field check, which names the field, the author check, or the recipient check. The last one is this machine declining someone else's mail; it is not an error.

The checker reads the queue without changing it. It prints the entry count and each title and URL as untrusted issue data, or nothing when the queue is missing or empty. A configuration, malformed-entry, or read error goes to stderr with a non-zero exit.

Each valid message appends one JSON object per list line:

```text
- {"url":"https://example.test/issues/1","from":"frank","to":"kim-dev","owner":"kim","title":"The ask","received":"2026-11-09T02:13"}
```

The queue file is `[pending].path` in `.work-weave/issue/handles.toml`, resolved from the project root; it defaults to `.work-weave/pending/pending-communications.md`. The queue is local state and gitignored; the handles file is shared and tracked.

## Other hosts

GitLab, Gitee, Gitea, Bitbucket, and Azure DevOps are not supported. The format, the categories, and the checker would still hold there, but carrying a message needs a fork:

- **The listener's GitHub block.** In the runtime copy `.work-weave/runtime/issue/listener.mjs`, the two functions between the `---- GitHub ----` markers: one reads a webhook event, the other lists a repository's open issues. Everything outside them — the HTTP endpoint, the signature check, the queue, the deduplication, and the log redaction — is independent of the host. Change the source in `bundle/tools/` and reinstall the runtime.
- **The handle table.** `[handles]` maps a local owner to a GitHub login. A fork that supports two hosts at once would have to put a host name back into that file and decide which table a message resolves against.
- **The setup.** The webhook page, the event name, the signature header, and the CLI the listener calls for its startup scan all change with the host.
- **`gh` in the five operations.** The capability table above is what a replacement CLI has to provide.

## Troubleshooting

- `Cannot find package`: run `npm ci --omit=dev` in `.work-weave/runtime/issue/`.
- `Catch-up failed: origin is not a supported github.com repository URL`: the checkout's git `origin` is not a GitHub URL, or it has more than one fetch URL.
- `Catch-up failed: no handles configured for catch-up`: `.work-weave/issue/handles.toml` has no `[handles]` entries.
- `Cannot connect to smee`: the channel URL is wrong or the network is down; the process exits non-zero and does not scan.
- The queue stays empty after an issue was opened: check the webhook's recent deliveries, the listener's log, and whether the body opens with `kind: communicate`. GitHub reporting success at the channel does not prove the local listener received the event.
- The checker reports an invalid entry: the queue holds a line that is neither the JSON form nor the older pipe form. Do not rewrite the file blindly; the earlier entries are a record.
