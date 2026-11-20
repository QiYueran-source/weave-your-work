# Take Matt's Set as the Base for This Version

The weave-your-work set is being rebuilt on Matt Pocock's skills. His skill is the shape this version starts from; an earlier weave-your-work skill is a reference, not a specification.

## What to do

1. **Start from his file.** When a skill exists in his set, copy it as the base and edit that copy. Do not write a new skill from the old set and call it the same thing. The upstream commit and the copied files are recorded in `weave-your-work/UPSTREAM.md`.
2. **Read his wording for what it decides.** His structure, his steps, and his order are the baseline. When this version departs from them, the departure is a recorded decision, not an accident of rewriting.
3. **Read the old set for what it solved.** An old skill answers questions his set never asks: who owns a record, what happens when two people write at once, how a change reaches what relied on it. Take those answers. Take its code too: the glossary MCP server, the CLI, and the install steps are reusable as they are.
4. **Do not keep the old wording.** An old file's sentences are not a contract. Where his phrasing does the job, his phrasing wins; where the old set solved a problem his does not address, write the answer in the new file's own words. Compatibility with the old phrasing is not a goal.
5. **Keep the old set reachable.** The set before this rebuild sits in `.inbox/v1-weave/`, which Git ignores. Read a file from there when a decision needs it, and record what was taken in the new file. A step that copies from it says so.

## Why

The two sets answer different questions. His is built for one person working one ticket at a time; the old set carries records across sessions and across people. A rewrite that starts from the old file and edits toward his shape carries the old set's assumptions into a place they do not fit, and a rewrite that starts from his file and ignores the old set loses the answers the team already paid for. Naming which one is the base, and which one is a reference, is what keeps both jobs visible.
