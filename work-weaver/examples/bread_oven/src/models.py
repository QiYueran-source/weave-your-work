"""The values the chain hands from one node to the next.

Each node boundary carries exactly one model from this file. The chain checks a
value against its model before the next node runs; a value that does not fit
stops the round at that edge rather than reaching a model that would guess.
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field, field_validator

from src.config import KNOBS

GrillVerdict = Literal["accept", "revise", "stop"]


def _require_knobs(settings: dict[str, float]) -> dict[str, float]:
    if not settings:
        raise ValueError("at least one knob must be set")
    unknown = set(settings) - set(KNOBS)
    if unknown:
        raise ValueError(f"unknown knobs {sorted(unknown)}; the machine has {sorted(KNOBS)}")
    for name, value in settings.items():
        bounds = KNOBS[name]
        if not bounds.low <= value <= bounds.high:
            raise ValueError(f"{name}={value} is outside {bounds.low}..{bounds.high} {bounds.unit}")
    return dict(settings)


class Intent(BaseModel):
    """What the switch carries: the round's id and nothing else."""

    round_id: str
    signal: Literal["start_bake"] = "start_bake"


class Observation(BaseModel):
    """What earlier bakes did, and how this round opens."""

    round_id: str
    analysis: str
    candidate_knobs: dict[str, float] = Field(default_factory=dict)

    @field_validator("candidate_knobs")
    @classmethod
    def _knobs(cls, value: dict[str, float]) -> dict[str, float]:
        return _require_knobs(value) if value else {}


class GrillOutcome(BaseModel):
    """The plan the proposer stands behind; the grill decides whether to accept it."""

    round_id: str
    knobs: dict[str, float]
    reasons: dict[str, str] = Field(default_factory=dict)
    notes: str = ""

    @field_validator("knobs")
    @classmethod
    def _knobs(cls, value: dict[str, float]) -> dict[str, float]:
        return _require_knobs(value)


class GrillVerdictMessage(BaseModel):
    """The grill agent's answer on one draft."""

    verdict: GrillVerdict
    reasons: list[str] = Field(default_factory=list)
    requested_changes: list[str] = Field(default_factory=list)


class GrillResult(BaseModel):
    """What the grill node hands on: the plan, whether it was agreed, and how long it took."""

    round_id: str
    verdict: GrillVerdict
    agreed: bool
    rounds_taken: int
    knobs: dict[str, float]
    reasons: dict[str, str] = Field(default_factory=dict)
    notes: str = ""

    @field_validator("knobs")
    @classmethod
    def _knobs(cls, value: dict[str, float]) -> dict[str, float]:
        return _require_knobs(value)


class SpecDraft(BaseModel):
    """What this bake should reach, and why."""

    round_id: str
    goal: str
    reasons: list[str] = Field(default_factory=list)
    knobs: dict[str, float]

    @field_validator("knobs")
    @classmethod
    def _knobs(cls, value: dict[str, float]) -> dict[str, float]:
        return _require_knobs(value)


class TicketStep(BaseModel):
    order: int
    action: str
    knobs: dict[str, float] = Field(default_factory=dict)

    @field_validator("knobs")
    @classmethod
    def _knobs(cls, value: dict[str, float]) -> dict[str, float]:
        return _require_knobs(value) if value else {}


class Plan(BaseModel):
    """Three to six steps implement follows, each with its knob values."""

    round_id: str
    steps: list[TicketStep]

    @field_validator("steps")
    @classmethod
    def _steps(cls, value: list[TicketStep]) -> list[TicketStep]:
        if not 3 <= len(value) <= 6:
            raise ValueError(f"a plan holds 3 to 6 steps, not {len(value)}")
        return value


class BakeResult(BaseModel):
    """What the bake produced, and what it was asked to do."""

    round_id: str
    knobs: dict[str, float]
    features: dict[str, float] | None = None
    score: float | None = None
    refused: list[str] = Field(default_factory=list)


class KnobState(BaseModel):
    """The machine as a node sees it: where the knobs stand and what the last bake scored."""

    knobs: dict[str, float]
    ranges: dict[str, dict]
    last_features: dict[str, float] | None = None
    last_score: float | None = None
    last_round_id: str | None = None
    bake_count: int = 0
