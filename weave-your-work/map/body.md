# Map body

A map body says what you want and how someone else will know you got it. This file defines the six sections, what each one holds, and the shape of every entry in them. Field rules live in `frontmatter.md`. Who may write which section, and when a map moves between statuses, belongs to the operating procedure reference.

## How a body is laid out

Six sections, in the order this file lists them. Each is a `##` heading carrying the English name given here, whatever language the text under it is written in.

A section is written when it carries something. One with nothing to say is left out, never filled with a placeholder such as `TBD`. The exception is `Not yet specified`: when the fog has been settled and no entry remains, the section carries the marker `(none; the fog is cleared)` instead of being left out.

The body holds the target, decisions, unresolved content, and review evidence; operating instructions live in the procedure.

A map body holds no list of its children. The `parent` field in each child's front matter is the structure, and `waymark tree --root <id>` reads the shape back. A reader who cannot tell what a child is for from that child's own `Target` is looking at a split that was never stated, not at a missing index.

## Target

Purpose: say what should be true when the map succeeds, and why it is worth pursuing.

Format:
- One expected outcome, stated as a state of the world. Not a method, not a solution, not a list of activities.
- A `Why:` line under it: what the outcome is for, or what the absence costs. One or two sentences.
- Deliberate exclusions stay out of here; they belong in `Out of scope`.
- A map that already reads as one action still states a target a reviewer can judge. "Build the onboarding checklist" is an action; use what the checklist should achieve.

Example:

```
## Target

A new hire delivers their first independent piece of work within one week of joining, without asking a teammate which step comes next.

Why: every new hire currently waits about three weeks, and the teammate who unblocks them loses most of that time from their own work.
```

## Acceptance direction

Purpose: say how someone other than the owner confirms the target was reached.

Format:
- When completing the children is the whole test, use the default clause alone:

  ```
  All children are complete and no further children are needed.
  ```

- When the target can be checked directly, state the specific observable result instead: a state that is reached, a number that holds, a document that exists and says what.
- Follow either one with a `Review point:` line. It is required in both cases. It names what a reviewer looks at and what evidence they see, as checkable items rather than a summary of the goal.
- Keep the section short. It carries the goal; the review point carries the detail.
- Keep the full acceptance direction across successive task layers. Completed and planned layers together cover it; plans are not evidence of completion. Unclear uncovered work stays in `Not yet specified`.
- A review point that cannot be written as checkable items means the goal is not settled yet. That is fog, not a review to get through.
- "Best effort", "as good as possible", and "reasonable progress" are not results.

Example, the default:

```
## Acceptance direction

All children are complete and no further children are needed.

Review point: each role's checklist exists and is linked from the first-week plan; a new hire and a reviewer can name the step they are on without asking anyone.
```

Example, a specific result:

```
## Acceptance direction

Ten consecutive new hires report, in their first-week survey, that they knew what to do next without asking a teammate.

Review point: the survey rows for those ten hires are in the shared sheet; no row is missing, and each states whether they asked and what they asked about.
```

## Decisions so far

Purpose: record what is settled, so nobody decides it twice and children inherit it.

Format:
- One decision per bullet, written in its concrete form — the rule itself, not the topic it concerns.
- A source at the end of the entry: `(user confirmed)`, `(verified in waymark 0.1.2)`, or a link to the ticket, testimony, or message the decision came from. A decision with no source cannot be traced back when it is questioned.
- A decision that no longer holds is struck through in place and followed by `Superseded on <date>: <reason>`. The old text stays readable; what replaced it is the next bullet. The update skill owns when this happens to a node others already rely on.
- Rejected alternatives and the argument behind a decision belong in a testimony, linked from the entry. This section holds the outcome, not the discussion.
- Anything not settled is not a decision. It belongs in `Not yet specified`.

Example:

```
## Decisions so far

- Onboarding runs from one checklist per role, not one shared checklist. (user confirmed)
- The first week carries no scheduled meeting before 11:00, so the new hire has a block to read and try things. (user confirmed)
- ~~Every step names the person who approves it.~~ Superseded on 2026-03-04: most steps need no approval, and naming an approver for each one made the checklist unusable. The rule now applies only to steps that touch production data. (user confirmed)
- Each role's checklist is owned by that role, and updated by whoever last saw a step fail. (user confirmed; see testimony `wm-example`.)
```

## Not yet specified

Purpose: hold the fog — in-scope content that is not yet specific enough to become a decision, a child, or an exclusion.

Format:
- Each entry uses one of the four built-in forms below, or a custom type when none of them fits. Every form carries a second line saying what resolving the entry would change. That line is what tells a reader how much the answer matters; an entry without it is a note, not fog.
- A resolved entry stays in place, struck through, with a `Resolved on <date>:` line saying what it became and where. The history shows what the map considered before it settled.
- An entry that is struck through is resolved. A section whose entries are all struck carries no fog even though it still has content; the marker is for a section that ends with no entries.
- Fog that turned out to be irrelevant may be deleted instead of struck through.
- When the fog has been settled and no entry remains, say so: `(none; the fog is cleared)`. A section left out and a section that carries the marker mean different things, and only one of them is a state worth reporting.

