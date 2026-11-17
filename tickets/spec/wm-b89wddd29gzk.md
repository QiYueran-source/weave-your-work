---
schema: 1
id: wm-b89wddd29gzk
title: 'to-tickets: whole tasks, one arranger per ticket, a result to point at'
category: spec
status: open
owner: frank
creator: frank
created_at: 2026-11-17T09:50:42Z
updated_at: 2026-11-17T09:50:42Z
---
## Problem Statement

`to-tickets` is the second of Matt's skills copied without edit, and it is the
one that does not survive the move at all.

Its central idea is a **vertical slice**: a narrow cut through every layer of a
codebase, schema, API, UI, and tests, chosen so that no layer is left half done.
Office work has no layers. There is no schema to cut through and no UI to catch a
half-finished change, so the instruction either gets skipped or gets answered
with a shape that looks like a slice and is not one. The word it is named after,
**tracer bullet**, appears three times and means nothing once the layered thing
it aims at is gone.

The exception rule is longer than the main rule and just as code-bound. A **wide
refactor** is a change to something used everywhere, such that one edit breaks
thousands of call sites at once. It is sequenced as expand, migrate, contract,
with each batch kept green by CI. Office work has no call sites and no CI: a
change to one document does not break another one, so there is nothing for this
rule to protect against.

Two smaller instructions assume a single person writing code. The second step
looks for chances to **prefactor** the code, which means reshaping it before
changing it. The publish step writes one file per ticket under a feature
directory, or creates a sub-issue per ticket under a parent issue, and applies a
triage label. This set has one tracker, it does not build parent relations, and
its records carry their own status, so all three instructions describe a
different project.

The last gap is one Matt never had to close, because every ticket in his set is
worked by an agent. In office work a great many tasks are done by a person: going
to a site to read a label, asking a supplier a question, getting a signature.
Nothing in the skill distinguishes such a task from one an agent can do alone,
and nothing records what the person found. A ticket done by hand leaves no trace
unless the skill says to leave one.

## Solution

Keep the shape: gather context, cut the work, ask the person whether the cut is
right, publish. Replace the idea of the slice, and add the two things office work
needs that code did not.

A ticket is one **whole task**: when it is done, the thing it names can be done,
even if the thing is small. Cutting is not slicing a big task into steps. It is
cutting it into smaller tasks, each of which is complete. A ticket that only
prepares for another ticket is cut wrong. A ticket that contains two complete
tasks is also cut wrong. Both errors are named, so a reader can tell them apart.

A second rule keeps a ticket workable: it must fit one context window, or one
stretch of a person's time. This is the upper bound. The first rule is the lower
bound: whole, but small.

Every ticket is worked by one arranger, either a person or an agent, never both.
A task that needs a person is a ticket of its own, however small: reading a label
takes a minute and is still a ticket, because a mixed ticket stops every time it
reaches the half the agent cannot do.

Every ticket ends with **a result**: what was left behind, in the form a later
reader can point at. For an agent's task this is often a change someone can read.
For a person's task it is a number, a name, a decision, or a reference that makes
the finding checkable. The result is filled in when the ticket is finished, not
when it is cut.

Acceptance stays where Matt put it, as a short list inside the ticket. How a
finished ticket is checked is not decided here: checking is its own job, done by
its own skill, and a ticket that also said how to check it would be saying the
same thing twice.

## User Stories

1. As a person holding a spec, I want to cut it into tasks I can hand out, so that
   work starts on several fronts instead of one long queue.
2. As a person holding a spec, I want each task to be whole, so that finishing it
   means something was achieved rather than something was started.
3. As a person holding a spec, I want a task that only prepares for another task
   to be folded into it, so that the list is not padded with steps.
4. As a person holding a spec, I want a task that hides two complete pieces of
   work to be cut again, so that no ticket is finished halfway through something
   else.
5. As a person who will do a task, I want it sized to fit one stretch of work, so
   that I can start and finish it without handing it on.
6. As an agent picking up a task, I want it sized to fit one context window, so
   that I do not run out of room halfway and lose the thread.
7. As an agent picking up a task, I want to know at a glance whether it is mine
   to do, so that I do not start something a person must do.
8. As a person picking up a task, I want it marked as mine, so that it does not
   wait in a queue an agent is draining.
9. As a person reviewing a list of tasks, I want mixed tasks to be split, so that
   every task can be worked start to finish by whoever holds it.
10. As a person reading a finished task, I want to see what was left behind, so
    that I can point at the outcome instead of trusting the word "done".
11. As the person or agent working the next task, I want the previous task's
    result written down, so that I do not have to ask anyone what was found.
12. As a person finishing a task outside the computer, I want a place to write
    what I found, so that my work is not invisible to whoever reads the list.
13. As a person cutting tasks, I want to know a task's result when I cut it, so
    that I cut it into pieces that each leave something behind.
14. As a person ordering the work, I want to see which tasks wait for which, so
    that I can start everything that is unblocked.
15. As a person ordering the work, I want blocking to be the only relation
    between tasks, so that I do not have to reason about two kinds of order at
    once.
16. As a person reviewing the proposed cut, I want to be asked whether the size
    is right, so that I can catch a list of steps presented as tasks.
17. As a person reviewing the proposed cut, I want to be asked whether the
    blocking edges are correct, so that nothing waits for something that does not
    actually gate it.
