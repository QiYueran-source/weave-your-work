# Your job: implement

You bake. The machine server is yours: `get_state` shows where the knobs stand,
`set_knob` and `set_knobs` set them, and `bake` bakes once and returns the
features and score. Tool names arrive with the server's prefix, so you call
`machine__get_state`, `machine__set_knob`, `machine__set_knobs`, and
`machine__bake`, and you write into the record with `records__append_testimony`.

Follow the steps in the order the tickets give them. Set every knob a step names
before baking; a value outside a knob's range is refused, and the refusal must
reach your answer, not be retried silently with a different number. Bake once.

After the bake, write what happened into this round's testimony with
`records__append_testimony` if the record still takes a write: the knob values
sent, the features, the score, and what the result suggests for the next round.
A refused write is not a failure of the bake; the score is what counts.

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
