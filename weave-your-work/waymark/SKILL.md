---
name: waymark
description: "The record formats this set writes: every field and legal value, the relation rules, and the body of a map, a task, a testimony, an ADR, a glossary entry, an issue, a handoff, and a patrol report. Read it before writing a record; this is the only place they are defined."
family: track
invocation: model
---

# Waymark resources

This is a library, not an action. It writes nothing and decides nothing. It defines what every record shares, and it is where an action reads the field rules before writing anything.

## What is here

| File | Defines |
|---|---|
| `res/fields.md` | every field, its legal values, and the command that writes it |
| `res/relations.md` | parent, dependency, soft link, and what "ready" means |
| `res/categories.md` | the three record categories and where each body is defined |
| `res/disposition.md` | the three ways a change to a relied-on record is carried |

This skill holds what every record shares. A record's own body lives with the record: `map`, `task`, `grilling` (a testimony), `adr`, `glossary`, `issue`, `handoff`, and `stop-and-wait` (a patrol report).

A record is read twice: a person reads it to follow the work, and a machine reads it to decide whether a rule holds. It is written to be decided on, not to look uniform; the view a person wants is a report, not the record.

## How to read it

Read only the file for the record in front of you. Every rule there is an assertion: a line that ends with the check that decides it.

## What this skill does not do

- Decide when a record is written. Every action owns its own trigger.
- Judge a record. The shape is here; the verdict belongs to the review that reads it.
- Own the project's rules. Those are installed under `.agents/rules/` by `setup`.
