"""The taste program: one bake in, five features and one score out.

The design is the outline the spec records while its author supplies the exact
formulas: five features from 0 to 1, each moved by every knob along a
single-peaked curve and dominated by one knob, no interaction between knobs, a
small perturbation on each feature, and one taste draw per bake.

Nothing here is visible to the chain. The machine server calls it and returns
only the features, the score, and refusals.
"""

from __future__ import annotations

import math
import random
from dataclasses import dataclass

from src.config import FEATURES, KNOBS

# Where each knob's curve peaks, and how fast the feature falls away from it.
# Every peak sits inside the knob's range, so the chain can reach it by adjusting.
_PEAKS: dict[str, float] = {
    "oven_temperature": 215.0,
    "bake_time": 45.0,
    "proofing_time": 75.0,
    "water_amount": 70.0,
    "sugar_amount": 8.0,
}

_HALF_WIDTH: dict[str, float] = {
    "oven_temperature": 28.0,
    "bake_time": 14.0,
    "proofing_time": 30.0,
    "water_amount": 12.0,
    "sugar_amount": 4.5,
}

_DOMINANT: dict[str, str] = {
    "oven_temperature": "crispness",
    "bake_time": "chewiness",
    "proofing_time": "softness",
    "water_amount": "moistness",
    "sugar_amount": "sweetness",
}

_DOMINANT_WEIGHT = 1.0
_CROSS_WEIGHT = 0.3

# The handbook's floors: outside these the loaf is raw or scorched and the
# feature the knob drives collapses.
_FLOORS: dict[str, tuple[float, float]] = {
    "bake_time": (23.0, 62.0),
    "oven_temperature": (165.0, 240.0),
}

_FEATURE_FLOOR = 0.05
_PERTURBATION = 0.05


def dominant_feature(knob: str) -> str:
    return _DOMINANT[knob]


def _bell(knob: str, value: float) -> float:
    peak = _PEAKS[knob]
    half_width = _HALF_WIDTH[knob]
    return math.exp(-0.5 * ((value - peak) / half_width) ** 2)


@dataclass(frozen=True)
class Taste:
    """One bake's taste: the weight each feature carries toward the score."""

    weights: dict[str, float]


def draw_taste(seed: int, round_index: int) -> Taste:
    """Draw one bake's taste from the run's seed and the round's index.

    The draw is fixed for a round, so rerunning the same round scores the same
    way, and about three bakes in ten lean clearly toward one feature.
    """

    rng = random.Random(f"taste-{seed}-{round_index}")
    logits = {name: rng.uniform(-1.0, 1.0) for name in FEATURES}
    if rng.random() < 0.3:
        logits[rng.choice(FEATURES)] += 2.5
    top = max(logits.values())
    exps = {name: math.exp(value - top) for name, value in logits.items()}
    total = sum(exps.values())
    return Taste(weights={name: exps[name] / total for name in FEATURES})


def compute_features(knobs: dict[str, float], seed: int, round_index: int) -> dict[str, float]:
    """Score every feature for one bake, then perturb each by about five percent."""

    rng = random.Random(f"features-{seed}-{round_index}")
    lift: dict[str, float] = {}
    for feature in FEATURES:
        total = 0.0
        for knob in KNOBS:
            weight = _DOMINANT_WEIGHT if _DOMINANT[knob] == feature else _CROSS_WEIGHT
            total += weight * _bell(knob, knobs[knob])
        lift[feature] = total

    lowest, highest = min(lift.values()), max(lift.values())
    span = highest - lowest or 1.0
    features = {
        name: (value - lowest) / span * (1.0 - _FEATURE_FLOOR) + _FEATURE_FLOOR
        for name, value in lift.items()
    }

    for knob, (low, high) in _FLOORS.items():
        if not low <= knobs[knob] <= high:
            features[_DOMINANT[knob]] *= 0.1

    for name in features:
        features[name] = min(
            1.0, max(0.0, features[name] + rng.uniform(-_PERTURBATION, _PERTURBATION))
        )
    return features


def score(features: dict[str, float], taste: Taste) -> float:
    """The features under one bake's taste, from 0 to 1."""

    return round(sum(features[name] * taste.weights[name] for name in FEATURES), 4)


def bake(knobs: dict[str, float], seed: int, round_index: int) -> tuple[dict[str, float], float]:
    """Run one bake: the features, and the score a person with this taste would give."""

    features = compute_features(knobs, seed, round_index)
    return features, score(features, draw_taste(seed, round_index))
