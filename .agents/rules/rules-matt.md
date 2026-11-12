# Find the Answer in Matt's Methods, Not in a Guess

When a development question about this repository has no settled answer, the first place to look is [`mattpocock/skills`](https://github.com/mattpocock/skills). A copy is in `.agents/matt-skills/`; read it rather than recalling it.

This rule covers how this repository is developed: how its skills, rules, and documents are written. It is not one of the rules the set installs into a project, and it does not govern what a skill's content should be.

## What to do

1. When a question about how this repository should be shaped has no recorded answer, search `.agents/matt-skills/` for the case that answers it. Look at how that skill writes the same thing: its file layout, its steps, what it puts behind a pointer, and what it leaves out.
2. Write what you found in `docs/matt-methods/`, one file per skill of his that answered a question. Name the file after his skill (`grilling.md`, `writing-for-agents.md`), and record three things: the question, the passage or file that answered it, and what this repository should do, or decided not to do, because of it.
3. Cite the answer where the change is made: the commit message or the record names the `docs/matt-methods/` file, so a reader asking "why this shape" has one place to open.
4. When his set has no answer, say so in the same file and take the smallest choice that keeps this repository's own rules. A guess is not an answer, and an unanswered question goes to the person.

## Why

The first review of this repository's skill set found four questions with no recorded answer, and every one of them was answered from memory of his set rather than from it. A reader of the source would have caught one of those answers in a single search. The source is on disk, and a guess is not worth its cost.
