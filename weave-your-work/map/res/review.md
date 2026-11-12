# Map review

How a map is judged. The verdict lands in the map's `## Review` section, in the shape below; the action that writes it is `map-review`.

## Two axes

Read them separately and report them separately: one holding does not cover the other, and merging them hides a failing axis behind a passing one.

- **Goal**: did the map do what its `Acceptance direction` says? Read the direction line by line, and the review point with it. Every line has to be answered by what the map and its children delivered.
- **Convention**: was the map built to the rules? The body shape from `body.md`, the child types against `split_as`, no children index, the relations from `waymark/res/relations.md`, and one owner per write.

Every finding names its source: the direction line it did not meet, or the rule it broke. A finding that cites nothing is an opinion, and it is dropped rather than reported.

## Four verdicts

| Verdict | When | What it does to the status |
|---|---|---|
| `passed` | both axes hold | `closed` |
| `needs changes` | an axis names a gap someone can close | stays `in_progress`; repair, then review again |
| `needs discussion` | ambiguity prevents reading the direction as a standard, or the map's words contradict each other | stays `in_progress`; the recorded question goes to a discussion |
| `wrong direction` | the map cannot be judged because it was the wrong target | `outcome=failed`, then `closed`; the owner opens the sibling that replaces it |

## The section

A short entry for every verdict: the verdict, then one line per axis with its evidence.

A verdict that no longer holds stays in place, struck through, with a line saying why it was invalidated. The fresh verdict is written above it.

## Assertions

- A closed map with no `## Review`. [check-records]
- A closed map whose `Review` carries a non-passing verdict. [check-records]
- `outcome=failed` with a verdict other than `wrong direction`. [check-records]
- A `Review` that merges the two axes into one verdict. [review]
- A finding with no source. [review]
