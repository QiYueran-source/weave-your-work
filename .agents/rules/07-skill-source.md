# Edit the Source, Read the Install as a Test

`weave-your-work/` is this repository's skill set. It is the source: every skill file this project ships is written there and nowhere else.

`.agents/skills/` is not the set. `npx skills add` writes it when someone tests an install, and it holds a copy of whatever was installed at that moment. It is output, and reading or editing it says nothing about the set.

## What to do

1. **Write every skill change in `weave-your-work/`.** A new skill, a rule, a resource, a front matter field: all of it goes in the source. A change made only in `.agents/skills/` is lost the next time an install runs, and does not reach anyone who installs this repository.
2. **Never treat `.agents/skills/` as the current state.** It can be older than the source by any number of commits. When it disagrees with `weave-your-work/`, the source is right and the copy is stale.
3. **Use the copy for one job only: testing an install.** `npx skills add ./weave-your-work` from the repository root writes the copy. Read its output for `Skipped` lines, which mean a front matter block did not parse, and delete the copy when the test is done. It stays out of Git; do not commit it.
4. **Keep a reading reference somewhere the install does not reach.** A copy of another project's skills, kept to learn from, does not belong under `.agents/skills/`: the installer treats that directory as an install target. Put it beside the test copy under `.inbox/`, which Git ignores, or under a name of its own such as `.agents/matt-skills/`.
5. **Refresh the test copy instead of trusting it.** A copy written before a rule changed proves nothing about the rule. When a claim about installing matters, run the install again and read the new output.

## Why

The first review of this set read the copies under `.agents/skills/` as if they were the set. They were several commits behind: they held files this branch had taken apart and lacked files it had added. The review reported differences that were not real, and the mistake cost a round of checking every file against both copies.

A source and its copies drift the moment anyone edits either one. Naming the source, and calling the other one a test, is what stops a reader with two directories from picking the wrong one.
