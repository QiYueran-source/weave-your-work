# Gitee

The read path for a communicate issue on Gitee. The write path and the Gitee listener are deferred; the frontmatter and the body are the same as on GitHub.

## The token

Create a personal access token at `https://gitee.com/profile/personal_access_tokens` with the `issues` and `notes` permissions (Gitee may list comments under `notes`). Make it available to the run in one of two ways:

```bash
export GITEE_TOKEN=<token>
# or, when the run cannot inherit the shell's environment:
export GITEE_TOKEN="$(cat ~/.config/work-weave/gitee-token)"
```

The file lives outside the repository and is readable only by its owner. Do not put the token in a file in the repository, and do not pass it in a URL.

```bash
curl -sS --fail-with-body \
  -H "Authorization: token $GITEE_TOKEN" \
  https://gitee.com/api/v5/user
```

The reply is the authenticated account. A missing token, or one without the permission, returns `401` with `Access token does not exist` or `登录失效，无权限访问该资源`.

## The repository

```bash
git remote get-url origin
curl -sS --fail-with-body \
  -H "Authorization: token $GITEE_TOKEN" \
  "https://gitee.com/api/v5/repos/<owner>/<repo>"
```

The reply carries `full_name`, `public`, and `private`. Read `public` before filing: `true` means the issue is a publication.

## Find first

```bash
curl -sS --fail-with-body \
  -H "Authorization: token $GITEE_TOKEN" \
  "https://gitee.com/api/v5/repos/<owner>/<repo>/issues?state=all&q=<primary ticket id>&per_page=100"
```

`q` searches the repository's issues by keyword. Filter the returned titles for the ticket id; unlike GitHub's search, Gitee has no `in:title` qualifier. `state` takes `open`, `progressing`, `closed`, `rejected`, or `all`.

The listener and the catch-up are GitHub-first; a Gitee catch-up can use the same list and filter the bodies for `kind: communicate`.

## Read

```bash
curl -sS --fail-with-body \
  -H "Authorization: token $GITEE_TOKEN" \
  "https://gitee.com/api/v5/repos/<owner>/<repo>/issues/<number>"

curl -sS --fail-with-body \
  -H "Authorization: token $GITEE_TOKEN" \
  "https://gitee.com/api/v5/repos/<owner>/<repo>/issues/<number>/comments?per_page=100&order=asc"
```

The issue carries `number`, `title`, `body`, `state`, `html_url`, and `user.login`. Each comment carries `body`, `user.login`, `created_at`, and `in_reply_to_id`.

## What is deferred

The create, update, and comment endpoints were called with an invalid token and returned `401` rather than `404`, so the paths and methods are right; no successful write has run. The Gitee listener and the write path wait for the end-to-end batch. Do not file or close a Gitee communicate issue from this skill yet.

## Numbers

Gitee issue numbers are strings, not integers: `IKTNFO`, `I1ABCD`. They are case-sensitive, and the URL in `html_url` is the one to store.
