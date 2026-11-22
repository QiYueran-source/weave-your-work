"""The round as code: gateway, six nodes, and typed edges between them.

Every node is a `@fast.agent`, and every node's function is one call to
`node_turn`, which binds the tools that node's scope allows and asks its model
once. Routing, pens, and validation live in this module, which is why a node
holds no tool it was not given and no model judges its own input.
"""

from __future__ import annotations

import json
from pathlib import Path

from fast_agent import FastAgent
from fast_agent.types import RequestParams
from pydantic import BaseModel, ValidationError

from src.config import RunConfig
from src.models import (
    BakeResult,
    GrillOutcome,
    GrillResult,
    GrillVerdictMessage,
    Intent,
    Observation,
    Plan,
    SpecDraft,
)
from src.runtime import (
    EdgeFailed,
    NodeFailure,
    attach,
    detach,
    node_turn,
    observation_topic,
)
from src.machine.records import RecordStore, RoundCursor, close_pen, hold_pen
from src.machine.server import Machine

NODES: tuple[str, ...] = ("observe", "proposer", "grill", "spec", "tickets", "implement")

# Which records a node may write while it stands.
NODE_PENS: dict[str, tuple[str, ...]] = {
    "observe": ("testimony",),
    "proposer": ("testimony", "evolving"),
    "grill": (),
    "spec": ("spec",),
    "tickets": ("tickets",),
    "implement": ("testimony",),
}
# Which records a node closes when it ends. A closed record stays closed for the round.
CLOSE_AFTER: dict[str, tuple[str, ...]] = {
    "observe": (),
    "proposer": ("testimony", "evolving"),
    "grill": (),
    "spec": ("spec",),
    "tickets": ("tickets",),
    "implement": (),
}

EDGE_MODELS: dict[str, type[BaseModel]] = {
    "observe": Observation,
    "proposer": GrillOutcome,
    "grill": GrillVerdictMessage,
    "spec": SpecDraft,
    "tickets": Plan,
    "implement": BakeResult,
}


def read_templates(config: RunConfig) -> dict[str, str]:
    """The goal every node shares, followed by each node's own job."""

    goal = (config.templates_root / "goal.md").read_text(encoding="utf-8")
    return {
        node: goal + "\n\n" + (config.templates_root / f"{node}.md").read_text(encoding="utf-8")
        for node in NODES
    }


def define_agents(fast: FastAgent, templates=None, model: str | None = None) -> FastAgent:
    """Define the six nodes on an existing FastAgent. No model is named here.

    The steps of a round build their FastAgent with `build_fast_agent`; a
    stdio process serving the MCP servers only needs this half.
    """

    templates = templates or {}

    @fast.agent(
        name="observe",
        instruction=templates.get("observe", "observe"),
        servers=[],
        model=model,
        tools={"records": ["append_testimony", "read_testimony", "list_testimony",
                           "read_base_handbook", "read_evolving_handbook"]},
    )
    async def observe_node(topic: str = "") -> str:
        return await node_turn(fast, "observe", topic, Observation)

    @fast.agent(
        name="proposer",
        instruction=templates.get("proposer", "proposer"),
        servers=[],
        model=model,
        tools={"records": ["append_testimony", "write_evolving_handbook", "read_testimony",
                           "list_testimony", "read_base_handbook", "read_evolving_handbook"]},
    )
    async def proposer_node(topic: str = "") -> str:
        return await node_turn(fast, "proposer", topic, GrillOutcome)

    @fast.agent(
        name="grill",
        instruction=templates.get("grill", "grill"),
        servers=[],
        model=model,
        tools={"records": ["read_testimony", "list_testimony", "read_base_handbook",
                           "read_evolving_handbook"]},
    )
    async def grill_node(topic: str = "") -> str:
        return await node_turn(fast, "grill", topic, GrillVerdictMessage)

    @fast.agent(
        name="spec",
        instruction=templates.get("spec", "spec"),
        servers=[],
        model=model,
        tools={"records": ["write_spec", "read_testimony", "list_testimony",
                           "read_base_handbook", "read_evolving_handbook"]},
    )
    async def spec_node(topic: str = "") -> str:
        return await node_turn(fast, "spec", topic, SpecDraft)

    @fast.agent(
        name="tickets",
        instruction=templates.get("tickets", "tickets"),
        servers=[],
        model=model,
        tools={"records": ["write_tickets", "read_spec", "read_testimony", "list_testimony",
                           "read_base_handbook", "read_evolving_handbook"]},
    )
    async def tickets_node(topic: str = "") -> str:
        return await node_turn(fast, "tickets", topic, Plan)

    @fast.agent(
        name="implement",
        instruction=templates.get("implement", "implement"),
        servers=[],
        model=model,
        tools={"machine": ["get_state", "set_knob", "set_knobs", "bake"]},
    )
    async def implement_node(topic: str = "") -> str:
        return await node_turn(fast, "implement", topic, BakeResult)

    return fast


