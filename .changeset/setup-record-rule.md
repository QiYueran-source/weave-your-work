---
"weave-your-work": minor
---

Add `setup`'s record rule: find the work in the tracker before editing.

A request that changes a file now starts by finding the record the work belongs
to, using whatever the project's own record settings name. When no record owns
the work, the rule stops before the file changes and leaves the decision to the
person: open the record this work should have started from, or settle that the
change needs none. The rule names no tool, so it holds for a project whose
tracker is not waymark.
