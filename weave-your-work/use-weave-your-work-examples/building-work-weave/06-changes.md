# What changed during the run

- The old map was retired and re-charted in the fixed map format.
- "Goal" was dropped; every target node is a map.
- The tickets were converted to English.
- The map template was fixed to six sections, with only `phase` as a custom field.
- Rule 03 was added: settled details land in the owning ticket immediately.
- The execution map's destination now names four skills: map, task, glossary, and explore.
- The three skill designs were first cut as tasks, then moved to skill maps; the skill layer was missing at the first cut.
- The map and task skill designs became skill maps of their own, with worked examples under `weave-your-work/use-weave-your-work-examples/`.
- The category maps were hung under the root map (`fa46553`), closing the parent gap.
- The glossary install task moved under the glossary map, so its dependency on that map was removed (a child does not wait for its parent).
- The examples moved into the `use-weave-your-work-examples` skill, split by section.
- Rule 05 was added: a skill's `description` is quoted, because an unquoted colon fails the installer's YAML parse.
- This rule and example were added on 2026-11-06.
