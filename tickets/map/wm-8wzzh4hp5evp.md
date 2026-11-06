---
schema: 1
id: wm-8wzzh4hp5evp
title: 'Entry skills: ask-me routing and questioning'
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T09:24:07Z
updated_at: 2026-11-06T12:01:35Z
parent: wm-wjwa9081hse1
custom_fields:
  phase: exploring
---
## Destination

Design the ask-me skill: when the user asks "what should I do now, which skill fits, what is the whole workflow", ask-me gives routing and next-step guidance; for deeper work it runs the question protocol and lands decisions and glossary terms in waymark. Borrows from matt's ask-matt (routing), grilling (question protocol), domain-modeling (glossary), and add (decision records).

## Notes

- Category: entry. Answers "what should I do now".
- Trigger: user-invoked.
- Delivery location: weave-your-work/ask-me/ (directory already created by the user).
- Borrowed from: .inbox/skills ask-matt, grilling, domain-modeling, to-spec (decision records).

## Decisions so far

- ask-me is one whole skill, not part of the environment category, with its own map (user confirmed).
- The question protocol borrows matt's add (decision records) and glossary (domain-modeling) (user confirmed).

## Not yet specified

- Routing rules: which request goes to which skill, and how to refer (ask-matt's approach).
- Question protocol details: design tree frontier, one round at a time, recommended answer per question, facts researched by the agent and decisions left to the human.
- How the glossary and decision records land in the waymark project.
- Form of the whole-workflow guidance: document, conversation, or command.
- ask-me's relation to execution and communication skills (routing to map/task/issue).

## Out of scope

- Software-specific workflows (TDD, code review, and so on).
- Issue triage state machine (communication category, not this round).
