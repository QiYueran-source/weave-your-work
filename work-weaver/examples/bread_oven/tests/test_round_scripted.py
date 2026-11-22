"""The real six nodes, driven by scripted models and both MCP servers over stdio.

This is the round the spec's acceptance names: every node function runs, the
tools are reached through MCP, and the only thing replaced is the model.
"""

import asyncio
import json
import sys
from pathlib import Path

import pytest

from fast_agent.llm.internal.playback import PlaybackLLM
from fast_agent.mcp.prompt import Prompt

HERE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(HERE))

from src.agents.chain import run_round  # noqa: E402
from src.config import RunConfig  # noqa: E402

NODES = ("records", "machine")

SCRIPTS = {
    "observe": [
        {"round_id": "round-01", "analysis": "chewiness is weakest", "candidate_knobs": {"bake_time": 45}}
    ],
    "proposer": [
        {
            "round_id": "round-01",
            "knobs": {
                "oven_temperature": 215,
                "bake_time": 45,
                "proofing_time": 75,
                "water_amount": 70,
                "sugar_amount": 8,
            },
            "reasons": {"bake_time": "chewiness was weakest"},
            "notes": "first plan",
        }
    ],
    "grill": [{"verdict": "accept", "reasons": [], "requested_changes": []}],
    "spec": [
        {
            "round_id": "round-01",
            "goal": "raise chewiness without losing moistness",
            "reasons": ["chewiness was weakest"],
            "knobs": {"oven_temperature": 215, "bake_time": 45},
        }
    ],
    "implement": [],
    "tickets": [
        {
            "round_id": "round-01",
            "steps": [
                {"order": 1, "action": "set the oven", "knobs": {"oven_temperature": 215}},
                {"order": 2, "action": "set the bake time", "knobs": {"bake_time": 45}},
                {"order": 3, "action": "bake", "knobs": {}},
            ],
        }
    ],
}


class ScriptedModel(PlaybackLLM):
    """Answers from a fixed script; calls the machine's tools when it is implement."""

    def __init__(self, node: str, script: list[dict], machine_calls: list):
        super().__init__(name=f"scripted-{node}")
        self.node = node
        self.script = list(script)
        self.machine_calls = machine_calls

    async def generate(self, messages, request_params=None, tools=None):
        self._synthetic_turn_count += 1
        if self.node != "implement":
            return Prompt.assistant(json.dumps(self.script.pop(0)))
        result = self.machine_calls["bake"]() if "bake" in self.machine_calls else None
        return Prompt.assistant(json.dumps(result))


def make_config(tmp_path: Path) -> RunConfig:
    return RunConfig(
        records_root=tmp_path / "runs",
        log_root=tmp_path / "logs",
        handbooks_root=tmp_path / "handbooks",
        templates_root=HERE / "templates",
        model="playback",
        grill_max_rounds=2,
        taste_seed=7,
    )


def test_real_nodes_run_the_round_with_scripted_models(tmp_path):
    """Every node function runs, the machine bakes, and the round lands on disk."""
    from src.agents.chain import define_agents, read_templates
    from fast_agent import FastAgent

    config = make_config(tmp_path)
    fast = define_agents(FastAgent("bread-oven"), read_templates(config))
    machine_calls = {}
    state_holder = {}

    def factory(node: str):
        if node == "implement":
            machine_calls["bake"] = lambda: state_holder["machine"].bake("round-01").model_dump()
        return ScriptedModel(node, SCRIPTS[node], machine_calls)

    from src.agents import chain as chain_module

    original = chain_module.prepare

    def prepare_with_holder(cfg):
        state = original(cfg)
        state_holder["machine"] = state["machine"]
        return state

    chain_module.prepare = prepare_with_holder
    try:
        outcome = asyncio.run(run_round(fast, config, model_factory=factory))
    finally:
        chain_module.prepare = original
    assert outcome["verdict"] == "accept"
    assert outcome["settled"] is True
    assert 0.0 <= outcome["score"] <= 1.0
    directory = config.records_root / "round-01"
    assert (directory / "round.json").exists()
    assert (directory / "trace.json").exists()


def test_a_scripted_reply_that_does_not_fit_stops_the_round(tmp_path):
    from src.agents.chain import define_agents, read_templates
    from src.runtime import EdgeFailed
    from fast_agent import FastAgent

    config = make_config(tmp_path)
    broken = dict(SCRIPTS)
    broken["spec"] = [{"round_id": "round-01", "goal": "no knobs at all"}]
    fast = define_agents(FastAgent("bread-oven"), read_templates(config))

    with pytest.raises(Exception) as caught:
        asyncio.run(run_round(fast, config, model_factory=lambda node: ScriptedModel(node, broken[node], {})))
    assert "spec" in str(caught.value)
    assert (config.records_root / "round-01" / "edge-failure.json").exists()
