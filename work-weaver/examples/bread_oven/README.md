# Bread oven

One round of a self-evolving bread machine: a person presses one button, six
agent nodes read what earlier rounds did, argue a plan, write it down, and bake.

The design is spec `wm-ax0pdz4cwxaw`; the discussion behind it is testimony
`wm-wgs66p03g76p`.

## What one round is

```
gateway -> observe -> grill (proposer | grill, bounded) -> spec -> tickets -> implement
```

- **One process run is one round.** The next round is the next run. Nothing
  survives in memory; the round reads what earlier rounds wrote.
- **Each node is a `@fast.agent`.** Routing, the typed edge between each pair,
  and the record pens are plain Python in `src/agents/chain.py`.
- **Two MCP servers** hold everything the round touches: `records` (testimony,
  spec, tickets, and the two handbooks) and `machine` (the five knobs and the
  bake). Each node holds only its own write tool and the reads it needs.

## Layout

```
bread_oven/
├── main.py              start one round (or several, one process each)
├── pyproject.toml       dependencies and pytest settings
├── src/
│   ├── config.py        knobs, ranges, defaults, and the run's paths
│   ├── models.py        the value each edge carries
│   ├── runtime.py       one node's turn: bind its tools, ask, validate
│   ├── agents/chain.py  the six nodes and the round they run
│   ├── machine/
│   │   ├── server.py    the machine MCP server: knobs, bake, state
│   │   ├── taste.py     the taste program, hidden behind the machine
│   │   └── records.py   the records MCP server, and the pens
│   └── servers/entry.py run either server as a stdio process
├── templates/           the system prompts: goal + one file per node
├── handbooks/           base.md (yours, read-only) and evolving.md (the chain's)
├── logs/                one log per round
└── tests/               the round without a model
```

## Run it

```sh
# from the work-weaver/ directory: one venv, one launcher
uv venv && uv pip install "fast-agent-mcp>=0.10,<0.11" pytest
./run_bread_oven.sh --dry-run                 # check paths and templates only
BREAD_MODEL=generic.gpt-4.1 ./run_bread_oven.sh          # one round
BREAD_MODEL=generic.gpt-4.1 ./run_bread_oven.sh --rounds 3   # three rounds, one process each
```

Without an endpoint configured, `generic.<name>` points at `http://localhost:11434/v1`
(fast-agent's Ollama default). Any OpenAI-compatible endpoint works through
`GENERIC_BASE_URL` and `GENERIC_API_KEY`, as does a native fast-agent provider
such as `deepseek` or `gpt-5-mini`.

The model is any OpenAI-compatible endpoint fast-agent knows
(`generic.<name>`, with `GENERIC_BASE_URL` and `GENERIC_API_KEY` set), or one of
fast-agent's native providers. Every node uses the same model unless a
`BREAD_MODEL` value says otherwise.

After a run, open:

- `runs/summary.json` — each round's knobs, features, and score side by side
- `runs/round-NN/` — the round's testimony, spec, tickets, `round.json`, and
  `trace.json` (the value on every edge)
- `logs/round-NN.md` — the round in a few lines
- `handbooks/evolving.md` — what the chain has learned so far

## Configuration

| Variable | Default | What it moves |
| --- | --- | --- |
| `BREAD_MODEL` | `generic.gpt-4.1` | the model every node uses |
| `BREAD_RECORDS` | `runs/` | where rounds are written |
| `BREAD_LOGS` | `logs/` | where the run's logs are written |
| `BREAD_HANDBOOKS` | `handbooks/` | where `base.md` and `evolving.md` live |
| `BREAD_GRILL_ROUNDS` | `3` | most grill exchanges per round |
| `BREAD_SEED` | `7` | the seed for each bake's taste |
| `BREAD_VERBOSE` | off | show the agents' conversation |

## The handbooks

`templates/base.md` is the person's handbook: the five-starting values, what each
knob does to its feature, the range of each knob, and the two ends where the
loaf stops being bread. It never says where a knob's best value is. The records
server copies it into `handbooks/base.md` on first use, and no tool can write
there.

`handbooks/evolving.md` is the chain's own handbook. The proposer writes it
during the grill: at most thirty entries, each tagged with the round that
produced it, and it may delete entries that later rounds disprove.

A knob's range is hard: `set_knob` refuses a value outside it. The stretch
inside the range where a bake comes out raw or scorched is not hard: the machine
bakes it and the score drops. The handbook says so, and a test pins both halves.

The tests also check that the base handbook carries the starting values and
leaks none of the taste program's parameters.

## The taste program

`src/machine/taste.py` follows the outline the spec records: five features from
0 to 1, each dominated by one knob along a single-peaked curve, no interaction,
a five-percent perturbation, and one taste draw per bake. The exact formulas are
still to be supplied by the spec's author; they replace that one file.

## Tests

```sh
cd work-weaver
.venv/bin/python -m pytest examples/bread_oven/tests
```

The tests drive the whole round with scripted models: no network, every node
function runs, both servers and the tool filters are exercised, and the record
pens, the grill's three verdicts, and a restart between rounds are checked.
