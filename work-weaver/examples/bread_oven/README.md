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
- **The servers run in the round's own process**, on two loopback ports, and
  each node connects over Streamable HTTP. They hold the record pens and the
  knobs; a separate process would hold its own copy of both.

## Layout

```
bread_oven/
├── main.py              start rounds, one experiment at a time
├── pyproject.toml       dependencies and pytest settings
├── src/
│   ├── config.py        knobs, ranges, defaults, and the run's paths
│   ├── experiments.py   runs/exp1, runs/exp2: which one a batch writes into
│   ├── models.py        the value each edge carries
│   ├── runtime.py       one node's turn: bind its tools, ask, validate
│   ├── agents/chain.py  the six nodes and the round they run
│   ├── machine/
│   │   ├── server.py    the machine MCP server: knobs, bake, state
│   │   ├── taste.py     the taste program, hidden behind the machine
│   │   └── records.py   the records MCP server, and the pens
│   └── servers/entry.py run either server as a stdio process
├── templates/           the system prompts: goal + one file per node
├── runs/                one directory per experiment, ignored by Git
│   ├── exp1/            round-NN/, results/, logs/, handbooks/, summary.json
│   └── exp2/
└── tests/               the round without a model
```

## Run it

```sh
# from the work-weaver/ directory: one venv, one launcher
uv venv && uv pip install "fast-agent-mcp>=0.10,<0.11" pytest
./run_bread_oven.sh --dry-run                 # check paths and templates only
BREAD_MODEL=generic.gpt-4.1 ./run_bread_oven.sh            # one round, new experiment
BREAD_MODEL=generic.gpt-4.1 ./run_bread_oven.sh --rounds 3 # three rounds, new experiment
```

Each batch of rounds is an experiment: `--rounds 3` writes `runs/exp1/`, the
next batch writes `runs/exp2/`, and `--continue` carries on inside the latest
one instead of starting a new one. `--experiment exp2` names the directory
yourself.

### Choosing a model

Copy `.env.example` to `work-weaver/.env` and fill it in. fast-agent reads
`.env` from the directory the round starts in, which is `work-weaver/` when you
use the launcher; a copy inside `examples/bread_oven/` works when you start
`main.py` from there. The filled-in `.env` is ignored by Git.

```
BREAD_MODEL=generic.gpt-4.1
GENERIC_BASE_URL=https://your-endpoint/v1
GENERIC_API_KEY=sk-...
```

- **Any OpenAI-compatible endpoint:** `BREAD_MODEL=generic.<model name>` with
  `GENERIC_BASE_URL` and `GENERIC_API_KEY`.
- **A local Ollama or llama.cpp server:** leave `GENERIC_BASE_URL` at
  `http://localhost:11434/v1` (fast-agent's default for `generic`).
- **A native fast-agent provider:** `BREAD_MODEL=deepseek`, or
  `BREAD_MODEL=gpt-5-mini`, and set that provider's key as fast-agent expects.

`--model` on the command line or `BREAD_MODEL` wins over the file; with neither,
the model is `generic.gpt-4.1`.

The model is any OpenAI-compatible endpoint fast-agent knows
(`generic.<name>`, with `GENERIC_BASE_URL` and `GENERIC_API_KEY` set), or one of
fast-agent's native providers. Every node uses the same model unless a
`BREAD_MODEL` value says otherwise.

After a run, open the experiment directory (`runs/exp1/` in the first batch):

- `summary.json` — each round's knobs, features, and score side by side
- `round-NN/` — the round's testimony, spec, tickets, `round.json`, and
  `trace.json` (the value on every edge)
- `logs/round-NN.md` — the round in a few lines
- `handbooks/evolving.md` — what the chain has learned so far

## Configuration

| Variable | Default | What it moves |
| --- | --- | --- |
| `BREAD_MODEL` | `generic.gpt-4.1` | the model every node uses |
| `BREAD_RUNS` | `runs` | the root holding one directory per experiment |
| `BREAD_GRILL_ROUNDS` | `3` | most grill exchanges per round |
| `BREAD_SEED` | `7` | the seed for each bake's taste |
| `BREAD_VERBOSE` | off | show the agents' conversation |

## Continuing a run

An experiment leaves everything the next round needs inside its own directory:
the knobs and the bake count in `machine-state.json`, each bake's result in
`results/`, each round's records in `round-NN/`, the logs in `logs/`, and what
the chain learned in `handbooks/evolving.md`. Starting another process in the
same experiment carries on from there — that is the checkpoint.

```sh
./run_bread_oven.sh --continue --rounds 5     # next five rounds of the latest experiment
./run_bread_oven.sh --experiment exp2 --rounds 3   # a named experiment
```

`--continue` picks the latest experiment; without it, a batch starts a new one,
so two runs never share a record directory. The round number always comes from
what is on disk, and a failed round keeps its number, because its bake still
happened. To start over, just run without `--continue`.

## The handbooks

`templates/base.md` is the person's handbook: the five starting values, what each
knob does to its feature, and the range of each knob. It never says where a
knob's best value is. The records server copies it into the experiment's
`handbooks/base.md` on first use, and no tool can write there.

The experiment's `handbooks/evolving.md` is the chain's own handbook. The
proposer writes it during the grill: at most thirty entries, each tagged with
the round that produced it, and it may delete entries that later rounds
disprove. Because every experiment starts with a fresh copy, one experiment's
learning never leaks into the next.

A knob's range is the machine's own limit: `set_knob` refuses a value outside it
and changes nothing. Inside the range every bake is a real loaf, and the score
falls away smoothly as a knob leaves the stretch its feature likes, so a round
never has to guess whether a bad score meant a broken knob or a bad loaf. A test
pins the refusal and the smooth fall.

The tests also check that the base handbook carries the starting values and
leaks none of the taste program's parameters.

## The taste program

`src/machine/taste.py` follows the outline the spec records: five features from
0 to 1, each dominated by one knob along a single-peaked curve, no interaction,
a three-percent perturbation on each feature, one taste draw per bake, and a
score that is the weighted mean of the features with no offset. The exact
formulas are still to be supplied by the spec's author; they replace that one
file.

## Tests

```sh
cd work-weaver
.venv/bin/python -m pytest examples/bread_oven/tests
```

The tests drive the whole round with scripted models: no network, every node
function runs, both servers and the tool filters are exercised, and the record
pens, the grill's three verdicts, and a restart between rounds are checked.
