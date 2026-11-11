# Submap reference

How a settled layer becomes child maps.

A layer splits into child maps when a part cannot be written as one action with one clearly auditable standard, or when it holds several independent directions that need their own owner. The criterion that sent it here lives in `SKILL.md`.

## The child body

Write each child body against the map skill's `body.md` and keep it to what the discussion settled:

- `Target` is required, with its `Why` line. A child with no `Why` is a title, not a goal.
- `Acceptance direction` takes the default clause and a review point, unless the discussion produced a specific result the child can be checked against.
- `Not yet specified` is written before the ticket exists, under the rule in the map skill's `body.md`: a part of this child's own target that is in scope and still not sharp enough to act on becomes an entry, and a child with no open entry and no known uncovered work carries the marker instead.
- `Decisions so far` and `Out of scope` are written when the discussion produced something for them, and left out when it did not.

There is no minimum size. A child map that holds one target and one review point is a complete child map.

## Where a child's content comes from

From the parent's settled decisions and its clarified `Target`. There is no one-to-one mapping between the two: several decisions may feed one child, and one decision may feed several, as long as the child does not drift from the parent.

What a child does not carry:

- The parent's `Decisions so far`. A child records what its own discussion settled. When it needs a parent decision, it links that decision rather than restating it.
- The parent's `Out of scope`. A child's exclusions are the ones its own discussion decided.
- The parent's fog. The pass that opened the parent resolved it; the child's entries are its own, found by the pass that opens the child.

A child that would conflict with its parent or with a sibling is not written as it stands: the conflict is merged, adjusted, or taken back to the owner before the ticket exists.

## When the parts must run in order

Sometimes one map needs another map's output. A waiting map may still be split; the parent's edge is not copied to the children. If a child map needs the blocker's output, add an edge from that child to the blocker. Tasks carry no edges: only tasks needing unavailable input wait at execution. Load the map skill and read its `frontmatter.md` for dependency and failed-output rules.

That sequence is still two child maps, and the order is one dependency edge:

```
waymark dependency add <second child> <first child>
```

The edge goes on the later child and is the only place the order is recorded. Neither body numbers the stages or mentions the other child: an order written into prose disappears the moment someone reorders the work. The edge is added after the discussion settles the sequence, not before.

## Writing them

At the map's first split, start the map and record the child type on it:

```
waymark start <map>
waymark field update <map> --set split_as=submap
```

On later splits leave status and `split_as` unchanged. Then create every child before reading anything back:

```
waymark create --category map --title "<the child's target>" --owner <parent owner> \
  --parent <map> \
  --body-file <the child body>
```

Finally read the shape back:

```
waymark tree --root <map>
```

The parent's body is not edited. It holds no children list.

Once `split_as` is `submap`, every later child of that map is a child map too. A part that needs to be a task opens a sibling map instead.

## The one-child split

A layer may split into a single child when that child is a pure refinement of the parent: the same target, stated more specifically, with a bar a reviewer can check. Fanning out is not the goal; being able to write the next level is.

## When a part is not ready

A part that reaches neither gate — the discussion cannot state the child's `Target` in a sentence, or cannot say what is still open in it — does not become a ticket. A child written that way carries a goal nobody agreed to, and its own acceptance fails later with no one to ask.

The part goes back to the discussion rather than being written: grill it, and either it sharpens into something openable, or it becomes an entry in `Not yet specified` of the map that owns it, by the `body.md` rule. Writing the entry is not a fallback for a missing `Target`; a part whose target cannot be stated is not in scope of the layer, and the layer is not settled enough to split.

## What this reference does not do

- Choose between child maps and tasks. That is `SKILL.md`.
- Define a body section. That is the map skill's `body.md`.
- Clear the fog a child carries. That is `fog-explore`, after the split.
- Define what fog is or when it is written. That is the map skill's `body.md`.
- Decide a child's content. That is the grill discussion.
