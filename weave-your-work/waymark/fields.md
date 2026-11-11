# Fields

Every waymark item carries front matter, and this file is where the set defines it: the core fields, the six custom fields the tracker is configured with, `owner`, the rule for how a write lands, and the list an accepting party checks. It is one file for maps and tasks both. Nothing in this set defines a field anywhere else.

`waymark agent-doc` prints waymark's own reference, with every flag of every command. This file does not repeat it; it adds what a command does not say on its own — where the write lands, who may run it, and which values the set uses.

## The core fields

Waymark writes these itself; the set decides which values are legal. A live status is one of `open`, `in_progress`, or `closed`; `waymark status set` accepts only those three. `archived` is a fourth state, and only `waymark archive` produces it. An archived item keeps its file and takes no further writes: `status`, `body`, `title`, `parent set`, and `parent clear` are all refused.

| Relation | Written by | Which file changes |
|---|---|---|
| `parent` | `waymark create --parent`, `waymark parent set`, `waymark parent clear` | the child only; the parent's file stays byte-identical |
| `dependencies` | `waymark dependency add`, `waymark dependency remove` | the waiting item only |
| `soft_links` | `waymark link add`, `waymark link remove` | both items, because a link is symmetric |
| `status`, `title`, `body`, custom fields | `waymark status set`, `title set`, `body replace`, `field update` | the item itself |
| `owner` | `waymark owner transfer` | the item itself |
| `archived` | `waymark archive` | the archived item, and every item that pointed at it |

Most relations are written on one side. The two that write both are the reason for the ownership rules below.

## The custom fields

Waymark checks that a field is declared in `.waymark/config.toml`; it does not check the value. The values below are the ones this set writes, so a value outside them is a finding when someone reads the front matter.

The project is configured with exactly six: `needs_human` (boolean), `outcome`, `reversibility`, `split_as`, `task_kind`, and `waiting_on` (all string). `setup/start-a-project.md` declares them; this file defines them.

| Field | Node | Values | Written by | Rule |
|---|---|---|---|---|
| `split_as` | map | `submap`, `task` | `split`, at the map's first split | The type is frozen for the map's life. A direction that needs the other type opens a sibling map; the field never flips. |
| `task_kind` | task | `delivery`, `probe` | `split`, when it creates the task | Written explicitly at creation and frozen. What the two kinds mean is `task-design/kind.md`. |
| `reversibility` | task | `one_way`, `two_way` | whoever writes the ticket, before work starts | `one_way` work needs a confirmation before it starts. Judge it by the effect on the world, not by whether the ticket can be corrected. |
| `needs_human` | task | boolean | whoever writes the ticket, before work starts | `true` when the task contains work only a person can do. Unset means the same as `false`; say `false` out loud when the check was made. |
| `waiting_on` | task | a person's name | the owner, when the task starts waiting on that person | One value: who is being waited on now. The owner clears it when the answer is handled, before the task is selected again. A task with a value is still `in_progress`. |
| `outcome` | map, task | `failed` | the review, when a node closes as a failed attempt | Only `failed` is written; a passing close needs nothing. Absence alone does not establish a pass: read the Review, the status, and the evidence. |

What a field means is here. When a skill uses a field for something more than its meaning, it says so where the step happens: `split` says when the first split writes `split_as`, `task-design/kind.md` says how the two kinds differ in use, and `task-design/placement.md` says what a link may not mean.

## owner

Waymark records one accountable person per item. The owner advances the item and accepts it. It is not the person who happened to do the work: work can be handed to anyone, acceptance cannot.

The owner is set at creation with `waymark create --owner` and changed with `waymark owner transfer`. It is not one of the custom fields.

Waymark stores the operator in `.waymark/user.toml`, which it gitignores per clone. The operator is whose machine a command ran on. The owner is whose ticket it is. A run's ownership boundary follows the node's `owner`, never the operator.

## Writing a field

Every front matter change goes through a waymark command. A hand edit skips the one thing the commands do for free: they write `updated_at`. A field changed by hand leaves the timestamp stale, and a stale timestamp is invisible to `waymark validate` because there is nothing for it to compare against.

Body edits follow the same rule: `waymark body replace` rewrites the body and moves `updated_at` with it.

After a change, read it back with `waymark show <id>`, or `waymark show --json <id>` when the answer is going to another tool.

One owner per item, and only the owner advances it. Writing a field is advancing it.

Every write command takes `--dry-run` and reports what it would do, or that there is nothing to do. A body file holds the body alone: its first line is a `##` heading, never the frontmatter. A file that starts with `---` writes the old frontmatter into the new body, and `waymark validate` does not flag it, because it reads only the first frontmatter block.

## Two commands that write a ticket you do not own

`link add`, `link remove`, and `archive` reach across ownership. A link is symmetric, so the other end's ticket is edited. `archive` rewrites every ticket that pointed at the archived node: it drops the inbound dependency and removes the soft links, in files its owner does not own. Waymark raises no ownership error for the foreign tickets it rewrites.

All three proceed, and the foreign owner is told afterwards in an issue. Blocking instead was tried and dropped: retiring a node that others depend on has no alternative, and a rule nobody can obey in the common case gets worked around. The `update` skill carries the check, the dry-run, and the notice.

## Checking front matter

Whoever accepts the node reads its front matter against this list. Some items a command catches; the rest need a person.

Machine-checked, by `waymark validate` or by the command itself:

1. A custom field the config does not declare.
2. A status outside `open`, `in_progress`, `closed`.
3. A dangling reference: a `parent` or link pointing at an item that is gone.

Person-checked, because waymark cannot see the intent:

4. Hand-edited front matter: a value that changed with no command behind it, or an `updated_at` that predates the content around it.
5. A reverse or circular dependency: the supposed blocker cannot finish without the item waiting on it.
6. An explicit edge between a parent and its child.
7. A `split_as` that was flipped after the first split.
8. A custom field value outside the ones listed above.

Who accepts belongs to the review skill of the node's family, not to this file. Where a dependency edge or a soft link may go on each node kind is `map/placement.md` or `task-design/placement.md`.
