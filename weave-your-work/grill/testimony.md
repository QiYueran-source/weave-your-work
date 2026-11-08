# Testimony

A testimony is the record of a grill: what a person said while a decision was being discussed — their answers, the ideas raised along the way, the alternatives that lost. It is written as the discussion happens.

It holds nothing else. Research findings, what an agent did during a run, and a ticket's conclusions are not testimony.

## It is not a ticket

A testimony has no waymark front matter, is not processed by waymark, and does not enter the target tree, status, frontier, or acceptance. It is a Markdown file under `testimony/` that tickets link to.

## Where it lives and what it is called

`testimony/YYYY-MM-DD_operator_topic.md`

- `YYYY-MM-DD` is the date the grill starts.
- `operator` is the project operator, or the git user name when the project has no operator.
- `topic` is a human-readable kebab-case name, not a ticket id.

Example: `testimony/2026-11-08_frank_pricing-model.md`.

## When it is written

Open the file when the grill starts, before the first question, and edit it as the discussion moves. Write the answers and the ideas that were raised, including the ones that lost.

A file written after the discussion is a summary, not a testimony. The name and the directory do not make it one.

## What it holds

There is no required structure. Write what was said in the order it was said, or group it by decision. Keep the person's answers and the alternatives that lost; those are the parts a later session cannot reconstruct.

When several tickets share one testimony, an optional `Related tickets` list at the end names them.

## How a ticket cites it

Use an ordinary Markdown relative link next to the relevant decision, fact, or fog entry:

```md
- The pricing model is usage-based. See [Testimony: pricing model](../../testimony/2026-11-08_frank_pricing-model.md).
```

Cite a testimony only after the grill closes. While the grill is running, the file is still changing.
