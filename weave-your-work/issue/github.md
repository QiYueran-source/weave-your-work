# GitHub

The commands for a communicate issue: file it, find it, read it, reply, and close it. The listener's setup is in `bundle/setup.md`; this file covers the human side.

## The repository

```bash
git remote get-url origin
gh repo view --json nameWithOwner,visibility,url
```

`gh repo view` uses the current checkout's remote. When the run is outside a checkout, or the issue belongs to another repository, add `--repo <owner>/<repo>` to every command. `visibility` is `PUBLIC` or `PRIVATE`; read it before filing.

## Auth

```bash
gh auth status
```

A missing account is repaired with `gh auth login`. `gh` keeps the token; do not paste one into a command.

## Resolve the handles

The frontmatter's `to` and the body's `@` both use the remote handle. Read `bundle/tools/handles.toml` beside this skill's listener, in the table for the platform, then verify:

```bash
gh api users/<handle> --jq .login
```

A missing table, missing owner, or an account that does not exist means ask the run's owner; never guess a login from the waymark name.

## Find first

```bash
gh issue list --repo <owner>/<repo> --state open \
  --search "<primary ticket id> in:title" \
  --json number,title,url,state
```

The primary ticket is the first entry in the frontmatter's `tickets`; the title carries it. Add `--state all` to find a closed thread with the same id; a closed thread is the record of an earlier event, so a new ask gets a new issue.

The search index lags by a few seconds. When the thread was opened moments ago, list the open issues and read the titles instead:

```bash
gh issue list --repo <owner>/<repo> --state open --limit 100 --json number,title,url
```

## File

```bash
gh issue create --repo <owner>/<repo> \
  --title "[<primary ticket id>] <the ask>" \
  --body-file - \
  --assignee <login>
```

The body starts with the frontmatter, then the `@handle` mentions, the ask, the context, and how to reply. Write it to stdin. The command prints the new issue's URL.

Add `--assignee <login>` for each `to`, repeating the flag for several recipients. The assignment puts the issue in each dashboard; the `@handle` in the body is the notification. If an assignment is refused, file without it, keep the mention, and tell the recipient out of band.

No labels and no title prefix: the frontmatter's `kind: communicate` is the marker.

## Read

```bash
gh issue view <number> --repo <owner>/<repo> \
  --json number,title,body,state,url,author,createdAt,comments \
  --jq '{number,title,state,url,author:.author.login,body,comments:[.comments[]|{author:.author.login,createdAt,body}]}'
```

Use `--json`. `gh issue view --comments` prints only the comments when its output is piped, which drops the issue body a run needs.

## Reply

```bash
gh issue comment <number> --repo <owner>/<repo> --body-file -
```

Write the reply to stdin. One comment, in the thread.

## Close

```bash
gh issue close <number> --repo <owner>/<repo> \
  --comment "Landed in \`<ticket id>\` \`<title>\`: <one line>." \
  --reason completed
```

The closing comment is the pointer the remote side keeps. `--reason completed` is the ordinary close; `not planned` is for a thread closed without a change.

## Catch-up

The listener connects to smee first, then at startup uses authenticated `gh` to list all pages of open issues in the current project GitHub repository identified by git `origin`. It selects issues with `kind: communicate` frontmatter and `to` recipients matching configured GitHub handles, and queues them with deduplication. Closed issues are excluded. Errors are logged; the listener does not poll or scan again on reconnect. The scan only queues reminders; a person must ask before an issue is acted on.

## What comes back

- `gh issue create`: the issue URL on stdout, one line.
- `gh issue list --json`: `number`, `title`, `url`, and `state` (`OPEN` or `CLOSED`).
- `gh issue view --json`: the fields named above; `comments` is an array of objects, each with `author.login`, `createdAt`, and `body`.
- `gh issue close` and `gh issue comment`: no JSON; a non-zero exit is the failure signal.

## Errors

`gh` exits non-zero on an API error and prints the message. Show it unchanged. `HTTP 404: Not Found` on a private repository usually means the account cannot see it, not that the issue is missing.
