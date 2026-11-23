"""The scoring contract the chain is shown: no offset, no jump, and a start near 0.5."""

from __future__ import annotations

from src.config import DEFAULT_KNOBS, FEATURES, KNOBS
from src.machine.taste import compute_features, draw_taste, score


def bake_score(knobs, round_index: int = 1) -> float:
    return score(compute_features(knobs, seed=7, round_index=round_index), draw_taste(7, round_index))


def test_the_untuned_recipe_scores_about_half():
    assert 0.42 <= bake_score(DEFAULT_KNOBS) <= 0.58


def test_the_score_is_the_weighted_mean_with_no_offset():
    round_index = 3
    features = compute_features(DEFAULT_KNOBS, seed=7, round_index=round_index)
    taste = draw_taste(7, round_index)
    expected = round(sum(features[name] * taste.weights[name] for name in FEATURES), 4)
    assert score(features, taste) == expected


def test_the_score_does_not_jump_at_the_old_proofing_boundary():
    """The retired floor used to drop the score by 0.38 between 46 and 46.01."""

    inside = bake_score({**DEFAULT_KNOBS, "proofing_time": 46.0})
    outside = bake_score({**DEFAULT_KNOBS, "proofing_time": 46.01})
    assert abs(inside - outside) < 0.01


def test_a_knob_at_either_end_scores_below_that_knob_at_its_peak():
    from src.machine.taste import _PEAKS

    for name, spec in KNOBS.items():
        best = bake_score({**DEFAULT_KNOBS, name: _PEAKS[name]})
        for end in (spec.low, spec.high):
            assert bake_score({**DEFAULT_KNOBS, name: end}) < best


def test_the_perturbation_is_a_fraction_of_each_feature():
    """Two bakes of one recipe differ by the perturbation, not by a fixed amount."""

    one = compute_features(DEFAULT_KNOBS, seed=7, round_index=1)
    other = compute_features(DEFAULT_KNOBS, seed=7, round_index=2)
    for name in FEATURES:
        ratio = other[name] / one[name]
        assert 0.94 <= ratio <= 1.06


def test_every_knob_leads_two_or_three_features():
    from src.machine.taste import _LEADS

    for knob, leads in _LEADS.items():
        assert 2 <= len(leads) <= 3, knob
        assert leads <= set(FEATURES), knob


def test_every_feature_is_led_by_at_least_two_knobs():
    from src.machine.taste import _LEADS

    for feature in FEATURES:
        leaders = [knob for knob, leads in _LEADS.items() if feature in leads]
        assert len(leaders) >= 2, feature


def test_a_step_on_one_knob_moves_several_features():
    from src.machine.taste import _PEAKS

    start = compute_features(DEFAULT_KNOBS, seed=7, round_index=1)
    moved = compute_features(
        {**DEFAULT_KNOBS, "oven_temperature": _PEAKS["oven_temperature"]}, seed=7, round_index=1
    )
    lifted = [name for name in FEATURES if moved[name] - start[name] > 0.05]
    assert len(lifted) >= 3
