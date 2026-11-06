# Setting dependencies

### The model came before the edges

The execution map settled the dependency model before any edge existed: the tree carries structure, the edges carry order. A dependency is a "waits for" relation between two nodes; adding or removing it does not move either node in the tree.

The glossary entry for dependency edge records the same rule, and it was written while the design was being settled. Later tickets use one meaning for the term.

### An edge that turned into a parent

The glossary work first exposed an edge: the install task consumes the pieces the glossary skill map produces, so the install waited for the design. The edge pointed from the install task to the skill map.

The next judgment changed the relation. The install step is part of the glossary skill, not part of setup's design: it installs that skill's pieces. So the task moved under the glossary map and the dependency was removed. A child does not wait for its own parent; the parent's acceptance waits for the child.

This is the layer test again, applied to the relation: the same two nodes can be parent-child when one is part of the other, and a dependency when one merely consumes the other's output. Choose by what the relation means, not by the shape of the tree.

The lesson: when two tickets sit in different branches and one consumes the other's output, wire the edge in the same pass that creates them. But check the relation first; a parent-child link may be the truth, and a dependency on top of it would be a loop.

### Edges left unwired

The root map leaves cross-category routing (ask-me to execution and communication) in fog. It is not sharp enough to be an edge yet: the routing rules are not settled. No other edge was added; the category maps are not sequenced.
