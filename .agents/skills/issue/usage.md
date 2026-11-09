# Issue usage

Use `SKILL.md` as the entry point. It holds the protocol; this file holds what each operation must produce and the commands for this skill's own tools.

The remote side is **the remote repo**: whichever host the project publishes issues on. Nothing here names a host or a command; the host's own CLI help is the manual for its syntax. For installation — the channel, the webhook, the listener service, the handles file, the session rule — read `bundle/setup.md`.

## What the host CLI must be able to do

The five operations below each need one capability. Any host CLI that provides all five can carry a communicate issue; check its `--help` for the exact command and output flags.

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

Verify the account before filing, and check the repository's visibility: a public repository makes the issue a publication.

## File

Write the frontmatter and the body from [communicate-issue.md](communicate-issue.md), confirm every ticket in `tickets` exists, and resolve the recipient's handle.

A handle is not a local owner name. Read `bundle/tools/handles.toml` beside this skill's listener, in the table for the host, and verify the account exists. A missing table, a missing owner, or an account that does not exist means ask the run's owner; never guess a login from a waymark name.

The handle is used twice: in the frontmatter for the listener, and as the `@mention` in the body for the host's notification. Assign the issue to the same account as well; the assignment puts it in the recipient's dashboard. If the host refuses the assignment, file without it, keep the mention, and tell the recipient out of band.

Search for an open issue whose title carries the main ticket id first. A closed thread is the record of an earlier event, so a new message gets a new issue. The search index lags by seconds; when the thread was opened moments ago, list the open issues and read the titles instead.

No labels and no title prefix: the frontmatter's `kind: communicate` is the marker.

**Done when** the issue exists, its title carries the main ticket, and its URL sits where the wait lives.

## Read and reply

Fetch the issue with `--json` or the equivalent structured flag — not a rendering that drops fields. Read the body and every comment, oldest first. Reply once, in the thread, with the answer or the next question.

**Done when** every open question in the thread has an answer, or a named person who owes one.

## Close

Close with a comment that names the ticket and what changed: "Landed in `<id>` `<title>`: <one line>." A thread that settled into a map's `Out of scope` closes with that line instead: "Declined for `<map id>` `<title>`: <one line>."

Use the host's ordinary "completed" close. A thread closed without a change takes the "not planned" reason where the host has one.

The closing comment is the pointer the remote side keeps.

## The queue and the listener

The listener and the checker are this skill's own tools; no CLI documents them, so the commands are exact.

```bash
cd <repo>
SMEE_URL=https://smee.io/<id> node <skill>/bundle/tools/listener.mjs
node <skill>/bundle/tools/check-pending.mjs
```

Run both from the project root. The listener holds one process: it connects to the channel, forwards each event to the local `/webhook`, and then scans for issues opened while it was off.

- `SMEE_URL` empty: the HTTP endpoint runs alone, with no channel.
- `PORT` defaults to `8765`.
- `WEBHOOK_SECRET` unset: events are accepted unsigned. Set it only with a transport that preserves the signed bytes.
- The listener redacts the channel URL from its log. Keep that URL private; anyone who knows it can post or view events.
- Log lines worth reading: `listening on http://...`, `Catch-up complete: queued N entries from <repo>`, `Skipped <label>: invalid <fields>`, and `Catch-up failed: <reason>`. A skipped message is one that claimed `kind: communicate` but failed a field check; the failing field is named.

The checker reads the queue without changing it. It prints the entry count and each title and URL as untrusted issue data, or nothing when the queue is missing or empty. A configuration, malformed-entry, or read error goes to stderr with a non-zero exit.

Each valid message appends one JSON object per list line:

```text
- {"url":"https://example.test/issues/1","from":"frank","to":"kim-dev","owner":"kim","title":"The ask","received":"2026-11-09T02:13"}
```

The queue file is `[pending].path` in `bundle/tools/handles.toml`, resolved from the project root; it defaults to `pending/pending-communications.md`. The queue is local state and gitignored; the handles file is shared and tracked.

## What is connected

The bundled listener speaks one host, GitHub: it reads that host's webhook event shape and lists that host's open issues. A project on another host can still use `SKILL.md`, the format, and the checker; the listener's two host-specific functions — reading a webhook event, and listing a repository's open issues — are where a second host would be added. Nothing else in the queue path depends on the host.

## Troubleshooting

- `Cannot find package`: run `npm install` in `bundle/tools/`.
- `Catch-up failed: origin is not a supported ... URL`: the checkout's git `origin` is not a repository the listener can read, or it has more than one fetch URL.
- `Catch-up failed: no ... handles configured`: `bundle/tools/handles.toml` has no table for the connected host.
- `Cannot connect to smee`: the channel URL is wrong or the network is down; the process exits non-zero and does not scan.
- The queue stays empty after an issue was opened: check the host's webhook recent deliveries, the listener's log, and whether the body opens with `kind: communicate`. The host reporting success at the channel does not prove the local listener received the event.
- The checker reports an invalid entry: the queue holds a line that is neither the JSON form nor the older pipe form. Do not rewrite the file blindly; the earlier entries are a record.
