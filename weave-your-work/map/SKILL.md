---
name: map
description: "Write a map and run it: the target a team works toward, what its body and fields hold, and which skill moves it to its next step."
---

# Map

A map is a target. It answers "what do I want", it can hold children that refine it, and it is accepted when its acceptance direction holds. Every target node is a map; the root is the one with no parent.

The fields a map carries are the waymark skill's `fields.md`. This skill says what a map is and how it moves.

This is the entry to the map skill. It says what a map is and sends you to the file that answers your question. `usage.md` gives the reading path; `bundle/setup.md` installs the work-record rule. Once installed, `.agents/rules/rules-map.md` governs when map work must be recorded.

## The references

| Question | File |
|---|---|
| What does a map body say, section by section, and when is fog written? | `body.md` |
| Where does a map sit in the tree, and what orders it? | `placement.md` |
| How does a map move from a stated target to a closed ticket? | `procedure.md` |
| What does the pass that opens a map do? | `open-a-map.md` |

`body.md` holds the six sections, the fog entry forms, and the single rule for when a map's fog is written. The waymark skill's `fields.md` holds the fields, who may write each one, and the list an accepting party checks. `procedure.md` holds the states, the steps, and what changing a split map does to its children.

## The steps are other skills

A map's steps are run by skills that sit beside this one. This entry names them; each one describes itself.

- `open-a-map` is the pass that opens a map: it settles the target, surveys it, and writes the map and the children the survey found. It is `open-a-map.md` in this directory, and `procedure.md` carries the rule it follows.
- `fog-explore` clears the entries in `Not yet specified`.
- `split` turns a settled layer into child maps or tasks, and makes the map `in_progress`.
- `map-review` accepts the map or sends it back.
- `update` changes a map that is already split or already closed, and the nodes that rely on it.
- `grill` is the discussion method the other skills call when a decision needs a person, including the target `open-a-map` settles.

## When to open this skill

You are writing a new map, reading one someone else wrote, or deciding what to do next with one. If the question is "what do I write in this section", open `body.md`. If it is "what happens next", open `procedure.md`.

## What a map is not

A map is not a task. A task ends at a result one person can hand over and someone else can check; a map states a target and is accepted when its children are complete. When a target can be checked directly and needs no refinement, it is a task, and `task-design` is the skill to write it with.

A map is not a plan either. Sequence lives on dependency edges, and the body carries no dates, phases, or order.

## What this skill does not do

- Define a body section or a fog entry. That is `body.md`.
- Run the pass that opens a map. That is `open-a-map.md`.
- Define a field, a custom field, or a dependency edge. Those are the waymark skill's `fields.md` and `placement.md`.
- Say what step comes next. That is `procedure.md`.
- Say what a field means. That is the waymark skill's `fields.md`.
- Clear fog, split, accept, or update. Those are the skills named above.
