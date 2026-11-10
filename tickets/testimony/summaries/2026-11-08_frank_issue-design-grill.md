# Issue design grill

Date: 2026-11-08
Operator: frank

## Context

The first issue skill draft was delivered and closed without the owner reading it. The owner moved it to `.inbox/issue/` and restarted the design with a grill. The design tree starts from what a communicate issue is, what lands locally, how it is delivered, how people are addressed, and only then the form.

## Round 1

### What an issue is

The platform issue on GitHub or Gitee stays the base. The skill may need a **communicate issue**: a specific format that keeps these issues apart from the others.

### What lands locally

An important issue is written back locally: someone asks for a ticket to be handed over, or objects to the experiment design; the owner finds the objection valid and has to change the current map or task.

### Delivery

The owner wants a hook or listener: after someone files an issue, an `@...` identifies who it is for, and the information is inserted when that person starts a new session.

### Handles

The owner asked what `handle.toml` is; the roster file the first draft added is new to him.

### Form

To be discussed after the marker and the listener.

## Open

- What marks a communicate issue.
- Whether "important" means only an accepted change to a map or task.
- What runs the listener and how the next session receives the queue.
- Whether a handle roster is wanted.
- The issue's form.

## Round 2

### Handles

The roster can record other people, not only the operator: `frank = ...`, `hanjiang = ...`. It is meant to cover the case where the operator and the git user differ; the owner asked whether that difference should be ignored.

### Communicate issue

A communicate issue is a normal GitHub issue used for communication, marked in a way like `fm`; it is not a separate physical entity.

### What is important

The test is whether the issue affects something local. The owner pointed at matt's triage for comparison.

### Listener

The owner asked whether GitHub has a hook for this and wants the technical options explored.

### Ownership

The listener is part of the issue skill, not a separate skill.

## Round 3

### The marker

The communicate issue is marked by YAML frontmatter at the top of the body, not a label or a title prefix.

### The importance test

Confirmed: an issue lands locally when it produces a local artifact — an accepted change to a map or task, or a rejection recorded in `Out of scope`.

### The listener

The owner wants a long connection and a trigger, not periodic polling.

### Handles

Confirmed: a team table with a reverse lookup; when the operator, the git user, and the issue author differ, the author is ignored and the ticket and sender in the body identify the sender.

## Round 4

### Frontmatter

`to` can address several people, and `tickets` can list several tickets. The body's `@` mention is still the platform notification.

### Relay

smee.io is the chosen relay for now.

### Session injection

The owner asked what the rule-plus-queue mechanism means; it needs a plain explanation before it can be accepted.

### Body

Confirmed: the frontmatter carries the machine fields and the body still opens with `@handle`.

## Round 5

### Multiple recipients

One issue can address several people; each `to` gets a queue entry; the thread is shared; the title carries the first ticket.

### The relay reference

The smee setup is a reference in the issue skill (`smee-setup.md`), and the setup skill points at it.

### The pending queue

The queue lives in a separate directory, configured in `handles.toml` as `[pending].path`, defaulting to `../pending/pending-communications.md`; it is gitignored.
