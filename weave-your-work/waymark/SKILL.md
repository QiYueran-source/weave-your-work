---
name: waymark
description: "Read and write the project's waymark tracker: what each field means and who may write it, where a write lands, and how to query the tree, the ready list, and the history with commands that return JSON."
---

# Waymark

Waymark stores every ticket as a Markdown document in the repository. The set uses it as the only tracker: a map and a task are both waymark items, and the tree, the waits, and the evidence all live in their files.

This skill is the shared reference for the tracker. It does not decide what a map or a task is; the `map` and `task` skills do. It says what the fields mean, what a write does, and how to read the project back.

## What is here

| Question | File |
|---|---|
| What does a field mean, who writes it, and where does a write land? | `fields.md` |
| How do I see the tree, the ready work, or a history? | `queries.md` |
| How does a project set waymark up? | The `setup` skill. `start-a-project.md` initializes the tracker; `join-a-project.md` runs the checks on a clone |

The two reference files are the only definitions of their subjects in the set. A skill that writes a field says which value it writes and points here for the rule; a skill that reads the project names the command and the table in `queries.md` it reads the answer from.

## Reading before writing

A write is a command, never an edit to the file. `waymark show <id>` prints the front matter, the state, and the body together; that is what to read before deciding whether the ticket still holds. `fields.md` gives the command for each field.

Every write command takes `--dry-run` and prints what it would change. Use it on anything that reaches a ticket the run does not own; `fields.md` says which commands do.

## What this skill does not do

- Define a map body or a task body. Those are the `map` and `task-design` skills.
- Say when a ticket is opened, split, reviewed, or retired. Those are the lifecycle skills of each family.
- Initialize the tracker or repair its configuration. That is the `setup` skill.
