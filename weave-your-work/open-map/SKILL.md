---
name: open-map
description: "Open a map for a target that has none: settle the target through a discussion, survey it once at low resolution, write the map with its fog and exclusions, and hand the settled layer to split. Use when a project has no root map, or a target has no map yet."
family: track
invocation: user
---

# Open map

A map opened well is half of the work. This skill is the pass that opens one, and it produces the map the mainline then runs on. It is auxiliary: it is not a stage of the line, it is where the line gets its input.

## When it runs

- A project has no root map. The setup flow ends with a configured project and no target; this is what makes the first one.
- A map was retired and its sibling has to be opened. Its target differs from the one it replaces, so it is a new map, not an edit.
- A target was settled in discussion and the map for it does not exist yet.

It does not open a child of a map that is being split: `split` does that, passing each child through the same questions.

## Steps

1. **Settle the target.** The answers needed are small: the outcome as a state of the world with its `Why:` line, the acceptance direction with its review point, what is already true in the project, and what the discussion ruled out. Decisions that need a person go through `grill`.
2. **Survey the target once, at low resolution.** Walk the whole target rather than drilling into one thread. For each part, ask where its next move is:

   | The part | Where it goes |
   |---|---|
   | one action and a checkable result can be written for it | a child, in this same pass |
   | in scope, and the question cannot be stated precisely yet | an entry in `Not yet specified` |
   | beyond what `Target` and `Acceptance direction` state | `Out of scope`, with the reason |
   | already settled | `Decisions so far`, with its source |

   Draft the fog entries and show them to the owner: the pass is the agent's, the call is theirs. Do not pre-slice an entry into the shape of a child.
3. **Write the map.** `waymark create --category map --title "<the outcome, not the method>" --owner <name> --body-file <body> --dry-run`, then again without the flag. A root map has no `--parent`. The body is what the `map` skill requires, filled from steps 1 and 2. No `Review` and no `split_as`: the first split writes the type.
4. **Hand the layer to `split`**, which writes the children and starts the map. Read the shape back with `waymark tree --root <map>`.

When step 2 finds neither a child nor an entry, write nothing: report that the target is small enough to be a task, or still too vague to state, and say which.

## Transformation

```
before: no map for the target
after:
- the map exists, status open, with no split_as and no Review
- Target carries an outcome and a Why line
- Acceptance direction carries a Review point
- Not yet specified carries its entries, or the marker
- every part of the survey became a child, an entry, an exclusion, or a decision
```

## Hands off

- `split` for the layer the survey found.
- `fog-explore` when an open entry blocks the next layer.
- `grill` for anything the target is blocked on.

## What this skill does not do

- Decide what a child contains: `split` does, and it answers to `grill` when the layer is not settled.
- Clear the fog it wrote.
- Judge the map.
- Repair a map that already exists. `update` does that.
