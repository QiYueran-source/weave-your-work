"""The round without a model: routing, pens, verdicts, and restart."""

import json
from pathlib import Path

from src.agents.chain import NODES, prepare, run_chain, run_round, write_summary
from src.config import RunConfig
from src.models import (
    BakeResult,
    GrillOutcome,
    GrillVerdictMessage,
    Observation,
    Plan,
    SpecDraft,
    TicketStep,
)

TEMPLATES = Path(__file__).resolve().parents[1] / "templates"
KNOBS = {
    "oven_temperature": 210.0,
    "bake_time": 44.0,
    "proofing_time": 40.0,
    "water_amount": 69.0,
    "sugar_amount": 7.5,
}


def config(tmp_path: Path, grill_rounds: int = 2) -> RunConfig:
    return RunConfig(
        records_root=tmp_path / "runs",
        log_root=tmp_path / "logs",
        handbooks_root=tmp_path / "handbooks",
        templates_root=TEMPLATES,
        model="playback",
        grill_max_rounds=grill_rounds,
        taste_seed=7,
    )


class Script:
    """Controls that play each node, keyed by node name."""

    def __init__(self, verdicts):
        self.verdicts = list(verdicts)
        self.calls = []
        self._round = 0

    def _round_id(self, state) -> str:
        return f"round-{state['round_index']:02d}"

    async def observe(self, state, topic):
        self.calls.append(("observe", json.loads(topic)["signal"]))
        state["store"].append_testimony(state["round_index"], "observe", "opened")
        return Observation(round_id=self._round_id(state), analysis="chewiness is weakest")

    async def proposer(self, state, topic):
        self.calls.append(("proposer", topic[:30]))
        state["store"].write_evolving_handbook("# Evolving handbook\n\n- [round-01] oven 215 beat 200\n")
        return GrillOutcome(round_id=self._round_id(state), knobs=KNOBS, reasons={"bake_time": "r1"})

    async def grill(self, state, topic):
        verdict = self.verdicts.pop(0) if self.verdicts else "accept"
        self.calls.append(("grill", verdict))
        return GrillVerdictMessage(verdict=verdict, requested_changes=["raise the oven a little"])

    async def spec(self, state, topic):
        self.calls.append(("spec", json.loads(topic)["verdict"]))
        state["store"].write_text_record(state["round_index"], "spec", "spec", "goal: better chew")
        return SpecDraft(round_id=self._round_id(state), goal="better chew", knobs=KNOBS)

    async def tickets(self, state, topic):
        self.calls.append(("tickets", json.loads(topic)["goal"]))
        state["store"].write_text_record(state["round_index"], "tickets", "tickets", "1. set knobs")
        return Plan(
            round_id=self._round_id(state),
            steps=[
                TicketStep(order=1, action="oven", knobs={"oven_temperature": 210.0}),
                TicketStep(order=2, action="time", knobs={"bake_time": 44.0}),
                TicketStep(order=3, action="bake"),
            ],
        )

    async def implement(self, state, topic):
        self.calls.append(("implement", len(json.loads(topic)["steps"])))
        result = state["machine"].bake(self._round_id(state))
        # The bake's own account goes in its own file: the round's testimony
        # closed when the plan was made, and a closed record stays closed.
        directory = state["store"].round_dir(state["round_index"])
        (directory / "bake.md").write_text(
            f"score {result.score} with {result.knobs}\n", encoding="utf-8"
        )
        return result


async def run(tmp_path, script, grill_rounds=2):
    cfg = config(tmp_path, grill_rounds)
    state = prepare(cfg)
    from src.models import Intent

    outcome = await run_chain(state, Intent(round_id=f"round-{state['round_index']:02d}"), _all(script))
    write_summary(cfg, state["store"])
    return cfg, state, outcome


def _all(script):
    return {
        "observe": script.observe,
        "proposer": script.proposer,
        "grill": script.grill,
        "spec": script.spec,
        "tickets": script.tickets,
        "implement": script.implement,
    }


def test_an_accepted_plan_reaches_the_bake(tmp_path):
    import asyncio

    cfg, state, outcome = asyncio.run(run(tmp_path, Script(["accept"])))
    assert [c[0] for c in Script(["accept"]).calls or []] == []
    assert outcome["verdict"] == "accept"
    assert outcome["settled"] is True
    assert 0 <= outcome["score"] <= 1
    assert set(outcome["knobs"]) == set(KNOBS)
    assert (state["store"].round_dir(1) / "spec.md").exists()
    assert (state["store"].round_dir(1) / "tickets.md").exists()
    assert (cfg.records_root / "summary.json").exists()


def test_a_revise_sends_the_plan_back_once(tmp_path):
    import asyncio

    script = Script(["revise", "accept"])
    _, state, outcome = asyncio.run(run(tmp_path, script))
    nodes = [call[0] for call in script.calls]
    assert nodes.count("proposer") == 2
    assert nodes.count("grill") == 2
    assert outcome["verdict"] == "accept"
    assert outcome["grill_rounds"] == 2


def test_a_stop_ends_the_grill_with_what_it_has(tmp_path):
    import asyncio

    script = Script(["stop"])
    _, _, outcome = asyncio.run(run(tmp_path, script))
    assert outcome["verdict"] == "stop"
    assert outcome["settled"] is False
    assert outcome["score"] is not None


def test_the_round_limit_stops_a_grill_that_keeps_revising(tmp_path):
    import asyncio

    script = Script(["revise", "revise", "revise"])
    _, _, outcome = asyncio.run(run(tmp_path, script, grill_rounds=2))
    assert outcome["verdict"] == "stop"
    assert outcome["grill_rounds"] == 2


def test_a_record_is_closed_once_its_node_has_ended(tmp_path):
    import asyncio

    _, state, _ = asyncio.run(run(tmp_path, Script(["accept"])))
    closed = state["store"].closed_pens(1)
    assert {"testimony", "evolving", "spec", "tickets"} <= closed


def test_a_second_round_reads_the_first_rounds_records(tmp_path):
    import asyncio

    cfg = config(tmp_path)
    from src.models import Intent

    for _ in range(2):
        state = prepare(cfg)
        script = Script(["accept"])
        asyncio.run(run_chain(state, Intent(round_id=f"round-{state['round_index']:02d}"), _all(script)))
        write_summary(cfg, state["store"])

    assert len(state["store"].round_dirs()) == 2
    assert state["store"].read_record(1, "spec") is not None
    assert "round-01" in state["store"].read_evolving_handbook()
