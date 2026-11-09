# Map procedure

`body.md` says what a map says. `frontmatter.md` says which field holds what and who may write it. This file says what happens next: the steps a map goes through, who runs each one, what it hands back, and what a change to a map that has already been split does to its children.

## The life of a map

```
open          a target, written and discussed, with no children yet
in_progress   from the first split until a verdict lands
closed        the review passed, or the direction failed
```

Three steps run inside those states:

```
open       → explore    while Not yet specified is not empty
open       → split      when a layer is settled; the first split starts the map
in_progress→ split      again, as later layers settle
in_progress→ review     when every child is closed and no fog is left
```

`reviewing` is not a status. Waymark has three, and a map under review stays `in_progress` until the verdict lands.

## Creating one

```
waymark create --category map --title "<the target>" --owner <name> \
  --parent <map> --body-file <the body>
```

A root map has no `--parent`. A new map is `open`, has no children, and says as much of its body as the discussion settled: `Target` with its `Why`, and `Acceptance direction` with the default clause and a review point.

Nothing else is required of it at this point. A map that is created and then left alone for a week is in a normal state, not a broken one.

## Explore

Runs while `Not yet specified` is not empty. `fog-explore` clears it: every entry becomes a decision, a target update, an exclusion, a hand-off to split, or nothing.

Discussion inside that clearing goes through `grill`. Explore calls it; it does not replace it.

Explore is done when the section is empty, and says so in the body. Explore never creates children, so a map can be fully explored and still have nothing under it.

## Split

Runs when a layer is settled. `split` calls `grill` to settle what the layer holds, then asks one question: can one complete execution action and one clearly auditable standard be written for each part? Yes sends the parts to tasks, no to child maps.

The first split does two things beyond hanging children:

```
waymark start <map>                    # open → in_progress
waymark field update <map> --set split_as=submap   # or task
```

Every later split adds children of that same type. The map's body is not edited by a split, because it holds no list of children.

## The loop

`in_progress` is not one step. It is a loop, and a map stays in it while layers are added:

```
in_progress ──split──▶ new children
     ▲                     │
     └── a layer settles ──┘
```

A map may split again whenever a layer is settled: when fog that was cleared produced a layer, or when a child closed and showed what comes next. The map does not leave `in_progress` between splits, and how many splits it takes is not fixed when it starts.

The children that are maps are split the same way, one level down. The far end of the loop is a layer of tasks: a task is a leaf, it does not split, and nothing below it changes the map's status.

The type stays the one the map's first split wrote. A map that split into child maps adds child maps; a map that split into tasks adds tasks. Different maps in one tree choose differently, and that is the only place the choice varies.

## Review

Runs when every child is closed and `Not yet specified` is empty.

A map with no children is not reviewed. A target that needs no refinement is a task, not a map: the split skill prefers a task, and a map whose verdict has nothing behind it could be closed without any work having been done.

`map-review` reads the map, its children, and the rules, and returns one verdict. Because a map has no `Review` section, the verdict is written as the status:

| Verdict | What is written |
|---|---|
| passed | `waymark close <map>` |
| needs changes | the gap goes into `Decisions so far`; the map stays `in_progress` and is reviewed again after the fix |
| needs discussion | the map stays `in_progress` and the question goes to `grill` |
| wrong direction | `outcome=failed`, then `waymark close`; the owner opens the sibling that replaces it and the two are soft-linked |

A child reopened while the review is running voids it. The verdict was being read against a tree that no longer exists; review again once that child closes.

## After the verdict

A closed map is a claim: this target was reached, and this is what reaching it consisted of. Anyone reading the tree later takes it at face value, so a verdict that no longer holds is worse than no verdict.

That is why a failed map is left closed and replaced rather than quietly edited: the record of the attempt stays, and the sibling says what replaced it.

## Changing a map

What a change costs depends on how far the map has gone.

| State | What a change is |
|---|---|
| `open`, no children | a plain edit. `waymark body replace`, and nothing else moves: no child has been written against the text yet |
| `in_progress` | a change to its children, in the five steps below. The update skill owns what it does to the nodes that rely on the map |
| `closed` | the update skill's business. Its second disposition reopens the map and revises it; its third retires it and opens the replacement |

From the first split on, a map's children are what its target means, so editing the target is not a one-file edit. The change runs in this order:

1. **Reopen the map first.** A closed map that is being changed goes back to `in_progress` with the update skill's second disposition, before anything else.
2. **Change what the map says.** `Target`, `Acceptance direction`, or `Decisions so far`, in the words the discussion settled.
3. **Revise the affected branches in the same run.** Every child whose meaning depends on the changed sentence is adjusted, closed or not. A child that never referred to it is left alone.
4. **Deal with the closed descendants.** A closed child's verdict was given against the old content. It is either reopened for a new review or retired and replaced. Leaving it closed puts a "passed" mark on work that no longer answers the question.
5. **Review the map again** once the branches are settled.

Who may write what is in `frontmatter.md`. What each change does to a node other people rely on — the three dispositions, the order, the issue for a foreign owner — is the update skill. This file only says when a change reaches it, and what has to be true before one starts.

## Who runs a step

The map's owner. Any of these steps can be run by an agent working for the owner, but the owner is the one who decides the map is explored, settled, or ready for review, and the one who owns the verdict.

A child closing is not something the procedure controls. After each close, the owner's question is one sentence long: does this map still need another child? If yes, split again when the layer is settled. If no, review.

## What this file does not do

- Define a body section or an entry format. That is `body.md`.
- Define a field, a custom field, or a dependency edge. That is `frontmatter.md`.
- Clear fog, split, or accept a map. Those are `fog-explore`, `split`, and `map-review`.
- Say what a change does to the nodes that depend on it. That is the update skill.
