# Relations

Parent, dependency, and soft link, and what each one means. This is the only place the dependency direction is defined; a task's own rule cites it.

## Parent

A node hangs under exactly one parent. A map hangs under another map or under nothing; the root is the one map with no parent. A task hangs under exactly one map and never under another task. The child carries the field: writing the hang never edits the parent's file.

The relation is refinement: the child is a more specific statement of the parent's target. A child that answers a different question does not belong under it.

```
waymark parent set <id> <parent>
waymark parent clear <id>
```

## Dependency

An edge records a wait: the item it starts from cannot be accepted until the item it points at is closed.

```
waymark dependency add <id> <blocking-id>     # <id> waits for <blocking-id>
waymark dependency remove <id> <blocking-id>
```

- A waits on B when B must finish before A can be accepted, including when A needs B's output. B must not depend on A.
- A parent and its child never carry an explicit edge; the tree already means the parent waits for the child.
- A task carries no edge. Work that must run in sequence is one action with several steps, or sibling maps with the edge between them.
- Edges are for waits between siblings or across branches.
- A closed blocker is not necessarily a usable one: when it carries `outcome=failed`, its output still has to be checked before the waiting work leans on it.

## Soft link

A link records an association and no order. It does not block, and it never appears in a readiness answer. `link add` and `link remove` write both records.

The usual case is a failed attempt and the sibling that replaced it.

## Reading relations back

```
waymark --json show <id>     # relationships: parent, children, dependencies, dependents, soft_links
waymark tree --root <id>     # the shape below one item
waymark list --parent <id> --limit 0
waymark ready                # items whose own edges are all clear
waymark blocked              # items waiting on an unfinished or missing dependency
```

`ready` and `blocked` read edges only. They ignore `parent` and do not walk the tree: a blocked map does not freeze every task under it. `list` stops at 100 rows unless `--limit 0` is passed, and `--compact` drops the relation columns: a sweep that needs every row passes the limit and skips `--compact`.

## Assertions

- More than one parent on one item. `[waymark]`
- A `parent` naming an item that is gone. `[waymark]`
- A task whose `parent` is a task. `[check-records]`
- An explicit dependency edge between a parent and its child. `[check-records]`
- A dependency edge on a task. `[check-records]`
- A dependency cycle, or a direction where the blocker needs the item that waits on it. `[review]`
