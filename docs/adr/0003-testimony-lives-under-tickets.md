# Put testimonies under `tickets/` with the rest of the tracker

The `testimony` category sits at `tickets/testimony`, beside `tickets/map` and `tickets/task`, instead of at a top-level `testimony/`. Post-hoc summaries stay in `tickets/testimony/summaries/`, which the tracker does not scan.

Supersedes the testimony location in ADR-0002 and in ADR-0001; the rest of both records stands. What a testimony is, who owns it, what it holds, and how it is cited do not change.

The tracker already owns all three categories, and the storage root `tickets` holds every waymark document in the project. A testimony sitting outside that root was the only document a reader had to know to look for elsewhere: `waymark` found it, but `ls tickets/` did not show it, so a reader scanning the tracker missed the one place a grill's discussion is written down. Keeping one root also makes the layout rule simple to state — waymark documents live under `tickets/`, everything else lives in its own top-level directory.

Owning ticket: [wm-31f6a2c9d840](../../tickets/map/wm-31f6a2c9d840.md).

## Consequences

- ADR-0002's item rules stand; only its path changes.
- The move was done with `waymark migrate storage --category-path testimony tickets/testimony`, which rewrites the category path in `.waymark/config.toml` and moves the directory. Editing the path by hand leaves the old directory in place, and `waymark validate` does not report the leftover.
- Links into a testimony lose one `../`: a ticket at `tickets/map/` now writes `../testimony/wm-....md`, a summary at `tickets/testimony/summaries/` writes `../../map/wm-....md`. The links were rewritten in closed tickets as well as open ones, because a link is a pointer and a stale pointer reads as "this record is gone". The ticket bodies themselves are untouched; a closed ticket still keeps what it recorded.
- `setup/start-a-project.md` creates the category at `tickets/testimony`; `grill/testimony.md` names that path. A project set up before this change keeps `testimony/` at its root until it runs the migrate command.
