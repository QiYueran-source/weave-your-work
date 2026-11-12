# Principles

Four rules this set is built on. They outrank any skill file, and a change that breaks one does not land.

## One: one fact, in one place

Every fact is written once. A second copy drifts, and a reader cannot tell which copy is current.

**Do not split a fact.** A record's field rules and its body rules are one subject. A map's fields, sections, states, and review belong together in the map skill's folder; a task's belong in the task skill's folder. Do not put half a record's definition in a shared file and half under the record.

What counts as one fact:

- everything that decides what a map record contains, including the custom fields it carries and when each is written
- everything that decides what a task record contains
- the sentence that defines a dependency, and what it means for readiness
- the rule for when fog is written, and the forms it takes

What is shared, and shared on purpose, is only what truly belongs to every record at once: the command that writes a field, the meaning of `parent`, and the three dispositions a change can take.

## Two: no cycles

A skill is one complete action. It may hand its result to another skill; it may not depend on a skill that depends on it.

Two kinds of mention, and only one of them counts as a dependency:

- **Call** — the steps actually go to another skill: "call `grill` for the decision", "call `open-map` once per child". A call is a dependency.
- **Hand-off** — the skill names where its result goes and stops: "what happens after the map is written is not this action's concern"; "the verdict goes to the owner". A hand-off carries no dependency.

The **call graph** — every skill's calls, no hand-offs — must have no cycle. Two skills that each call the other are one action split across two files, and the split is what to fix, not the wording.

A caller decides whether to act on a hand-off. The callee never names the caller as a step.

## Three: when unsure, follow Matt

This set adapts [mattpocock/skills](https://github.com/mattpocock/skills). When a question about structure is open, look at how that set solves it and follow that before inventing a new shape.

The places his set has already answered:

| Question | His answer | Where |
|---|---|---|
| What a `SKILL.md` holds | when to use it, what to do, what to write | every `SKILL.md` |
| Where a format reference lives | inside the skill that owns the record, as a file beside the skill that writes it | `domain-modeling` in mattpocock/skills |
| How one skill reaches another | an explicit instruction to call the Skill tool, never a path into another folder | `invocation` doc in mattpocock/skills |
| Who can reach a skill | user-invoked (only a person) or model-invoked (any run) | `invocation` doc in mattpocock/skills |
| How the set is indexed | one router, and it must list every skill or it lies | `ask-matt` in mattpocock/skills |
| How setup works | explore, present, confirm, write text; no script | `setup-matt-pocock-skills` in mattpocock/skills |
| How a phase hands off | a portable file with the things the records do not carry | `handoff` in mattpocock/skills |

When Matt's set has no answer, the fallback is the smallest thing that keeps the other three.

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
| Two: no cycles | `scripts/check-references.mjs` builds the call graph from each `SKILL.md` and fails on a cycle |
| Three: follow Matt | no check; the reviewer says which skill in mattpocock/skills they followed, or why none applies |
| Four: direction, not layout | `scripts/check-references.mjs` fails an assertion that names no check, which is how a contract without a reader is caught; a person checks, at review, that no rule spends words on layout that no check reads |
