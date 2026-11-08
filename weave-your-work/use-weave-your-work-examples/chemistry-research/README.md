# Chemistry research: walking the task skills

This is a fictional scenario used to walk the task skill family end to end. The waymark project under `waymark/` is a scratch project, not this repository's tracker. It holds three maps and four tasks, all closed, and the lab files the tasks produced.

The story: a process chemistry group is deciding whether a nickel catalyst can replace palladium in a Suzuki coupling before a 5 L pilot. The root map splits into two sibling maps, screen and pilot, and the pilot waits on the screen. The screen map holds three tasks; the pilot map holds one.

The walk was run on 2026-11-08 with waymark 0.1.2. `waymark validate --project waymark` reports no findings, and the project sees the repository's Git history through its parent directory.

## Order

1. [The tree](01-the-tree.md)
2. [Designing the tasks](02-designing-the-tasks.md)
3. [Running one task](03-running-one-task.md)
4. [Running the batch](04-running-the-batch.md)
5. [Reviewing the finished tasks](05-reviewing-the-finished-tasks.md)
6. [What the walk found](06-what-the-walk-found.md)

## The project

- [Root map: Choose the catalyst for the Suzuki coupling scale-up](waymark/work/map/wm-t0k1c4ddsngp.md)
- [Screen the palladium and nickel catalysts](waymark/work/map/wm-eq30h8a29n4y.md)
- [Pilot the catalyst chosen by the screen](waymark/work/map/wm-5ysrcd4r1g6y.md)

The skill family is under `weave-your-work/task/`, `task-design/`, `execute-one-task/`, `execute-all/`, and `task-review/`. The pages link to the exact files they read.
