# The split

The first split turned the root into two child maps, started the root, and froze its child type as `submap`:

```
waymark start wm-wgqqvca7r5zb
waymark field update wm-wgqqvca7r5zb --set split_as=submap
```

The two children are [The restock list is computed from the export](work/map/wm-jerymvgvmn3y.md) (`wm-jerymvgvmn3y`) and [The owner can produce next week's list without help](work/map/wm-2wdscw2knbjk.md) (`wm-2wdscw2knbjk`). Both were written from the parent's decisions and clarified target, and neither restates the parent's `Decisions so far`; each links it instead.

The order between them is one dependency edge, added after the discussion settled it: `wm-2wdscw2knbjk` waits for `wm-jerymvgvmn3y`. The page that documents the rule can only be written once the rule has produced a list. The edge lives on the later map and nowhere else — neither body numbers the two stages.

Each child then split into tasks, started at its first split and frozen as `task`:

- `wm-jerymvgvmn3y`: a probe asking whether every product appears in all four weeks, and a delivery producing the week of 2026-11-02 list.
- `wm-2wdscw2knbjk`: a delivery writing the process page, and a delivery producing and placing the week of 2026-11-09 list.

The task bodies were written against `split/task.md`'s gates: one action and one standard, evidence a reader can open, the fields set explicitly, no dependency edge on a task, and no `Result`, `Review`, or `Progress` from the designer.

What the split did not do is write the plan log. `split/task.md` asks for the count and one line per task in the discussion testimony before the first ticket is created, and this run skipped it, so the testimony has no record of how the layer was cut. Nothing catches that today: the entry is a log for a later reader, not an input to a review. [What the run showed](07-what-the-run-showed.md) says what that means for the run.
