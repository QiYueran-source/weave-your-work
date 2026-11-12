# Fields

Every waymark item is a Markdown file with YAML front matter and a body. This file defines the fields the set writes and the command that writes each. `waymark agent-doc` prints every flag; this file does not repeat it.

## Core fields, written by waymark

| Field | Values | Command |
|---|---|---|
| `id` | `wm-…` | `waymark create` |
| `title` | one line | `waymark title set <id> "<title>"` |
| `category` | `map`, `task`, `testimony` | `waymark create --category` |
| `status` | `open`, `in_progress`, `closed` | `waymark start`, `waymark close`, `waymark reopen` |
| `owner` | one person | `waymark create --owner`, `waymark owner transfer` |
| `creator` | one person | `waymark create` |
| `created_at`, `updated_at` | ISO 8601 | every write command |
| `parent` | one item id | `waymark parent set`, `waymark parent clear` |
| `dependencies` | item ids | `waymark dependency add`, `waymark dependency remove` |
| `soft_links` | item ids, symmetric | `waymark link add`, `waymark link remove` |
| `archived_at`, `archive_reason` | set by the archive command | `waymark archive <id> --reason "<why>"` |

`archived` is a fourth state, and only `waymark archive` produces it. An archived item takes no further write: status, body, title, and parent are all refused.

## Custom fields, declared in `.waymark/config.toml`

| Field | On | Values | Written |
|---|---|---|---|
| `split_as` | map | `submap`, `task` | when the map first gains children; frozen |
| `task_kind` | task | `delivery`, `probe` | when the task is written; frozen |
| `reversibility` | task | `one_way`, `two_way` | when the task is written |
| `needs_human` | task | `true`, `false` | when the task is written; never left absent |
| `waiting_on` | task | one person's name | when the task starts waiting; cleared before it is picked up again and on every close |
| `outcome` | map, task | `failed` | when a record closes as a failed attempt; never cleared to make fields match |

A field the config does not declare is refused. A value outside the table above is still accepted by waymark, so it is a review finding.

## Writing

- A front matter change goes through a command. A hand edit leaves `updated_at` stale, and nothing checks that it is not stale.
- Every write command takes `--dry-run`. Use it on any write that reaches a record the run does not own; write your own records directly.
- `link add`, `link remove`, and `archive` write a second record. Tell its owner afterwards.

## Assertions

- A custom field the config does not declare is refused by the command. [waymark]
- `status` outside the three live values is refused by the command. [waymark]
- A custom field value outside the table above is a finding. [review]
- `needs_human` is absent on a task written by this set. [check-records]
- A front matter value differs from what the last command on that item would have written, and `updated_at` is older than the body around it. [review]
