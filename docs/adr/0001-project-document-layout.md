# Keep project state, sources, testimony, and delivery artifacts in separate roots

The project keeps different kinds of durable material in separate top-level locations: `tickets/` stores map and task work state, `.work-weave/glossary/` stores per-operator JSONL glossary sources, `GLOSSARY.md` is the generated local glossary view and is ignored, `testimony/` stores records of grill discussions, `docs/adr/` stores accepted decisions, and `weave-your-work/` stores the delivered skills and examples. This separation keeps tracker state, source data, records, decisions, and deliverables from being mistaken for one another.

The glossary source location changed from the top-level `glossary/` to `.work-weave/glossary/` on 2026-11-10. The sources moved and the tool runtime now installs under the project; everything else in this record stands.

Owning ticket: [wm-qhd3twqjzhma](../../tickets/map/wm-qhd3twqjzhma.md).
Amendment owning map: [wm-2ztwvye6q9t7](../../tickets/map/wm-2ztwvye6q9t7.md).

## Consequences

`GLOSSARY.md` is not the shared source file and must be regenerated from `.work-weave/glossary/*.jsonl`; the source files and testimony records are committed so the team can share and review them. A project that still has a top-level `glossary/` migrates it with the glossary setup; the old directory is removed only after the regenerated view has the same terms. Testimony files are named `YYYY-MM-DD_operator_topic.md`; they are not tickets, are not processed by waymark, and do not enter the target tree. The directory was called `weave-logs/` until 2026-11-08, when the record was narrowed to grill discussion and renamed testimony.

## Status

The testimony clauses are superseded by ADR-0002; the rest of this record stands. The testimony location is superseded again by ADR-0003, which puts testimonies under `tickets/`; the rule that different kinds of durable material get separate roots still stands.
