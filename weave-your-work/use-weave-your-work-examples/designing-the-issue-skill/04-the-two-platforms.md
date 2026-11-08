# The two platforms

### GitHub keeps its own credential; Gitee does not

`gh` was already installed and logged in on this machine, so GitHub needs no new credential and no token in the skill. Its five actions are one command each: `gh issue create`, `gh issue list`, `gh issue view --json`, `gh issue comment`, and `gh issue close`.

Gitee has no CLI here. The skill uses `curl` against the REST API v5, with a personal access token. The token is the one new input, and it is the reason this example has a gap page: without it, only the read half of the Gitee reference could be checked.

### Gitee's API does not mirror GitHub's paths

Three differences were found in Gitee's own OpenAPI document (`https://gitee.com/api/v5/doc_json`) and confirmed against a public repository:

- **Create and update put the repository in the form body, not the path.** The path is `/api/v5/repos/<owner>/issues` with a `repo` form field; the comment endpoints use `/api/v5/repos/<owner>/<repo>/issues/<number>/comments` and do put both in the path. A reference written by analogy with GitHub would call `/repos/<owner>/<repo>/issues` and get a 404.
- **Issue numbers are strings.** `IKTNFO` and `I1ABCD` are numbers in Gitee's vocabulary, not integers, and they are case-sensitive. The skill stores `html_url` rather than rebuilding a URL from an integer.
- **Search is a keyword filter, not a qualified query.** `q=<ticket id>` matches the issue text; there is no `in:title`. The skill filters the returned titles for the id. `state=all` is accepted even though the documented states are `open`, `progressing`, `closed`, and `rejected`.

The token is sent as `Authorization: token $GITEE_TOKEN`. Gitee's document lists `access_token` as a form or query parameter, and the header form was confirmed to be parsed: an invalid token in the header returns `Access token does not exist`, the same answer the query form gives. The header keeps the token out of the request line.

### What the verification has shown

- GitHub: all five actions were run end to end on a private scratch repository on 2026-11-08 — create (which printed the URL the skill treats as the receipt), search, view with comments, comment, and close with a closing comment. The search index missed the new issue for the first few seconds and the list fallback found it, which is why the reference keeps that fallback. The repository was archived after the run, so the issue stays readable and no active scratch project is left behind.
- Gitee: the list, view, and comment reads were run against `oschina/git-osc`, including an issue with nine comments, and returned `number`, `html_url`, `state`, `user.login`, and per-comment `body`, `user.login`, `created_at`, and `in_reply_to_id`.
- Gitee's write commands have not completed a write. Their three endpoints were called with an invalid token and returned `401 Access token does not exist` rather than `404`, which confirms the paths and methods are the ones Gitee serves; a real write still needs a token and a test repository.

The title and body rules are the same on both platforms. Only the commands differ, which is why the split is one skill with two references rather than two skills.
