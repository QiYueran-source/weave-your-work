"""A run carries on from what is on disk, and a failed round keeps its number."""

import json
from pathlib import Path

from src.config import RunConfig
from src.machine.records import RecordStore


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


def test_a_new_process_counts_the_rounds_on_disk(tmp_path):
    config = make_config(tmp_path)
    store = RecordStore(config)
    assert store.next_round_index() == 1
    for index in (1, 2):
        (config.records_root / f"round-{index:02d}").mkdir(parents=True, exist_ok=True)

    # A second process, with its own store, sees the same rounds.
    assert RecordStore(make_config(tmp_path)).next_round_index() == 3


def test_a_failed_round_keeps_its_number(tmp_path):
    """A round that baked but never wrote records must not be handed out again."""

    config = make_config(tmp_path)
    RecordStore(config)
    (config.records_root / "results").mkdir(exist_ok=True)
    (config.records_root / "results" / "round-04.json").write_text(
        json.dumps({"round_id": "round-04", "knobs": {}, "features": None, "score": None}),
        encoding="utf-8",
    )
    # Only rounds 1-3 have directories; the bake in results/ holds the fourth.
    assert RecordStore(config).next_round_index() == 5


def test_the_machine_state_also_holds_the_count(tmp_path):
    config = make_config(tmp_path)
    RecordStore(config)
    (config.records_root / "machine-state.json").write_text(
        json.dumps({"knobs": {}, "round_index": 7}), encoding="utf-8"
    )
    assert RecordStore(config).next_round_index() == 8