def build_fast_agent(config: RunConfig, templates: dict[str, str] | None = None) -> FastAgent:
    """The six nodes, each on the run's model.

    The nodes name no servers: the run attaches its own server for each node's
    turn, so the same definitions serve a YAML-free run and a test. A test that
    replaces the model does so after this, and its answers replace the model's.
    """
    if not config.model:
        raise ValueError("a run needs a model: set BREAD_MODEL or pass --model")
    return define_agents(FastAgent("bread-oven"), templates or read_templates(config), model=config.model)


def start_servers(config: RunConfig, round_index: int) -> dict:
    """Start the round's two MCP servers on loopback ports and return how to reach them.

    Both hold state the round owns — the record pens and the machine's knobs —
    so they live in the round's process and the agents connect to them over
    HTTP. A child process would hold its own copy and the pens would disagree.
    """

    from fast_agent.config import MCPServerSettings

    from src.machine.http import HttpServer, as_fastmcp
    from src.machine.records import build_server as build_records_server
    from src.machine.server import build_server as build_machine_server

    store = RecordStore(config)
    # The machine carries its knobs from the last round: a new process reads the
    # file the last one wrote, and a fresh run starts from the default knobs.
    matrix = Machine.load(
        config.records_root / "machine-state.json",
        seed=config.taste_seed,
        log_path=config.log_root / f"round-{round_index:02d}.jsonl",
    )
    # Each bake writes its result here; the implement node reads that file.
    matrix.result_dir = config.records_root / "results"

    records_http = HttpServer(
        "records", as_fastmcp("records", build_records_server(store, RoundCursor(round_index)))
    )
    machine_http = HttpServer("machine", as_fastmcp("machine", build_machine_server(matrix)))
    records_http.start()
    machine_http.start()

    def settings(name: str, url: str) -> MCPServerSettings:
        return MCPServerSettings(name=name, transport="http", url=url, read_timeout_seconds=60)

    return {
        "config": config,
        "round_index": round_index,
        "store": store,
        "machine": matrix,
        "servers": {
            "records": settings("records", records_http.url),
            "machine": settings("machine", machine_http.url),
        },
        "threads": [records_http, machine_http],
    }


def prepare(config: RunConfig) -> dict:
    """Open one run: the round's number, its servers, and what a scripted bake calls."""

    store = RecordStore(config)
    round_index = store.next_round_index()
    state = start_servers(config, round_index)
    state.update(
        {
            "fast": None,
            "app": None,
            "cursor": RoundCursor(round_index),
            "edges": [],
            "trace": [],
        }
    )
    return state


def _open(state: dict, node: str) -> None:
    for record in NODE_PENS[node]:
        hold_pen(state["store"], state["round_index"], record, node)
    state["cursor"].bind(node, state["round_index"])


def _close(state: dict, node: str) -> None:
    for record in CLOSE_AFTER.get(node, ()):
        close_pen(state["store"], state["round_index"], record)


