"""Start rounds of the bread machine, one experiment at a time.

    python main.py                       one round in the next experiment
    python main.py --rounds 3            three rounds in the next experiment
    python main.py --continue --rounds 5 five more rounds in the latest experiment
    python main.py --experiment exp2     rounds inside a named experiment
    python main.py --dry-run             show where the rounds would go, call no model

One run is one round: the switch is pressed, the chain runs, and the process
exits. A batch of rounds is one experiment, written under `runs/exp1`,
`runs/exp2`, and so on: the rounds, their results, the logs, and the two
handbooks all sit inside the experiment directory, so two runs never mix.
Nothing survives in memory; a round reads what the earlier ones wrote.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import os
import sys
from dataclasses import replace
from pathlib import Path

HERE = Path(__file__).resolve().parent
# `src` is this example's code; it imports as the package `src`.
sys.path.insert(0, str(HERE))

from src.agents.chain import build_fast_agent, run_round  # noqa: E402
from src.config import EXAMPLE_ROOT, RunConfig  # noqa: E402
from src.experiments import resolve_experiment  # noqa: E402


def load_env() -> None:
    """Read `.env` from this directory, then from where the round was started.

    fast-agent does not read `.env` itself in this version: it takes the file's
    keys as settings it does not recognise. The round reads the file here and
    the provider reads the environment, so the two agree.
    """

    from dotenv import load_dotenv

    candidates = [HERE / ".env", Path.cwd() / ".env"]
    for candidate in candidates:
        if candidate.exists():
            load_dotenv(candidate, override=False)


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run rounds of the bread machine.")
    parser.add_argument("--rounds", type=int, default=1, help="how many rounds to run, one process each")
    parser.add_argument(
        "--runs",
        default=None,
        help="root directory holding the experiments (default: runs/)",
    )
    parser.add_argument(
        "--experiment",
        default=None,
        help="experiment directory name under the runs root (default: the next free expN)",
    )
    parser.add_argument(
        "--continue",
        dest="continue_run",
        action="store_true",
        help="continue the latest experiment instead of starting a new one",
    )
    parser.add_argument(
        "--from-round",
        type=int,
        default=None,
        help="start numbering at this round, continuing the run (default: the next free number)",
    )
    parser.add_argument("--model", default=None, help="model for every node, e.g. generic.gpt-4.1")
    parser.add_argument("--seed", type=int, default=None, help="seed for the per-bake taste draws")
    parser.add_argument("--grill-rounds", type=int, default=None, help="most grill exchanges per round")
    parser.add_argument("--verbose", action="store_true", help="show the agents' conversation")
    parser.add_argument("--dry-run", action="store_true", help="check paths and templates, call no model")
    return parser.parse_args(argv)


def runs_root(args: argparse.Namespace) -> Path:
    raw = Path(args.runs or os.environ.get("BREAD_RUNS", "runs")).expanduser()
    return (raw if raw.is_absolute() else EXAMPLE_ROOT / raw).resolve()


def config_from_args(args: argparse.Namespace, experiment: Path) -> RunConfig:
    if args.model:
        os.environ["BREAD_MODEL"] = args.model
    if args.seed is not None:
        os.environ["BREAD_SEED"] = str(args.seed)
    if args.grill_rounds is not None:
        os.environ["BREAD_GRILL_ROUNDS"] = str(args.grill_rounds)
    if args.verbose:
        os.environ["BREAD_VERBOSE"] = "1"
    return replace(
        RunConfig.from_env(),
        records_root=experiment,
        log_root=experiment / "logs",
        handbooks_root=experiment / "handbooks",
    )


def resume_point(config: RunConfig) -> int:
    """The round number the records directory is ready for.

    Everything a round needs to carry on is already on disk: the machine's knobs
    and bake count in machine-state.json, each bake's result in results/, each
    round's records in round-NN/, and what the chain learned in the evolving
    handbook. Continuing means starting from this number in the same directory.
    """

    from src.machine.records import RecordStore

    store = RecordStore(config)
    return store.next_round_index()


def check(config: RunConfig, create: bool = True) -> list[str]:
    """Everything a round needs before it calls a model.

    A dry run passes `create=False` and asks only whether the paths could be
    written, so asking where a round would go leaves nothing on disk.
    """

    problems: list[str] = []
    for name in ("goal", "observe", "proposer", "grill", "spec", "tickets", "implement", "base"):
        path = config.templates_root / f"{name}.md"
        if not path.exists():
            problems.append(f"missing template {path}")
    for name in ("records_root", "log_root", "handbooks_root"):
        path = getattr(config, name)
        if not create:
            probe = path
            while not probe.exists() and probe != probe.parent:
                probe = probe.parent
            if not probe.exists() or not os.access(probe, os.W_OK):
                problems.append(f"{name} {path} is not writable")
            continue
        try:
            path.mkdir(parents=True, exist_ok=True)
        except OSError as exc:
            problems.append(f"{name} {path} is not writable: {exc}")
    return problems


def main(argv: list[str] | None = None) -> int:
    load_env()
    args = parse_args(argv)
    continuing = args.continue_run or args.from_round is not None
    experiment = resolve_experiment(runs_root(args), args.experiment, continuing)
    config = config_from_args(args, experiment)
    problems = check(config, create=not args.dry_run)
    if problems:
        for problem in problems:
            print(f"problem: {problem}", file=sys.stderr)
        return 1
    if args.dry_run:
        print(
            json.dumps(
                {
                    "model": config.model,
                    "experiment": str(config.records_root),
                    "records": str(config.records_root),
                    "logs": str(config.log_root),
                    "handbooks": str(config.handbooks_root),
                    "grill_rounds": config.grill_max_rounds,
                    "seed": config.taste_seed,
                    "next_round": _next_round(config),
                },
                indent=2,
            )
        )
        return 0

    print(json.dumps({"experiment": str(config.records_root)}), file=sys.stderr)
    if continuing:
        resume = resume_point(config)
        print(
            json.dumps(
                {"continuing": True, "next_round": resume, "experiment": str(config.records_root)}
            ),
            file=sys.stderr,
        )
    failed = 0
    for _ in range(max(1, args.rounds)):
        fast = build_fast_agent(config)
        outcome = asyncio.run(run_round(fast, config))
        if outcome.get("failed"):
            failed += 1
            print(json.dumps({"round": outcome["round_id"], "failed": outcome["failed"]}, indent=2))
            # A failed round keeps its number: the next one continues after it.
            try:
                from src.machine.records import RecordStore

                RecordStore(config)
            except Exception:
                pass
            continue
        print(
            json.dumps(
                {
                    "round": outcome["round_id"],
                    "verdict": outcome["verdict"],
                    "settled": outcome["settled"],
                    "score": outcome["score"],
                    "knobs": outcome["knobs"],
                    "summary": outcome["summary"],
                    "log": outcome["support"]["log"],
                },
                indent=2,
            )
        )
    if failed:
        print(f"{failed} of {max(1, args.rounds)} rounds failed; see runs/summary.json", file=sys.stderr)
    return 0


def _next_round(config: RunConfig) -> int:
    from src.machine.records import next_round_index

    return next_round_index(config)


if __name__ == "__main__":
    raise SystemExit(main())
