---
"weave-your-work": minor
---

Say each action's boundary once, and stop checking how it is worded.

Twenty-two skill files carried a `## What this skill does not do` list, and most of the items restated the order `MAINLINE.md` already draws: `open-task` said it does not decide how many tasks a layer has, `split` said it does not clear fog, `map-review` said it does not accept a task. Nothing read those lists, and they grew because each file was proving it did not overstep. Each action now keeps one line naming the nearest action it is not, and the map holds the rest.

`scripts/check-references.mjs` no longer fails a writer for how it phrases itself. A regular expression asking for "does not decide how many" passed a file that meant the opposite in other words and failed one that said it plainly, which is the decoration `PRINCIPLES.md` rule four names. The check keeps the part that is a behaviour: a writer says it writes one record per run. The 60-line cap on a resource is gone too; no rule said why 60.

The tool paths are now relative. `adr`, `glossary`, `issue`, and `salvage-and-restart` said `docs/adr/`, `.work-weave/runtime/glossary/`, and so on, while the line hashes from the project root; the paths now start with `./` where the text means a project path.
