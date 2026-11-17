---
schema: 1
id: wm-h7479mtnyr4v
title: 'to-tickets: cut whole tasks, and say what a finished one leaves behind'
category: ticket
status: closed
owner: frank
creator: frank
created_at: 2026-11-17T09:52:25Z
updated_at: 2026-11-17T09:53:22Z
closed_at: 2026-11-17T09:53:22Z
---
Part of wm-b89wddd29gzk

## What to do

Someone cutting a spec with this skill gets a list of tasks, each of which is
whole: finishing it means something is done, not started. The cutting rule is a
pair of errors that mirror each other. A task that only prepares for another is
folded into the task it prepares for. A task that holds two complete tasks is cut
again. A ceiling bounds the size: one context window, or one stretch of a
person's time.

Every task is worked by one arranger, a person or an agent, never both. A task
needing a person becomes its own task however small. The arranger is marked on
the record with the `needs_human` field, and the skill says which tasks set it.

Every task ends with a result, and the skill says what that is: one or two lines
naming what was left behind, in a form a later reader can point at, written when
the task is finished. For a task done by hand this is the only trace there is.

## Acceptance criteria

- [ ] The cutting instruction names both errors: a task that only prepares for
      another is folded in; a task holding two complete tasks is cut again.
- [ ] The cutting instruction states wholeness as the floor and one context
      window, or one stretch of a person's time, as the ceiling.
- [ ] The instruction says every task is worked by one arranger, a person or an
      agent, never both, and that a task needing a person is its own task however
      small.
- [ ] The instruction names the `needs_human` field, says it is false by default,
      and says a task for a person sets it true.
- [ ] The instruction says every task ends with a result: one or two lines naming
      what was left behind, pointable by a later reader.
- [ ] The instruction says the result is written when the task is finished, and
      that a task done by hand is invisible without it.
- [ ] Nothing in the skill uses the words vertical slice, tracer bullet,
      prefactor, wide refactor, expand, contract, call site, or CI.
