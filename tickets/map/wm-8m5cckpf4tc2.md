---
schema: 1
id: wm-8m5cckpf4tc2
title: 'Explore skills: fog exploration'
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T12:57:36Z
updated_at: 2026-11-06T12:57:36Z
parent: wm-qhd3twqjzhma
custom_fields:
  phase: exploring
---
## Target

Design the explore skill: when a map has fog (its Not yet specified list), turn fog items into testable assumptions, rank them by impact times uncertainty, route each by where the answer lives (conversation or a probe task), run the chosen route with domain-neutral methods, and land the results back into the map.

Why: a map can carry fog for a long time and never move. Explore is how fog graduates into children or gets cleared.

## Notes

- Category: execution, a child map of the execution map.
- Boundary (user confirmed): ask-me handles entry routing and the generic question protocol; explore handles fog triage, the two routes, and landing; map and task reference explore.
- Reference degree: domain-neutral methods only. A/B tests, fake-door tests, prototypes and other product-specific tools stay out.
- Answerer: the owner by default. When the owner is unsure, resolve through a remote issue first; which issues to sync back is decided in the communication category.
- Sources: .inbox/skills-ref pm-product-discovery (identify-assumptions, prioritize-assumptions, brainstorm-experiments, interview-script); .inbox/skills grilling, grill-with-docs.

## Children

(none yet)

## Decisions so far

- Two routes: conversation when the answer lives in someone's head, a probe task when it lives in reality (user confirmed).
- Pre-step: assumption-ize each fog item, rank by impact times uncertainty, test high-impact high-uncertainty ones first (user confirmed).
- Domain-neutral only; product-specific validation tools excluded (user confirmed).
- Answerer defaults to the owner; the owner's uncertainty is resolved through a remote issue first (user confirmed).
- explore references ask-me's question protocol; map and task reference explore (user confirmed).
- Probe task: task_kind=probe and reversibility=two_way by default (user confirmed; exact field values set when the task template is designed).

## Not yet specified

- Trigger: when is explore invoked, and by whom.
- How to turn a fog item into a testable assumption, concretely.
- The general dimensions of the impact times uncertainty ranking.
- The conversation route's concrete flow: what to ask and how to ask without product-specific framing.
- The probe route's concrete flow: how to design a probe, what to write, how to judge the result.
- Probe acceptance: is a probe accepted when its question is answered regardless of the answer, and is failing to get an answer the incident.
- Landing rules: when to write a decision, when to graduate fog into a child, when to clear it.
- explore's interface with ask-me: when does explore hand over to the question protocol.
- explore's outputs and how to verify the skill works.

## Out of scope

- Product-specific validation toolkits (A/B tests, fake-door tests, prototypes).
- Issue triage rules (communication category).
