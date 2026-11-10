---
schema: 1
id: wm-8wzzh4hp5evp
title: 'Entry skill: ask-me routes a person to the skill that fits'
category: map
status: closed
owner: frank
creator: frank
created_at: 2026-11-06T09:24:07Z
updated_at: 2026-11-10T07:50:01Z
closed_at: 2026-11-10T07:50:01Z
parent: wm-wjwa9081hse1
soft_links:
  - wm-bhxcbv4j8fyd
custom_fields:
  split_as: task
---
## Destination

Design the ask-me skill: a person does not know which skill to use now, and ask-me names the entry to open. It is shaped after matt's `ask-matt` — one main flow with the branch points beside it, not a flat table of skills. It routes and stops: it indexes the other skills and invokes nothing itself.

## Notes

- Category: entry. Answers "which skill do I use now".
- Trigger: a person who does not know which skill fits the situation in front of them.
- Delivery location: weave-your-work/ask-me/ (directory already created by the user).
- Source: .agents/matt-skills/ask-matt (the flow shape).

## Acceptance direction

Default clause. Review point: open `weave-your-work/ask-me/SKILL.md` alone; every skill it names exists under `weave-your-work/`, every skill in the set is reachable from it in one hop, it restates no rule from a skill it names, and it names no file this project does not have.

## Decisions so far

- ask-me is one whole skill, not part of the environment category, with its own map (user confirmed).
- ask-me is shaped after matt's `ask-matt` (user confirmed, 2026-11-10).
- The trigger is a person who does not know which skill to use now. The answer is the next skill to open, not a description of the whole set (user confirmed, 2026-11-10).
- ask-me only routes. It indexes the other skills and names the entry to open; it does not invoke a skill, run a discussion, or write a ticket itself (user confirmed, 2026-11-10).
- `grill` owns every discussion. ask-me sends a person to grill and does not carry a second question protocol (user confirmed, 2026-11-10).
- The family entries keep their own routing. `map`, `task`, `setup`, and `issue` answer within their family; ask-me sends a person to the family entry, and the family entry sends them on (user confirmed, 2026-11-10).
- Delivery shape: one `SKILL.md`, a main flow with the branch points beside it. No second document (user confirmed, 2026-11-10).
- The main route is `map` then `task`. `grill` is not a step on it: it is reachable from any step, because a discussion can be needed at any point (user confirmed, 2026-11-10).
- Five branch points sit beside the route: `setup`, `fog-explore`, `split`, `update`, and `handoff` (user confirmed, 2026-11-10).
- Routing reads what the person said, never the ticket store. Reading the state is `wait-what`, a different skill (user confirmed, 2026-11-10).
- ~~The question protocol borrows matt's add (decision records) and glossary (domain-modeling) (user confirmed).~~ Superseded on 2026-11-10: ask-me carries no question protocol. `grill` owns the discussion, `glossary` owns terms, and `adr` owns decision records. (user confirmed, 2026-11-10)
- A skill that only sits under another skill is not on the main route and gets no branch point; ask-me names it where its owner is named. (agent decision, 2026-11-10)

## Not yet specified

(none; the fog is cleared)

## Out of scope

- Software-specific workflows (TDD, code review, and so on).
- Issue triage state machine (communication category, not this round).
- The question protocol, glossary terms, and decision records: those belong to `grill`, `glossary`, and `adr`.
- Reading the project's state to route: that is `wait-what`.

## Review

passed

- Goal: the review point asks that every skill ask-me names exists under `weave-your-work/`, every skill in the set is reachable from it in one hop, it restates no rule from a skill it names, and it names no file this project does not have. All four ran: the 21 skills besides `ask-me` are each named in `SKILL.md`, every backticked name resolves to a directory that exists, a grep for `waymark`, `acceptance clause`, `Default clause`, and `frontmatter` found nothing, and `npx skills add ./weave-your-work/ask-me` installed it without a skip.
- Convention: `split_as` is `task` and the one child is a task, closed by `task-review` with both axes evidenced. The body holds no children index. `Not yet specified` is empty, so the map was reviewed with no fog left. `waymark validate` reports no findings.
