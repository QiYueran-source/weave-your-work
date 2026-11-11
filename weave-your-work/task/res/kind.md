# Task kinds

Every task is one of two kinds, and the kind decides which sections it carries and what failure means. The field is `task_kind`, written when the task is written and frozen after.

| Kind | Commits to | Failure is |
|---|---|---|
| `delivery` | an output that can be named before the work starts | an incident: someone must recover |
| `probe` | an answer the map does not have yet | a normal result, recorded as a finding |

Ask what the task commits to. A `delivery` can name its output now; a `probe` cannot, because the answer depends on what reality turns out to be.

- A `delivery` that is `one_way` carries `Failure recovery`: what is done when the promise breaks.
- A `probe` carries `Next step`: what the finding unblocks, or what it means for the map.
- A `probe` trades the smallest reversible action for information, so its `Acceptance signal` says what would count as an answer, not what counts as success.

## Assertions

- `task_kind` missing or outside the two values. `[check-records]`
- A `delivery` with no named output in its `Action`. `[review]`
- A probe whose signal can only pass or fail, with no room for "the answer is the other way". `[review]`
