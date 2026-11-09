---
name: fog-explore
description: "Clear a map's fog: resolve every entry in Not yet specified into a decision, a target update, an exclusion, or a hand-off to split."
---

# Fog explore

A map's `Not yet specified` section holds fog: in-scope content that is not yet specific enough to become a decision, a child, or a right to skip. This skill clears it. When no unresolved entry remains, the map's next move is a split, not another round of exploring.

The entries come from `body.md` in the map skill. Explore reads them as written and does not reclassify them.

## When it runs

The section holds an unresolved entry. That is the whole trigger.

It ends when every entry has been resolved or dropped, so no unresolved entry remains. When that happens, anything that became splittable is handed to split. The trigger, the completion check, and that hand-off belong to the map operating procedure; this file covers only the clearing.

## The skeleton

Every entry goes through the same four steps.

1. **Judge**: is the entry concrete enough to settle? An assumption someone has already tested, a fact one page can answer, a decision with no missing information — these go to step 3. The rest go to step 2.
2. **Act**: get the missing part. Research it, measure it, or talk it through. Discussion goes through grill; what a person said is written into a testimony as it happens.
3. **Land**: write the result into the map — `Decisions so far`, `Target`, `Acceptance direction`, or `Out of scope`. A part that turned out to need its own ticket is handed to split instead.
4. **Strike**: strike the entry through and add `Resolved on <date>:` saying what it became and where.

Fog that turned out to be irrelevant is deleted rather than struck through. Everything else stays visible, so a reader later can see what the map considered.

## Assumption

An assumption is a belief the map's shape rests on. It usually cannot be confirmed by a fact — "people will use this" is not something a document answers — so explore looks for support rather than proof.

Research first, the same as for a fact. Then one of three things is true:

- **Supported.** Land it in `Decisions so far` with the evidence and its source.
- **Refuted.** Do not land it as a decision. Update whatever depended on it — `Target`, `Acceptance direction`, `Out of scope` — or open new fog for what the refutation exposes. Record the counter-evidence where the update lands.
- **Neither.** No support and no refutation. Two ways forward: accept it as reasonable, which is legitimate for small consequences and should say so in the entry it becomes; or recommend a probe task, strongly when the consequence is large. A probe is a recommendation, not a requirement.

## Fact to establish

A fact is missing and someone could look it up, ask, or measure.

Research it first: locally in the repository and documents, then online. A landed fact carries its source; a fact without a source is an opinion in a fact-shaped sentence.

When neither place yields a reliable answer, ask a person. Start with the owner, through grill's question protocol. When the owner does not know either, the owner is reminded to ask whoever does — an issue, or a short message, depending on where that person is. The entry stays open until an answer arrives; it is not landed as "unknown".

## Decision to make

The owner has to choose, and the choice is not made.

When the choice is blocked on information nobody has, do not push the owner to decide anyway. Split the entry instead: an assumption form for what the decision is being guessed at, or a probe task for what would settle it. A decision made on a guess is worse than fog, because it lands as settled and nobody revisits it.

When the information is there, decide with the owner and land it in `Decisions so far`.

Explore also marks whether the decision produced something that a child ticket should carry. It marks it; it does not create the child.

## Goal to clarify

Part of the target is too vague to judge a child against.

Talk it through with the owner, then rewrite `Target` in the words the discussion settled. When the clarification moves the bar, rewrite `Acceptance direction` in the same pass — a target and an acceptance direction that disagree make the map unjudgeable.

A clarified goal updates the target. It does not become a child of its own.

## Where the landings go

| What was resolved | Where it lands |
|---|---|
| a decision the map now holds | `Decisions so far`, with a source |
| a clarified goal | `Target`, and `Acceptance direction` with it |
| something the map will not do | `Out of scope`, with the reason |
| a part that needs its own ticket | handed to split; the entry is struck through naming what was handed over |

## What explore never does

- It never creates a child. It marks the part and hands it to split; hanging the ticket is split's job.
- It never settles what a discussion decided. Grill runs the discussion; explore writes the landing.
- It never decides that something is a term. Grill decides whether a word goes into the glossary; explore records the fact as a fact.
- It never forces a decision the owner cannot make. Missing information becomes an assumption entry or a probe, not a coin flip.
- It never touches a map it does not own. Fog on someone else's map is cleared by that map's owner.
