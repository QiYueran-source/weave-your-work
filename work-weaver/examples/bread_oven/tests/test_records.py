import json
from pathlib import Path

from src.config import RunConfig
from src.machine.records import RecordError, RecordStore
from src.machine.server import Machine


def make_config(tmp_path: Path) -> RunConfig:
    return RunConfig(
        records_root=tmp_path / "runs",
        log_root=tmp_path / "logs",
        handbooks_root=tmp_path / "handbooks",
        templates_root=Path(__file__).resolve().parents[1] / "templates",
        model="playback",
        grill_max_rounds=2,
        taste_seed=7,
    )


def test_person_handbook_is_readable_and_never_writable(tmp_path):
    config = make_config(tmp_path)
    store = RecordStore(config)
    assert "crispness" in store.read_base_handbook()
    assert not hasattr(store, "write_base_handbook")
    assert store.read_evolving_handbook().startswith("# Evolving handbook")


def test_a_record_without_a_pen_cannot_be_written(tmp_path):
    config = make_config(tmp_path)
    store = RecordStore(config)
    store.hold_pen(1, "testimony", "observe")
    store.append_testimony(1, "observe", "baked 0.41")
    with pytest_raises(RecordError):
        store.write_text_record(1, "spec", "spec", "not yours")


def test_a_record_closed_by_one_node_stays_closed(tmp_path):
    config = make_config(tmp_path)
    store = RecordStore(config)
    store.hold_pen(1, "testimony", "observe")
    store.close_pen(1, "testimony")
    with pytest_raises(RecordError):
        store.hold_pen(1, "testimony", "implement")


def test_evolving_handbook_is_capped(tmp_path):
    config = make_config(tmp_path)
    store = RecordStore(config)
    entries = "\n".join(f"- [round-01] entry {i}" for i in range(31))
    with pytest_raises(RecordError):
        store.write_evolving_handbook(entries)
    store.write_evolving_handbook("\n".join(f"- [round-01] entry {i}" for i in range(5)))
    assert "entry 4" in store.read_evolving_handbook()


def test_machine_refuses_a_knob_outside_its_range(tmp_path):
    machine = Machine(seed=7)
    before = dict(machine.knobs)
    with pytest_raises(Exception):
        machine.set_knob("oven_temperature", 400)
    assert machine.knobs == before


def test_machine_state_has_no_simulator_parameters(tmp_path):
    state = Machine(seed=7).state()
    assert set(state["knobs"]) == {
        "oven_temperature",
        "bake_time",
        "proofing_time",
        "water_amount",
        "sugar_amount",
    }
    assert "peaks" not in json.dumps(state)


class pytest_raises:
    """A tiny stand-in so these tests need no plugin beyond pytest itself."""

    def __init__(self, exc):
        self.exc = exc

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return exc_type is not None and issubclass(exc_type, self.exc)


def test_the_handbook_says_the_range_is_the_machines_limit(tmp_path):
    """The handbook's limit is the range itself: outside it the machine refuses."""

    from src.config import KNOBS

    handbook = (Path(__file__).resolve().parents[1] / "templates" / "base.md").read_text(encoding="utf-8")
    assert "the machine's limit" in handbook

    machine = Machine(seed=7)
    # Inside the range but at the end the handbook calls raw: accepted, baked, and
    # scored below a loaf that is merely untuned.
    from src.config import DEFAULT_KNOBS
    from src.machine.taste import bake as taste_bake

    machine.set_knob("bake_time", KNOBS["bake_time"].low)
    result = machine.bake("round-01")
    assert result.score is not None
    untuned, untuned_score = taste_bake(DEFAULT_KNOBS, seed=7, round_index=1)
    assert result.score < untuned_score

    # Outside the range: refused, and the knob keeps its value.
    kept = machine.knobs["bake_time"]
    with pytest_raises(Exception):
        machine.set_knob("bake_time", KNOBS["bake_time"].high + 50)
    assert machine.knobs["bake_time"] == kept


def test_the_handbook_gives_starting_values_and_no_optimum(tmp_path):
    handbook = (Path(__file__).resolve().parents[1] / "templates" / "base.md").read_text(encoding="utf-8")
    from src.config import DEFAULT_KNOBS

    for name, value in DEFAULT_KNOBS.items():
        assert name in handbook
        assert str(int(value)) in handbook
    # The bake starts at the handbook's values, and the two agree.
    machine = Machine(seed=7)
    assert machine.knobs == DEFAULT_KNOBS
    # Nothing from the taste program's internals may leak into what the chain
    # reads: no method, no parameter of the curve, no per-bake taste.
    from src.machine import taste

    for word in ("gaussian", "exp(", "softmax", "peak=", "half_width", "perturbation", "seed"):
        assert word not in handbook.lower(), word
    for knob in taste._PEAKS:
        row = next(line for line in handbook.splitlines() if line.startswith(f"| `{knob}`"))
        assert str(taste._PEAKS[knob]) not in row, f"{knob}'s optimum leaked into its row"
