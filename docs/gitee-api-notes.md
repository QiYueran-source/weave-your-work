# Gitee API notes

Parked findings, not support. `weave-your-work/issue/` handles GitHub only, and nothing in this repository wires Gitee in. The notes are here because they are the only record of what a Gitee implementation actually costs, and because the page that held them was deleted on 2026-11-10.

They came from the design work on the issue skill. A Gitee reference (`gitee.md`) shipped beside `SKILL.md` in the first version and was deleted on 2026-11-09, when the skill was narrowed to one host. The differences below were checked against Gitee's own OpenAPI document (`https://gitee.com/api/v5/doc_json`) and against a public repository.

## Three ways Gitee's REST API v5 differs from GitHub's

- **Create and update put the repository in the form body, not the path.** The path is `/api/v5/repos/<owner>/issues` with a `repo` form field. The comment endpoints do the opposite: `/api/v5/repos/<owner>/<repo>/issues/<number>/comments` carries both in the path. A reference written by analogy with GitHub would call `/repos/<owner>/<repo>/issues` and get a 404.
- **Issue numbers are strings.** `IKTNFO` and `I1ABCD` are numbers in Gitee's vocabulary, not integers, and they are case-sensitive. Store `html_url` rather than rebuilding a URL from an integer.
- **Search is a keyword filter, not a qualified query.** `q=<ticket id>` matches the issue text; there is no `in:title`, so the returned titles are filtered locally. `state=all` is accepted even though the documented states are `open`, `progressing`, `closed`, and `rejected`.

## The token

Gitee has no CLI on this machine, so the first version called the REST API with `curl` and a personal access token. Gitee's document lists `access_token` as a form or query parameter; the header form `Authorization: token $GITEE_TOKEN` is also parsed, and an invalid token in the header returns `Access token does not exist`, the same answer the query form gives. The header keeps the token out of the request line.

## What was run, and what was not

- The list, view, and comment reads ran against `oschina/git-osc`, including an issue with nine comments, and returned `number`, `html_url`, `state`, `user.login`, and per-comment `body`, `user.login`, `created_at`, and `in_reply_to_id`.
- No Gitee write has completed. The three write endpoints were called with an invalid token and returned `401 Access token does not exist` rather than `404`, which confirms the paths and methods are the ones Gitee serves. A real write still needs a token and a test repository.

## If the skill ever gains the host

`weave-your-work/issue/usage.md` ends with an "Other hosts" section listing what a fork changes: the listener's two GitHub functions, the flat `[handles]` table, the setup, and the CLI behind the five operations. The three differences above are what a Gitee fork would hit first, and they belong in that fork's own usage document rather than in this skill's.
