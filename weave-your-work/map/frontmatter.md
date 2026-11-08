# Map front matter

A map's front matter carries the fields waymark needs to place it in the tree and the few fields this skill adds on top. Ordering lives here, on dependency edges, and nowhere in the body. What a map's body says is `body.md`; how a map moves through its life is the operating procedure reference.

## The core fields

`waymark --help` documents every core field and every command that writes one, and `waymark agent-doc` prints the same reference for an agent. This file does not repeat them. What it adds is where the write lands, because waymark writes some relations on both sides and some on one, and the difference decides who may touch which file.

| Relation | Written by | Which file changes |
|---|---|---|
| `parent` | `waymark create --parent`, `waymark parent set`, `waymark parent clear` | the child only; the parent's file stays byte-identical |
| `dependencies` | `waymark dependency add`, `waymark dependency remove` | the waiting item only |
| `soft_links` | `waymark link add`, `waymark link remove` | both items, because a link is symmetric |
| `status`, `title`, `body`, custom fields | `waymark status set`, `title set`, `body replace`, `field update` | the item itself |
| `owner` | `waymark owner transfer` | the item itself |
| `archived` | `waymark archive` | the archived item, and every item that pointed at it |

A live status is one of `open`, `in_progress`, or `closed`; `waymark status set` accepts only those three. `archived` is a fourth state and only `waymark archive` produces it. An archived item keeps its file and takes no further writes: `status`, `body`, `title`, `parent set`, and `parent clear` are all refused.

## Custom fields

Waymark checks that a field is declared in `.waymark/config.toml`; it does not check the value. The values below are the ones this skill writes, so a value outside them is a finding when someone reads the front matter.

| Field | Values | Who writes it | Rule |
|---|---|---|---|
| `split_as` | `submap`, `task` | split, at the map's first split | The type is frozen for the map's life. A direction that needs the other type opens a sibling map; this field is never flipped. |
| `outcome` | `failed` | review, when a node closes as a failed attempt | Absent means the node closed as intended. Only `failed` is written; a passing close is carried by `closed` and needs no field. |
| `task_kind` | `delivery`, `probe` | split, when it creates the task | Task tickets only, written explicitly at creation. What the two kinds mean is task design's `kind.md`. |

Task front matter beyond `task_kind` — `reversibility`, `needs_human`, `waiting_on` — belongs to the task skill. The dependency rules below are node-agnostic and apply to tasks as well; that is why they live here.

## Writing practice

Every front matter change goes through a waymark command. A hand edit skips the one thing the commands do for free: they write `updated_at`. A field changed by hand leaves the timestamp stale, and a stale timestamp is invisible to `waymark validate` because there is nothing for it to compare against.

Body edits follow the same rule: `waymark body replace` rewrites the body and moves `updated_at` with it.

After a change, read it back with `waymark show <id>`, or `waymark show --json <id>` when the answer is going to another tool.

One owner per item, and only the owner advances it. Writing a field is advancing it. The two exceptions are in "Two commands that write a ticket you do not own" below.

## Dependencies

An edge records a wait: the item it starts from cannot start until the item it points at is closed. It is the only place ordering is expressed. The body never mirrors an edge, and the tree never carries one.

### Direction

A may wait on B only when B can be implemented without A. The blocked node has to be independently implementable; if it needs B's result to be written at all, the two belong in one node.

That rule draws the line for the two common cases:

- A parent and its child are already in a dependency: the parent is not accepted until the child is complete. No explicit edge is added, ever.
- A task carries no edges at all, because the tasks under one map run in parallel.

Explicit edges are for waits between siblings or across branches: a node here that needs a node there, neither being the other's parent.

### Timing

Grill the relation before wiring it. Whether the wait is real is a judgment someone has to talk through; `waymark dependency add` only records the outcome. Wiring first and asking later leaves edges nobody remembers justifying.

Once a blocker closes, its edge stays as history. The owner removes it with `waymark dependency remove` when the wait no longer holds, not when the blocker closes.

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

## Two commands that write a ticket you do not own

`link add`, `link remove`, and `archive` reach across ownership. A link is symmetric, so the other end's ticket is edited. `archive` rewrites every ticket that pointed at the archived node: it drops the inbound dependency and removes the soft links, in files its owner does not own. Waymark raises no ownership error for the foreign tickets it rewrites.

All three proceed, and the foreign owner is told afterwards in an issue. Blocking instead was tried and dropped: retiring a node that others depend on has no alternative, and a rule that cannot be obeyed in the common case gets worked around.

The issue carrying the notice names three things:

- the relation that disappeared, and the node it pointed at;
- the id that replaced the node, when there is one;
- the decision the owner now makes — re-point the edge at the replacement, or accept that the wait is gone.

Archiving changes a dependent's plan, not only its file. A ticket that was `blocked` becomes `ready`; that change appears in no diff. That is the part the issue is for, and it is why retiring a node and naming its successor happen in the same breath: an archive with no replacement leaves the owner nothing to re-point to.

## Checking front matter

Whoever accepts the node reads its front matter against this list. Some items a command catches; the rest need a person.

Machine-checked, by `waymark validate` or by the command itself:

1. A custom field the config does not declare.
2. A status outside `open`, `in_progress`, `closed`.
3. A dangling reference: a `parent` or link pointing at an item that is gone.

Person-checked, because waymark cannot see the intent:

4. Hand-edited front matter: a value that changed with no command behind it, or an `updated_at` that predates the content around it.
5. A reverse dependency: the blocked node could not be implemented without the node it waits for.
6. An explicit edge between a parent and its child.
7. A `split_as` that was flipped after the first split.
8. A custom field value outside the ones listed above.

The owner's own check after a change is optional. Who accepts belongs to the review skill, not to this file.
