# Map review

How a map is judged, and the shape its `## Review` takes. The action that writes it is `map-review`.

## Two axes, one verdict each

Each axis is judged on its own and reports its own verdict from the four below. One holding does not cover the other, and merging them hides a failing axis behind a passing one.

- **Goal**: did the map do what its `Acceptance direction` says? Read the direction line by line, and the review point with it. Every line has to be answered by what the map and its children delivered.
- **Convention**: was the map built to the rules? The body shape from `body.md`, the child types against `split_as`, no children index, the relations from `waymark/res/relations.md`, and one owner per write.

Every finding names its source: the direction line it did not meet, or the rule it broke. A finding that cites nothing is an opinion, and it is dropped rather than reported.

## Four verdicts

| Verdict | When |
|---|---|
| `passed` | this axis holds |
| `needs changes` | this axis names a gap someone can close |
| `needs discussion` | ambiguity prevents reading the direction as a standard, or the map's words contradict each other |
| `wrong direction` | the map cannot be judged because it was the wrong target |

## What the pair does to the record

| Goal | Convention | The record |
|---|---|---|
| `passed` | `passed` | the map closes |
| anything else | anything else | it stays where it was; the next step comes from the worse of the two, below |

When the two verdicts disagree on the next step, `wrong direction` outranks `needs discussion`, which outranks `needs changes`.

- `needs changes`: repair, then review again.
- `needs discussion`: the recorded question goes to a discussion.
- `wrong direction`: `outcome=failed`, then the map closes; the owner opens the sibling that replaces it.

## The section

One block per review: `Goal: <verdict>` and `Convention: <verdict>`, each on its own line with that axis's evidence under it. A later review adds a new block; when an older block no longer holds, it is struck under the rule `body.md` gives every section.

## Assertions

- A closed map with no `## Review`. [check-records]
- A closed map whose `Review` carries a non-passing verdict. [check-records]
- `outcome=failed` with a verdict other than `wrong direction`. [check-records]
- A `Review` that merges the two axes into one verdict. [review]
- A finding with no source. [review]
