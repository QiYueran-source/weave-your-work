# Gitee

The five actions through Gitee's REST API v5. Gitee has no CLI on the machine; `curl` and a personal access token are enough.

This reference covers repositories on `gitee.com`. Enterprise issue endpoints live under `/enterprises/...` and are not covered here.

## The token

Create a personal access token in Gitee's settings, at `https://gitee.com/profile/personal_access_tokens`, with the permission that covers issues, then export it:

```bash
export GITEE_TOKEN=<token>
```

Do not put the token in a file in the repository, and do not pass it in a URL. Gitee accepts it as a header, which keeps it out of the request line:

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

The reply carries `full_name`, `public`, and `private`. Read `public` before filing: `true` means the issue is a publication. A `git@gitee.com:<owner>/<repo>.git` remote splits into `owner` and `repo` at the colon; an `https://gitee.com/<owner>/<repo>.git` remote splits at the path.

## Find first

```bash
curl -sS --fail-with-body \
  -H "Authorization: token $GITEE_TOKEN" \
  "https://gitee.com/api/v5/repos/<owner>/<repo>/issues?state=all&q=<ticket id>&per_page=100"
```

`q` searches the repository's issues by keyword. Filter the returned titles for the ticket id; unlike GitHub's search, Gitee has no `in:title` qualifier, and `q` may match the body as well.

`state` takes `open`, `progressing`, `closed`, `rejected`, or `all`.

## File

```bash
curl -sS --fail-with-body -X POST \
  -H "Authorization: token $GITEE_TOKEN" \
  "https://gitee.com/api/v5/repos/<owner>/issues" \
  --data-urlencode "repo=<repo>" \
  --data-urlencode "title=[<ticket id>] <what the recipient must decide or do>" \
  --data-urlencode "body@-"
```

The path is `/repos/<owner>/issues` with the repository in the `repo` form field, not `/repos/<owner>/<repo>/issues`. The reply is the new issue: `number` (a string such as `IKTNFO`, case-sensitive) and `html_url`, which is the receipt the ticket records.

`body@-` reads the body from stdin and form-encodes it. Nothing else is required: `labels` and `assignee` are optional, and this skill sends neither by default.

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

## Reply

```bash
curl -sS --fail-with-body -X POST \
  -H "Authorization: token $GITEE_TOKEN" \
  "https://gitee.com/api/v5/repos/<owner>/<repo>/issues/<number>/comments" \
  --data-urlencode "body@-"
```

## Close

Comment first, then close, so the closing note exists before the thread stops accepting replies:

```bash
curl -sS --fail-with-body -X POST \
  -H "Authorization: token $GITEE_TOKEN" \
  "https://gitee.com/api/v5/repos/<owner>/<repo>/issues/<number>/comments" \
  --data-urlencode "body=Landed in \`<ticket id>\` \`<title>\`: <one line>."

curl -sS --fail-with-body -X PATCH \
  -H "Authorization: token $GITEE_TOKEN" \
  "https://gitee.com/api/v5/repos/<owner>/issues/<number>" \
  --data-urlencode "repo=<repo>" \
  --data-urlencode "state=closed"
```

The PATCH takes the repository as a form field, for the same reason the create does.

## States

An open issue reads `open` or `progressing`; a closed one reads `closed`, and a rejected one `rejected`. The PATCH accepts `open`, `progressing`, and `closed`; `rejected` is a list filter, not a state to set.

## What comes back

- Create: the issue object, with `number` and `html_url`.
- List: an array of issue objects.
- Read: one issue object.
- Comments: an array of comment objects.
- Close: the updated issue object.

## Errors

A non-2xx reply is JSON with a `message`. `--fail-with-body` keeps that body and exits non-zero. Show the message unchanged. A `404` on a private repository usually means the token cannot see it.

## Numbers

Gitee issue numbers are strings, not integers: `IKTNFO`, `I1ABCD`. They are case-sensitive, and the URL in `html_url` is the one to store.
