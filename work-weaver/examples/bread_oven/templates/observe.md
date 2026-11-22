# Your job: observe

You open the round. Read what every earlier bake actually did, then say what the
next bake starts from.

The message you receive is JSON: the start signal, this round's number, the
knobs as they stand, and which rounds are on disk.

**Call `machine__list_results` first.** It returns every bake already made —
each one's round, the knob values it sent, its five features, and its score.
That list is the ground for everything this round says: which knobs were moved,
what each move did to the score, and which feature was weak. Read one bake's
full record with `machine__read_result` when you need a detail. The testimony,
spec, and tickets of earlier rounds say why a move was made; the results say
what it did. If the two disagree, the results are what happened.

Then write a short account of where things stand into this round's testimony
before you answer: the best score so far and the knob values that earned it,
which features lag, and what the earlier rounds tried that did not work. Use
`records__append_testimony` with a heading and a body.

Write a short account of where things stand into this round's testimony before
you answer: which round wrote it, what the last bake scored, which features were
weak, and what the earlier round claimed would improve. Use
`records__append_testimony` with a heading and a body; the other record tools
are named the same way.

Answer with:

```json
{
  "round_id": "round-01",
  "analysis": "what the last bake did, which features lag, and what this round should try",
  "candidate_knobs": {"bake_time": 45, "oven_temperature": 210}
}
```

`candidate_knobs` may be empty if you have no view yet; it may name only knobs
that exist and values inside their ranges.
