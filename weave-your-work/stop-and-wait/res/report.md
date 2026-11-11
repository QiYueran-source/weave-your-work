# Patrol report

The report one whole-project read produces, under `docs/stop-and-wait/`; it changes no record.

## The six conflict classes

The list is closed. A candidate that fits none of them is an opinion and is dropped.

1. Two maps promise the same outcome.
2. A record says something exists that does not: a file, a command, a section, a skill.
3. Two rules require opposite things.
4. A map's `Acceptance direction` and its children no longer cover each other.
5. A record names another record that is archived or gone.
6. A pointer resolves from the wrong directory, or to a path that no longer exists.

## The report

One entry per conflict:

- **What contradicts what** — both sides, each citable at a file and a line.
- **Class** — one of the six.
- **What it costs if left** — the work that will be done twice, or the claim that is already false.

Plus a short preamble: what was read, and what was deliberately skipped.

## Assertions

- A finding that names one side only. `[review]`
- A finding whose class is not one of the six. `[review]`
- A report that changes a record. `[review]`
