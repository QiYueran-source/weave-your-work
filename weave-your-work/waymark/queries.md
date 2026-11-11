# Queries

The state of a project is read off the tickets, never off the conversation. This file lists the reads the set uses, the flags that matter, and the trap in each one. Every command here was run against waymark 0.1.2 in a real project; the rows below are shapes, not this project's data.

Add `--json` to any read to get the versioned envelope: `ok`, `v`, `_meta`, and `data`. A read that a person will see does not need it; a read whose result drives a decision does.

## The tree

```
waymark tree --root <map>
```

Prints the map and its descendants, one line per item, with status in brackets. The shape is not stored in any body: each child's `parent` field is the structure, and this command reads it back. Use it to check that a split produced the shape it planned. An archived item rejects `tree`, so a retired branch is read from `waymark list --archive archived`.

## One item

```
waymark show <id>
```

Prints the front matter as fields, the state (`ready`, `blocked`, or nothing), the children, the file path, and then the body. This is what to read before deciding anything about one ticket. The body is shown whole; to get the raw document including its frontmatter use `--raw`.

With `--json`, `data` carries one row per item and `relationships` inside it holds `parent`, `children`, `dependencies`, `dependents`, and `soft_links` — every key present, with `[]` or `null` when empty. Those five are the impact scan: one command reaches the whole neighbourhood of a ticket.

## The ready list and the blocked list

```
waymark ready        # items whose dependencies are all closed
waymark blocked      # items with an unfinished or missing dependency
```

Both read dependency edges only. They ignore `parent` and never walk the tree, so an item here is ready or blocked according to its own edges, whatever state its parent is in.

An item with no edges is ready, so `ready` is every item whose own edges are clear. A blocked map does not block the tasks under it; the executor checks whether a task actually needs the missing output.

## Filtered lists

```
waymark list --parent <map>                       # the children of one map
waymark list --category map --status in_progress  # every open map
waymark list --owner <name>                       # one person's tickets
waymark list --roots                              # every root map
waymark list --where "split_as exists"            # maps that already split
waymark list --where "waiting_on exists"          # tasks waiting on a person
waymark list --readiness blocked                  # the blocked ones, in one read
waymark list --limit 0                            # every match, no cap
```

`--where` takes one predicate per flag and repeats; the predicates combine. The operators are listed in `waymark agent-doc`. `--compact` keeps identity columns only; `--fields` projects named columns.

Two traps:

- **The default limit is 100.** A list that looks complete at a hundred rows is not. Pass `--limit 0` when the count matters.
- **`--where` reads the declared fields, not the status.** Use `--status` and `--readiness` for lifecycle and the ready set; `--where` is for the six custom fields.

## Search

```
waymark search "<text>"
```

Matching is case-insensitive over the title, the front matter, and the body. It finds tickets that quote something, which is how a reference to a changed node turns up. It does not reach the skill files, the tests, or the testimony: those are ordinary Markdown on disk, and finding them takes `grep`.

A body search matches prose, so it returns noise as well as references. Read the `field` column before acting on a row.

## The archive and the counts

```
waymark list --archive archived      # retired tickets, with their reasons
waymark stats                        # totals by status and category, ready, blocked
waymark list --parent <map> --limit 0   # every child, with no silent cap
```

`stats` reports the archive slice it read and whether the projection is complete. Run `waymark validate` when the projection looks stale; it rebuilds the in-memory view and reports findings without changing any ticket.
