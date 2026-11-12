---
name: open-map
description: "Write one map: settle the target through a discussion, survey it once at low resolution, and write the body with its fog and exclusions. The same action writes a root map and a child map. Use when a target has no map yet, or a parent is about to split into child maps."
family: track
invocation: user
---

# Open map

A map opened well is half of the work. This skill is the pass that opens one, and it produces the map the mainline then runs on. It is auxiliary: it is not a stage of the line, it is where the line gets its input.

## When it runs

- A project has no root map. The setup flow ends with a configured project and no target; this is what makes the first one.
- A map was retired and its sibling has to be opened. Its target differs from the one it replaces, so it is a new map, not an edit.
- A target was settled in discussion and the map for it does not exist yet.
- `split` decided a layer is child maps: it calls this skill once per child, with that child's part of the parent's target.

One map per run. A root map and a child map are the same record, so this one action writes both, and the only difference is the `--parent` argument. It does not decide how many children a layer has, or what they are: `split` decided that before calling it.

## Steps

1. **Settle the target.** The answers needed are small: the outcome as a state of the world with its `Why:` line, the acceptance direction with its review point, what is already true in the project, and what the discussion ruled out. Decisions that need a person go through `grill`.
2. **Walk the target once, using the `map` skill's fog rules.** The `map` skill decides what becomes a child, a fog entry, an exclusion, or a decision, and what an entry looks like. This step runs that walk and no rule of its own: draft the entries, show them to the owner, keep what the owner keeps. A part the walk sends to a child is not written here; it is work for a later split.
3. **Write the map.** `waymark create --category map --title "<the outcome, not the method>" --owner <name> --body-file <body> --dry-run`, then again without the flag. `--parent <map>` for a child map; a root map has none. The body is what the `map` skill requires, filled from steps 1 and 2. No `Review` and no `split_as`: the first split writes the type.

When the target turns out to be small enough for one task, or too vague to state, write nothing: report which. Deciding that the part belongs in another record is not this run's call.

## Transformation

```
before: no map for the target
after:
- the map exists, status open, with no split_as and no Review
- Target carries an outcome and a Why line
- Acceptance direction carries a Review point
- Not yet specified carries its entries, or the marker
- every part of the survey became an entry, an exclusion, or a decision; none became a child
```

## Hands off

The map is written, and that is the whole result: the action writes one record and decides nothing that comes after it. Who acts next — the person, a flow that called this action, or an automated pass that splits until nothing more can be split — is not this action's concern, and no reader of it should infer one.

The one thing a caller may do with the result is close the gap into children: a part the walk reported as work becomes a child map, or a task, through the action for that record. That is the caller's call, not a step here.

## What this skill does not do

- Decide how many children a layer has, or what type they are. `split` decides, then calls this action once per child map.
- Write a child. A root map and a child map go through this action one at a time, never in the same pass.
- Clear the fog it wrote.
- Judge the map.
- Repair a map that already exists. `update` does that.
