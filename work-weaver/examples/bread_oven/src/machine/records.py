"""The records server: the only home of testimony, spec, tickets, and handbooks.

Every tool does one operation with a narrow signature, so a node that was not
given a write tool for a record cannot overreach. Two rules the server owns:

- a record is writable only while the node that holds its pen for the round is
  standing, and it stays closed once any node closes it;
- the person's handbook is readable and never writable.

Rounds are read from the runs directory, so a new process continues where the
last one stopped without keeping anything in memory:

    <runs>/round-01/testimony.md   <runs>/round-01/spec.md
    <runs>/round-01/tickets.md     <runs>/round-01/round.json
    <handbooks>/base.md            <handbooks>/evolving.md
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from pathlib import Path

from src.config import RunConfig

ROUND_DIR = re.compile(r"^round-(\d+)$")
MAX_HANDBOOK_ENTRIES = 30
BASE_HANDBOOK = "base.md"
EVOLVING_HANDBOOK = "evolving.md"


class RecordError(Exception):
    """A read or write the server refuses, with a reason the caller can act on."""


@dataclass
class RecordStore:
    """The run's records on disk, and which pens are open right now."""

    config: RunConfig
    _pens: dict[str, str] = field(default_factory=dict)
    _closed: set[str] = field(default_factory=set)

    def __post_init__(self) -> None:
        self.config.records_root.mkdir(parents=True, exist_ok=True)
        self.config.handbooks_root.mkdir(parents=True, exist_ok=True)
        base = self.config.handbooks_root / BASE_HANDBOOK
        if not base.exists():
            template = self.config.templates_root / BASE_HANDBOOK
            base.write_text(template.read_text(encoding="utf-8"), encoding="utf-8")
        if not (self.config.handbooks_root / EVOLVING_HANDBOOK).exists():
            (self.config.handbooks_root / EVOLVING_HANDBOOK).write_text(
                "# Evolving handbook\n\nNothing learned yet.\n", encoding="utf-8"
            )

    # ── rounds ──────────────────────────────────────────────────────────────

    def round_dirs(self) -> list[tuple[int, Path]]:
        found: list[tuple[int, Path]] = []
        for entry in self.config.records_root.iterdir():
            match = ROUND_DIR.match(entry.name) if entry.is_dir() else None
            if match:
                found.append((int(match.group(1)), entry))
        return sorted(found)

    def next_round_index(self) -> int:
        """The next number, counted over everything the run left behind.

        A round that died before writing its records still has a bake, and a
        bake counts: the number comes from the machine's bake count and the
        result files as well as the round directories, so a failed round is
        never reused by mistake.
        """

        seen = [index for index, _ in self.round_dirs()]
        results = self.config.records_root / "results"
        if results.exists():
            for path in results.glob("round-*.json"):
                try:
                    seen.append(int(path.stem.split("-")[1]))
                except (IndexError, ValueError):
                    continue
        state = self.config.records_root / "machine-state.json"
        if state.exists():
            try:
                seen.append(int(json.loads(state.read_text(encoding="utf-8")).get("round_index", 0)))
            except (OSError, ValueError, TypeError):
                pass
        return max(seen, default=0) + 1

    def round_dir(self, round_index: int) -> Path:
        return self.config.records_root / f"round-{round_index:02d}"

    def list_rounds(self) -> list[dict]:
        listing: list[dict] = []
        for index, directory in self.round_dirs():
            listing.append(
                {
                    "round": index,
                    "has_testimony": (directory / "testimony.md").exists(),
                    "has_spec": (directory / "spec.md").exists(),
                    "has_tickets": (directory / "tickets.md").exists(),
                    "has_round": (directory / "round.json").exists(),
                }
            )
        return listing

    # ── pens ────────────────────────────────────────────────────────────────

    def hold_pen(self, round_index: int, record: str, holder: str) -> None:
        self._pens[f"{round_index}:{record}"] = holder

    def close_pen(self, round_index: int, record: str) -> None:
        """Close a record: every later write is refused, from any node."""
        key = f"{round_index}:{record}"
        self._pens.pop(key, None)
        self._closed.add(key)

    def closed_pens(self, round_index: int) -> set[str]:
        prefix = f"{round_index}:"
        return {key[len(prefix):] for key in self._closed if key.startswith(prefix)}

    def _require_open(self, round_index: int, record: str) -> Path:
        if f"{round_index}:{record}" in self._closed:
            raise RecordError(f"{record} is closed for round {round_index}")
        if self._pens.get(f"{round_index}:{record}") is None:
            raise RecordError(f"{record} for round {round_index} is not open for writing")
        return self.round_dir(round_index)

    # ── records ─────────────────────────────────────────────────────────────

    def append_testimony(self, round_index: int, heading: str, body: str) -> dict:
        directory = self._require_open(round_index, "testimony")
        directory.mkdir(parents=True, exist_ok=True)
        path = directory / "testimony.md"
        fresh = not path.exists() or path.stat().st_size == 0
        with path.open("a", encoding="utf-8") as handle:
            if fresh:
                handle.write(f"# Round {round_index:02d} testimony\n")
            handle.write(f"\n## {heading}\n\n{body.rstrip()}\n")
        return {"round": round_index, "lines": len(path.read_text(encoding="utf-8").splitlines())}

    def write_text_record(self, round_index: int, record: str, title: str, body: str) -> str:
        directory = self._require_open(round_index, record)
        directory.mkdir(parents=True, exist_ok=True)
        path = directory / f"{record}.md"
        path.write_text(f"# Round {round_index:02d} {title}\n\n{body.rstrip()}\n", encoding="utf-8")
        return str(path)

    def read_record(self, round_index: int, record: str) -> str | None:
        path = self.round_dir(round_index) / f"{record}.md"
        return path.read_text(encoding="utf-8") if path.exists() else None

    # ── handbooks ───────────────────────────────────────────────────────────

    def read_base_handbook(self) -> str:
        return (self.config.handbooks_root / BASE_HANDBOOK).read_text(encoding="utf-8")

    def read_evolving_handbook(self) -> str:
        return (self.config.handbooks_root / EVOLVING_HANDBOOK).read_text(encoding="utf-8")

    def write_evolving_handbook(self, text: str) -> dict:
        entries = [line for line in text.splitlines() if line.strip().startswith("- ")]
        if len(entries) > MAX_HANDBOOK_ENTRIES:
            raise RecordError(
                f"the evolving handbook holds at most {MAX_HANDBOOK_ENTRIES} entries, "
                f"this one has {len(entries)}"
            )
        path = self.config.handbooks_root / EVOLVING_HANDBOOK
        path.write_text(text.rstrip() + "\n", encoding="utf-8")
        return {"entries": len(entries), "path": str(path)}


