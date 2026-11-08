# The move that is one command

### What the move was expected to cost

Relocating a subtree was not in the original question. It arrived later: sometimes nothing about the node changes, only where it hangs.

The first analysis priced it as a rebuild, because that is how you would do it by hand — create the node in the new place, move the children over one at a time, delete the old one. That price is high and it was written down honestly: every dependent loses its edge, because archiving the old node strips them, and every review verdict has to be re-litigated, because `waymark create` returns the node as `open`.

Then the probe: `parent set` writes the child's front matter and nothing else. The parent file's checksum does not change. Every descendant follows, because each of them points at its own parent. `waymark tree --root` shows the whole subtree in its new place with the descendants intact.

So a move writes one file and changes one line. The rebuild was not merely expensive; it destroyed the record it was meant to preserve.

### The user's ruling was that this is not a fork

Two candidate rules were on the table for when a move should be allowed. The user cut through it: a move and a rebuild do not constitute two paths to choose between. A relocation whose content is unchanged is `parent set`. A relocation whose content also changed is the third disposition — the old node retires and the new one is built in the new place, and that is a content change that happens to include a move, not a move with extra steps.

What settled it was looking at what the operator actually knows at the moment of the decision. They know whether the content changed. They do not know, and should not have to decide, which of two machinery paths to run.

### Which of the three tickets reopen

A move writes one file and changes three tickets' meaning: the node, its old parent, its new parent. The rule that came out follows the work rather than the edit — the moved node keeps its status, because it answers the same question it always did; the old parent reopens when its Target no longer holds without the node; the new parent reopens only when an unfinished subtree arrives under a closed map.

The last one is the non-obvious case. Hanging finished work under a closed map changes nothing about that map's verdict, so nothing reopens. Hanging open work under it makes its "all children are complete" claim false, and its owner has to decide.

### Nothing is recorded, on purpose

The design first wanted a `moved from` note on the ticket. It was dropped: `waymark git history --item <id>` and the commit diff both show the `-parent:` line, so a note would be a second copy of a fact git already holds and a second thing to keep true. This repository has one such move to check against — the glossary install task moving under the glossary map (`b699d5f`) — and the old parent survives in exactly that place.

### The wrong claim about category changes

The first draft of `move.md` said no waymark command changes a category, so turning a task into a map was a retire-and-replace by default. That was never checked, and it is false: `waymark move <id> <category>` exists, rewrites the category field and moves the file to the other directory.

The conclusion survived the correction and the reason changed, which is the useful part. The command does not touch the body, and `waymark validate` does not check whether a body matches its category — so moving a task with an `## Action` section into the map directory produces a map ticket with no Target, and nothing complains. The operation is still a retire-and-replace, because the body has to be rewritten either way. The skill now says that instead of saying the command is missing.

### Why a move is not just the cheap way to retire

If a move is one command, why not use it to get a node out of the way instead of archiving? Because the reason to retire a node is that its subject changed, and moving a wrong node to a different parent leaves it just as wrong. The two operations answer different questions.

### A claim that did not survive the probe either

The first draft of `move.md` said moving a subtree under a blocked map takes everything under it out of `waymark ready`. It does not: `waymark ready` reads dependency edges and never looks at `parent`, so a task under a blocked map, and a map under a blocked map, both come back ready. The wait is real — the work is behind a map that has not started — but no query reports it, so the skill says to walk the parent chain by hand.

Two claims in one file were wrong in the same way: they were plausible from the model of the tree and had never been run. Both were caught by writing a scratch project and asking, which is cheaper than it sounds and was the only thing in this effort that ever changed a decision.
