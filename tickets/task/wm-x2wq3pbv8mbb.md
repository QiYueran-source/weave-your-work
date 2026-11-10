---
schema: 1
id: wm-x2wq3pbv8mbb
title: Write the ask-me skill
category: task
status: open
owner: frank
creator: frank
created_at: 2026-11-10T07:37:55Z
updated_at: 2026-11-10T07:37:55Z
parent: wm-8wzzh4hp5evp
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Write `weave-your-work/ask-me/SKILL.md`: the router a person opens when they do not know which skill fits the situation in front of them.

1. Trigger and shape: a person does not know which skill to use now; ask-me names the entry to open and stops. One file, no second document.
2. The main route: `map` then `task`. Say what each step answers — map holds the target and its acceptance, task is one checkable action — and hand off to that family's entry rather than describing the family's skills.
3. `grill` beside every step, not on the route: a discussion can be needed at any point, so it is offered from each step instead of being step one.
4. Five branch points, each with the state that triggers it: `setup` (the project is not configured), `fog-explore` (a map holds an unresolved entry), `split` (a layer is settled), `update` (a split or closed node must change), `handoff` (the session continues elsewhere).
5. Every other skill reachable in one hop: name where `map-review`, `task-review`, `execute-all`, `execute-one-task`, `glossary`, `adr`, `wait-what`, `stop-and-wait`, `salvage-and-restart`, `feedback-me-please`, and `use-weave-your-work-examples` sit, most of them under the entry that owns them.
6. Say what it does not do: it invokes nothing, reads no ticket, runs no discussion, and writes nothing. The person opens the skill it names. Reading the state is `wait-what`.
7. Front matter: `name: ask-me`, a quoted description naming the trigger, no other field.

## Acceptance signal

`weave-your-work/ask-me/SKILL.md` exists and `npx skills add` parses it without a skip. Every skill it names exists under `weave-your-work/`, and every one of the 21 delivered skills is reachable from it in one hop — checked by listing `weave-your-work/*/SKILL.md` and grepping each name out of the new file. It restates no rule from a skill it names: no acceptance clause, no field list, no command sequence. `waymark validate` reports no findings.

## Boundaries

- No change to any other skill, and no second document in `weave-your-work/ask-me/`.
- The ask-me map's own body is not edited by this task.
