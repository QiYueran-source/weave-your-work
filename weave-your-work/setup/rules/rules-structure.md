# Keep Records and Actions Apart

A skill does one job. A record is defined once, and the action that writes it is somewhere else. When a skill holds both, the record's shape changes every time the action changes, and two actions that need the same record each grow a copy.

## What to do

1. **A record lives under its own skill's `res/`.** A map under `map/res/`, a task under `task/res/`, a testimony under `grill/res/`; what every record shares lives under `waymark/res/`. A resource states what the record must contain and the assertions that decide it. It never holds a step procedure.
2. **An action lives in a `SKILL.md`.** It says when it runs, its steps, what it writes, and what it hands off. It does not describe what a record contains: it names the record's skill.
3. **An action names another skill only as a call.** "Read the `task` skill" or "hand the layer to `split`" is a call. A path into another skill's folder is not: it breaks the moment that skill moves a file.
4. **Installable parts live under `setup/`.** Rules, tools, and install guides belong to setup. A skill that needs something installed says so; it does not carry a `bundle/`.
5. **Every rule is an assertion with a check.** A rule names what decides it: the tracker refuses it, `scripts/check-records.mjs` reports it, or a review finds it. A rule with no check is advice, and advice stays out of `res/`.

## Before adding a skill or a rule

- Which record kind does this belong to? If it is a fact about a record, it goes in that record's `res/`. If it is a way to change one, it is an action.
- Does the fact already exist? Search `res/` for it. A second copy is the failure this rule exists to prevent.
- Would this rule be checked? Name the check. If there is none, either write the check or drop the rule.

## Why

The first version of this set wrote each record's shape into the skills that acted on it, then pointed those skills at one another for the parts they shared. The pointers became loops, the shapes drifted into several homes, and a reader could not tell which file was current. Separating the two is what makes one record have one definition and one action have one job.