class RoundCursor(dict):
    """Which round the record tools act on, and which node is standing."""

    def __init__(self, round_index: int) -> None:
        super().__init__(round=round_index, node="gateway")

    def bind(self, node: str, round_index: int) -> None:
        self["node"] = node
        self["round"] = round_index


def hold_pen(store: RecordStore, round_index: int, record: str, holder: str) -> None:
    """Give one node the pen for one record of this round."""

    store.hold_pen(round_index, record, holder)


def close_pen(store: RecordStore, round_index: int, record: str) -> None:
    """Close one record of this round for every caller."""

    store.close_pen(round_index, record)


def build_server(store: RecordStore, cursor: RoundCursor):
    """Build the MCP server that reads and writes the run's records."""

    from src.machine.server import _server_class

    server = _server_class("records")
    current = cursor

    def current_round(round: int | None) -> int:
        return round if round is not None else current["round"]

    @server.tool(name="append_testimony")
    def append_testimony(heading: str, body: str) -> dict:
        """Append a section to this round's testimony. Only while your node holds the pen."""
        return store.append_testimony(current["round"], heading, body)

    @server.tool(name="read_testimony")
    def read_testimony(round: int | None = None) -> dict:
        """Read a round's testimony; the current round when round is omitted."""
        index = current_round(round)
        return {"round": index, "text": store.read_record(index, "testimony")}

    @server.tool(name="list_testimony")
    def list_testimony() -> dict:
        """List every round on disk, oldest first, with which records it holds."""
        return {"rounds": store.list_rounds()}

    @server.tool(name="write_spec")
    def write_spec(body: str) -> dict:
        """Write this round's spec. Only while your node holds the pen."""
        path = store.write_text_record(current["round"], "spec", "spec", body)
        return {"round": current["round"], "path": path}

    @server.tool(name="read_spec")
    def read_spec(round: int | None = None) -> dict:
        """Read a round's spec; the current round when round is omitted."""
        index = current_round(round)
        return {"round": index, "text": store.read_record(index, "spec")}

    @server.tool(name="write_tickets")
    def write_tickets(body: str) -> dict:
        """Write this round's tickets. Only while your node holds the pen."""
        path = store.write_text_record(current["round"], "tickets", "tickets", body)
        return {"round": current["round"], "path": path}

    @server.tool(name="read_tickets")
    def read_tickets(round: int | None = None) -> dict:
        """Read a round's tickets; the current round when round is omitted."""
        index = current_round(round)
        return {"round": index, "text": store.read_record(index, "tickets")}

    @server.tool(name="read_base_handbook")
    def read_base_handbook() -> dict:
        """Read the person's handbook. It never changes."""
        return {"text": store.read_base_handbook()}

    @server.tool(name="read_evolving_handbook")
    def read_evolving_handbook() -> dict:
        """Read the handbook this chain keeps and rewrites."""
        return {"text": store.read_evolving_handbook()}

    @server.tool(name="write_evolving_handbook")
    def write_evolving_handbook(text: str) -> dict:
        """Replace the evolving handbook. At most 30 entries, each tagged [round-NN]."""
        try:
            return store.write_evolving_handbook(text)
        except RecordError as exc:
            return {"refused": str(exc)}

    return server
