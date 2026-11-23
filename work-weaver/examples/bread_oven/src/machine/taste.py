"""The taste program: one bake in, five features and one score out.

The design is the outline the spec records while its author supplies the exact
formulas: five features from 0 to 1, each moved by every knob along a
single-peaked curve and dominated by one knob, no interaction between knobs, a
small perturbation on each feature, and one taste draw per bake. The score is
the features under that bake's taste, weighted and averaged: no offset, so a
loaf that is right nowhere reads near 0 and a loaf that is right everywhere
reads near 1.

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
# The peaks are spread out on purpose: knobs that peak near the whole range's
# middle leave a bake that sits mid-range looking good at every feature, and then
# nothing is left to learn.
_PEAKS: dict[str, float] = {
    "oven_temperature": 222.0,
    "bake_time": 51.0,
    "proofing_time": 34.0,
    "water_amount": 78.0,
    "sugar_amount": 9.5,
}

_HALF_WIDTH: dict[str, float] = {
    "oven_temperature": 20.0,
    "bake_time": 9.0,
    "proofing_time": 25.0,
    "water_amount": 7.0,
    "sugar_amount": 3.0,
}

_DOMINANT: dict[str, str] = {
    "oven_temperature": "crispness",
    "bake_time": "chewiness",
    "proofing_time": "softness",
    "water_amount": "moistness",
    "sugar_amount": "sweetness",
}

# A knob leads its own feature and touches the other four. Each effect is read
# through the same curve, against the knob's own half-width: a step toward a
# knob's peak helps the feature it leads and its neighbours together.
_DOMINANT_WEIGHT = 1.0
_CROSS_WEIGHT = 0.3

_FEATURE_FLOOR = 0.05

# Each feature's reading carries a perturbation of about this fraction of its
# own size, so a low feature keeps the same relative noise a high one has.
_PERTURBATION = 0.03


def dominant_feature(knob: str) -> str:
    return _DOMINANT[knob]


def _bell(knob: str, value: float) -> float:
    """How well a knob serves each feature, from 0 at its worst to 1 at its peak."""

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
    """Score every feature for one bake, then perturb each by about three percent."""

    rng = random.Random(f"features-{seed}-{round_index}")
    # Each feature is read on its own scale: what the five knobs do to it,
    # divided by the most those same knobs could ever do to it. A feature is a
    # 1.0 only when every knob sits where that feature wants it, so one knob at
    # its peak lifts nothing else to the top and nothing competes for the ceiling.
    features: dict[str, float] = {}
    for feature in FEATURES:
        lift = 0.0
        ceiling = 0.0
        for knob in KNOBS:
            weight = _DOMINANT_WEIGHT if _DOMINANT[knob] == feature else _CROSS_WEIGHT
            ceiling += weight
            lift += weight * _bell(knob, knobs[knob])
        features[feature] = _FEATURE_FLOOR + (1.0 - _FEATURE_FLOOR) * (lift / ceiling)

    for name in features:
        scale = 1.0 + rng.uniform(-_PERTURBATION, _PERTURBATION)
        features[name] = min(1.0, max(0.0, features[name] * scale))
    return features


def score(features: dict[str, float], taste: Taste) -> float:
    """The features under one bake's taste: their weighted mean, from 0 to 1.

    There is no offset. A loaf that is right nowhere reads near 0, a loaf that is
    right everywhere reads near 1, and every point between is earned by moving a
    knob toward where its feature wants it.
    """

    return round(sum(features[name] * taste.weights[name] for name in FEATURES), 4)


def bake(knobs: dict[str, float], seed: int, round_index: int) -> tuple[dict[str, float], float]:
    """Run one bake: the features, and the score a person with this taste would give."""

    features = compute_features(knobs, seed, round_index)
    return features, score(features, draw_taste(seed, round_index))
