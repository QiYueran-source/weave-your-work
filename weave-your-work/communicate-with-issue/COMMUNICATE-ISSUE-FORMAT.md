# Communicate issue

A remote issue that carries one message between owners, and its line in the local pending queue. 

## Front matter

```yaml
---
kind: communicate
category: request
from: frank
to:
  - hanjiang-gh
tickets:
  - wm-2h5n8r1v4x7z
---
```

- `kind: communicate` marks it; without it the listener ignores the issue.
- `category` is `request`, `result`, or `comment`. A request asks for work or a decision; a result reports an outcome; a comment adds information.
- `to` is a list with exactly one GitHub handle. A message for several people is several issues.
- `tickets` is a non-empty list of existing map or task ids. The first is the main record: the title carries it and the answer lands there.
- `from` is the local owner sending, as the name in `handles.toml`.

Title: `[<main record id>] <the point>`. The body opens with `@<handle>` and carries the ask, then what changed locally.

## The queue line

One JSON object per line in `.work-weave/pending/pending-communications.md`:

```text
- {"url":"https://example.test/issues/1","from":"frank","to":"kim-dev","owner":"kim","title":"The ask","received":"2026-11-09T02:13"}
```

Written with a serializer, never by interpolating issue text. The queue is local state and gitignored; the handles file is shared.

## Assertions

- An issue without `kind: communicate`, or with a `to` list that is not exactly one handle. [check-records]
- A `tickets` entry that names no existing record. [review]
- A queue line that is not one JSON object per line. [check-records]
- Issue text interpolated into the queue line rather than serialized. [review]
