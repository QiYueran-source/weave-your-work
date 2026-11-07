# Task properties

A task carries three custom fields in its front matter: `task_kind`, `reversibility`, and `needs_human`. The first two are required; the third is optional. This file defines what each one means, the values it accepts, and who writes it. Body sections are defined in `body.md`; how to choose the kind is in `kind.md`.

## task_kind

Required on every task. Accepted values: `delivery` and `probe`.

- `delivery`: the task promises an output, and failure is an incident.
- `probe`: the task buys information, and a negative result is a normal result.

Who writes it: the AI that runs `split-to-task`, judged when the ticket is created.

The value is frozen once written. Changing it means closing the ticket and opening a new one with the other kind; `kind.md` says why.

## reversibility

Required on every task. Accepted values: `one_way` and `two_way`.

- `one_way`: the work cannot be undone once it goes wrong. The task requires a Failure recovery section, and it names who confirms the work and what they confirm before work starts. Enforcing that block belongs to the task execution skill.
- `two_way`: the work can be undone. Failure recovery is optional.

Who writes it: whoever writes the task, before work starts.

## needs_human

Optional. Type: boolean. Leave it unset when the task needs no person.

- `true`: the task contains work that only a person can do.
- `false`: the task contains no such work.

Who writes it: the AI that runs `split-to-task`, judged when the ticket is created.

The field and the body must agree. When the value is `true`, at least one Action step starts with `Person:`; when it is `false`, no step does. How that prefix is written is in `body.md`.

Notifying a person and waiting for their answer belong to the task execution skill, not to this field.

## What a task does not carry

No date fields. There is no start date and no deadline: the start is the moment the ticket is claimed, which execution records, and a deadline needs a check on overdue work that this layer does not have. When the work itself is constrained by a date, that constraint belongs in Action or Boundaries, where a reader sees it.

No dependency edges. The tasks under one map are parallel branches, so an edge between them would mean one waits for another. Work that waits on a sibling is a slice of a result, not a result; either it joins that sibling's action, or the map splits into child maps that carry the edge.

## Placement and links

A task hangs under exactly one map. Its `parent` is a map, never another task: a task cannot hold children, so a task under a task is an error. This one is machine checkable.

A task may link to another item with `waymark link`. A link records a relationship worth following: this task's output was used elsewhere, or two items cover the same subject. A link never expresses order. It does not block, it does not make anything wait, and it does not shift readiness. Work that must run in sequence is two steps of one action, or two child maps carrying a dependency edge. When a link is used to mean "this waits for that", the reader is being told something the tracker does not enforce.

The owner adds or removes a link when the relationship appears, through the waymark command, without asking anyone. A link is not written in the body; the body says what the work is, and a reader who needs the relationship follows the front matter.

## Waymark's own fields

Waymark's front matter fields, including id, title, status, owner, parent, and dependencies, are documented by `waymark --help` and are not repeated here.

Every front matter change goes through a waymark command, never a hand edit.