18. As a person reviewing the proposed cut, I want to be asked whether to merge
    or split further, so that the granularity is settled before anything is
    published.
19. As a person publishing the cut, I want each task to become one record in the
    tracker, so that I can find, claim, and close it like any other record.
20. As a person publishing the cut, I want each record to name the spec it came
    from, so that a later reader can trace it back.
21. As a person reading a task, I want it to say what to do rather than what to
    build, so that the words fit work that is not software.
22. As a person reading a task, I want it to describe the finished state rather
    than a list of steps, so that whoever works it decides how to get there.
23. As a person cutting a first task that others depend on, I want to know which
    tasks are startable now, so that the work begins at the edge of what is
    unblocked.
24. As a person who took over a colleague's ticket, I want the transfer to be
    visible, so that a reader sees who answers for it now.
25. As a person reading a task months later, I want it to describe the outcome
    and not a location, so that it still reads correctly after things have moved.

## Implementation Decisions

**A ticket is one whole task.** When it is done, the thing it names can be done.
The size of the thing is free; its completeness is not.

**Two cutting errors are named, and they mirror each other.** A ticket that only
prepares for another is folded into the task it prepares for. A ticket that holds
two complete tasks is cut again. The first error makes a list of steps; the
second makes a ticket nobody can finish in one go.

**A second rule bounds the size.** A ticket fits one context window, or one
stretch of a person's time. This is the ceiling; wholeness is the floor.

**Every ticket is worked by one arranger.** A person or an agent, never both. A
task needing a person becomes its own ticket however small it is, because a mixed
ticket stops at the half the agent cannot do. The minute spent reading a label is
a ticket, not an interruption inside someone else's.

**The arranger is recorded on the record, not in the body.** A boolean field
named `needs_human`, false by default, is declared in the project configuration.
A ticket an agent can do leaves it alone. A ticket for a person sets it true.

**Every ticket ends with a result.** One or two lines saying what was left
behind, in a form a later reader can point at. The result is written when the
ticket is finished. At cutting time the section is present and empty.

**The result is what makes a hand-done task visible.** For an agent's task the
change is often readable already. For a person's task the result is the only
trace: the number, the name, the decision, or the reference that lets someone
check it.

**Acceptance stays a short list in the ticket, and checking is not part of this
skill.** The ticket says what counts as done. How a finished ticket is verified
is a separate job with a separate skill, as it is upstream.

**The body names the spec it came from.** Each ticket's body opens with the spec's
identifier on a line of its own. This set builds no parent relation between a
spec and a ticket, so the identifier in the body is the whole link.

**Blocking is the only relation between tickets.** A ticket lists the tickets that
gate it. Two tickets with no edge between them can be worked at the same time.

**The template has four parts and they keep Matt's order.** What to do, then
acceptance criteria, then the result, then blocking, with the blocking list
omitted when the edges are recorded on the record instead.

**The section is called "What to do", not "What to build".** Matt's word assumes
the output is something constructed. The work this set describes is often not.

**The text still refuses a step list.** Matt's instruction that a ticket states
the finished behaviour rather than a layer-by-layer list becomes an instruction
to state the finished state rather than the steps taken to reach it.

**Matt's cutting words are gone, not translated.** Vertical slice, tracer bullet,
prefactor, wide refactor, expand and contract all describe a codebase with layers
and call sites. Nothing is put in their place that reintroduces the metaphor.

**The two tracker branches collapse into one.** The local-file layout, the
sub-issue layout, the triage label, and the parent section all describe a
different project. One tracker, one record per ticket, no label, no parent.

**The workspace-fill case falls outside this skill.** When a ticket cannot be cut
small enough to fit, the spec is the thing that is too big, and saying so is
better than forcing a cut.

## Acceptance

The delivery is a rewritten `to-tickets`, and a reader can tell it was delivered
when every instruction in it can be carried out on work that happens outside a
computer, and when a ticket cut by it leaves a trace of what was found.

Its parts: the cutting rules are wholeness, no nesting, one arranger, and a size
ceiling; the arranger is marked on the record; the template has four parts
beginning with what to do and ending with a result; and no instruction mentions a
layer, a call site, a CI, a parent, or a label.

The reading is the check. There is nothing to run. Where the set's own rewritten
skills are the model, a reader compares them and applies the same bar.

## Out of Scope

- How a finished ticket is verified. That is a separate skill.
- Any relation between a spec and a ticket beyond the identifier in the body.
- Any field describing who checks a ticket's result.
- Nesting tasks into subtasks. The four cutting rules produce a flat list.
- Wayfinder and the handling of an effort too large to fit one spec. It is
  deferred and is specified separately.
- The other mainline skills, which follow this one.

## Further Notes

The cutting rule took three shapes before it settled. It first borrowed Matt's
vertical slice and translated the layers to "everything that must change
together". That kept the metaphor alive without the thing it named. It then
became "a deliverable that can be accepted on its own", which described the
output but not the failure: a list of steps also produces deliverables, one per
step. What settled is the pair of errors. A ticket that only prepares for another
is wrong for the same reason a ticket holding two tasks is wrong, and naming both
makes the rule checkable in either direction.

The `needs_human` field carries a known gap: a task needing a person and a task
an agent can do are the same record shape, so nothing stops a mistaken mark. The
gap is accepted because the alternative, a field recording who checks a result,
was more machinery than it bought, and because checking is out of scope here.
