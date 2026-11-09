# Settling on one host, twice

### GitHub keeps its own credential; Gitee does not

`gh` was already installed and logged in on this machine, so GitHub needs no new credential and no token in the skill. Its five actions are one command each: `gh issue create`, `gh issue list`, `gh issue view --json`, `gh issue comment`, and `gh issue close`.

Gitee has no CLI on this machine. The first version of the skill used `curl` against the REST API v5 with a personal access token. The token was the one new input, and it is the reason this example has a gap page: without it, only the read half of the Gitee reference could be checked.

### Gitee's API does not mirror GitHub's paths

Three differences were found in Gitee's own OpenAPI document (`https://gitee.com/api/v5/doc_json`) and confirmed against a public repository:

- **Create and update put the repository in the form body, not the path.** The path is `/api/v5/repos/<owner>/issues` with a `repo` form field; the comment endpoints use `/api/v5/repos/<owner>/<repo>/issues/<number>/comments` and do put both in the path. A reference written by analogy with GitHub would call `/repos/<owner>/<repo>/issues` and get a 404.
- **Issue numbers are strings.** `IKTNFO` and `I1ABCD` are numbers in Gitee's vocabulary, not integers, and they are case-sensitive. The skill stores `html_url` rather than rebuilding a URL from an integer.
- **Search is a keyword filter, not a qualified query.** `q=<ticket id>` matches the issue text; there is no `in:title`. The skill filters the returned titles for the id. `state=all` is accepted even though the documented states are `open`, `progressing`, `closed`, and `rejected`.

The token was sent as `Authorization: token $GITEE_TOKEN`. Gitee's document lists `access_token` as a form or query parameter, and the header form was confirmed to be parsed: an invalid token in the header returns `Access token does not exist`, the same answer the query form gives. The header keeps the token out of the request line.

These findings stay here. On 2026-11-09 the Gitee reference was deleted and this page is now the only record of them.

### What the verification has shown

- GitHub: all five actions were run end to end on a private scratch repository on 2026-11-08 — create (which printed the URL the skill treats as the receipt), search, view with comments, comment, and close with a closing comment. The search index missed the new issue for the first few seconds and the list fallback found it, which is why the reference kept that fallback. The repository was archived after the run, so the issue stays readable and no active scratch project is left behind. The assignee path was run separately: `gh issue create --assignee <login>` put the account in the issue's `assignees` field, which is the delivery mechanism the skill uses when the handle is known.
- Gitee: the list, view, and comment reads were run against `oschina/git-osc`, including an issue with nine comments, and returned `number`, `html_url`, `state`, `user.login`, and per-comment `body`, `user.login`, `created_at`, and `in_reply_to_id`.
- Gitee's write commands have not completed a write. Their three endpoints were called with an invalid token and returned `401 Access token does not exist` rather than `404`, which confirms the paths and methods are the ones Gitee serves. The user deferred the write path to the end-to-end batch on 2026-11-08; a real write still needs a token and a test repository.

### The two references were removed on 2026-11-09

The first version shipped `github.md` and `gitee.md` beside `SKILL.md`, on the theory that a run reads the one platform it files on. Two things went wrong with that.

The files were not the same kind of document. `github.md` was a command reference; `gitee.md` was raw `curl` plus a token convention of its own, because no CLI existed. One name covered two shapes.

And the split was in the wrong place. The five operations — find, file, read, reply, close — are the same on any host; only the command spells them. The skill already had to state what each operation must produce, because that is protocol. Restating it per host meant two copies of the same rules that could drift, and a third file for a third host.

The replacement is one `usage.md` with four parts:

- **What each operation must produce**, as a contract, with no command.
- **Exact commands for this skill's own tools** — the listener and the checker — because no `--help` documents them.
- **What `gh` must be able to do** for each operation, not the syntax of each command. A run can read `gh --help`; what it cannot infer is that reading an issue must return the body *and* the comments, or that the body must go in on stdin.
- **The other hosts, and what a fork changes.** GitLab, Gitee, Gitea, Bitbucket, and Azure DevOps are named as unsupported, with the listener block, the handle table, the setup, and the CLI listed.

### The first version was too neutral

The first replacement went further than that. It removed the host from the text altogether: the remote side became "the remote repo", the CLI was "the host's CLI", and `handles.toml` kept a `[handles.github]` table so a second platform could sit beside it.

That read as "multi-platform, not finished yet". Three places carried the claim — the prose that talked about "the host", a config table nested under a platform name, and a code comment saying a second host would replace one block and nothing else — and none of them was true. There was one host, and saying otherwise made a reader look for a knob that does not exist.

The correction, on 2026-11-09, was to name GitHub and keep naming it:

- the docs say GitHub, and `usage.md` closes with the hosts that are not supported;
- `handles.toml` is a flat `[handles]` table, so the file does not imply a platform axis;
- the listener rejects a nested `[handles.github]` table by name, instead of reading it as an empty recipient list and appearing configured.

The seam in the code stayed, because it is real regardless of what the docs promise: two functions where GitHub shows through, and everything outside them independent of the host. What changed is how it is described. It is not an extension point the skill offers; it is where a fork starts.

### The listener kept one process

Deleting the host references raised the matching question for the code: does each host need its own listener?

Most of the listener is host-neutral — the HTTP endpoint, the signature check, the queue, the deduplication by issue URL and recipient, and the log redaction. Only two things know where the events come from: the webhook payload shape, and the call that lists a repository's open issues. A listener per host would copy the neutral majority.

The code was split along that seam into `readIssueEvent` and `listOpenIssues`, with the rest left alone. No plugin mechanism and no `platform` config key were added: with one host built, an abstraction over hosts would be a guess.

The listener stays one process per project, which is a different axis: it reads the project's `handles.toml` and queue path, so each project runs its own.
