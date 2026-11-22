"""What each node actually receives from the MCP servers.

These tests start the two servers as real stdio child processes, so they check
the tools a model would be offered, not a table in the code.
"""

import asyncio
import sys
from pathlib import Path

from fast_agent import FastAgent
from fast_agent.llm.internal.playback import PlaybackLLM
from fast_agent.mcp.prompt import Prompt

from src.agents.chain import define_agents, prepare, read_templates
from src.config import RunConfig
from src.runtime import bind_tools, unbind_tools


class SpyModel(PlaybackLLM):
    def __init__(self):
        super().__init__(name="spy")
        self.tools = None

    async def generate(self, messages, request_params=None, tools=None):
        self.tools = tools
        return Prompt.assistant("{}")


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


async def tools_for_node(tmp_path: Path, node: str) -> list[str]:
    config = make_config(tmp_path)
    state = prepare(config)
    fast = define_agents(FastAgent("bread-oven"), read_templates(config), model=config.model)
    async with fast.run() as app:
        agent = app.get_agent(node)
        spy = SpyModel()
        agent._llm = spy
        attached = await bind_tools(agent, state)
        try:
            await agent.generate("go")
        finally:
            await unbind_tools(agent, attached)
        return sorted(tool.name for tool in spy.tools or [])


def test_observe_gets_its_write_and_reads_but_not_spec_writes(tmp_path):
    names = asyncio.run(tools_for_node(tmp_path, "observe"))
    assert names == [
        "machine__get_state",
        "machine__list_results",
        "machine__read_result",
        "records__append_testimony",
        "records__list_testimony",
        "records__read_base_handbook",
        "records__read_evolving_handbook",
        "records__read_spec",
        "records__read_testimony",
        "records__read_tickets",
    ]
    assert "records__write_spec" not in names
    # Reading bake history is not baking: no knob to set, no bake to start.
    assert "machine__bake" not in names
    assert "machine__set_knob" not in names


def test_the_grill_only_reads(tmp_path):
    names = asyncio.run(tools_for_node(tmp_path, "grill"))
    assert all(query in names for query in (
        "records__read_testimony", "records__read_spec", "records__read_tickets",
    ))
    assert not any(
        name in names
        for name in (
            "records__append_testimony", "records__write_spec",
            "records__write_tickets", "records__write_evolving_handbook",
        )
    )


def test_implement_holds_the_machine_and_no_record_write(tmp_path):
    names = asyncio.run(tools_for_node(tmp_path, "implement"))
    assert names == [
        "machine__bake",
        "machine__get_state",
        "machine__list_results",
        "machine__read_result",
        "machine__set_knob",
        "machine__set_knobs",
        "records__list_testimony",
        "records__read_base_handbook",
        "records__read_evolving_handbook",
        "records__read_spec",
        "records__read_testimony",
        "records__read_tickets",
    ]
    assert not any(name.startswith("records__write") or name == "records__append_testimony" for name in names)


def test_a_node_is_not_offered_a_tool_it_was_not_granted(tmp_path):
    """The model sees its granted tools and nothing else.

    fast_agent keeps every tool of an attached server addressable on the agent,
    so the guarantee under test is the one the model experiences: the tool list.
    """

    names = asyncio.run(tools_for_node(tmp_path, "grill"))
    assert "machine__list_results" in names and "machine__read_result" in names
    assert "machine__set_knob" not in names
    assert "machine__bake" not in names
    assert not any(name.startswith("records__write") or name == "records__append_testimony" for name in names)
