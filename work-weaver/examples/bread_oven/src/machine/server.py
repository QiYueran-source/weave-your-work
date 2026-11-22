"""The machine server: the five knobs, the bake, and the result.

The taste program sits behind this server. No tool returns a simulator
parameter, and the last bake's features and score are all the chain ever sees of
how a loaf was judged.
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path

from pydantic import ValidationError

from src.config import DEFAULT_KNOBS, KNOBS
from src.models import BakeResult
from src.machine.taste import bake as run_taste


class KnobError(Exception):
    """A knob value the machine refuses."""


@dataclass
class Machine:
    """The simulation's state: the knobs as they stand, and the last bake."""

    seed: int
    round_index: int = 0
    knobs: dict[str, float] = field(default_factory=lambda: dict(DEFAULT_KNOBS))
    last: BakeResult | None = None
    log_path: Path | None = None
    state_path: Path | None = None
    result_dir: Path | None = None
    """Where each bake's result is written, one file per round, for a reader."""

    def save(self) -> None:
        """Write the knobs and the bake count, so the next round starts where this one ended."""

        if self.state_path is None:
            return
        self.state_path.parent.mkdir(parents=True, exist_ok=True)
        self.state_path.write_text(
            json.dumps({"knobs": self.knobs, "round_index": self.round_index}, indent=2) + "\n",
            encoding="utf-8",
        )

    @classmethod
    def load(cls, state_path: Path, *, seed: int, log_path: Path | None = None) -> "Machine":
        """The machine as the last round left it, or a fresh one at the default knobs."""

        machine = cls(seed=seed, log_path=log_path, state_path=Path(state_path))
        if machine.state_path and machine.state_path.exists():
            saved = json.loads(machine.state_path.read_text(encoding="utf-8"))
            knobs = dict(DEFAULT_KNOBS)
            knobs.update({name: float(value) for name, value in saved.get("knobs", {}).items()})
            machine.knobs = knobs
            machine.round_index = int(saved.get("round_index", 0))
        return machine

    def state(self) -> dict:
        return {
            "knobs": dict(self.knobs),
            "ranges": {
                name: {"low": spec.low, "high": spec.high, "unit": spec.unit}
                for name, spec in KNOBS.items()
            },
            "last_features": self.last.features if self.last else None,
            "last_score": self.last.score if self.last else None,
            "last_round_id": self.last.round_id if self.last else None,
            "bake_count": self.round_index,
            "results_on_disk": len(self.history()),
        }

    def history(self) -> list[dict]:
        """Every bake whose result is on disk, oldest first."""

        if self.result_dir is None or not self.result_dir.exists():
            return []
        entries: list[dict] = []
        for path in sorted(self.result_dir.glob("*.json")):
            try:
                entries.append(json.loads(path.read_text(encoding="utf-8")))
            except (OSError, ValueError):
                continue
        return entries

    def set_knob(self, name: str, value: float) -> dict:
        if name not in KNOBS:
            raise KnobError(f"unknown knob {name!r}; the machine has {sorted(KNOBS)}")
        spec = KNOBS[name]
        if not spec.low <= value <= spec.high:
            raise KnobError(f"{name}={value} is outside {spec.low}..{spec.high} {spec.unit}")
        self.knobs[name] = float(value)
        self.save()
        return {"knobs": dict(self.knobs)}

    def bake(self, round_id: str) -> BakeResult:
        self.round_index += 1
        features, score = run_taste(dict(self.knobs), self.seed, self.round_index)
        self.save()
        result = BakeResult(round_id=round_id, knobs=dict(self.knobs), features=features, score=score)
        self.last = result
        if self.result_dir is not None:
            # The bake's own record, written where a reader can open it. The
            # implement node reads this file rather than restating its contents.
            self.result_dir.mkdir(parents=True, exist_ok=True)
            (self.result_dir / f"{round_id}.json").write_text(
                result.model_dump_json(indent=2) + "\n", encoding="utf-8"
            )
        if self.log_path is not None:
            self.log_path.parent.mkdir(parents=True, exist_ok=True)
            with self.log_path.open("a", encoding="utf-8") as handle:
                handle.write(result.model_dump_json() + "\n")
        return result


def _server_class(name: str):
    """The MCP server class this environment provides.

    fast-agent 0.10 runs against either MCP SDK line: v1 exposes `FastMCP`, and
    v2 renames it to `MCPServer`. Both decorate functions the same way.
    """

    try:
        from mcp.server.fastmcp import FastMCP

        return FastMCP(name)
    except ModuleNotFoundError:
        from mcp.server.mcpserver import MCPServer

        return MCPServer(name)


def build_server(machine: Machine):
    """Build the MCP server the implement node alone is given."""

    server = _server_class("machine")

    @server.tool(name="get_state")
    def get_state() -> dict:
        """The knobs as they stand, their ranges, and the last bake's features and score."""
        return machine.state()

    @server.tool(name="set_knob")
    def set_knob(name: str, value: float) -> dict:
        """Set one knob. A value outside its range is refused and changes nothing."""
        try:
            return machine.set_knob(name, float(value))
        except KnobError as exc:
            return {"refused": str(exc), "knobs": dict(machine.knobs)}

    @server.tool(name="set_knobs")
    def set_knobs(values: dict[str, float]) -> dict:
        """Set several knobs at once; the whole call is refused if any value is outside range."""
        for name, value in values.items():
            if name not in KNOBS:
                return {"refused": f"unknown knob {name!r}", "knobs": dict(machine.knobs)}
            spec = KNOBS[name]
            if not spec.low <= float(value) <= spec.high:
                return {
                    "refused": f"{name}={value} is outside {spec.low}..{spec.high} {spec.unit}",
                    "knobs": dict(machine.knobs),
                }
        for name, value in values.items():
            machine.set_knob(name, float(value))
        return {"knobs": dict(machine.knobs)}

    @server.tool(name="bake")
    def bake(round_id: str) -> dict:
        """Bake once with the knobs as they stand, and return the features and score."""
        try:
            return machine.bake(round_id).model_dump()
        except ValidationError as exc:  # a taste-program bug, not a chain decision
            return {"error": str(exc), "round_id": round_id}

    @server.tool(name="read_result")
    def read_result(round_id: str) -> dict:
        """Read one bake's result: the knobs sent, the five features, and the score."""
        if machine.result_dir is None:
            return {"error": "results are not kept on disk in this run"}
        path = machine.result_dir / f"{round_id}.json"
        if not path.exists():
            return {"error": f"no result file for {round_id}", "path": str(path)}
        return json.loads(path.read_text(encoding="utf-8"))

    @server.tool(name="list_results")
    def list_results() -> dict:
        """List every bake already made, oldest first: its round, knobs, features, and score."""
        history = machine.history()
        return {
            "bakes": history,
            "count": len(history),
            "best": max(history, key=lambda entry: entry.get("score") or 0.0) if history else None,
        }

    return server
