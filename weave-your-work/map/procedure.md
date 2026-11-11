# Map procedure

`body.md` says what a map says. `placement.md` says where it sits in the tree. The waymark skill's `fields.md` says which field holds what and who may write it. This file says what happens next: the steps a map goes through, who runs each one, what it hands back, and what a change to a map that has already been split does to its children.

## The life of a map

```
open          a new target before its first split, or work reopened by update
in_progress   from the first split, or resumed after reopening, until a verdict lands
closed        the review passed, or the direction failed
```

Three steps run inside those states:

```
open       → explore    while an open entry blocks the split
open       → split      when a layer is settled; the first split starts the map
in_progress→ split      again, as later layers settle
in_progress→ review     when every child is closed, no fog is left, and coverage is ready to check
```

`reviewing` is not a status. Waymark has three, and a map under review stays `in_progress` until the verdict lands.

## Creating one

The pass itself — the questions it asks, the survey that finds the children and the fog, and the order of the writes — is `open-a-map.md`. What follows is the lifecycle rule it obeys.

```
waymark create --category map --title "<the target>" --owner <name> \
  --parent <map> --body-file <the body>
```

A root map has no `--parent`. A new map is `open` and has no children yet. It carries `Target` with its `Why`, `Acceptance direction` with a review point, and `Not yet specified` with its entries or the marker, all settled by the pass that opened it. A map that is created and then left alone for a week is in a normal state, not a broken one.

Opening is one pass, and `open-a-map.md` runs it: settle the target, survey it at low resolution in the same round, and write the map once the survey is done. The fog rule it obeys is in `body.md`. A survey that finds neither a child nor an entry does not produce a map at all: report that the target is small enough to be a task, or still too vague to state, and write nothing.

## Explore

Runs while an open entry remains in `Not yet specified` and the map cannot be split without it. `fog-explore` clears it: every entry becomes a decision, a target update, an exclusion, a hand-off to split, or nothing.

Discussion inside that clearing goes through `grill`. Explore calls it; it does not replace it.

Explore is done when no open entry remains: every entry is struck through as resolved or deleted, and the body shows it. Explore never creates children, so a map can be fully explored and still have nothing under it. Explore also writes no new entries: fog arrives when a map is opened or through `update`, and explore clears it.

## Split

Runs when a layer is settled. `split` calls `grill` to settle what the layer holds, then asks one question: can one complete execution action and one clearly auditable standard be written for each part? Yes sends the parts to tasks, no to child maps.

Each child map is opened by the same pass as its parent, and `split` writes the child's `Not yet specified` under the rule in `body.md` before the child ticket exists. The parent's own body is not touched: its fog was resolved at the pass that opened it, and a part still open at the parent is handed to `fog-explore` rather than carried down. The pass starts the map and writes its child type; `split` carries both, under the field rules in the waymark skill's `fields.md`.

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

A map may split again whenever a layer is settled: when a child closed and showed what comes next. The map does not leave `in_progress` between splits, and how many splits it takes is not fixed when it starts.

Keep the entire acceptance direction on the map. Completed and planned task layers together cover it; uncovered unclear work stays visible as fog. Planned work is not evidence, and uncovered acceptance prevents early review.

The children that are maps are split the same way, one level down. The far end of the loop is a layer of tasks: a task is a leaf, it does not split, and nothing below it changes the map's status.

The type stays the one the map's first split wrote. A map that split into child maps adds child maps; a map that split into tasks adds tasks. Different maps in one tree choose differently, and that is the only place the choice varies.

## Review

Runs when every child and dependency is closed, `Not yet specified` has no unresolved fog, and the acceptance direction has no known uncovered work. Check required dependency outputs, including failed blockers, as `placement.md` directs. Known ambiguous standards go to `fog-explore` before review; a gap first discovered during review receives the appropriate verdict.

A map with no children can be reviewed, and the review is where the absence is explained. One outcome closes it without work having been done: the map was opened with nothing to deliver. The other is a finding, because the split skill prefers a task and the map should not have been opened. Either way the review reads the absence rather than closing the ticket quietly; `map-review` names the verdict.

`map-review` reads the map, its children, deliverables, and the rules. It writes each verdict and evidence for both axes in `Review`; status remains the lifecycle state:

| Verdict | What is written |
|---|---|
| passed | `waymark close <map>` |
| needs changes | the map stays `in_progress`; repair the gap as `map-review` directs, then review again |
| needs discussion | the map stays `in_progress` and the recorded question goes to `grill` |
| wrong direction | `outcome=failed`, then `waymark close`; the owner opens the sibling that replaces it and the two are soft-linked |

A child reopened while the review is running voids it. Review again once that child closes. If status and Review disagree, the owner rechecks children and evidence before the appropriate state change; changed evidence requires a fresh review. Do not infer a pass from status alone.

## After the verdict

A closed map records either a passed target or a failed attempt. A passed verdict that no longer holds must be invalidated, so readers do not mistake it for current evidence.

That is why a failed map is left closed and replaced rather than quietly edited: the record of the attempt stays, and the sibling says what replaced it.

## Changing a map

What a change costs depends on how far the map has gone.

| State | What a change is |
|---|---|
| `open`, no children | a plain edit. `waymark body replace`; no child has been written against the text yet |
| `open`, with children | use the update skill; the map already has work that relies on it |
| `in_progress` | use the update skill and check affected branches before changing the map |
| `closed` | use the update skill to test whether the verdict still holds; reopen only when its disposition requires it, or retire and replace if the subject changed |

From the first split on, a map's children are what its target means, so editing the target is not a one-file edit. Follow the update skill:

1. **Scan the relations.** Read the map, its children and descendants, its parent, dependency edges, soft links, and references. Determine which tickets rely on the changed content.
2. **Apply the two tests to each affected node.** Ask whether it still answers the same question, then whether its recorded verdict still holds. A closed node does not reopen merely because an ancestor changed; its own verdict must fail the test.
3. **Use the matching disposition.** Edit when the verdict holds; strike the old content, reopen, and review again when the subject is the same but the verdict fails; retire and replace when the subject changed. For an affected open child, update its content without inventing a prior verdict.
4. **Respect ownership.** Work through nodes this run owns; hand foreign-owned changes to their owners as the update skill directs.
5. **Review reopened maps** after their affected branches are settled. Do not reopen an ancestor whose own acceptance still holds.

A change to `Not yet specified` is an update too, even though nothing waits on it. Fog has two directions: a target change can leave an entry that no longer holds, and a change can expose what is in scope and still not sharp. The first is struck and superseded like other content; the second is a new entry, which `update` writes under the `body.md` rule. An entry is never edited to mean something else without a mark.

The waymark skill's `fields.md` defines who may write which fields. The update skill owns the impact scan, the two tests, the three dispositions, and cross-owner hand-off. This procedure only identifies the state that calls for update.

## Who runs a step

The map's owner. Any of these steps can be run by an agent working for the owner, but the owner is the one who decides the map is explored, settled, or ready for review, and the one who owns the verdict.

A child closing is not something the procedure controls. After each close, the owner's question is one sentence long: does this map still need another child? If yes, split again when the layer is settled. If no, review.

## What this file does not do

- Define a body section or an entry format. That is `body.md`.
- Define a field, a custom field, or a dependency edge. Those are the waymark skill's `fields.md` and `placement.md`.
- Clear fog, split, or accept a map. Those are `fog-explore`, `split`, and `map-review`.
- Say what a change does to the nodes that depend on it. That is the update skill.
