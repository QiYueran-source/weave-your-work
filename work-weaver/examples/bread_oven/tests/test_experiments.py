"""One directory per experiment: a new batch gets the next number, --continue reuses."""

from __future__ import annotations

from src.experiments import latest_experiment, next_experiment, resolve_experiment


def test_a_new_batch_gets_the_next_free_number(tmp_path):
    assert resolve_experiment(tmp_path).name == "exp1"
    (tmp_path / "exp1").mkdir()
    assert resolve_experiment(tmp_path).name == "exp2"


def test_a_named_experiment_is_used_as_given(tmp_path):
    assert resolve_experiment(tmp_path, "pilot") == tmp_path / "pilot"


def test_continue_picks_the_highest_number_not_the_newest_mtime(tmp_path):
    for name in ("exp1-step", "exp2-continuous", "exp10"):
        (tmp_path / name).mkdir()
    assert latest_experiment(tmp_path).name == "exp10"
    assert resolve_experiment(tmp_path, continue_run=True).name == "exp10"


def test_continue_with_nothing_on_disk_starts_at_exp1(tmp_path):
    assert resolve_experiment(tmp_path, continue_run=True).name == "exp1"


def test_directories_that_are_not_experiments_are_ignored(tmp_path):
    (tmp_path / "scratch").mkdir()
    (tmp_path / "notes.txt").write_text("not an experiment", encoding="utf-8")
    assert next_experiment(tmp_path).name == "exp1"
