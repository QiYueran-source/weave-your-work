# writing-for-agents

Source: `skills/productivity/writing-for-agents/SKILL.md` and `.agents/invocation.md` in [`mattpocock/skills`](https://github.com/mattpocock/skills), read from the vendored copy while it existed.

## What a skill holds, and how much

**Question.** Does an action restate a rule the record's format already states?

**Answer.** No. The source names duplication as the first pruning fault: the same meaning in more than one place costs maintenance and inflates that meaning's prominence. It also names scattering: one meaning fragmented across many files should be grouped under one heading. The positive rule is one meaning in one place, and a document is split only when the cut earns its cost.

**What this repository does.** An action says what it writes and what it hands off; the shape it writes is read from the record's skill. The review found the opposite in several places (the size rule in `task/res/body.md` and `open-task`, the fog walk in `map/SKILL.md` and `open-map`) and repaired them. What is still open: whether an action may repeat one clause of the `parent` rule, and where a field's "when to write" belongs. Both are on `wm-yb9eswa9esj6`.

## How one skill reaches another

**Question.** Does a skill link into another skill's folder, or call it by name?

**Answer.** It names the skill and asks the Skill tool to run it; it never links across folders. The source is explicit: "an explicit instruction to call the Skill tool with the named skill, not deep `../other-skill/FILE.md` cross-references". Reference documents live inside the skill that owns them.

**What this repository does.** A call is written `call \`name\``, is the only edge in the call graph, and is refused when it makes a cycle. `check-references.mjs` fails a file that links into another skill's folder. `PRINCIPLES.md` rule two says the same, and this file is where that rule came from.

## What a pointer is for

**Question.** Should a description carry trigger phrases, and should a document be long or split?

**Answer.** The description is the skill's top-level pointer, always loaded, and its wording decides when the skill fires. Material reached only through a pointer is loaded when the pointer fires; material with no pointer rides entirely on what the person remembers. A document splits by sequence (where later steps tempt the agent to rush the current one) or by invocation, and not otherwise.

**What this repository does.** Descriptions carry the trigger branches and are model-facing; the router `ask-me` names every skill. `check-references.mjs` fails a skill the router does not name. What the source does not settle is where a reference to his set belongs, which is why `rules-matt.md` names `docs/matt-methods/` and leaves `PRINCIPLES.md` free of a per-skill attribution.

## Steps and the end of a step

**Question.** A `Transformation` block states what the work looks like when the action is done. Is that a shape his set uses?

**Answer.** Every step ends on a completion criterion, checkable from not-done, and nothing else; his set has no before/after block. The block's job is split in his set: the criterion is a step, and where the result goes is prose at the end.

**What this repository does.** Nothing yet. `docs/principle-review.md` records the question of whether the `Transformation` blocks are a contract; this file records that the source resolves it toward a completion criterion and a hand-off, with no separate before/after object.
