# GitHub

The five actions through the `gh` CLI. `gh` reads the repository from the checkout and the account from its own login; no token is written here.

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

## Find first

```bash
gh issue list --repo <owner>/<repo> --state open \
  --search "<ticket id> in:title" \
  --json number,title,url,state
```

`--search` is GitHub's issue search; `in:title` keeps the match on the title, where the ticket id lives. An empty list means no thread for this ticket yet.

GitHub's search index lags by a few seconds. When a thread was opened moments ago, list the open issues and read their titles instead:

```bash
gh issue list --repo <owner>/<repo> --state open --limit 100 --json number,title,url
```

Add `--state all` to the search to find a closed thread carrying the id; the open search is for a thread still waiting.

## File

```bash
gh issue create --repo <owner>/<repo> \
  --title "[<ticket id>] <what the recipient must decide or do>" \
  --body-file -
```

Write the body to stdin. The command prints the new issue's URL, which is the receipt the ticket records. Add `--assignee <login>` when the recipient's GitHub handle is known: the assignment puts the issue in their queue, and the `@handle` in the body is the notification. A waymark owner name is not always a GitHub login, so resolve it before filing.

No labels. A label is a repository's own vocabulary, and requiring one makes the skill fail on a repository that never set it up.

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

## What comes back

- `gh issue create`: the issue URL on stdout, one line.
- `gh issue list --json`: `number`, `title`, `url`, and `state` (`OPEN` or `CLOSED`).
- `gh issue view --json`: the fields named above. `comments` is an array of objects, each with `author.login`, `createdAt`, and `body`.
- `gh issue close` and `gh issue comment`: no JSON; a non-zero exit is the failure signal.

## Errors

`gh` exits non-zero on an API error and prints the message. Show it unchanged. `HTTP 404: Not Found` on a private repository usually means the account cannot see it, not that the issue is missing.
