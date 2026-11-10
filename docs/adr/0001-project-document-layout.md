# Keep project state, sources, testimony, and delivery artifacts in separate roots

The project keeps different kinds of durable material in separate top-level locations: `tickets/` stores map and task work state, `glossary/` stores per-operator JSONL glossary sources, `GLOSSARY.md` is the generated local glossary view and is ignored, `testimony/` stores records of grill discussions, `docs/adr/` stores accepted decisions, and `weave-your-work/` stores the delivered skills and examples. This separation keeps tracker state, source data, records, decisions, and deliverables from being mistaken for one another.

Owning ticket: [wm-qhd3twqjzhma](../../tickets/map/wm-qhd3twqjzhma.md).

## Consequences

`GLOSSARY.md` is not the shared source file and must be regenerated from `glossary/*.jsonl`; the source files and testimony records are committed so the team can share and review them. Testimony files are named `YYYY-MM-DD_operator_topic.md`; they are not tickets, are not processed by waymark, and do not enter the target tree. The directory was called `weave-logs/` until 2026-11-08, when the record was narrowed to grill discussion and renamed testimony.

## Status

The testimony clauses are superseded by ADR-0002; the rest of this record stands. The testimony location is superseded again by ADR-0003, which puts testimonies under `tickets/`; the rule that different kinds of durable material get separate roots still stands.