async def play(state: dict, node: str, topic: str, controls: dict | None) -> BaseModel:
    """One node's value: a control's value in a test, or the node's own model."""

    model = EDGE_MODELS[node]
    try:
        if controls and node in controls:
            raw = await controls[node](state, topic)
            value = raw if isinstance(raw, model) else model.model_validate(raw)
        else:
            fast = state["fast"]
            if fast is None or state["app"] is None:
                raise NodeFailure("the round has no running app")
            text = await node_turn(fast, node, topic, model)
            try:
                value = model.model_validate(json.loads(text))
            except (ValidationError, json.JSONDecodeError):
                if node != "implement":
                    raise
                # The bake's result is a file the machine wrote. Whatever the
                # model says after its last tool call, the edge carries what
                # the machine recorded, not a restatement of it.
                round_id = f"round-{state['round_index']:02d}"
                result_path = state["config"].records_root / "results" / f"{round_id}.json"
                if not result_path.exists():
                    raise
                value = model.model_validate(json.loads(result_path.read_text(encoding="utf-8")))
    except (ValidationError, json.JSONDecodeError) as exc:
        _fail(state, node, model, topic, exc)
        raise EdgeFailed(f"{node} did not return {model.__name__}: {exc}") from exc
    state["edges"].append({"node": node, "input": topic, "output": value.model_dump()})
    return value


def _fail(state: dict, node: str, model, topic: str, exc: Exception) -> None:
    directory = state["store"].round_dir(state["round_index"])
    directory.mkdir(parents=True, exist_ok=True)
    (directory / "edge-failure.json").write_text(
        json.dumps(
            {"node": node, "expected": model.__name__, "input": topic, "error": str(exc)},
            indent=2,
        ),
        encoding="utf-8",
    )


async def run_chain(state: dict, intent: Intent, controls: dict | None = None) -> dict:
    """The round: observe, the grill, spec, tickets, and the bake."""

    store = state["store"]
    round_index = state["round_index"]

    _open(state, "observe")
    observation: Observation = await play(state, "observe", observation_topic(state), controls)
    _close(state, "observe")

    _open(state, "proposer")
    draft: GrillOutcome = await play(state, "proposer", observation.model_dump_json(), controls)
    verdicts: list[GrillVerdictMessage] = []
    verdict = GrillVerdictMessage(verdict="stop", reasons=["no grill round ran"])
    for _ in range(state["config"].grill_max_rounds):
        _open(state, "grill")
        verdict = await play(state, "grill", draft.model_dump_json(), controls)
        _close(state, "grill")
        verdicts.append(verdict)
        if verdict.verdict != "revise":
            break
        _open(state, "proposer")
        draft = await play(
            state,
            "proposer",
            json.dumps(
                {"previous_draft": draft.model_dump(), "requested_changes": verdict.requested_changes}
            ),
            controls,
        )
        _close(state, "proposer")
    _close(state, "proposer")

    settled = GrillResult(
        round_id=draft.round_id,
        verdict=verdict.verdict if verdict.verdict != "revise" else "stop",
        agreed=verdict.verdict == "accept",
        rounds_taken=len(verdicts),
        knobs=draft.knobs,
        reasons=draft.reasons,
        notes=draft.notes,
    )

    _open(state, "spec")
    spec: SpecDraft = await play(state, "spec", settled.model_dump_json(), controls)
    _close(state, "spec")

    _open(state, "tickets")
    plan: Plan = await play(state, "tickets", spec.model_dump_json(), controls)
    _close(state, "tickets")

    _open(state, "implement")
    result: BakeResult = await play(state, "implement", plan.model_dump_json(), controls)

    outcome = {
        "round_id": intent.round_id,
        "round_index": round_index,
        "knobs": result.knobs,
        "features": result.features,
        "score": result.score,
        "verdict": settled.verdict,
        "settled": settled.agreed,
        "grill_rounds": len(verdicts),
        "refused": result.refused,
        "pens_closed": sorted(store.closed_pens(round_index)),
    }
    directory = store.round_dir(round_index)
    directory.mkdir(parents=True, exist_ok=True)
    (directory / "round.json").write_text(json.dumps(outcome, indent=2) + "\n", encoding="utf-8")
    (directory / "trace.json").write_text(
        json.dumps({"edges": state["edges"], "trace": state["trace"]}, indent=2), encoding="utf-8"
    )
    return outcome


