---
name: feedback-me-please
description: "Send a skill bug or a good experience upstream to QiYueran-source/weave-your-work: check for a duplicate, draft the issue, send only after the person approves, and offer a star."
---

# Feedback me please

These skills are used by people who did not write them. A bug found in use is the only report of it, and a skill that worked well tells the author which path is worth keeping. Both facts die in the session that found them unless someone sends them upstream.

One repository receives both: `QiYueran-source/weave-your-work`. It is public. An issue posted there is a permanent, public record under the sender's GitHub account, so the draft is read before it is sent.

## When it runs

- A skill behaved wrongly: a step that cannot be followed, a command that fails, a rule that contradicts another, a path that does not exist.
- A skill was better than expected and the person says so.
- The person asks to report something upstream or to star the repository.

Not this skill: a mistake in this project's own tickets. Those are repaired here with `update`. This skill is for the skills themselves, as delivered.

## Before anything: whose account sends it

The active `gh` account may not be the one that should post. Check it, and say which account will be used:

```
gh api /user --jq .login
```

When more than one account is logged in, the posting account is chosen per command with `GH_TOKEN`:

```
GH_TOKEN=$(gh auth token --user <account>) gh issue create ...
```

Then check that the chosen account can actually post:

```
GH_TOKEN=$(gh auth token --user <account>) gh api \
  /repos/QiYueran-source/weave-your-work --jq .permissions
```

`push`, `triage`, or `admin` true is enough to open an issue; a read-only account is refused by GitHub with a 403 after the draft is approved, so check first. On the machine this skill was written on, the default account had `pull` only and the repository owner's account had `admin`, which is why every command below names the token.

Read the account name back to the person before drafting. A report filed from the wrong account cannot be reassigned.

## Step 1: a bug, or a good word?

Ask once, and let the answer pick the path.

- **Bug** → steps 2 to 5, ending in an issue.
- **Good word** → steps 2 and 5 only, ending in a star or a short issue. A working path is worth recording, but it does not need a bug report.

## Step 2: check for a duplicate

A duplicate issue costs the author more than it costs the sender. Search before drafting:

```
GH_TOKEN=$(gh auth token --user <account>) gh search issues \
  --repo QiYueran-source/weave-your-work "<two or three words from the symptom>" --limit 10
```

Search by the symptom, not the fix: "listener queue empty", not "fix to-routing". Also read the open issues once, because a symptom often has a different title than the reporter expected:

```
gh issue list --repo QiYueran-source/weave-your-work --state all --limit 30
```

When a matching issue is open, add a comment there instead of filing a new one. When it is closed, say so in the draft and reference it; a closed issue that came back is information.

## Step 3: draft

Write the draft into the conversation, not straight to the repository. Four parts, in this order:

- **What I ran.** The skill name, the command or step, and the input, short enough to copy.
- **What happened.** The actual output or behaviour, quoted.
- **What I expected.** Which line of the skill said otherwise, with its path.
- **Where it was.** Skill name and version if visible, host OS, and the `weave-your-work` commit if the person knows it.

Title: `[<skill>] <the symptom>`, for example `[issue] listener queues a message for another owner`. One symptom per issue; two symptoms are two issues.

The label comes from the repository's own set:

```
gh label list --repo QiYueran-source/weave-your-work
```

`bug` for a wrong behaviour, `enhancement` for a missing capability, `documentation` for a skill whose text is wrong or unclear. Do not invent a label; a rejected label fails the whole create call.

## Step 4: send, after approval

Show the full draft and the exact command. Send only after the person says yes. There is no undo on a public issue: deleting it leaves the number and the notifications already sent.

```
GH_TOKEN=$(gh auth token --user <account>) gh issue create \
  --repo QiYueran-source/weave-your-work \
  --title "[<skill>] <the symptom>" \
  --body-file <the draft file> \
  --label bug
```

Read the returned URL back. Then one line into the ticket that owns the work, or into the session if no ticket owns it, saying what was filed. Do not wait for the author's reply in this run.

## Step 5: the star

Offer it; never give it without the person saying yes. It is a short-lived choice, so ask once and move on.

Check first, because a second star is a no-op that reads as success:

```
GH_TOKEN=$(gh auth token --user <account>) gh api \
  /user/starred/QiYueran-source/weave-your-work
```

A `404 — Not Found` with exit code 1 means not starred. The body is the API's `Not Found` JSON, which is the answer, not a failure. Any `2xx` means already starred, and the star step is done. To star:

```
GH_TOKEN=$(gh auth token --user <account>) gh api -X PUT \
  /user/starred/QiYueran-source/weave-your-work
```

Ask in the person's language, mention that the repository is public and the star is visible on their profile, and accept no as a complete answer. A bug report and a star are independent: a bug does not block the star, and the star does not soften the report.

## The report

Four lines: what was filed or starred, under which account, the issue URL or the star result, and what is still waiting. Nothing else is written into this project.

## What it never does

- Send an issue without showing the draft and getting a yes.
- Star without asking, or star twice.
- File from an account the person did not name.
- Bundle several symptoms into one issue.
- Include credentials, tokens, private repository contents, or another person's data in a draft. Read the draft for this before sending; a public issue is forever.
- Fix the reported bug here. The fix is a change in that repository, and the report is the whole of this run's job.
- Comment on, close, or edit an existing issue without the person's approval.
