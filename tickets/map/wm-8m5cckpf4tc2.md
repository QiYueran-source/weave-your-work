---
schema: 1
id: wm-8m5cckpf4tc2
title: 'Explore skills: fog exploration'
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T12:57:36Z
updated_at: 2026-11-06T13:01:50Z
parent: wm-qhd3twqjzhma
custom_fields:
  phase: exploring
---
## Target

Design the explore skill: when a map has fog (its Not yet specified list), turn fog items into testable assumptions, rank them by impact times uncertainty, route each by where the answer lives (conversation or a probe task), run the chosen route with domain-neutral methods, and land the results back into the map.

Why: a map can carry fog for a long time and never move. Explore is how fog graduates into children or gets cleared.

## Acceptance direction

All child tasks are complete and no further child task is needed: the SKILL.md exists under `weave-your-work/explore/`, and a sample map with fog can be explored end to end, with each fog item either graduated into a child, cleared, or turned into a probe.

## Notes

- Category: execution, a child map of the execution map.
- Boundary (user confirmed): ask-me handles entry routing and the generic question protocol; explore handles fog triage, the two routes, and landing; map and task reference explore.
- Triggers (user confirmed): `/map` is the primary entry and runs explore when it meets fog; `/explore` is a separate entry; automatic invocation happens when a map is exploring and its fog is non-empty.
- Probe acceptance belongs to the task skill; explore depends on it and does not define it here (user confirmed).
- Reference degree: domain-neutral methods only. A/B tests, fake-door tests, prototypes and other product-specific tools stay out.
- Answerer: the owner by default. When the owner is unsure, resolve through a remote issue first; which issues to sync back is decided in the communication category.
- Sources: .inbox/skills-ref pm-product-discovery (identify-assumptions, prioritize-assumptions, brainstorm-experiments, interview-script); .inbox/skills grilling, grill-with-docs.

## Children

(none yet)

## Decisions so far

- Two routes: conversation when the answer lives in someone's head, a probe task when it lives in reality (user confirmed).
- Pre-step: assumption-ize each fog item, rank by impact times uncertainty, test high-impact high-uncertainty ones first (user confirmed direction).
- Domain-neutral only; product-specific validation tools excluded (user confirmed).
- Answerer defaults to the owner; the owner's uncertainty is resolved through a remote issue first (user confirmed).
- explore references ask-me's question protocol; map and task reference explore (user confirmed).
- Trigger: `/map` runs explore when it meets fog; `/explore` is a separate entry; automatic invocation when a map is exploring with non-empty fog (user confirmed).
- Probe acceptance: owned by the task skill; explore depends on it (user confirmed).

## Not yet specified

- How to turn a fog item into a testable assumption, concretely, and whether a fog that cannot be written as an assumption should stay.
- The general dimensions of the impact times uncertainty ranking, and whether ranking adds map fields or stays in body text.
- The conversation route's concrete flow: what to ask and how to ask without product-specific framing.
- The probe route's concrete flow: how to design a probe, what to write, how to judge the result (acceptance itself belongs to the task skill).
- Landing rules: when to write a decision, when to graduate fog into a child, when to clear it.
- explore's interface with ask-me: when does explore hand over to the question protocol.
- explore's outputs and how to verify the skill works.

## Out of scope

- Product-specific validation toolkits (A/B tests, fake-door tests, prototypes).
- Issue triage rules (communication category).
- Probe acceptance definition (task skill).
