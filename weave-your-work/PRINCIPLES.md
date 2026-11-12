# Principles

Four rules this set is built on. The first three outrank any skill file, and a change that breaks one of them does not land. The fourth is a reference, not a requirement.

## One: one fact, in one place

Every fact is written once. A second copy drifts, and a reader cannot tell which copy is current.

**Do not split a fact.** A record's field rules and its body rules are one subject. A map's fields, sections, states, and review belong together in the map skill's folder; a task's belong in the task skill's folder. Do not put half a record's definition in a shared file and half under the record.

What counts as one fact:

- everything that decides what a map record contains, including the custom fields it carries and when each is written
- everything that decides what a task record contains
- the sentence that defines a dependency, and what it means for readiness
- the rule for when fog is written, and the forms it takes

What is shared, and shared on purpose, is only what truly belongs to every record at once: the command that writes a field, the meaning of `parent`, and the three dispositions a change can take.

## Two: no dependency for a call, no cycle in the graph

A record is written by one action. A reader never writes another skill's record, and a skill never calls back into a skill that calls it.

Two kinds of mention, and only one of them counts in the graph:

- **Call** — the steps go to another skill now, in the same run: "call `grill` for the decision". Write it as `call \`name\``, with the backticks on the name. A call is an edge.
- **Reference** — the skill says where its result goes, what a reader should read, or what happens next, and stops. "The record's shape is the `map` skill's"; "this flow does not restate those steps"; "`update` repairs a map that already exists." A reference carries no edge, and a skill with many references is not one with many dependencies.

The **call graph** is every edge. It must have no cycle: two skills that each call the other are one action split across two files, and the split is what to fix, not the wording.

A node is not a file. `split` calling `open-map` once per child map, which writes each child, is a tree: the child is work, and the child's own opening is a lower node. `split` → `open-map` → back into `split` for that child's layer is a cycle, and it is one to cut. The line is that going down a tree is not going back up it.

## Three: Matt's set is a reference, not a rule

This set adapts [mattpocock/skills](https://github.com/mattpocock/skills). His set is worth reading before inventing a shape, and reading it settles nothing formally: no skill file, assertion, or review verdict names him.

When a shape follows his, `docs/matt-methods/` records which file was read and what it settled. A change that reached its shape from this repository's own rules, records, or discussion writes nothing there.

When his set has no answer, the fallback is the smallest thing that keeps the other three.

## Four: rules set direction, not layout

A rule says what must exist. It does not say how many paragraphs, lines, bullets, or symbols to use. A rule that describes layout is either a machine contract or decoration, and only one of those earns its place.

- **A machine contract names its check.** If a check needs a fixed shape, the rule states that shape and says which check reads it. "A fog entry's second line says what resolving it would change. `[check-records]`" is a contract: the checker looks for that line.
- **Decoration goes.** "One or two sentences", "one line per axis", "an entry is one line": nothing decides on those, and a writer spends attention satisfying them. Say what the rule is for and stop.
- **A rule that several layouts satisfy is finished.** When more than one way of writing it meets the rule, the rule needs no more words.

This applies to records. An action still says what it does and in what order; "set direction, not layout" is not a licence to turn a step into a slogan.

## How these are checked

| Rule | How it is checked |
|---|---|
| One: one fact | `scripts/check-references.mjs` fails a skill file that links into another skill's folder; a person checks, at review, that no record's definition is split across two folders |
| Two: no cycles for calls | `scripts/check-references.mjs` reads every `call \`name\`` from each `SKILL.md`, builds the graph, and fails on a cycle; every other mention is a reference and carries no edge |
| Three: Matt is a reference | no check. A shape that follows his is recorded in `docs/matt-methods/`; one that does not needs nothing |
| Four: direction, not layout | `scripts/check-references.mjs` fails an assertion that names no check, which is how a contract without a reader is caught; a person checks, at review, that no rule spends words on layout that no check reads |
