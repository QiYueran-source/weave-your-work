# Testimony is a waymark record item

Testimony is a waymark record item in a `testimony` category at `testimony/`, not a plain file and not a work item. Its title is the topic; its owner is the person the grill is for; its creator is the operator or agent; its status is open while the grill runs and closed when it ends. The body holds the question tree and the discussion, written once per round. Work a grill produces is handed off to the target tree with a `work:` pointer; the testimony never parents work. Post-hoc summaries live under `testimony/summaries/` and are not waymark items. Work queries filter to map and task, so a testimony never enters the frontier.

## Status

Accepted. The testimony clauses of ADR-0001 are superseded by this record; the rest of ADR-0001 stands.

## Considered Options

- **A plain Markdown file.** Simpler, and it keeps the readable `YYYY-MM-DD_operator_topic.md` name. But it has no owner, status, links, or search in the tracker, and the citation gate stays informal.
- **Reuse the `comment` category.** No new category, but comment means a record synced from an issue; a testimony is written locally during a grill, so reusing it would conflate two record types.

## Consequences

The glossary gains `record item`, `question tree`, `askable set`, `refine`, and `hand off`, and `frontier` narrows to work items. The setup step must add the `testimony` category and the `testimony/` path. The two pre-existing summaries moved to `testimony/summaries/`, which is outside the tracked category root.
