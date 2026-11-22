"""Run one of the example's MCP servers as a stdio process.

    python -m src.servers.entry records --records <dir> --handbooks <dir> --templates <dir> --round 1
    python -m src.servers.entry machine --seed 7 --log <file>
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Start one MCP server for the bread machine.")
    parser.add_argument("which", choices=["records", "machine"])
    parser.add_argument("--records", default=None, help="round records directory")
    parser.add_argument("--handbooks", default=None, help="directory holding base.md and evolving.md")
    parser.add_argument("--templates", default=None, help="directory holding the instruction templates")
    parser.add_argument("--logs", default=None, help="log directory")
    parser.add_argument("--round", type=int, default=1, help="the round the record tools act on")
    parser.add_argument("--seed", type=int, default=7, help="seed for the per-bake taste draws")
    parser.add_argument("--state", default=None, help="file the machine keeps its knobs and bake count in")
    args = parser.parse_args(argv)

    here = Path(__file__).resolve().parents[2]
    sys.path.insert(0, str(here))

    from src.config import EXAMPLE_ROOT, RunConfig
    from src.machine.records import RecordStore, RoundCursor, build_server as build_records
    from src.machine.server import Machine, build_server as build_machine

    config = RunConfig(
        records_root=Path(args.records or EXAMPLE_ROOT / "runs"),
        log_root=Path(args.logs or EXAMPLE_ROOT / "logs"),
        handbooks_root=Path(args.handbooks or EXAMPLE_ROOT / "handbooks"),
        templates_root=Path(args.templates or EXAMPLE_ROOT / "templates"),
        model="unused",
        grill_max_rounds=3,
        taste_seed=args.seed,
    )
    if args.which == "records":
        server = build_records(RecordStore(config), RoundCursor(args.round))
    else:
        state_path = Path(args.state) if args.state else config.records_root / "machine-state.json"
        machine = Machine.load(
            state_path, seed=args.seed, log_path=config.log_root / f"round-{args.round:02d}.jsonl"
        )
        server = build_machine(machine)
    server.run()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
