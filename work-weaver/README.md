# Work Weaver

One example lives here: `examples/bread_oven/`, a self-evolving bread machine
where each round is a chain of fast-agent nodes reading what earlier rounds
wrote. The design is spec `wm-ax0pdz4cwxaw`; the discussion behind it is
testimony `wm-wgs66p03g76p`.

`weave-your-work/` is the source of the interactive skills; this directory is
the runtime prototype that puts one of those chains on disk and runs it.

## Run it

From this directory:

```sh
uv venv --python 3.12 .venv
uv pip install "fast-agent-mcp>=0.10,<0.11" pydantic "fastmcp>=4.0" python-dotenv pytest
cp examples/bread_oven/.env.example .env      # fill in the model and its key
./run_bread_oven.sh --rounds 5                # five rounds in a new experiment
```

The launcher runs `examples/bread_oven/main.py` from this directory, so
fast-agent reads `.env` from here. `examples/bread_oven/README.md` covers the
round, the knobs, the scoring, and where each experiment's records land.
