# What this example does not show

- **A Gitee write.** GitHub's five actions were run end to end on a private scratch repository on 2026-11-08; the probe issue is closed and the repository is archived. Gitee's create, comment, and close still wait on a token and a test repository. Until they are run, the acceptance signal is not met and the map cannot close.
- **A blind read of the skill.** The update skill's build ended with four fresh readers; this one has not had its first complete read yet. The question the readers answer is not "are the facts right" but "can a person holding this skill act on it", and only the second test catches a rule that is true and unusable.
- **A real cross-owner hand-over.** Every ticket in this repository is owned by `frank`, so the archive example in [Three callers and one message](01-three-callers.md) is a scenario, not a run. The shape is checked against the update map's rule; the delivery is not.
- **The `comment` category's fate.** The skill does not use it, but the category is still declared and the glossary still defines it. Whether it stays is a decision for the execution map, which owns the question.
- **The end-to-end batch.** The root map runs every skill's paths once the set is whole. This example records the design of one skill; it is not that test, and it does not claim the issue skill works beside the others.
