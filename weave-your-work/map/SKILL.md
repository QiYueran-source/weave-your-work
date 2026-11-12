---
name: map
description: "The reference for a map record: the six body sections, the fog forms, the three states, and the two review axes. Read it before writing, changing, or judging a map."
family: track
invocation: model
---

# Map

A map is a target: what a team wants, why it is worth having, and how someone else confirms it was reached. This skill is the reference for the record; the actions that write it are `open-map`, `split`, `fog-explore`, `update`, and the review is `map-review`.

Read it before writing a map, changing one, or judging one. It defines; it does not run.

## What is here

| File | Defines |
|---|---|
| `res/body.md` | the six sections, the fog forms, and the three states |
| `res/review.md` | the two review axes, the four verdicts, and the `## Review` shape |

The field rules are `waymark/res/fields.md`; where a map sits in the tree, and what a dependency means, are `waymark/res/relations.md`.

Fog is defined here, in `res/body.md`: what becomes an entry, how the walk decides, and where a cleared entry lands. `open-map` runs the walk when it writes a map, and `fog-explore` writes to those landings when it clears one; neither carries a copy of the rule.

## What this skill does not do

- Open or change a map. The actions do that.
- Judge a map. `map-review` does that, reading `res/review.md`.
- Define a field. `waymark` does.
