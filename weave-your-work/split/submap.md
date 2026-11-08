# Submap reference

How a settled layer becomes child maps.

A layer splits into child maps when a part cannot be written as one action with one clearly auditable standard, or when it holds several independent directions that need their own owner. The criterion that sent it here lives in `SKILL.md`.

## The child body

Write each child body against `body.md` and keep it to what the discussion settled:

- `Target` is required, with its `Why` line. A child with no `Why` is a title, not a goal.
- `Acceptance direction` takes the default clause and a review point, unless the discussion produced a specific result the child can be checked against.
- `Not yet specified` is written when the part still carries fog. When the discussion settled everything, say so explicitly: `(none; the fog is cleared)`.
- `Decisions so far` and `Out of scope` are written when the discussion produced something for them, and left out when it did not.

There is no minimum size. A child map that holds one target and one review point is a complete child map.

## Where a child's content comes from

From the parent's settled decisions and its clarified `Target`. There is no one-to-one mapping between the two: several decisions may feed one child, and one decision may feed several, as long as the child does not drift from the parent.

What a child does not carry:

- The parent's `Decisions so far`. A child records what its own discussion settled. When it needs a parent decision, it links that decision rather than restating it.
- The parent's `Out of scope`. A child's exclusions are the ones its own discussion decided.

A child that would conflict with its parent or with a sibling is not written as it stands: the conflict is merged, adjusted, or taken back to the owner before the ticket exists.

## Writing them

At the map's first split, record the child type on the map itself:

```
waymark field update <map> --set split_as=submap
```

Then create every child before reading anything back:

```
waymark create --category map --title "<the child's target>" --owner <parent owner> \
  --parent <map> \
  --body-file <the child body>
```

Finally read the shape back:

```
waymark tree --root <map>
```

The parent's body is not edited. It holds no children list, so the split leaves the parent's ticket byte-identical, and its owner is never asked to open it.

Once `split_as` is `submap`, every later child of that map is a child map too. A part that needs to be a task opens a sibling map instead.

## The one-child split

A layer may split into a single child when that child is a pure refinement of the parent: the same target, stated more specifically, with a bar a reviewer can check. Fanning out is not the goal; being able to write the next level is.

## Going back to grill

Two things send the part back instead of producing a ticket:

- the discussion cannot state the child's `Target` in a sentence,
- it cannot say what is still unknown in the child, so `Not yet specified` would have to be invented.

A child written from either one carries a goal nobody agreed to, and its own acceptance will fail later with no one to ask.

## What this reference does not do

- Choose between child maps and tasks. That is `SKILL.md`.
- Define a body section. That is `body.md`.
- Clear the fog a child carries. That is explore, after the split.
- Decide a child's content. That is the grill discussion.
