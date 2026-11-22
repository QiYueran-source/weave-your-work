"""What one node's turn costs, and what it is allowed to see.

`node_turn` is the whole of a node's function: it binds the tools the node's
scope allows, asks the agent's model one question, validates the reply against
the edge's model, and returns the reply text. A node that was not given a write
tool cannot make one, however its prompt is read.
"""

from __future__ import annotations

import json

from fast_agent.types import RequestParams
from pydantic import ValidationError

from src.config import RunConfig
from src.models import Observation


class NodeFailure(RuntimeError):
    """A node's turn ended without a usable value."""


class EdgeFailed(RuntimeError):
    """A node's value did not fit the model the edge expects."""


_ACTIVE: dict[int, dict] = {}


def attach(fast, state: dict) -> None:
    """Bind this run's state to the running FastAgent instance."""

    _ACTIVE[id(fast)] = state


def detach(fast) -> None:
    _ACTIVE.pop(id(fast), None)


def state_for(fast) -> dict:
    try:
        return _ACTIVE[id(fast)]
    except KeyError as exc:
        raise NodeFailure("the round was not prepared; start it through run_round") from exc


def tools_for(node: str) -> dict[str, list[str]]:
    """The tool filter this node's agent is given. Narrow on purpose."""

    reads = [
        "read_testimony",
        "list_testimony",
        "read_spec",
        "read_tickets",
        "read_base_handbook",
        "read_evolving_handbook",
    ]
    writes = {
        "observe": ["append_testimony"],
        "proposer": ["append_testimony", "write_evolving_handbook"],
        "grill": [],
        "spec": ["write_spec"],
        "tickets": ["write_tickets"],
        "implement": ["append_testimony"],
    }
    filters: dict[str, list[str]] = {"records": reads + writes[node]}
    if node == "implement":
        filters["machine"] = ["get_state", "set_knob", "set_knobs", "bake"]
    return filters


class _ToolServer:
    """A server the run is holding, shaped the way fast_agent lists an MCP server.

    The round builds its servers in process; fast-agent reads tools, prompts, and
    resources through one object with those three async calls, so this adapter is
    all it takes to give an agent the tools without a second process or a YAML
    entry.
    """

    def __init__(self, name: str, server) -> None:
        self.name = name
        self.server = server
        manager = getattr(server, "_tool_manager", None)
        self.tools = list((manager._tools if manager else {}).values())

    async def list_tools(self):
        class _Result:
            tools = self.tools

        return _Result()

    async def list_prompts(self):
        class _Result:
            prompts = []

        return _Result()

    async def list_resources(self):
        class _Result:
            resources = []

        return _Result()


async def bind_tools(agent, state: dict) -> dict:
    """Give this agent the servers and tool names this node is allowed to use."""

    filters = tools_for(agent.name)
    saved = {
        "servers": getattr(agent, "_tool_servers", None),
        "filters": getattr(agent, "_tool_filters", None),
    }
    servers = {
        name: _ToolServer(name, server)
        for name, server in state["servers"].items()
        if name in filters
    }
    for name, server in servers.items():
        server.tools = [tool for tool in server.tools if tool.name in filters[name]]
    agent._tool_servers = servers
    agent._tool_filters = filters
    return saved


async def unbind_tools(agent, saved: dict) -> None:
    agent._tool_servers = saved["servers"] or {}
    agent._tool_filters = saved["filters"]


async def node_turn(fast, node: str, topic: str, model, request_params: RequestParams | None = None) -> str:
    """One node's turn. Returns the model's reply text; raises on anything that does not fit."""

    state = state_for(fast)
    agent = state["app"].get_agent(node)
    state["trace"].append({"node": node, "kind": "topic", "text": topic})
    saved = await bind_tools(agent, state)
    try:
        reply = await agent.generate(
            topic or f"Round {state['round_index']}",
            request_params=request_params or RequestParams(use_history=False, max_iterations=8),
        )
    except Exception as exc:
        raise NodeFailure(f"{node} failed: {exc}") from exc
    finally:
        await unbind_tools(agent, saved)
    text = (reply.last_text() or "").strip()
    if not text:
        raise NodeFailure(f"{node} returned nothing; the model call did not answer")
    if text.startswith("```"):
        # A model may wrap its JSON in a fence despite the instruction; the fence
        # is not the model's answer, so it comes off before validation.
        text = text.split("\n", 1)[1] if "\n" in text else text
        text = text.rsplit("```", 1)[0].strip()
    state["trace"].append({"node": node, "kind": "reply", "text": text})
    try:
        model.model_validate(json.loads(text))
    except (ValidationError, json.JSONDecodeError) as exc:
        raise EdgeFailed(f"{node} did not return {model.__name__}: {exc}") from exc
    return text


def observation_topic(context: dict) -> str:
    """What the observe node is asked: where things stand, and the start signal."""

    store = context["store"]
    machine_state = context["machine"].state()
    rounds = store.list_rounds()
    topic = {
        "signal": "start_bake",
        "round": context["round_index"],
        "machine": machine_state,
        "rounds_on_disk": rounds,
    }
    return json.dumps(topic, indent=2)


def config_for(state: dict) -> RunConfig:
    return state["config"]


__all__ = [
    "EdgeFailed",
    "NodeFailure",
    "Observation",
    "attach",
    "bind_tools",
    "detach",
    "node_turn",
    "observation_topic",
    "state_for",
    "unbind_tools",
    "tools_for",
]
