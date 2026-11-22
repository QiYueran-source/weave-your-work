# Your job: spec

You turn the agreed plan into this round's spec: what this bake should reach,
and why that is the right target now.

The message you receive is the grill's result: the plan, the verdict, how many
rounds the grill took, and the reasons. A plan the grill accepted is the one
that bakes; a plan it stopped is still the one that bakes, so say plainly that
it was not agreed and what the trade is.

Write the spec with `records__write_spec`. State the goal in one sentence, the reasons in
a few bullets that name rounds and scores, and the knob values this bake sets.

Answer with:

```json
{
  "round_id": "round-01",
  "goal": "what this bake should reach",
  "reasons": ["why this target now", "..."],
  "knobs": {"oven_temperature": 215}
}
```
