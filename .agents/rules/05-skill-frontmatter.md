# Write Skill Front Matter in Valid YAML

Every `SKILL.md` opens with YAML front matter between two `---` lines. `npx skills add` parses that block with a YAML 1.2 parser; when the parse fails it skips the skill with `YAML parse error`, and the skill is never listed or installed.

## What to do

1. Quote the description. Double quotes on one line is the default shape:

   ```yaml
   ---
   name: task-design
   description: "Write a task ticket for a target tree leaf: choose delivery or probe, state the action and its acceptance signal, and handle human steps."
   ---
   ```

2. For a description too long for one line, use a block scalar. `>-` folds the lines into one and drops the trailing newline:

   ```yaml
   description: >-
     Write a task ticket for a target tree leaf: choose delivery or probe.
     State the action and its acceptance signal, and handle human steps.
   ```

3. Escape a `"` inside a double-quoted string as `\"`. Use single quotes instead when the text has double quotes and no apostrophes.

## Why

An unquoted description that contains a colon followed by a space fails:

```yaml
description: Write a task ticket: choose delivery or probe
```

The parser reads the part after the colon as a nested mapping and reports:

```
YAML parse error: Nested mappings are not allowed in compact mappings
```

Wrapping the line does not fix it. The colon is the problem, not the length. Quoting also protects a `#`, which starts a comment, and `{`, `[`, `&`, `*`, which start other YAML syntax.

## Check before installing

Run the install and read its output. The skill must appear; any `Skipped` line means the front matter still fails:

```bash
npx skills add ./weave-your-work/<skill>
```
