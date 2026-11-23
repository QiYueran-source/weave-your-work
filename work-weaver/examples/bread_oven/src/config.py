"""What one run needs to locate itself: the knobs, the model, and the paths.

Paths default to the example's own directories and can be moved by environment
variables, so a test or a second run never writes into the checked-in folders.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

from pydantic import BaseModel, ConfigDict

EXAMPLE_ROOT = Path(__file__).resolve().parent.parent


class KnobRange(BaseModel):
    """One knob the machine accepts, with the range its server enforces."""

    model_config = ConfigDict(frozen=True)

    name: str
    unit: str
    low: float
    high: float


# The five knobs, fixed for this version. Each dominates one feature:
# temperature -> crispness, bake time -> chewiness, proofing time -> softness,
# water amount -> moistness, sugar amount -> sweetness.
#
# The range is the machine's own limit: a value outside it is refused, so the
# rounds never bake a loaf that is raw or scorched at the ends. Inside the range
# every bake is a real loaf, and the score moves continuously with the knobs.
# Every peak sits inside its range, so each best value stays reachable.
KNOBS: dict[str, KnobRange] = {
    "oven_temperature": KnobRange(name="oven_temperature", unit="degC", low=195.0, high=240.0),
    "bake_time": KnobRange(name="bake_time", unit="min", low=30.0, high=62.0),
    "proofing_time": KnobRange(name="proofing_time", unit="min", low=20.0, high=46.0),
    "water_amount": KnobRange(name="water_amount", unit="pct_of_flour", low=56.0, high=88.0),
    "sugar_amount": KnobRange(name="sugar_amount", unit="pct_of_flour", low=3.0, high=14.0),
}

FEATURES: tuple[str, ...] = ("crispness", "moistness", "softness", "chewiness", "sweetness")

# The recipe a person would try before tuning anything: inside every range, far
# from every peak, and worth about 0.5 on the scale. The first round starts here.
DEFAULT_KNOBS: dict[str, float] = {
    "oven_temperature": 200.0,
    "bake_time": 40.0,
    "proofing_time": 20.0,
    "water_amount": 65.0,
    "sugar_amount": 5.0,
}


@dataclass(frozen=True)
class RunConfig:
    """What one process run reads, where it writes, and which model it uses."""

    records_root: Path
    log_root: Path
    handbooks_root: Path
    templates_root: Path
    model: str
    grill_max_rounds: int
    taste_seed: int
    max_iterations: int = 6
    quiet: bool = True

    @classmethod
    def from_env(cls) -> RunConfig:
        def path(name: str, default: Path) -> Path:
            # A relative path in .env means "beside the example", wherever the
            # round was started from.
            raw = Path(os.environ.get(name, default)).expanduser()
            return (raw if raw.is_absolute() else EXAMPLE_ROOT / raw).resolve()

        return cls(
            records_root=path("BREAD_RECORDS", Path("runs")),
            log_root=path("BREAD_LOGS", Path("logs")),
            handbooks_root=path("BREAD_HANDBOOKS", Path("handbooks")),
            templates_root=path("BREAD_TEMPLATES", EXAMPLE_ROOT / "templates"),
            model=os.environ.get("BREAD_MODEL", "generic.gpt-4.1"),
            grill_max_rounds=int(os.environ.get("BREAD_GRILL_ROUNDS", "3")),
            taste_seed=int(os.environ.get("BREAD_SEED", "7")),
            max_iterations=int(os.environ.get("BREAD_MAX_ITERATIONS", "8")),
            quiet=os.environ.get("BREAD_VERBOSE", "").strip() not in {"1", "true", "yes"},
        )
