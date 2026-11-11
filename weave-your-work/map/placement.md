# Map placement

Where a map sits in the tree: the dependency edges that order it against other maps, and the soft links that only record a relation. Fields themselves, and how a write lands, are in the waymark skill's `fields.md`. What a map says is `body.md`; how it moves through its life is `procedure.md`.

## Dependencies

An edge records a wait: the map it starts from cannot be accepted until the map it points at is closed. An edge can also name a producer whose output is needed to perform some of the waiting map's work. The tree does not express that order. A blocked map does not freeze every task under it: the executor checks whether the task actually needs a missing output. A child does not inherit its parent's edge; a child map may carry its own edge when the relation applies to it, while a task carries no edge and waits at execution if its required input is unavailable; `task-design/placement.md` covers that side.

### Direction

A waits on B when B must finish before A can be accepted, including when A needs B's output. B must not depend on A: the producer must be able to finish without the waiting map. A can be specified before B finishes, but work that needs B's missing output waits. If A cannot be specified without that output, leave the undecided part for a later split rather than inventing it.

That rule draws the line for the two common cases:

- A parent and its child are already in a dependency: the parent is not accepted until the child is complete. No explicit edge is added, ever.
- No node is a task here: a task carries no edges at all, and `task-design/placement.md` says why.

Explicit edges are for waits between siblings or across branches: a node here that needs a node there, neither being the other's parent.

### Timing

Grill the relation before wiring it. Whether the wait is real is a judgment someone has to talk through; `waymark dependency add` only records the outcome. Wiring first and asking later leaves edges nobody remembers justifying.

Once a blocker closes, its edge stays as history. Closed does not necessarily mean successful: if the blocker has `outcome=failed`, check whether the required output actually exists and is usable. If not, the work needing it and the waiting map's acceptance must wait. The owner decides whether to wait for a replacement or adjust the target and dependency; do not automatically change the edge. The owner removes it with `waymark dependency remove` when the wait no longer holds, not merely when the blocker closes.

```
waymark dependency add <id> <blocking-id>     # <id> waits for <blocking-id>
waymark dependency remove <id> <blocking-id>
```

### Reading them back

After wiring, read the result rather than assuming it:

```
waymark dep tree <id>      # the chain above and below one item
waymark ready              # items with no unfinished edges
waymark blocked            # items waiting on an unfinished or missing dependency
```

`ready` and `blocked` read edges only. They ignore `parent` and they do not walk the tree, so an item is ready when its own edges are clear, whatever state its parent is in. Relocating a node does not move an edge with it; that is a separate change, and the update skill's `move.md` covers it.

## Soft links

A soft link associates two items without ordering them. It is not a dependency: it does not block, it does not appear in `ready` or `blocked`, and it is not a reason to wait for the other side.

`waymark link add` writes both tickets and `waymark link remove` clears both, because a link has no direction to break.

The usual case is a node that closed as a failed attempt and the sibling that replaced it: the link keeps the pair findable. A link stores no reason, so whatever justifies it goes in the body entry or the issue that created it.

## What this file does not do

- Define a field or a command. That is the waymark skill's `fields.md`.
- Define the body sections. That is `body.md`.
- Say when a node is moved. That is `move.md` in the update skill.
