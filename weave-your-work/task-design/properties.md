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

## Waymark's own fields

Waymark's front matter fields, including id, title, status, owner, parent, and dependencies, are documented by `waymark --help` and are not repeated here.

Every front matter change goes through a waymark command, never a hand edit.
