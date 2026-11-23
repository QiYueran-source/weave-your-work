"""Where a run's records live: one directory per experiment under a runs root.

    runs/exp1/round-01/...      one experiment: its rounds, results, logs, handbooks
    runs/exp2/round-01/...

A new batch of rounds gets the next free `expN`, so two runs never mix their
records. `--continue` picks the latest one and carries on inside it.
"""

from __future__ import annotations

import re
from pathlib import Path

EXPERIMENT_DIR = re.compile(r"^exp(\d+)")


def experiment_dirs(root: Path) -> list[tuple[int, Path]]:
    """Every experiment directory under the root, oldest number first."""

    if not root.exists():
        return []
    found: list[tuple[int, Path]] = []
    for entry in root.iterdir():
        match = EXPERIMENT_DIR.match(entry.name) if entry.is_dir() else None
        if match:
            found.append((int(match.group(1)), entry))
    return sorted(found)


def next_experiment(root: Path) -> Path:
    """The directory a new batch of rounds writes into."""

    numbers = [number for number, _ in experiment_dirs(root)]
    return root / f"exp{max(numbers, default=0) + 1}"


def latest_experiment(root: Path) -> Path | None:
    """The experiment `--continue` picks: the highest number on disk."""

    found = experiment_dirs(root)
    return found[-1][1] if found else None


def resolve_experiment(root: Path, name: str | None = None, continue_run: bool = False) -> Path:
    """The experiment directory this invocation writes into.

    A named experiment is used as given, and created if it is new. `--continue`
    with no name picks the latest one; when there is none, the run starts fresh
    at exp1. Anything else creates the next free directory.
    """

    root.mkdir(parents=True, exist_ok=True)
    if name:
        return root / name
    if continue_run:
        latest = latest_experiment(root)
        if latest is not None:
            return latest
    return next_experiment(root)
