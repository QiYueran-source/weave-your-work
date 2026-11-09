---
name: map
description: "Write a map and run it: the target a team works toward, what its body and fields hold, and which skill moves it to its next step."
---

# Map

A map is a target. It answers "what do I want", it can hold children that refine it, and it is accepted when its acceptance direction holds. Every target node is a map; the root is the one with no parent.

This is the entry to the map skill. It says what a map is and sends you to the file that answers your question. `usage.md` gives the reading path; `bundle/setup.md` installs the work-record rule. Once installed, `.agents/rules/rules-map.md` governs when map work must be recorded.

## The three references

| Question | File |
|---|---|
| What does a map body say, section by section? | `body.md` |
| What do the fields mean, and who may write which one? | `frontmatter.md` |
| How does a map move from a stated target to a closed ticket? | `procedure.md` |

`body.md` holds the five sections and the fog entry forms. `frontmatter.md` holds the custom fields, the dependency rules, and the list an accepting party checks. `procedure.md` holds the states, the steps, and what changing a split map does to its children.

## The steps are other skills

A map's steps are run by skills that sit beside this one. This entry names them; each one describes itself.

- `fog-explore` clears the entries in `Not yet specified`.
- `split` turns a settled layer into child maps or tasks, and makes the map `in_progress`.
- `map-review` accepts the map or sends it back.
- `update` changes a map that is already split or already closed, and the nodes that rely on it.
- `grill` is the discussion method the first two call when a decision needs a person.

## When to open this skill

You are writing a new map, reading one someone else wrote, or deciding what to do next with one. If the question is "what do I write in this section", open `body.md`. If it is "what happens next", open `procedure.md`.

## What a map is not

A map is not a task. A task ends at a result one person can hand over and someone else can check; a map states a target and is accepted when its children are complete. When a target can be checked directly and needs no refinement, it is a task, and `task-design` is the skill to write it with.

A map is not a plan either. Sequence lives on dependency edges, and the body carries no dates, phases, or order.

## What this skill does not do

- Define a body section or a fog entry. That is `body.md`.
- Define a field, a custom field, or a dependency edge. That is `frontmatter.md`.
- Say what step comes next. That is `procedure.md`.
- Clear fog, split, accept, or update. Those are the skills named above.
