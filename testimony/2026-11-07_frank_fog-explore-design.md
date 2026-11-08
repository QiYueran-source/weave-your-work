# Fog-explore design discussion

Date: 2026-11-07
Operator: frank

## Context

The explore skill was first designed around fog triage: five fog classes (judgment, fact, decision, goal, action), two routes (conversation, probe task), impact ranking, assumption-ization, landing rules, and an interface with ask-me. During review the user decided the positioning was wrong: explore should only clear fog, nothing else. The old ticket was archived and a new one opened ([Fog-explore skill: clear a map's fog](../tickets/map/wm-3084re0f48z3.md)), renamed fog-explore.

This log records the design discussion of the new fog-explore skill and the alternatives that lost.

## Design decisions

### Positioning

- fog-explore's only responsibility is to clear a map's fog: take the Not yet specified items and resolve them until the section is empty.
- It never splits (no child creation), never reviews, and has no status flow of its own. Trigger, completion, and split hand-off are all owned by the map skill.

### Fog types come from the map body, not a new taxonomy

- The old design invented five classes. The new one reuses the map body format's four entry types: Assumption, Fact to establish, Decision to make, Goal to clarify, plus custom types. There is no fifth "action fog" class: something that can already be written as an action plus a verifiable result is not fog, it goes to split.

### Common skeleton

Judge, act, land, strike through:

1. Judge how concrete the entry is.
2. If not concrete enough, act: research, or discuss through grill.
3. When concrete, land it: Decisions so far, updated Target, Out of scope, or mark it splitable for split.
4. Strike the entry through in Not yet specified.

### Landing split

- explore owns the map landings: Decisions so far, Target updates, Out of scope, strike-through, splitable marks.
- grill owns the term, weave-log, and ADR landings.
- explore references grill for discussion; grill does not clear fog.

### The four clearing flows

- **Fact to establish**: research locally and online with a source. If neither yields a reliable answer, go to a person: ask the owner through grill's question protocol; if the owner does not know, remind them to ask others through an issue. Land the fact in Decisions so far with its source, strike the entry. explore records facts honestly and does not decide whether a fact is also a term; grill decides term landing.
- **Assumption**: look for support like a fact, but confirmation usually cannot come from a fact at all (example: "adding a button makes people xxx, so that xxx") — it can only be supported. If no hard support exists (e.g. it is only a particular opinion), a probe task is recommended to test it, but not mandatory: in most simple cases the assumption may be treated as reasonable to save time, and a probe is strongly suggested when the impact is large. Supported: land in Decisions so far with evidence. Refuted: update the affected Target, Acceptance direction, Out of scope, or new fog instead, recording the counter-evidence; strike the entry.
- **Decision to make**: discuss through grill. If the owner cannot decide because information is missing, do not force the decision: turn it into an Assumption fog entry or a probe task. A landed decision goes into Decisions so far, the entry is struck through, and explore marks whether it can be split; split creates the child later.
- **Goal to clarify**: clarify with the owner through grill, update the Target section, and update Acceptance direction together with Target when the acceptance standard is affected; strike the entry.

## Alternatives that lost

- Five fog classes with a separate action-fog class: rejected because it duplicated the body format's entry types and contradicted the fog definition (fog is not yet specific enough to become a child).
- Impact ranking and assumption-ization as mandatory steps before routing: rejected as the old design's weight; the new flow is per-type and direct.
- explore creating child tickets on landing: rejected; explore never splits, split does child creation.
- Landing behavior owned by grill including map decisions: initially recorded, then corrected — explore owns map decisions and fog clearing; grill owns terms, logs, and ADRs.
- A SKILL.md draft written now: deferred; the design stays in the map until the task skill is settled.

## Open follow-ups

- Split fog-explore into an implementation task once the task skill is settled (deliverable: `weave-your-work/fog-explore/SKILL.md`).
- Grill's discussion details (question protocol, term/log/ADR landing) are being designed in another session branch.
