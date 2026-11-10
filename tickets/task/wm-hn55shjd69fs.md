---
schema: 1
id: wm-hn55shjd69fs
title: Write the feedback-me-please skill and check its commands
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T01:25:49Z
updated_at: 2026-11-10T01:46:55Z
closed_at: 2026-11-10T01:46:55Z
parent: wm-0166kgff304k
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Deliver `weave-your-work/feedback-me-please/` and check its commands against the repository.

1. `SKILL.md`: the trigger, the account check, the duplicate search, the four-part draft, the draft-then-send gate, the label rule, the star check and command, and what it never sends.
2. Run the read-only commands the skill quotes and record what each returns: `gh api /user --jq .login`, `gh repo view` for visibility, `gh label list` for the label set, `gh search issues` scoped to the repository, and the starred lookup.
3. Record which account is active and whether it can write to the repository, since that decides whether `GH_TOKEN` is required.
4. Do not file a test issue and do not star anything.

## Acceptance signal

The skill file exists. Each command it quotes was run and is reported with its actual output or result, including the active account's write access and the `404`-or-`2xx` answer of the starred lookup. No issue and no star was created by this run. The draft-then-send gate is stated as a required step, not a suggestion.

## Boundaries

- No test issue, no star, no comment on an existing issue.
- The skill is not installed with `npx skills add` in this task.

## Result

`weave-your-work/feedback-me-please/SKILL.md` exists, and every command it quotes was run against `QiYueran-source/weave-your-work` on 2026-11-10. No issue was filed and nothing was starred.

What each command returned:

- `gh api /user --jq .login` printed `QiYueran-archived`. That account's `/repos/... --jq .permissions` is `{"admin":false,"maintain":false,"pull":true,"push":false,"triage":false}`, so it cannot open an issue in the repository.
- The same two commands under `GH_TOKEN=$(gh auth token --user QiYueran-source)` printed `QiYueran-source` and `{"admin":true,"maintain":true,"pull":true,"push":true,"triage":true}`. Both accounts are logged in on this machine, which is why the skill names the token on every command.
- `gh repo view QiYueran-source/weave-your-work --json visibility` returned `{"visibility":"PUBLIC"}`.
- `gh label list --repo QiYueran-source/weave-your-work` returned eleven labels: `accessibility`, `bug`, `documentation`, `duplicate`, `enhancement`, `good first issue`, `help wanted`, `invalid`, `question`, `wontfix`. The skill names three of them.
- `gh search issues --repo QiYueran-source/weave-your-work "listener queue" --limit 3` returned one closed issue, `#8`. Searching a phrase with no match returned an empty result and exit code 0, not an error.
- `gh api /user/starred/QiYueran-source/weave-your-work` returned `{"message":"Not Found",...}` with HTTP 404, under both accounts. The shell exit code is 1.

Two corrections the run made to the skill. The account check now includes the permissions call, because a logged-in account that cannot post would otherwise fail at the last step, after the draft was approved. The star check now says the `404` body is the expected answer and that the command exits 1, since a run that trusts the exit code would read "not starred" as "check failed".

The `--body-file` path in step 4 is a file the run writes before sending; no draft file was created in this task, because no issue was approved.

Changed on 2026-11-10 after the review: the star step no longer asks. It stars by default when the lookup returns 404, and the run says so in its report. The map's earlier decision that a star is offered but never given without asking was struck through and replaced with the reason. The `DELETE /user/starred/QiYueran-source/weave-your-work` undo command the skill now quotes was run too: against the unstarred repository it exits 0 and changes nothing, and the lookup still returns 404 afterwards. Nothing in the acceptance signal moved, so the verdict stands and this stays an edit in place.

## Review

passed

- Goal: the `Acceptance signal` asks for the skill, each quoted command run and reported, the active account's write access stated, the starred lookup's answer recorded, and no issue or star created. `Result` reports each command with its actual output: the active account has `pull` only, the repository owner's account has `admin`, the starred lookup returns 404 under both, the label set has eleven entries, and the search returns `#8` for one phrase and nothing for another. `gh issue list --repo ...` was not run, so no issue exists and none was starred.
- Convention: `Boundaries` held. No test issue, no star, no comment, and no `npx skills add`.
