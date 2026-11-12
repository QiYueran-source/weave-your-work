# domain-modeling

Source: `skills/engineering/domain-modeling/` and its `ADR-FORMAT.md` and `GLOSSARY-FORMAT.md` in [`mattpocock/skills`](https://github.com/mattpocock/skills), read from the vendored copy while it existed.

## Where a record's format lives

**Question.** Does a record's format live beside the skill that owns it, or in one shared file?

**Answer.** Beside the skill. His file layout puts `GLOSSARY.md` at the root and `docs/adr/` at the root, each with its own format file beside the skill that writes it (`GLOSSARY-FORMAT.md` and `ADR-FORMAT.md` sit in `domain-modeling/`). ADRs are created lazily: `docs/adr/` appears only when the first ADR is needed. There is no shared format file that every record kind reads.

**What this repository does.** Each record kind's body and fields live under the skill that owns it: `map/res/`, `task/res/`, `grill/res/`, and so on. A change to how a map's body is written goes in `map/res/`, and no other file restates it. This is the shape `PRINCIPLES.md` names, and this file is where it was learned.

## How a field table is written

**Question.** Is there a table that says when each field is written?

**Answer.** No. His records are Markdown headings and optional sections; the format files say which sections exist and that a section appears only when it earns its place. There is no cross-record field table and no "written when" column.

**What this repository does.** `PRINCIPLES.md` asks the question of where "when to write" belongs, because `waymark/res/fields.md` carries it for every field while the same principle gives it to the record. The source gives no answer here: his set has no equivalent, so the question is open in `docs/principle-review.md` and on `wm-yb9eswa9esj6`.

## How a glossary and an ADR are recorded

**Question.** Does a glossary entry or an ADR get written at the moment it resolves?

**Answer.** Yes, inline, one at a time, and not batched to the end. A glossary entry is one term with a definition and the words to avoid; an ADR is a title and one paragraph, with three optional sections that appear only when they add something a reader cannot infer. An ADR is offered only when all three gates hold: hard to reverse, surprising without context, and a real trade-off.

**What this repository does.** `glossary/res/entry.md` and `adr/res/format.md` carry the same three gates and the same one-paragraph shape. `grill` writes each term as it resolves. No change was needed; this file records where the shape came from.
