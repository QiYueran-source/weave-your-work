# Testimony

A testimony is the record of a grill: the question tree and what the person said while the decisions were discussed. It is one waymark record item per grill.

It is a record, not a work item: it has a category, an owner, and a status, but it is not a map or a task and does not enter the target tree.

## The item

- Category: `testimony`.
- Title: the topic, in plain words. No date or operator prefix.
- Owner: the person the grill is for — the owner of the discussion's work item, or the user when the grill is standalone.
- Creator: the operator or agent that wrote it.
- Status: `open` while the grill runs, `closed` when it ends. Tickets cite it only after it closes.
- Links: a soft link to the discussion's work item, and to any work item the grill hands off.

The file is the waymark id, `testimony/wm-....md`. The date and last edit come from `created_at` and `updated_at`; do not repeat them in the title.

## The body

Two sections:

### Question tree

A short outline of the questions, one line per node, indented where a question refines another. Use a checkbox and a note:

```md
- [x] Launch in Q1
  - [x] What counts as ready
  - [ ] Is the contract signed — fact, agent checking
  - [ ] Who approves — decision, waiting on VP
- [ ] Will sales object — assumption
```

`[x]` settled, `[ ]` open. A note says who is resolving it or what it waits on. The labels `fact`, `decision`, `goal`, `assumption` are optional; write one only when it helps say who resolves the node.

Rewrite the tree at the end of each round. Do not keep a history of tree states; the discussion below is the history.

### Discussion

What was said, appended at the end of each round:

```md
### Round 1

- Q: ...
  A: ...
- Lost alternative: ...
```

Write the answers in the person's terms; do not replace an answer with your own conclusion. Questions may be shortened.

## Work leaves the testimony

When a question becomes work — someone must do something and it must be checked — write one line and hand it to the caller:

```md
- work: Contract review (the agent cannot check the contract; the caller creates the task)
```

The caller creates the map or task in the target tree. The work item hangs under a map, not under the testimony; the testimony is a record, not a target. Add the work item's id or link when it exists.

A term goes to the glossary and an ADR to the `adr` skill; the testimony holds at most a one-line pointer.

## What it does not hold

Research findings, what an agent did during a run, and a ticket's conclusions are not testimony. A file written after the discussion is a summary, not a testimony.

## Where the rest goes

Research findings are results, not testimony. A research question that needs work becomes a task; its findings go in that task's `Result`. A finding the map relies on becomes a `Decisions so far` entry linked to the task. The grill hands the conclusion to its caller, and the caller writes it into its map or task. There is no separate research record.

## Citing it

Tickets cite a testimony with a relative Markdown link next to the relevant decision, fact, or fog entry. Cite only after the grill closes and the testimony is `closed`.
