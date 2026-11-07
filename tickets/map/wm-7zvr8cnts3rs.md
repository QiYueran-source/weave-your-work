---
schema: 1
id: wm-7zvr8cnts3rs
title: 'Grill skill: discuss and clarify'
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T16:48:15Z
updated_at: 2026-11-07T16:21:59Z
parent: wm-qhd3twqjzhma
soft_links:
  - wm-25b3q7mg88c7
  - wm-rq3exm0m5563
---
## Target

Design the grill skill: discuss an idea, question or proposal with the owner until it is clear, and land the three artifacts grill owns as it happens — glossary terms, testimonies, and ADRs. Map decisions and new tasks are landed by the calling skill. Modeled on matt's grill-with-docs.

Why: new ideas and open questions do not arrive as fog; without a discussion skill they either stall or get lost.

## Acceptance direction

The SKILL.md exists under `weave-your-work/grill/`; a sample discussion produces at least one landed term and one landed testimony, and an ADR when a decision passes the three gates.

## Children

(none yet)

## Decisions so far

- grill is a peer skill under Execution, level with map/task/glossary (user confirmed).
- ask-me only routes; grill owns the discussion (user confirmed).
- grill is both a low-level conversation ability called by explore/split/review and a standalone entry (user confirmed).
- grill lands three artifacts itself: glossary terms, testimonies, and ADRs, and it owns the landing rules for those three. Everything else — map decisions, split results, task creation — is landed by the skill that called grill: the caller references grill, receives its clear conclusions, terms, testimonies, and ADRs, and writes them into its own ticket (user confirmed, revising the earlier "grill lands map decisions and task creation" wording).
- Discussion protocol: prefer the harness's built-in choice feature for questions with selectable options; when no choice feature exists, fall back to the grilling protocol (one round covers the whole frontier, numbered questions with recommended answers) (user confirmed).
- Grill's output contract: grill returns clear conclusions plus the glossary, testimony, and ADR artifacts to the calling skill, and the calling skill lands the conclusions itself. When a calling skill needs grill is that skill's own design, not grill's (user confirmed).
- Glossary landing: a term is written to GLOSSARY.md the moment it resolves during the discussion, one term at a time, not batched (user confirmed).
- Testimony landing: the testimony is written in real time as the grill advances, and edited as the discussion progresses; other tickets cite it only after the grill closes (user confirmed).
- ADR landing: an ADR is written only when the decision is hard to reverse, surprising without context, and a real trade-off — all three; otherwise the decision goes to the caller's Decisions so far (user confirmed).

## Not yet specified

- ~~The exact landing rules grill owns for glossary, weave logs, and ADRs: when each artifact is written, in what form.~~
  Resolved: a term is written the moment it resolves; the testimony is written and edited in real time; an ADR needs all three gates (see Decisions so far).
- ~~Its interface with split and review (explore's interface is settled: explore calls grill to discuss fog).~~
  Resolved: when to call grill is defined by each calling skill (explore, split, review), not by grill.

## Out of scope

- explore's fog resolution.
- split's child creation.
