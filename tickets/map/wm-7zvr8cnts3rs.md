---
schema: 1
id: wm-7zvr8cnts3rs
title: 'Grill skill: discuss and clarify'
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T16:48:15Z
updated_at: 2026-11-08T13:25:22Z
parent: wm-qhd3twqjzhma
soft_links:
  - wm-25b3q7mg88c7
---
## Target

Design the grill skill: discuss an idea, question or proposal with the owner until it is clear, and land the three artifacts grill owns as it happens — glossary terms, testimonies, and ADRs. Map decisions and new tasks are landed by the calling skill. Modeled on matt's grill-with-docs.

Why: new ideas and open questions do not arrive as fog; without a discussion skill they either stall or get lost.

## Acceptance direction

All children are complete and no further children are needed.

Review point: Read the entry against the method and the record. The entry points at both, names the three branch maps, and restates neither the method's rules nor a branch's landing rule. Each branch's delivered file exists and installs with `npx skills add` when it is a skill.

## Decisions so far

- ~~grill is a peer skill under Execution, level with map/task/glossary (user confirmed).~~ Superseded on 2026-11-08: grill is the parent skill; testimony, glossary, and ADR hang under it as its branches (user confirmed). The parent relation says each branch refines grill's target; it does not by itself settle how a branch is invoked.
- An ADR skill is added as the third branch (user confirmed on 2026-11-08). Its design is [ADR skill](tickets/map/wm-fptggp5yhf8s.md).
- The grill skill has three files: `SKILL.md` (entry and contract), `how-to-grill.md` (the method: question tree, askable set, rounds, facts, hand off), and `testimony.md` (the record) (user confirmed on 2026-11-08).
- Method terms: `refine` (question tree), `hand off` (question to work), `split` (target tree). The grill uses the first two; the split skill owns the third (user confirmed on 2026-11-08).
- Fact rule: a fact the agent can check is the agent's; a fact only a person knows is asked; a fact nobody knows becomes an assumption or a probe. The person may not be the decider; "ask X" is a wait, not a forced decision (decided in this design on 2026-11-08).
- Delivery shape (user confirmed on 2026-11-08): testimony is a reference file at `weave-your-work/grill/testimony.md`; glossary and ADR are independent skills at `weave-your-work/glossary/` and `weave-your-work/adr/`. The tree's parent relation is design refinement, not directory nesting.
- Landing split (follows the delivery shape, user confirmed on 2026-11-08): grill owns when an artifact is written and the output contract; each branch owns how its artifact is written. Grill's `SKILL.md` points at the branch and does not restate its landing rule.
- ask-me only routes; grill owns the discussion (user confirmed).
- grill is both a low-level conversation ability called by fog-explore/split/review and a standalone entry (user confirmed).
- grill lands three artifacts itself: glossary terms, testimonies, and ADRs. ~~It owns the landing rules for those three.~~ Superseded on 2026-11-08: it owns when each artifact is written and the output contract; each branch owns the landing rule. Everything else — map decisions, split results, task creation — is landed by the skill that called grill: the caller references grill, receives its clear conclusions, terms, testimonies, and ADRs, and writes them into its own ticket (user confirmed, revising the earlier "grill lands map decisions and task creation" wording).
- Discussion protocol: prefer the harness's built-in choice feature for questions with selectable options; when no choice feature exists, fall back to the grilling protocol (one round covers the whole frontier, numbered questions with recommended answers) (user confirmed).
- Grill's output contract: grill returns clear conclusions, the testimony path, the glossary and ADR artifacts, and the work to hand off; the calling skill lands the conclusions itself. When a calling skill needs grill is that skill's own design, not grill's (user confirmed; the hand-off was added on 2026-11-08).
- Glossary landing: a term is written to the operator's `glossary/<operator>.jsonl` source the moment it resolves during the discussion, one term at a time, not batched (user confirmed; the source file is the glossary branch's decision).
- ~~Testimony landing: the testimony is written in real time as the grill advances, and edited as the discussion progresses; other tickets cite it only after the grill closes (user confirmed).~~ Revised on 2026-11-08: the testimony is updated once per round — the question tree is rewritten and the discussion is appended; other tickets cite it only after the grill closes (user confirmed).
- ADR landing: an ADR is written only when the decision is hard to reverse, surprising without context, and a real trade-off — all three; otherwise the decision goes to the caller's Decisions so far (user confirmed).

## Not yet specified

- ~~The exact landing rules grill owns for glossary, weave logs, and ADRs: when each artifact is written, in what form.~~
  Resolved: a term is written the moment it resolves; the testimony is written and edited in real time; an ADR needs all three gates (see Decisions so far).
- ~~Its interface with split and review (fog-explore's interface is settled: fog-explore calls grill to discuss fog).~~
  Resolved: when to call grill is defined by each calling skill (fog-explore, split, review), not by grill.
- ~~Decision to make: whether each branch ships as its own installed skill or as a reference file inside the grill skill. Why it matters: a separate skill is independently invocable and can be reached by other skills; a reference file is reachable only through grill.~~
  Resolved on 2026-11-08: testimony is a reference file; glossary and ADR are independent skills (see Decisions so far).
- ~~Decision to make: whether the glossary branch covers the whole glossary subsystem — per-operator JSONL sources, MCP lookup, merge, and the generated view — or only term landing during a grill. Why it matters: lookup and merge are used outside a grill, so the narrower reading leaves part of the glossary skill outside this branch.~~
  Moved on 2026-11-08 to [Glossary skill](tickets/map/wm-rq3exm0m5563.md); that branch owns its own scope.
- ~~Decision to make: whether the landing rules stay in grill or move to the branch that owns the artifact. Why it matters: a rule kept in two places drifts, and a branch whose map owns no rule has nothing to design.~~
  Resolved on 2026-11-08: each branch owns how its artifact is written; grill owns when and the output contract.
- ~~Decision to make: what the ADR skill owns beyond the three gates — record format, numbering, status, and superseding. Why it matters: if it owns only the gates, the record format has no home.~~
  Moved on 2026-11-08 to [ADR skill](tickets/map/wm-fptggp5yhf8s.md); that branch owns the gates and the record format.

## Out of scope

- explore's fog resolution.
- split's child creation.
