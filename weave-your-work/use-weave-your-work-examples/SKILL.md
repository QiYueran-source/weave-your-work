---
name: use-weave-your-work-examples
description: "Two worked examples of the set in use: a chemistry lab and a shop's restock list, each taken from a map through its split, its task runs, and its reviews. Use when a skill's rules are too abstract to act on and a page written earlier is easier to follow."
family: method
invocation: user
---

# Use weave-your-work examples

Two worked examples of the method in use. Both are fictional and self-contained: each carries its own waymark project, its tickets, and a page that reads the run back.

## The two examples

- `chemistry-research/` walks the task skills and one `grill-and-records` run: a map, a split, one task run, a batch, and the reviews. It also carries a production grill and a map lifecycle audit. It is the record of a 2026-11-08 walk, so its map headings predate the current body reference. Start at its `README.md`; for a map in the current shape, read `data-analysis/`.
- `data-analysis/` runs a shop's restock list end to end in its own project: map, grill, both split types, a dependency edge, the task run, all three update dispositions, and the map reviews. The run was unattended, so its grill records accepted recommendations. Start at its `README.md`.

Each directory holds its pages, the waymark project its tickets live in, and whatever the run produced. Paths inside a directory are relative to it.

## Read them when

- you are about to write a map and want to see a complete one: `data-analysis/`;
- you are unsure whether a part of a layer should be a child map or a task;
- you want to see a fog entry arrive as a child;
- you want to see the design, run, batch, and review paths together;
- you want to see `grill-and-records` turn a decision into a testimony, a glossary term, and an ADR;
- you are changing a closed record and want to see which of the three dispositions fits.

## What this skill does not do

- Define a record. `waymark` does.
- Run an example. Each is a record of a run that happened, not a script.
