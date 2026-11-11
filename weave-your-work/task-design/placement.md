# Task placement

Where a task sits: under which parent, what it may link to, and what it never carries. Fields and their write rules are in the waymark skill's `fields.md`. What a task says is `body.md`; which kind it is, `kind.md`.

## Parent

A task hangs under exactly one map. Its `parent` is a map, never another task: a task cannot hold children, so a task under a task is an error. This one is person-checked: waymark accepts a task parent and `validate` does not flag it, so the executor reads the parent's category before work.

## Links

A task may link to any other item with `waymark link`, including a sibling in the same map. A link records something worth following: this task's output was used elsewhere, two items cover the same subject, or one replaced another.

A link never expresses order. It does not block, does not make anything wait, and does not change whether the work can start. Work that must run in sequence is two steps of one action, or two child maps carrying a dependency edge. A link used to mean "this waits for that" tells the reader something the tracker does not enforce.

A link between siblings in one map is the case to check hardest. Siblings rarely have a reason to be associated except sequence, so a sibling link that exists only because one has to happen after the other is order in disguise, and the work was split wrongly.

The owner adds or removes a link when the relationship appears, through the waymark command, without asking anyone. A link is not written in the body.

## What a task does not carry

No date fields. There is no start date and no deadline: the start is the moment the ticket is claimed, and a deadline would need an overdue check this layer does not have. A hard date that constrains the work goes in the opening sentence of Action, where a reader sees it.

No dependency edges. The tasks under one map are parallel; where two pieces of work must run in sequence, either they are one action with several steps, or the map splits into sibling maps under the same parent, with the edge between them. The reason is the size rule in `body.md`: work that waits on a sibling is a slice, and a slice is not a result. Waymark still accepts `waymark dependency add` on a task and `validate` does not flag it, so the executor checks for a `dependencies` block before work.

Waymark's own front matter fields, including id, title, status, parent, and dependencies, are documented by `waymark agent-doc` and are not repeated here. The `dependencies` key exists in waymark; a task never sets it.

## What this file does not do

- Define a field. That is the waymark skill's `fields.md`.
- Define the body sections or their size rule. That is `body.md`.
- Decide that a piece of work is a task, or that two pieces are tasks. That is `split`.
- Advance the task. That is `execute-one-task`.
