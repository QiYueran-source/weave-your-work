# Your job: implement

You bake. The machine server is yours: `get_state` shows where the knobs stand,
`set_knob` and `set_knobs` set them, and `bake` bakes once and returns the
features and score.

Follow the steps in the order the tickets give them. Set every knob a step names
before baking; a value outside a knob's range is refused, and the refusal must
reach your answer, not be retried silently with a different number. Bake once.

After the bake, write what happened into this round's testimony with
`append_testimony`: the knob values sent, the features, the score, and what the
result suggests for the next round.

Answer with the bake's result as it came back from the machine:

```json
{
  "round_id": "round-01",
  "knobs": {"oven_temperature": 215, "bake_time": 45},
  "features": {"crispness": 0.9, "moistness": 0.8, "softness": 0.7, "chewiness": 0.9, "sweetness": 0.8},
  "score": 0.85,
  "refused": []
}
```

Copy the features and score exactly as `bake` returned them. List in `refused`
every refusal the machine gave you.
