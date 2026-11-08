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
