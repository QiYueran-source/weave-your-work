# The project's records

Records are tracked with waymark, in the repository.

## Writing a record

- A testimony: `waymark create --category testimony --owner <name>`
- A spec: `waymark create --category spec --owner <name>`
- A ticket: `waymark create --category ticket --owner <name>`

Then write the body into the record file, and set the fields the record needs.

## Fields

- `needs_human` (boolean, false by default): whether a task is worked by a person
  rather than an agent.

## Statuses

`open` → `in_progress` → `closed`.

- `waymark start <id>` moves a record to `in_progress`.
- `waymark close <id>` moves it to `closed`.
- `waymark reopen <id>` moves it back to `open`.

## Relations

- `waymark dependency add <id> <blocking-id>` makes one record wait for another.
- There is no parent relation between a spec and its tickets. A ticket names its
  spec by identifier in its body.
