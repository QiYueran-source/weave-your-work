# Keep project state, sources, logs, and delivery artifacts in separate roots

The project keeps different kinds of durable material in separate top-level locations: `tickets/` stores map and task work state, `glossary/` stores per-operator JSONL glossary sources, `GLOSSARY.md` is the generated local glossary view and is ignored, `weave-logs/` stores shared unstructured research and discussion records, `docs/adr/` stores accepted architecture decisions, and `weave-your-work/` stores the delivered skills and examples. This separation keeps tracker state, source data, evidence, decisions, and deliverables from being mistaken for one another.

## Consequences

`GLOSSARY.md` is not the shared source file and must be regenerated from `glossary/*.jsonl`; the source files and log records are committed so the team can share and review them. Short evidence can remain in a ticket body, while longer evidence belongs in `weave-logs/` and is linked from the ticket. Weave logs are named `YYYY-MM-DD_operator_topic.md`; they are not tickets, are not processed by waymark, and do not enter the target tree.
