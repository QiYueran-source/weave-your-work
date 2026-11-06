---
schema: 1
id: wm-8m5cckpf4tc2
title: 'Explore skills: fog exploration'
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T12:57:36Z
updated_at: 2026-11-06T13:49:33Z
parent: wm-qhd3twqjzhma
custom_fields:
  phase: exploring
---
## Target

Design the explore skill: when a map has fog (its Not yet specified list), triage each item into one of five classes, turn judgment fog into goal or requirement assumptions, rank them by impact, route the chosen ones by where the answer lives, run the route with domain-neutral methods, and land the results back into the map.

Explore clarifies goals and requirements (the destination). It does not test feasibility or implementation; those belong to tasks.

Why: a map can carry fog for a long time and never move. Explore is how fog graduates into children or gets cleared.

## Acceptance direction

All child tasks are complete and no further child task is needed: the SKILL.md exists under `weave-your-work/explore/`, and a sample map with fog can be explored end to end, with each fog item either graduated into a child, cleared, or turned into a probe.

## Notes

- Category: execution, a child map of the execution map.
- Boundary (user confirmed): ask-me handles entry routing and the generic question protocol; explore handles fog triage, the routes, and landing; map and task reference explore.
- Triggers (user confirmed): `/map` is the primary entry and runs explore when it meets fog; `/explore` is a separate entry; automatic invocation happens when a map is exploring and its fog is non-empty.
- Probe design and acceptance belong to the task skill; explore depends on it and does not define it here (user confirmed).
- Reference degree: domain-neutral methods only. A/B tests, fake-door tests, prototypes and other product-specific tools stay out.
- Answerer: the owner by default. When the owner is unsure, resolve through a remote issue first; which issues to sync back is decided in the communication category.
- Sources: .inbox/skills-ref pm-product-discovery (identify-assumptions, prioritize-assumptions, brainstorm-experiments, interview-script); .inbox/skills grilling, grill-with-docs.

## Worked example

A requirement judgment fog under the map "raise click-through 10% this quarter": "Users do not click because the entrance is hard to find, not because the content is unappealing."

1. Assumption: we believe the main cause is the entrance; if the cause is actually content, the rework direction is wrong.
2. Impact: high, because a wrong direction puts the whole target at risk.
3. Route: the answer lives partly in people's heads and partly in data. Ask what happened last time the entrance changed, check click tracking, then hand a probe task to the task skill if the evidence is weak.
4. Landing: write the confirmed or refuted cause into Decisions so far. If confirmed, open a child map for the entrance rework. If refuted, change direction.

## Children

- [Define the exploration skill](tickets/task/wm-dxz6qcg4aamx.md): write the explore SKILL.md and walk one fog of each class through the steps.

## Decisions so far

- Two routes: conversation when the answer lives in someone's head, a probe task when it lives in reality (user confirmed).
- Fog classes: judgment fog goes through assumption-ization, impact ranking and the routes; fact fog is researched directly; decision fog is put to the owner; goal fog goes back to the Target section; action fog graduates straight into a child (user confirmed).
- Only judgment fog becomes an assumption, written as a goal or requirement assumption plus the consequence if it is wrong. The assumption never covers the implementation path or its effects; those belong to the task skill. Ranking uses the impact of the assumption being wrong on the target, not uncertainty (user confirmed).
- map states the expected outcome or requirement and does not cover feasibility or implementation; task carries implementation (user confirmed, recorded in GLOSSARY).
- Domain-neutral only; product-specific validation tools excluded (user confirmed).
- Answerer defaults to the owner; the owner's uncertainty is resolved through a remote issue first (user confirmed).
- explore references ask-me's question protocol; map and task reference explore (user confirmed).
- Trigger: `/map` runs explore when it meets fog; `/explore` is a separate entry; automatic invocation when a map is exploring with non-empty fog (user confirmed).
- Landing: a graduated fog item is struck through, not deleted, and its child ticket is created; an irrelevant fog item is deleted; a decision goes to Decisions so far; a \"not doing\" item goes to Out of scope; a term goes to GLOSSARY; a major decision becomes an ADR (user confirmed).

## Not yet specified

- The conversation route's concrete flow: what to ask and how to ask without product-specific framing.
- explore's interface with ask-me: when does explore hand over to the question protocol.

## Out of scope

- Product-specific validation toolkits (A/B tests, fake-door tests, prototypes).
- Issue triage rules (communication category).
- Probe design and acceptance (task skill).
- Verification details (the Define the exploration skill task).
