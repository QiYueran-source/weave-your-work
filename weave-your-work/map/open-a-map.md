# Open a map

A map opened well is half of the work. This file is the pass that opens one: the discussion that settles the target, the pass over the target that finds what can be split now and what is still fog, and the two writes that leave a map ready for its first split.

It uses two rules it does not restate: what a map body says, and when fog is written. Both are in `body.md`. The fields and the commands are in `frontmatter.md` and `procedure.md`. Reopening a map that was already split, or closed, belongs to `update`.

## When it runs

- **A project has no root map.** Setup ends with a configured project and no target for it; this is what makes the first one. `start-a-project.md` names it as the last step.
- **A map that has no children was retired and replaced.** The sibling that replaces a failed or obsolete map is opened by this pass, because its target differs from the one it replaces.
- **A project already carries work.** The documents, notes, and finished pieces are the scene the first map is opened on: what exists goes into `Decisions so far` and the opening of `Target`, so the first split can decide what continues and what does not.

It does not run for a child map. `split` opens those, and passes each one through the same pass.

## The four steps

The target is settled before the target is surveyed, and the ticket is written after both, because the survey changes what the body says.

### 1. Settle the target

Ask one question large enough to hold the work, and ask it through `grill`: the map skill's `open-a-map` is a caller of grill, and grill owns the question protocol. The answer this step needs is small:

- The outcome, stated as a state of the world, with its `Why:` line.
- The acceptance direction, with its review point: what a reviewer looks at, in checkable items.
- What is already true. A project that carries work states which of it counts toward this target; a project without it says so. This is the part that keeps an existing scene from being rebuilt.
- What is out of scope, when the discussion ruled something out.

Do not grill this deep. `split` is the measure of the round: it runs on a layer whose fog is resolved, so the round is deep enough when the survey can hand almost every part either to a child or to an entry. This step stops at the point where the survey in step 2 can tell a part's next move. A map that reaches step 4 with an acceptance direction and no open entry is a round that grilled past what opening needs.

When the acceptance direction cannot be written, stop. The map is not opened yet: the target is a goal to clarify, and that goes on the ticket that owns the discussion, or back to the person as a question. `body.md` requires both sections from creation.

### 2. Survey the target

Cover the whole target once, at low resolution, rather than drilling into one thread. Do this with the person in the room, in the same round as step 1; this is what the AI drafts and the person corrects.

For each part of the target, ask where its next move is:

| The part | Where it goes |
|---|---|
| the next move is clear: one action and a checkable result | a child, in the same pass as the map |
| in scope, and the question cannot be stated precisely yet | an entry in `Not yet specified`, under the `body.md` rule |
| beyond the target as `Target` and `Acceptance direction` state it | `Out of scope`, with the reason |
| already settled | `Decisions so far`, with its source |

Draft the entries first and show them to the person: the pass is the AI's, the call is theirs. Write the entries they keep and drop the ones they rule out. Do not pre-slice an entry into the shape of a child; if it already names each part separately, it is a child that has not been hung yet.

The survey ends when another question would repeat one already answered. When it finds no child and no entry, stop: report that the target is small enough to be a task, or that it is still too vague, and write nothing. Children alone are a fine outcome of the pass, and so are children with entries behind them; an empty map is not.

### 3. Write the map

```
waymark create --category map --title "<the target's outcome, not the method>" --owner <name> \
  --body-file <the body> --dry-run
```

A root map has no `--parent`. Read the dry-run, then run it again without the flag. The body is the one `body.md` defines, and it is written from what steps 1 and 2 settled: `Target` with its `Why`, `Acceptance direction` with its review point, `Decisions so far` for what the survey settled, `Not yet specified` with its entries or the marker, `Out of scope` for what the survey ruled out. There is no `Review` and no `split_as`; the first split writes the type.

### 4. Write the children

The children found in step 2 are hung now, in the body pass the `split` skill defines: `task.md` when the next move is one action and a checkable result, `submap.md` when it is not. A child map goes through this same pass, so its fog is written before its ticket exists. Then read the shape back with `waymark tree --root <map>`.

Hanging children here and hanging them from the first split is the same act. The difference is the order of the two writes, not which skill owns them: `split` carries the rule, and a run that opens a map runs that rule for the children it found while opening it.

## After opening

The map is `open` with its children. Its next step is its first split for the layer that is left, or `fog-explore` for the entries that block one.

A newly opened map changes one thing in the project besides the tickets: if the project already had files that the map now cites, no file moves. Keeping the existing work, or replacing it, is what the first child tasks say.

## What this file does not do

- Decide whether a layer splits or what a child contains. That is `split`.
- Clear the fog it wrote. That is `fog-explore`.
- Review the map it opened. That is `map-review`.
- Reopen, repair, or move a map that already exists. That is `update`, or `salvage-and-restart` when the whole tree has stopped describing the work.
- Write fog under a rule of its own. It calls the one in `body.md`.
