# The tree

The root map is [Choose the catalyst for the Suzuki coupling scale-up](waymark/work/map/wm-t0k1c4ddsngp.md). Its target is a decision, not an experiment: which catalyst goes into the 5 L pilot, with evidence a process chemist can review.

## Why the root splits into maps, not tasks

The root's `split_as` is `submap`. The two children are stages with their own targets and their own acceptance directions:

- [Screen the palladium and nickel catalysts](waymark/work/map/wm-eq30h8a29n4y.md): know whether nickel reaches the yield and purity floor on three substrates, and leave the data in a form the pilot decision can read.
- [Pilot the catalyst chosen by the screen](waymark/work/map/wm-5ysrcd4r1g6y.md): run the 5 L batch under the selected conditions, and record whether it reproduces the screen.

The screen and the pilot are sibling maps under the root. They are not a parent and child. The pilot waits on the screen, so the wait is a dependency edge from the pilot map to the screen map. The tree still shows both as refinements of the root; the edge carries the order.

That shape keeps the wait on the map layer, where dependency edges live. A task carries no dependency edge, because the tasks under one map are parallel; a staged lab workflow is not. The task rules now say the sequence becomes sibling maps under the same parent, with the edge between them. Putting the two stages under one map as two tasks would either invent a dependency the task layer forbids or start the pilot too early.

## The tasks

The screen map's `split_as` is `task`, so its children are tasks:

- [Write the comparison protocol](waymark/work/task/wm-wea2f4ywz4v1.md): delivery, `two_way`, no person, closed.
- [Measure the nickel yield on the three substrates](waymark/work/task/wm-0jba45z3c75b.md): probe, `two_way`, `needs_human: true`, closed.
- [Compile the screening table](waymark/work/task/wm-p3ktzx61k2yw.md): delivery, `two_way`, no person, closed.

The pilot map's `split_as` is `task`, and it holds one task:

- [Run the 5 L palladium pilot](waymark/work/task/wm-gz51ak42aq9k.md): delivery, `one_way`, `needs_human: true`, closed.

Three tasks sit under the screen map as siblings, and the task rule treats siblings as parallel. The protocol can be written while the probe waits on the lab. The table cannot: it reads the probe's run log. That is a split error, not a batch problem; the batch page takes it up.

## What the tree shows

`waymark --project waymark tree` returns:

```
wm-t0k1c4ddsngp Choose the catalyst for the Suzuki coupling scale-up [closed]
  - wm-5ysrcd4r1g6y Pilot the catalyst chosen by the screen [closed]
  -   - wm-gz51ak42aq9k Run the 5 L palladium pilot [closed]
  - wm-eq30h8a29n4y Screen the palladium and nickel catalysts [closed]
  -   - wm-0jba45z3c75b Measure the nickel yield on the three substrates [closed]
  -   - wm-p3ktzx61k2yw Compile the screening table [closed]
  -   - wm-wea2f4ywz4v1 Write the comparison protocol [closed]
```

The order in this output is the tree's rank, not the order the work ran. The pilot map appears above the screen map because the display sorts by rank; the dependency edge is what made the pilot wait.