def write_summary(config: RunConfig, store: RecordStore) -> Path:
    rounds: list[dict] = []
    for index, directory in store.round_dirs():
        path = directory / "round.json"
        if path.exists():
            rounds.append(json.loads(path.read_text(encoding="utf-8")))
    summary = config.records_root / "summary.json"
    summary.write_text(json.dumps({"rounds": rounds}, indent=2) + "\n", encoding="utf-8")
    return summary


async def run_round(
    fast: FastAgent,
    config: RunConfig,
    controls: dict | None = None,
    model_factory=None,
) -> dict:
    """One press: prepare the run, run the chain, write the summary, exit.

    `controls` and `model_factory` are for tests. Controls replace whole nodes;
    a model factory replaces what each agent talks to without touching the node
    definitions.
    """

    state = prepare(config)
    state["fast"] = fast
    round_id = f"round-{state['round_index']:02d}"
    try:
        outcome = await _run_in_app(fast, state, round_id, controls, model_factory)
    except Exception as exc:
        # A round that dies part way still leaves a record of where it stopped,
        # so the summary shows the failure instead of losing the round.
        outcome = _record_failure(config, state, round_id, exc)
        write_summary(config, state["store"])
        write_logs(config, state)
        outcome["summary"] = str(config.records_root / "summary.json")
        return outcome
    summary = write_summary(config, state["store"])
    support = write_logs(config, state)
    outcome["summary"] = str(summary)
    outcome["support"] = support
    return outcome


def _record_failure(config: RunConfig, state: dict, round_id: str, exc: Exception) -> dict:
    directory = state["store"].round_dir(state["round_index"])
    directory.mkdir(parents=True, exist_ok=True)
    outcome = {
        "round_id": round_id,
        "round_index": state["round_index"],
        "failed": f"{type(exc).__name__}: {exc}",
        "reached": [edge["node"] for edge in state["edges"]],
        "knobs": None,
        "features": None,
        "score": None,
    }
    (directory / "round.json").write_text(json.dumps(outcome, indent=2) + "\n", encoding="utf-8")
    return outcome


async def _run_in_app(
    fast: FastAgent,
    state: dict,
    round_id: str,
    controls: dict | None,
    model_factory,
) -> dict:
    async with fast.run() as app:
        state["app"] = app
        attach(fast, state)
        if model_factory is not None:
            for node in NODES:
                app.get_agent(node)._llm = model_factory(node)
        try:
            return await run_chain(state, Intent(round_id=round_id), controls)
        finally:
            detach(fast)


def write_logs(config: RunConfig, state: dict) -> dict:
    """The run's own log: the edges, the trace, and a reader's view of the round."""

    directory = config.log_root
    directory.mkdir(parents=True, exist_ok=True)
    round_index = state["round_index"]
    (directory / f"round-{round_index:02d}.trace.json").write_text(
        json.dumps({"edges": state["edges"], "trace": state["trace"]}, indent=2),
        encoding="utf-8",
    )
    lines = [f"# Round {round_index:02d}", ""]
    if not state["edges"]:
        lines.append("- (the round stopped before any edge was recorded)")
    for edge in state["edges"]:
        node = edge["node"]
        output = edge["output"]
        if node == "implement":
            lines.append(f"- bake: score {output.get('score')} with {output.get('knobs')}")
        elif node == "grill":
            lines.append(f"- grill: {output.get('verdict')} after {output.get('rounds_taken')} round(s)")
        else:
            lines.append(f"- {node}: {json.dumps(output)[:200]}")
    path = directory / f"round-{round_index:02d}.md"
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return {"trace": str(directory / f"round-{round_index:02d}.trace.json"), "log": str(path)}