### Assumption

When to use: something treated as true that nobody has established, where the map's shape depends on it being true. Confirmation usually cannot be looked up; it can only be supported, tested, or accepted as reasonable.

Format: the impact line is `If wrong`, not `Why it matters`, because the cost of an assumption is the cost of being wrong about it.

```
- Assumption: [what is believed].
  If wrong: [what target, acceptance direction, child, or exclusion would change].
```

Example:

```
- Assumption: a new hire can read the whole checklist in one morning.
  If wrong: the first week needs fewer steps, or the checklist needs a shorter first-week version.
```

### Fact to establish

When to use: a fact someone could look up, ask about, or measure, where the answer changes what the map does.

```
- Fact to establish: [the fact that is missing].
  Why it matters: [what depends on it].
```

Example:

```
- Fact to establish: how many steps in the current checklist wait on someone else's answer.
  Why it matters: if most of them do, the fix is a shorter approval path, not a better checklist.
```

### Decision to make

When to use: a choice the owner has to make, where the options are known and the choice is not.

```
- Decision to make: [what must be decided].
  Why it matters: [what depends on this decision].
```

Example:

```
- Decision to make: whether each role gets its own checklist or the roles share one with a section per role.
  Why it matters: it decides how many documents exist and who keeps them current.
```

### Goal to clarify

When to use: part of the target is too vague to judge a child against. A clarified goal updates `Target`, and updates `Acceptance direction` with it when the bar moves; it does not become a child of its own.

```
- Goal to clarify: [which part of the target is unclear].
  Why it matters: [what changes if it is clarified one way or another].
```

Example:

```
- Goal to clarify: what "independent" means — no questions at all, or no questions about which step comes next.
  Why it matters: the one-week figure is measured against that definition.
```

### Other types

The four above are the built-in types, not a closed list. A map may use another type when none of them fits, and that type may define its own fields. It still needs the line that says what resolving it would change; without that line the entry does not tell anyone what to do with it.

## Out of scope

Purpose: keep the map from growing into work nobody agreed to.

Format: bullets, each naming the item and the reason it is out. An item that might be done later is not an exclusion — it stays in `Not yet specified` until someone decides.

Example:

```
## Out of scope

- Changing the hiring bar. Onboarding starts after the offer is accepted.
- Putting the checklist into a tool. A document is enough to test whether the idea works.
```

## Review

Purpose: record the verdict and evidence for both review axes.

Write a short entry for every verdict: `passed`, `needs changes`, `needs discussion`, or `wrong direction`. Name the goal check and convention check separately, with their findings and evidence. A needs-discussion entry records the unresolved question without deciding it.

A verdict that no longer holds stays in place, struck through, with a line saying why it was invalidated. The fresh verdict is written above it.

Example after a same-subject re-review:

```markdown
## Review

passed
- Goal: the role checklists are linked from the first-week plan, as the review point requires.
- Convention: the children are all tasks, matching `split_as`; their Result and Review sections cite the delivered checklists.

~~passed~~
~~- Goal: the first-week plan links every checklist.~~
~~- Convention: all child tasks were closed.~~
Invalidated on 2026-11-09: a checklist task reopened when its link stopped working.
```

## Keeping a body short

`Target` and `Acceptance direction` are required from creation. The other sections record settled decisions, fog, exclusions, and review evidence when they exist.

## A whole map

A map as waymark stores it before review. The front matter is shown because this is the artifact a reader receives; what this file defines is the body.

```markdown
---
schema: 1
id: wm-map00000000
title: A new hire delivers independent work within one week
category: map
status: in_progress
owner: frank
creator: frank
created_at: 2026-03-01T09:00:00Z
updated_at: 2026-03-04T10:00:00Z
parent: wm-root00000000
custom_fields:
  split_as: task
---
## Target

A new hire delivers their first independent piece of work within one week of joining, without asking a teammate which step comes next.

Why: every new hire currently waits about three weeks, and the teammate who unblocks them loses most of that time from their own work.

## Acceptance direction

All children are complete and no further children are needed.

Review point: each role's checklist exists and is linked from the first-week plan; a new hire and a reviewer can name the step they are on without asking anyone.

## Decisions so far

- Onboarding runs from one checklist per role, not one shared checklist. (user confirmed)
- The first week carries no scheduled meeting before 11:00. (user confirmed)

## Not yet specified

- Assumption: a new hire can read the whole checklist in one morning.
  If wrong: the first week needs fewer steps, or the checklist needs a shorter first-week version.

## Out of scope

- Changing the hiring bar. Onboarding starts after the offer is accepted.
```

The example map carries the default clause because completing its children is the whole test. A map whose target has its own observable outcome states that result instead, whether or not it also has children.
