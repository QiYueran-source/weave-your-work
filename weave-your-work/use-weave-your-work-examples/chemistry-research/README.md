# Chemistry research: walking the task skills

This is a fictional scenario used to walk the task skill family and one grill end to end. The waymark project under `waymark/` is a scratch project, not this repository's tracker. It holds four maps and four tasks, all closed, one testimony, one ADR, and the lab files the tasks produced.

The story: a process chemistry group is deciding whether a nickel catalyst can replace palladium in a Suzuki coupling before a 5 L pilot. The root map splits into two sibling maps, screen and pilot, and the pilot waits on the screen. The screen map holds three tasks; the pilot map holds one. After the pilot, a second grill decides the production catalyst.

The walk was run on 2026-11-08 with waymark 0.1.2. `waymark validate --project waymark` reports no findings, and the project sees the repository's Git history through its parent directory.

**This is a historical record.** Its map bodies use the section names current on 2026-11-08: `## Why` and `## Boundaries`. The current map body reference uses `## Target` with a `Why:` line and `## Out of scope`. Read `data-analysis/` for a map written in the current shape; do not copy these map headings into a new map.

## Order

1. [The tree](01-the-tree.md)
2. [Designing the tasks](02-designing-the-tasks.md)
3. [Running one task](03-running-one-task.md)
4. [Running the batch](04-running-the-batch.md)
5. [Reviewing the finished tasks](05-reviewing-the-finished-tasks.md)
6. [What the walk found](06-what-the-walk-found.md)
7. [The production grill](07-the-production-grill.md)
8. [Map lifecycle audit](08-map-lifecycle-audit.md) — a separate test project, including review mistakes and exceptional review paths
9. [Map improvement checks](09-map-improvement-checks.md) — what the checks on the map skill family showed after the audit rounds

## The project

- [Root map: Choose the catalyst for the Suzuki coupling scale-up](waymark/work/map/wm-t0k1c4ddsngp.md)
- [Screen the palladium and nickel catalysts](waymark/work/map/wm-eq30h8a29n4y.md)
- [Pilot the catalyst chosen by the screen](waymark/work/map/wm-5ysrcd4r1g6y.md)
- [Production map: Choose the catalyst for production](waymark/work/map/wm-pr0d8c4a2e9s.md)
- [Testimony: Whether to wait for nickel before the production scale-up](waymark/work/testimony/wm-gr1k7c4a2e9s.md)
- [ADR: Palladium for the production scale-up](waymark/docs/adr/0001-palladium-for-production.md)

The skill family is under `weave-your-work/task/`, `task-design/`, `execute-one-task/`, `execute-all/`, `task-review/`, and `grill/`. The pages link to the exact files they read.
