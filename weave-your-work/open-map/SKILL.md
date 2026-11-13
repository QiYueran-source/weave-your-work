---
name: open-map
description: "Write one map: turn the target it is given into a body with its fog and exclusions, and record where the target came from. The same action writes a root map and a child map. Use when a target is settled and has no map yet, or when a split is writing child maps."
family: track
invocation: model
---

# Open map

A map is a target written down: what the team wants, why, how someone else confirms it, and what is still unclear underneath it. This action writes one record per run; it does not decide how many maps a layer has or which type the layer is. The target it writes came in with the call, from the parent map's decision or from a `grill-and-records` run.

## When it runs

- A project has no root map, and a target was settled in discussion. This is the first map.
- `split` decided a layer is child maps, and calls this action once per child, with that child's part of the parent's target and the decision it came from.
- A map was retired and its replacement has a target that differs from the one it replaces; it is a new map, not an edit.

One map per run. A root map and a child map are the same record, and the only difference is the parent it hangs under.

## Steps

1. **Take the target.** It comes from the parent map's `Decisions so far` when a split sends it, or from a `grill-and-records` run when a person settles it. State it as an outcome and record where it came from; a target nobody agreed to is not this action's to invent.
2. **Walk the target once**, by `map/res/body.md`'s walk: each part becomes a child, a fog entry, an exclusion, or a decision. What cannot be stated precisely yet becomes a fog entry; a part that needs its own record is left for `split` and is not written here.
3. **Write the body** as `map/res/body.md` requires: `Target` with its `Why:` line, `Acceptance direction` with its `Review point:`, `Decisions so far`, `Not yet specified`, `Out of scope` when something was ruled out. No `Review`: a review writes that after the children close.
4. **Create the record.** `waymark create --category map --title "<the outcome, not the method>" --owner <name> --parent <map> --body-file <body> --dry-run`, then again without the flag. A root map passes no `--parent`.

When the target turns out to be small enough for one task, or too vague to state, write nothing: report which. Whether the part belongs in another record is not this run's call.

The map exists, and `map/res/body.md` says what it holds; the file this action wrote is that record, not a copy of the rule.

## Hands off

The map is written, and that is the whole result. `split` writes `split_as` and starts the map when it first splits it; the map is judged by `map-review` once its children close; a change after that is `update`.

## What this skill does not do

- Decide whether the target deserves a map; a person does.
