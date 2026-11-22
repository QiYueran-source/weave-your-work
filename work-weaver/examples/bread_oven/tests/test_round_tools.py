"""A round whose nodes call the real MCP tools, with the model scripted.

This is the closest check to a live run without an endpoint: the node
functions, the HTTP servers, the tool filters, and the record pens all run;
only the words the model would say are supplied by the test.
"""

import asyncio
import json
import sys
from pathlib import Path

from fast_agent import FastAgent
from fast_agent.llm.internal.playback import PlaybackLLM
from fast_agent.mcp.prompt import Prompt

from src.agents.chain import define_agents, read_templates, run_round
from src.config import RunConfig

KNOBS = {
    "oven_temperature": 215.0,
    "bake_time": 45.0,
    "proofing_time": 75.0,
    "water_amount": 70.0,
    "sugar_amount": 8.0,
}


class CallingModel(PlaybackLLM):
    """Answers from a script and, where the node has tools, uses them."""

    def __init__(self, node: str, agents: dict):
        super().__init__(name=f"calling-{node}")
        self.node = node
        self.agents = agents

    async def _call(self, tool: str, arguments: dict):
        result = await self.agents[self.node].call_tool(tool, arguments)
        texts = [block.text for block in result.content if hasattr(block, "text")]
        return json.loads(texts[0]) if texts else None

    async def generate(self, messages, request_params=None, tools=None):
        self._synthetic_turn_count += 1
        names = {tool.name for tool in tools or []}
        if self.node == "observe":
            written = await self._call("records__append_testimony", {"heading": "observe", "body": "round 1 opened"})
            return Prompt.assistant(json.dumps({
                "round_id": "round-01",
                "analysis": f"testimony written: {'lines' in written}",
                "candidate_knobs": {"bake_time": 45},
            }))
        if self.node == "proposer":
            assert "records__write_evolving_handbook" in names
            await self._call("records__write_evolving_handbook", {"text": "# Evolving handbook\n\n- [round-01] oven 215 beat 200\n"})
            return Prompt.assistant(json.dumps({
                "round_id": "round-01", "knobs": KNOBS,
                "reasons": {"bake_time": "chewiness was weakest"}, "notes": "plan",
            }))
        if self.node == "grill":
            return Prompt.assistant(json.dumps({"verdict": "accept", "reasons": [], "requested_changes": []}))
        if self.node == "spec":
            await self._call("records__write_spec", {"body": "goal: raise chewiness"})
            return Prompt.assistant(json.dumps({
                "round_id": "round-01", "goal": "raise chewiness",
                "reasons": ["chewiness was weakest"], "knobs": {"oven_temperature": 215.0},
            }))
        if self.node == "tickets":
            await self._call("records__write_tickets", {"body": "1. set the oven\n2. set the time\n3. bake"})
            return Prompt.assistant(json.dumps({
                "round_id": "round-01",
                "steps": [
                    {"order": 1, "action": "set the oven", "knobs": {"oven_temperature": 215.0}},
                    {"order": 2, "action": "set the bake time", "knobs": {"bake_time": 45.0}},
                    {"order": 3, "action": "bake", "knobs": {}},
                ],
            }))
        # implement: set the knobs the tickets named, then bake
        assert "machine__bake" in names and "records__write_spec" not in names
        await self._call("machine__set_knobs", {"values": {"oven_temperature": 215.0, "bake_time": 45.0}})
        result = await self._call("machine__bake", {"round_id": "round-01"})
        return Prompt.assistant(json.dumps(result))


def test_a_round_whose_nodes_use_their_tools(tmp_path):
    config = RunConfig(
        records_root=tmp_path / "runs",
        log_root=tmp_path / "logs",
        handbooks_root=tmp_path / "handbooks",
        templates_root=Path(__file__).resolve().parents[1] / "templates",
        model="playback",
        grill_max_rounds=2,
        taste_seed=7,
    )
    agents: dict = {}

    class App:
        def __init__(self, real):
            self.real = real

        async def __aenter__(self):
            app = await self.real.__aenter__()
            for node in ("observe", "proposer", "grill", "spec", "tickets", "implement"):
                agents[node] = app.get_agent(node)
            return app

        async def __aexit__(self, *exc):
            return await self.real.__aexit__(*exc)

    fast = define_agents(FastAgent("bread-oven"), read_templates(config))
    real_run = fast.run
    # The agents are reachable only once the app is running; the scripted models
    # need them to call tools, so the app is wrapped to record them.
    fast.run = lambda: App(real_run())

    outcome = asyncio.run(
        run_round(fast, config, model_factory=lambda node: CallingModel(node, agents))
    )

    assert outcome["verdict"] == "accept"
    assert 0.0 <= outcome["score"] <= 1.0
    round_dir = config.records_root / "round-01"
    assert "opened" in (round_dir / "testimony.md").read_text(encoding="utf-8")
    assert (round_dir / "spec.md").exists()
    assert (round_dir / "tickets.md").exists()
    assert "[round-01]" in (config.handbooks_root / "evolving.md").read_text(encoding="utf-8")
    state = json.loads((config.records_root / "machine-state.json").read_text(encoding="utf-8"))
    assert state["knobs"]["oven_temperature"] == 215.0
