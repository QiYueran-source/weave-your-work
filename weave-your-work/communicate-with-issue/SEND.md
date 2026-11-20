# Send a message

One act. When it ends, the issue exists on GitHub, assigned to the owner it is for.

The message's shape is `COMMUNICATE-ISSUE-FORMAT.md`. This file is the run that writes one.

## 1. Pick the recipient

The recipient is an owner in the roster, `.work-weave/issue/handles.toml`. It is the one table that turns an owner into a GitHub login and a login into an owner; do not keep a second one.

Read the owner's login from `[handles]`. If the person has not named a recipient, ask which owner it is for.

## 2. Name the records

Every id in `tickets` must name a spec or a ticket that exists. Read each one.

The first is the main record: the title carries it, and the answer lands there. Pick the record whose subject the message is about, not the one that happens to be open.

## 3. Write the front matter

Three fields, and no others:

```yaml
---
kind: communicate
category: request
tickets:
  - <main record id>
---
```

`category` is `request` when the message asks for work or a decision, `result` when it reports an outcome, `comment` when it adds information.

## 4. Write the title and the body

Title: `[<main record id>] <the point>`. The point is what the message asks for, in the person's words.

Body: open with the ask, in one or two sentences, then name the records it is about. Do not put a sender name or a recipient name in the body. The opener and the assignee say who is who.

## 5. Open the issue

```sh
gh issue create \
  --title "[<main record id>] <the point>" \
  --assignee <recipient login> \
  --body-file <the issue text>
```

Use `--body-file` with a file holding the front matter and the body together, not an inline `--body`: the text carries newlines and quotes.

An issue whose title already carries the main record id and is still open is that thread. Reply in it instead of opening a second one.

## 6. Confirm it exists

```sh
gh issue view <number> \
  --json number,title,assignees,author,state
```

Check four things: the state is `OPEN`, the author is the account you are signed in as, the assignee is the recipient login, and the title carries the main record id. If the assignee is missing, add it with `gh issue edit <number> --add-assignee <recipient login>` and check again.

The act is done when the issue is open and assigned. The recipient has the notification already; nothing else has to be sent.

## Failures

- **The recipient is not in the roster.** Stop and say so. Do not guess a login, and do not fall back to a name typed into the body.
- **The recipient has no login in the roster,** or the login resolves to no GitHub account. Say which owner and which login failed, and ask the person which one is right.
- **The recipient cannot be assigned** because they have no access to the repository. Do not open a message they cannot receive. Say that, and let the person decide: add their access, or send to another owner.
- **A record id in `tickets` names nothing.** Stop before opening the issue. A message whose main record does not exist has no place for the answer to land.
- **The issue is created without the front matter.** Edit the body before doing anything else: a message without `kind: communicate` is not a message.

## What this file does not do

- Wait for the answer, or close the issue. The sender opens the thread; the sender closes it later, after reading the answer.
- Send to more than one owner. A message for several people is several messages.
