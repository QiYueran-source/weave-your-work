# Task properties

A task carries five custom fields in the waymark front matter, under `custom_fields`: `task_kind`, `reversibility`, `needs_human`, `waiting_on`, and `outcome`. The first two are required. The other three are optional: `needs_human` is the only one written at creation; `waiting_on` is written while the task runs, and `outcome` when it closes as a failed attempt. This file defines what each one means, the values it accepts, and who writes it. Body sections are in `body.md`; choosing the kind is in `kind.md`.

Every front matter change goes through a waymark command, never a hand edit. A whole ticket is shown at the end of `body.md`.

## task_kind

Required on every task. Accepted values: `delivery` and `probe`.

- `delivery`: the task promises an output, and failure is an incident.
- `probe`: the task buys information, and a negative result is a normal result.

Who writes it: whoever writes the ticket, before work starts. In practice that is the AI running the split skill, because the kind is decided when the ticket is created.

The value is frozen once written. A body written for one kind does not serve the other, since the section lists differ.

## reversibility

Required on every task. Accepted values: `one_way` and `two_way`.

- `one_way`: the work cannot be undone once it goes wrong. Someone outside the work confirms the plan before it starts, and the Acceptance signal names who that is and what they confirm.
- `two_way`: the work can be undone. Nothing needs confirming first.

Judge it by the effect on the world, not by whether the ticket can be corrected. A wrong file that can be republished is `two_way`. A price list that already reached customers is `one_way`.

A probe can be `one_way`. Asking a question is cheap to repeat, but a one-time message to five hundred customers is not.

Who writes it: whoever writes the ticket, before work starts.

## needs_human

Optional at creation, and the only optional field written then. Type: boolean. Leave it unset when the task needs no person.

- `true`: the task contains work only a person can do.
- `false`: the task was checked and needs no person.

Unset and `false` mean the same thing in effect; set `false` when you want the ticket to say so out loud.

Who writes it: whoever writes the ticket, before work starts.

The field and the body must agree. When the value is `true`, at least one Action step carries the `Person:` prefix; when it is `false`, no step does. Every person step carries the prefix either way, as `body.md` requires.

Notifying a person belongs to the task execution skill. When the task then waits on that person's answer, the wait is recorded in `waiting_on`.

## waiting_on

Optional, type: string. Leave it unset when the task waits on nobody.

- It names the person whose answer the task waits on. One value: who is being waited on now, not everything the task touched. Waiting on a task or a map is a split error, not a `waiting_on` value; if the work needs another task's output, the task layer is the wrong shape.
- Who writes it: the owner, when the task starts waiting. It is cleared by the owner when the answer is handled, before the task is selected again. A run that sees a value stops; it does not guess that the answer arrived. Task design only declares the field.
- A task with a value is still `in_progress`. It is not blocked and not closed: the field records a wait, not a state of its own.

## outcome

Optional, type: string. Leave it unset unless the task closed as a failed attempt.

- The one accepted value is `failed`. It marks a ticket that closed because the work went the wrong way, not because it delivered: the action no longer served the map, and a replacement task takes its place.
- Who writes it: whoever runs the review, at the close, and only with the verdict `wrong direction`. Execution never writes it, and a task that passed carries no `outcome`.
- It mirrors the `Review` section and never contradicts it: the section says what the review found, the field makes a failed close findable in the front matter.
- The field was first defined for maps and means the same thing on a task. This file is where it takes its task meaning.

## owner

Waymark records one accountable person per item. The owner advances the task and decides whether it passes. It is not the person who happened to do the work: work can be handed to anyone, acceptance cannot.

The owner is set when the ticket is created, with `waymark create --owner`, and changed with `waymark owner transfer`. It is not one of the custom fields above.

## Placement

A task hangs under exactly one map. Its `parent` is a map, never another task: a task cannot hold children, so a task under a task is an error. This one is person-checked: waymark accepts a task parent and `validate` does not flag it, so the executor reads the parent's category before work.

## Links

A task may link to any other item with `waymark link`, including a sibling in the same map. A link records something worth following: this task's output was used elsewhere, two items cover the same subject, or one replaced another.

A link never expresses order. It does not block, does not make anything wait, and does not change whether the work can start. Work that must run in sequence is two steps of one action, or two child maps carrying a dependency edge. A link used to mean "this waits for that" tells the reader something the tracker does not enforce.

A link between siblings in one map is the case to check hardest. Siblings rarely have a reason to be associated except sequence, so a sibling link that exists only because one has to happen after the other is order in disguise, and the work was split wrongly.

The owner adds or removes a link when the relationship appears, through the waymark command, without asking anyone. A link is not written in the body.

## What a task does not carry

No date fields. There is no start date and no deadline: the start is the moment the ticket is claimed, and a deadline would need an overdue check this layer does not have. A hard date that constrains the work goes in the opening sentence of Action, where a reader sees it.

No dependency edges. The reason is the size rule in `body.md`: work that waits on a sibling is a slice, and a slice is not a result. Waymark still accepts `waymark dependency add` on a task and `validate` does not flag it, so the executor checks for a `dependencies` block before work.

Waymark's own front matter fields, including id, title, status, parent, and dependencies, are documented by `waymark --help` and are not repeated here. `owner` is the exception, because a task's owner is the person who accepts it and that is easy to mistake. The `dependencies` key exists in waymark; a task never sets it.
