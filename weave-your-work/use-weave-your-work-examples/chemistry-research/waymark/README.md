# Chemistry scenario waymark project

This is a scratch waymark project for the scenario in the parent directory. It is not this repository's tracker.

Run commands from this directory with `--project .`, or from the parent with `--project waymark`:

```bash
waymark --project . tree
waymark --project . show wm-t0k1c4ddsngp
```

The project has three maps and four tasks, all closed. The lab files the tasks produced are under `lab/`. The project sees the parent repository's Git history, so `waymark validate` reports no findings.

The fixture has no local operator setting. A write command may warn that your operator is not the ticket owner, because every ticket is owned by `frank`.
