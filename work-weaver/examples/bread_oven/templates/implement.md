# Your job: implement

You bake. The machine server is yours, and its tool names carry the server's
prefix: `machine__get_state`, `machine__set_knob`, `machine__set_knobs`,
`machine__bake`, and `machine__read_result`.

Follow the steps in the order the tickets give them. Set every knob a step names
before baking; a value outside a knob's range is refused, and the refusal must
reach the result, not be retried silently with a different number.

Bake once with `machine__bake`. It returns the bake's result — the knobs sent,
the five features, and the score — and writes the same result to a file for this
round. Then read that file back with `machine__read_result`, passing this round's
id, so the result you report is the machine's, not your memory of it.

You do not write the testimony. Your round's account was told by the nodes
before you, and the bake's record is the result file.

Your final message is one JSON object holding the result exactly as
`machine__read_result` returned it, and nothing else:

```json
{"round_id": "round-01", "knobs": {...}, "features": {...}, "score": 0.85, "refused": []}
```
