---
name: ask-me
description: "Pick the skill that fits the situation in front of you: a route from a target to its checked result, the branch points that interrupt it, and every other skill named where its owner is. Use when a person does not know which skill to use now."
---

# Ask me

You do not remember every skill, so ask. This file names the one to open next. It invokes nothing, reads no ticket, and writes nothing; open the skill it names and let that skill run.

It answers one question: which skill fits the situation in front of me. Whether the work is going well is a different question, and `wait-what` is what answers it.

## The route

Two steps, in order. Each step is a family entry: open it, and it routes inside its own family.

1. **`map`** — what is wanted, and when it counts as done. Its own skills are `open-a-map`, `map-review`, `fog-explore`, and `split`.
2. **`task`** — the one action that produces a result someone can check. Its own skills are `task-design`, `execute-one-task`, `execute-all`, and `task-review`.

A finished child is judged by its own family — `task-review` for a task, `map-review` for a map — and both are reached through the entry that owns them.

## Beside every step: `grill`

A discussion can be needed at any point, so `grill` is not a step on the route: something is still fuzzy — a term, a decision, an assumption nobody tested — and the discussion is what settles it. It is reachable from every step.

It writes the testimony, and it hands off the terms and decisions to the branches that own them, `glossary` and `adr`.

## Branch points

Each one opens on a state, not on a position in the route. When the state matches, open the branch; when it does not, stay on the route.

- **`setup`** — the project is not configured yet. Nothing else runs before this does.
- **`open-a-map`** — the project is configured but has no root map, or a map has to be opened to replace a retired one.
- **`fog-explore`** — a map still holds fog it has not cleared.
- **`split`** — a layer is settled and its children do not exist yet.
- **`update`** — a node other tickets already rely on has to change, so editing it in place stops being enough.
- **`handoff`** — the session ends and the work continues in another one.

## The records

Three skills write what the route produces and leave the route where it is, and a fourth says how to read and write the tracker itself.

- **`glossary`** — one name for one thing: look a term up, or sharpen a fuzzy one.
- **`adr`** — a decision a future reader cannot reconstruct from the repository.
- **`issue`** — a message to another owner on GitHub, and the decision it brings back.
- **`waymark`** — what each field means, and how to read the tree, the ready list, and the history back out of the tickets.

## Standalone

Opened for their own sake, on no route.

- **`wait-what`** — where the work stands, read off the tickets into one short table.
- **`stop-and-wait`** — read the whole project and report where two targets, a promise and its artifact, or two rules disagree.
- **`salvage-and-restart`** — the tree no longer describes the work: write down what is still usable and start again.
- **`feedback-me-please`** — a skill bug or a good experience goes upstream.
- **`use-weave-your-work-examples`** — two worked examples, for when a skill's rules are too abstract to act on.

## What this does not do

- It does not invoke a skill. The person opens the one it names.
- It does not read the tickets. What the person said is the whole input; `wait-what` is what reads state.
- It does not restate a rule. Each skill owns its own, and this file only says which one.
- It does not run a discussion. That is `grill`.
