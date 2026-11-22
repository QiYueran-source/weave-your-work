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
        # implement writes no record: its account of the round is the bake's
        # own result file, which the machine server writes.
        "implement": [],
    }
    filters: dict[str, list[str]] = {"records": reads + writes[node]}
    if node == "implement":
        filters["machine"] = ["get_state", "set_knob", "set_knobs", "bake", "read_result", "list_results"]
    else:
        # Every node reads the machine's bake history: what was baked, what it
        # scored, and which feature was weak. Observing is useless without it.
        filters["machine"] = ["get_state", "list_results", "read_result"]
    return filters


async def bind_tools(agent, state: dict) -> list:
    """Give this agent the servers it may use, filtered to its own tools.

    A node is offered only the tools it was granted. That is what the model
    sees and what it can reach. fast_agent keeps every tool of an attached
    server callable by name on the agent object regardless of the filter, so
    the guarantee is "not offered" rather than "not reachable": what stops an
    overreach is the node being handed a server at all, and the server's own
    rules when it is.
    """

    from fast_agent.mcp.mcp_aggregator import MCPAttachOptions

    filters = tools_for(agent.name)
    attached: list[str] = []
    for name, settings in state["servers"].items():
        if name not in filters:
            continue
        agent.config.tools = filters
        await agent.attach_mcp_server(
            server_name=name,
            server_config=settings,
            options=MCPAttachOptions(),
        )
        attached.append(name)
    return attached


async def unbind_tools(agent, attached: list) -> None:
    for name in attached:
        try:
            await agent.detach_mcp_server(name)
        except Exception:  # the turn is over; a dead child is not a node failure
            pass


async def node_turn(fast, node: str, topic: str, model, request_params: RequestParams | None = None) -> str:
    """One node's turn. Returns the model's reply text; raises on anything that does not fit."""

    state = state_for(fast)
    agent = state["app"].get_agent(node)
    state["trace"].append({"node": node, "kind": "topic", "text": topic})
    saved_tools = dict(agent.config.tools or {})
    attached = []
    try:
        attached = await bind_tools(agent, state)
        reply = await agent.generate(
            topic or f"Round {state['round_index']}",
            request_params=request_params or RequestParams(use_history=False, max_iterations=8),
        )
    except NodeFailure:
        raise
    except Exception as exc:
        raise NodeFailure(f"{node} failed: {exc}") from exc
    finally:
        await unbind_tools(agent, attached)
        agent.config.tools = saved_tools
    text = (reply.last_text() or "").strip()
    if not text:
        # An empty answer is the provider ending the turn with nothing; try once
        # more before the round is called dead, and never retry past that.
        retry = await agent.generate(
            topic or f"Round {state['round_index']}",
            request_params=request_params or RequestParams(use_history=False, max_iterations=8),
        )
        text = (retry.last_text() or "").strip()
        state["trace"].append({"node": node, "kind": "retry", "text": text[:200]})
    if not text:
        raise NodeFailure(f"{node} returned nothing twice; the model call did not answer")
    if text.startswith("```"):
        # A model may wrap its JSON in a fence despite the instruction; the fence
        # is not the model's answer, so it comes off before validation.
        text = text.split("\n", 1)[1] if "\n" in text else text
        text = text.rsplit("```", 1)[0].strip()
    state["trace"].append({"node": node, "kind": "reply", "text": text})
    # The chain validates the value against the edge's model, because only the
    # chain knows whether a node may answer with something other than its words.
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
