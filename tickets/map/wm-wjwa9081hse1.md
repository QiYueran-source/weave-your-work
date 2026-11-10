---
schema: 1
id: wm-wjwa9081hse1
title: 'Work-weave: general team collaboration skill set'
category: map
status: in_progress
owner: frank
creator: frank
created_at: 2026-11-06T09:12:59Z
updated_at: 2026-11-10T15:23:16Z
custom_fields:
  split_as: submap
---
## Target

Form an installable skill set for general team collaboration under weave-your-work, using waymark as the single tracker and carrying goal, task, claim, and acceptance through one chain. Ownership is clear: one owner per item, the owner advances and accepts. It suits any domain and is not limited to software development.

Why: it is the shared path from a goal to an accepted result; without it, each project invents its own, and the evidence stays in conversation instead of the tracker.

## Acceptance direction

The set is accepted when every skill the sub-maps name is delivered under `weave-your-work/`, installs with `npx skills add`, and one end-to-end run over the whole set has been done.

That run is one batch, not one per map: write the worked example each effort needs under `use-weave-your-work-examples/`, walk every skill's paths in it, and apply whatever the walk shows is wrong. A map is judged on the deliverable its own acceptance direction names; whether a reader can walk the set is judged here, once.

Review point: each skill named by a sub-map has a `SKILL.md` under `weave-your-work/` and passes `scripts/check-skills.mjs`; a clean install lists the whole set; the batch record under this map names the example walk and the changes it forced.

## Decisions so far

- The root map is an index: design decisions live in each sub-map, and the structure is read from each child's `parent`, not from a list in this body. (agent decision, recorded from the earlier Notes)
- Design references: the matt skill set (`.inbox/skills`), reference skills (`.inbox/skills-ref`), and design notes (`.inbox/work-methods/`). (source note)
- The design adopts the key findings in `.inbox/work-methods/general-methods.md`: name uncertainty explicitly, move judgment away from the executor, externalize conclusions into artifacts others can read. The question protocol is the primitive; the three gaps are irreversibility, decision authority placement, and ungrillable questions that need probes. (source note)
- Delivery shape: a skill set under weave-your-work, one map per category (user confirmed).
- Category split: entry/environment/execution/communication, one map per category (user confirmed).
- Skill layer: a category's children are skill maps, and a skill's function details become tasks under its skill map (user confirmed).
- Ownership model: one owner per item, owner advances and accepts; no executor field (user confirmed).
- Task types: delivery and probe, with a reversibility marker; details reference skills-ref later (user confirmed).
- Acceptance: judged by the owner against signals agreed in advance, distinguishing done/not done/cannot judge. The non-executor rule is dropped (user confirmed).
- ~~ask-me is one whole skill, covering the question protocol, decision records, and glossary (user confirmed).~~ Superseded on 2026-11-10: ask-me covers none of the three. It routes; `grill` owns the protocol, `adr` the records, `glossary` the terms. (user confirmed, 2026-11-10)
- Worked examples and the end-to-end test of every skill happen in one batch, once the skill set is whole. No skill carries a per-skill functional test. ~~each one records the paths it has not exercised in its own gap list, and those lists are the input to that batch.~~ Superseded on 2026-11-10: the per-skill gap lists were merged into one [Gaps](../../docs/gaps.md) file under `docs/` when the worked examples that held them were deleted. That file is the batch's input. A path left unexercised today is deferred, not closed. (user confirmed; amended 2026-11-10)
- ~~Skill invocation has one test: a skill is model-invocable only when another skill reaches it mid-run, or when its trigger is a state the run has to notice for itself. Every other skill is user-invoked, which loads no description into context.~~ Superseded on 2026-11-09: the test does not hold. Entry skills are reached by runs too, and a skill that another skill must load cannot be kept out of the model's reach; the classification produced references that could not be followed. (user confirmed, 2026-11-09)
- ~~Five skills are user-invoked. `execute-all` and `execute-one-task`, because each spends a run of unspecified size and writes real files. `task`, because it is the entry name a person types and no skill calls it. `issue`, because a filed issue is sent under the operator's GitHub account and cannot be recalled. `use-weave-your-work-examples`, because no skill calls it and its description is the longest in the set, spent on examples a person opens deliberately; its content is revised later, and this entry settles only how it is invoked.~~ Superseded on 2026-11-09: same reason as the test above. (user confirmed, 2026-11-09)
- Skill invocation is not classified: every skill is model-invocable, and the one action that must not start by accident, a batch, says so in its own text. (user confirmed, 2026-11-09)
- The body carries no children index. The `Sub-maps` list was removed on 2026-11-10 because `map/body.md` forbids one; the children are read from `parent` with `waymark tree`. (user confirmed, 2026-11-10)
- Three maintenance skills hang directly under this root map rather than under a new category map: stop-and-wait, salvage-and-restart, and feedback-me-please. (user confirmed, 2026-11-10)
- The root map is started and carries `split_as: submap`: it has held children since 2026-11-06 while still `open`, so its status and field did not match its tree. (user confirmed, 2026-11-10)
- ~~Three session-level skills hang under one child map rather than one each: `chief-of-staff` to advance a whole map, `handoff`, and `wait-what`.~~ Superseded on 2026-11-10: `chief-of-staff` was dropped as redundant with `execute-all`, so two skills hang under that map, which is now closed. See [Session skills](wm-s4tvr121g3tv.md). (user confirmed, 2026-11-10)
- A map is advanced by `execute-all` and `execute-one-task`, not by a session-level skill of its own. (user confirmed, 2026-11-10)
- The entry skill `ask-me` landed as a router: it names the skill that fits the situation and invokes nothing. Its main route is `map` then `task`, `grill` sits beside every step, and five branch points open on a state. It carries no question protocol — `grill` owns every discussion, which supersedes the root decision that ask-me would cover one. (user confirmed, 2026-11-10)
- Two of Matt's session skills joined the set: `handoff` and `wait-what`. `wait-what` was rewritten rather than ported — it stops the work and reports the state in a fixed table instead of re-pitching the last message. (user confirmed, 2026-11-10)

## Not yet specified

- ~~Dependencies between skills: how ask-me routes to execution and communication skills.~~ Resolved on 2026-11-10: [Entry skill](wm-8wzzh4hp5evp.md) settled it. ask-me routes to the family entry, not to a skill, and each family entry routes inside its own family.
- Which map maintains the shared glossary, and which file it lives in.
- Installation and distribution: reference matt's skill configuration mechanism, optional.
- Number of acceptance scenarios and eval prompts, and how passing is judged. The batch that does the worked examples is where this gets answered: it walks every skill's paths and reports what had to change.
- ~~Whether the local comment category stays.~~ Resolved 2026-11-09 in the execution map: the category is removed, because the issue skill uses `comment` for a message category. See [Execution skills: map, task, glossary, and explore](wm-qhd3twqjzhma.md).
- ~~Skills that may join each category later (retro, handoff, and so on); not this round.~~ Resolved on 2026-11-10: `handoff` and `wait-what` are taken up by [Session skills](wm-s4tvr121g3tv.md); `retro` is dropped, because its only caller was `chief-of-staff` and `chief-of-staff` does not come in.
- A skill that reads testimonies to reconstruct how a layer was cut and what was considered before it settled.
  Why it matters: the split's plan log has no reader today; such a skill would give it one and would notice when the log is missing.

## Out of scope

- Software-specific workflows (TDD, code review, and so on).
- The full issue triage state machine (if ever, a communication-category later design).
- External connectors and automatic sync.
