#!/bin/sh
# Run rounds of the bread oven example: one round per process.
#
#   ./run_bread_oven.sh                 one round
#   ./run_bread_oven.sh --rounds 3      three rounds
#   ./run_bread_oven.sh --model generic.gpt-4.1
set -e
cd "$(dirname "$0")"
exec .venv/bin/python examples/bread_oven/main.py "$@"
