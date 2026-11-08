---
schema: 1
id: wm-7zvr8cnts3rs
title: 'Grill skill: discuss and clarify'
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T16:48:15Z
updated_at: 2026-11-08T10:44:30Z
parent: wm-qhd3twqjzhma
soft_links:
  - wm-25b3q7mg88c7
---
## Target

Design the grill skill: discuss an idea, question or proposal with the owner until it is clear, and land the three artifacts grill owns as it happens — glossary terms, testimonies, and ADRs. Map decisions and new tasks are landed by the calling skill. Modeled on matt's grill-with-docs.

Why: new ideas and open questions do not arrive as fog; without a discussion skill they either stall or get lost.

## Acceptance direction

The grill `SKILL.md` exists under `weave-your-work/grill/`.

All children are complete and no further children are needed.

Review point: Read the grill `SKILL.md` against its three branch maps. It names the three artifacts and points at the branch that owns each; every landing rule it states is the branch's own. Each branch's delivered file exists and installs with `npx skills add` when it is a skill.

## Decisions so far

- ~~grill is a peer skill under Execution, level with map/task/glossary (user confirmed).~~ Superseded on 2026-11-08: grill is the parent skill; testimony, glossary, and ADR hang under it as its branches (user confirmed). The parent relation says each branch refines grill's target; it does not by itself settle how a branch is invoked.
- An ADR skill is added as the third branch (user confirmed on 2026-11-08). Its design is [ADR skill](tickets/map/wm-fptggp5yhf8s.md).
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
- Decision to make: whether each branch ships as its own installed skill or as a reference file inside the grill skill. Why it matters: a separate skill is independently invocable and can be reached by other skills; a reference file is reachable only through grill.
- Decision to make: whether the glossary branch covers the whole glossary subsystem — per-operator JSONL sources, MCP lookup, merge, and the generated view — or only term landing during a grill. Why it matters: lookup and merge are used outside a grill, so the narrower reading leaves part of the glossary skill outside this branch.
- Decision to make: whether the landing rules stay in grill or move to the branch that owns the artifact. Why it matters: a rule kept in two places drifts, and a branch whose map owns no rule has nothing to design.
- Decision to make: what the ADR skill owns beyond the three gates — record format, numbering, status, and superseding. Why it matters: if it owns only the gates, the record format has no home.

## Out of scope

- explore's fog resolution.
- split's child creation.
