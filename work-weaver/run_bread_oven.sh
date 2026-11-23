#!/bin/sh
# Run rounds of the bread oven example: one round per process.
#
#   ./run_bread_oven.sh                        one round in a new experiment
#   ./run_bread_oven.sh --rounds 3             three rounds in a new experiment
#   ./run_bread_oven.sh --continue --rounds 5  five more rounds in the latest one
#   ./run_bread_oven.sh --model generic.gpt-4.1
set -e
cd "$(dirname "$0")"
exec .venv/bin/python examples/bread_oven/main.py "$@"
