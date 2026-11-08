---
schema: 1
id: wm-59mkrg330ha8
title: Sharpen the glossary method against domain-modeling
category: task
status: closed
owner: frank
creator: frank
created_at: 2026-11-08T13:38:00Z
updated_at: 2026-11-08T13:38:15Z
closed_at: 2026-11-08T13:38:15Z
parent: wm-rq3exm0m5563
custom_fields:
  needs_human: false
  reversibility: two_way
  task_kind: delivery
---
## Action

Sharpen the glossary method against `domain-modeling`: make move 4 check actual behavior and add the two missing writing rules.

1. In `weave-your-work/glossary/SKILL.md`, replace move 4 with a check of the project's actual behavior: read the ticket, the process, or the output; if the recorded definition and what the project does disagree, say so and fix one. Searching for the word is not enough.
2. In `weave-your-work/glossary/glossary-rules.md`, add: only terms this project coins or narrows; general vocabulary stays out.
3. Add: the glossary is a vocabulary, not a spec. No commands, file paths, or step lists. If a definition needs a command or more than two sentences, it is a spec; move the detail to the ticket or reference.

## Acceptance signal

`SKILL.md`'s move 4 checks the project's actual behavior and names the contradiction path. `glossary-rules.md` carries the only-project and not-a-spec rules. The skill still installs with `npx skills add`; no code or data changes.

## Result

`SKILL.md` move 4 now checks the project's actual behavior and names the contradiction path. `glossary-rules.md` adds the only-project and not-a-spec rules, and its last rule now matches the behavior check. `npx skills add ./glossary --list` parsed the skill; no code or data changed.

## Review

passed

- Goal: the `Acceptance signal` asks for the behavior check and the two rules. Both are in place, and the last rule is aligned with the check.
- Convention: no `Boundaries` line was crossed; the run wrote the two text files and this task's `Result` and `Review` only.

## Boundaries

- No definition cleanup; that is its own task.
- No code or MCP changes.
- No new terms.
