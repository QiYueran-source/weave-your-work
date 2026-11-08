# Three dispositions

### The first cut asked how big the change was

The map's first entry split content changes by size: a small change is edited on the ticket, a large one retires it and opens a parallel ticket. It reads like a rule and it decides nothing, because nobody can say where small ends. Two people using it on the same ticket reach different answers, and each believes the rule agreed with them.

The user rejected it in one line: do not use size, use the acceptance tests. The replacement is two questions asked in order — does the node still answer the same question, and does the recorded acceptance still hold — and their answers sort every change into one of three dispositions.

The lesson is the one about any threshold that is not measurable: it moves the judgement into a word and then hides it. A test that two people can run and agree on does not.

### The third disposition was not in the first design

The opening design had two dispositions: edit, or reopen. Both assume the ticket stays the same ticket.

A node whose subject changed is not that node any more. Its children were hung to refine the old subject; its review verdict was written against the old text; its dependents wait for an outcome that is no longer being produced. Editing it in place leaves all three quietly wrong, and none of them says so.

So the third disposition retires the node with archive and opens a parallel one under the same parent. It is more work than an edit, and the first design left it out because the cheap path was already written down. The gap showed up when the question changed from "how do I change this ticket" to "what is this ticket for".

### `outcome=failed` was considered and dropped

A retired node looks a little like a failed one: work that is no longer wanted. The distinction that settles it is what the verdict is about. Failure is a verdict on an attempt — the work ran and did not deliver. Retirement is a verdict on a subject — the work delivered, and the tree moved. A completed node made obsolete by an upstream change is archived with a reason, never marked failed.

The glossary's `archive` entry grew to say so, because "done but retired by an upstream change" had no home before this effort.

### Children move by recursion, not by a list

The parent's content change is read against each child. A child that still refines the new content does nothing; one whose own verdict no longer holds runs the second disposition itself; one that refines nothing is retired.

The map template carried a `## Children` list until this effort. It was dropped (`6b5bf34`), and that changed this design: with the list gone, recording a parent relation writes only the child's file, so re-hanging a child never touches the parent's body. An earlier entry in the design map — "a branch cannot continue when the foreign node is the parent whose Children list must change" — was struck through because the thing it was about stopped existing.

Neither rule was wrong when written. One of them lost its subject, which is the ordinary fate of a design that outlives the shape it was designed against.
