---
name: feed-me-back
description: "Report a problem with a skill in this set, or a skill that worked better than expected, to QiYueran-source/weave-your-work. Use when a skill's step cannot be followed, a command in it fails, it contradicts another skill, or the person wants to say a skill went well."
disable-model-invocation: true
---

# Feed me back

These skills are used by people who did not write them. A skill that went wrong
is found only by the person using it, and a skill that worked better than
expected tells the author which path to keep. Both findings are lost when the
session ends unless someone sends them upstream.

This skill reports on a skill in this set. A mistake in the project's own
records is not this: that is that project's to fix, in its own records.

Every report goes to `QiYueran-source/weave-your-work`. That repository is the
default and the only one this skill sends to.

## The repository, named on every call

`communicate-with-issue` takes the repository from the directory it runs in.
This skill runs inside whatever project the person is working in, so every
`gh` call here names the repository explicitly:

```sh
gh api /user --jq .login
gh search issues --repo QiYueran-source/weave-your-work "<words from the symptom>" --limit 10
gh issue list --repo QiYueran-source/weave-your-work --state all --limit 30
gh label list --repo QiYueran-source/weave-your-work
gh issue comment <number> --repo QiYueran-source/weave-your-work --body-file <the comment text>
gh issue create --repo QiYueran-source/weave-your-work --title "<title>" --body-file <the issue text> --label <label>
gh api /user/starred/QiYueran-source/weave-your-work
gh api -X PUT /user/starred/QiYueran-source/weave-your-work
```

## When it runs

- A skill's step cannot be followed, or names a path that does not exist.
- A command in a skill fails.
- One skill contradicts another, or itself.
- A skill did better than expected and the person says so.
- The person asks to report something upstream.

## Steps

1. **Say which account will send.** `gh api /user --jq .login`, and read the
   login back to the person. A report carries that account's name permanently,
   and a report from the wrong account cannot be reassigned. When more than one
   account is signed in, `GH_TOKEN=$(gh auth token --user <account>)` in front
   of the command picks the one to send with.

2. **Ask once whether this is a bug or a good word.** A bug runs steps 3 to 6.
   A good word runs steps 3, 4, and 6, and it carries a label only when the
   person asks for one.

3. **Check for a duplicate.** Search by the symptom, not the fix: "listener
   queue empty", not "fix the routing". A matching open issue gets a comment in
   its thread instead of a new issue: read the thread with
   `gh issue view <number> --repo QiYueran-source/weave-your-work --comments`,
   and answer it the way `communicate-with-issue` answers a thread. A closed
   issue that has come back is said so in the draft.

4. **Draft it in the conversation.** Four parts:

   - what was run: the skill, the command, and the input, short enough to copy
   - what happened: the real output, quoted
   - what was expected: the line of the skill that says otherwise, with its
     path
   - where it happened: skill name, operating system, and the set's version

   The title is `[<skill>] <the symptom>`, and it holds one symptom. For a bug,
   pick the label from `gh label list --repo QiYueran-source/weave-your-work`:
   `bug`, `enhancement`, or `documentation`. Do not invent a label; a label the
   repository does not have fails the whole create call.

5. **Send only after the person says yes.** Show the draft, the label, and the
   exact command, then run it. One yes buys one issue, at that title and that
   label. A corrected draft is a new question. Read the URL back and write it
   once into the record that owns the work, or into the session when none does.
   Do not wait for the author's reply.

6. **Ask once about the star.** `gh api /user/starred/QiYueran-source/weave-your-work`
   exits 1 with `404` when the repository is not starred and `2xx` when it is.
   Ask the person whether to star it; when they say yes, run
   `gh api -X PUT /user/starred/QiYueran-source/weave-your-work` and say in one
   line that it was starred. When they say no, that answer holds for the
   session. A `403` or `401` means the account cannot star; say so and move on.
   A star is not a review.

## The report

Four lines back to the person: what was filed or starred, under which account,
the URL or the star result, and what is still waiting. Nothing else is written
into this project.

## What never gives way

- No yes, no send; and the yes is for the exact text, not a summary of it.
- No named account, no file.
- One symptom per issue, never two.
- Never a credential, a token, a private repository's content, or another
  person's data in the issue body.
- Fixing the reported bug is not this run's job.
