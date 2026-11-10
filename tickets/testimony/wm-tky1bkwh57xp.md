---
schema: 1
id: wm-tky1bkwh57xp
title: 'Session skills: which to keep and how to shape them'
category: testimony
status: closed
owner: frank
creator: frank
created_at: 2026-11-10T06:52:01Z
updated_at: 2026-11-10T06:52:02Z
closed_at: 2026-11-10T06:52:02Z
soft_links:
  - wm-s4tvr121g3tv
---
## Question tree

- [x] Which of Matt's session-level skills does this set keep?
- [x] Does `chief-of-staff` earn its place beside `execute-all`?
- [x] Is `wait-what` ported as written, or rewritten?
- [x] Where does the worked pass for each skill live?
- [x] Split plan: how many tasks, and one line each.

## Discussion

### Round 1

- Q: Chief of staff, handoff, and wait-what were the three candidates. Does each go in?
  A: "chief-of-staff 可以留，用来做整个地图的推进。可否根据任务推进？hand-off可以。wait-what也可以加。"

### Round 2

- Q: Chief of staff as Matt writes it is goal-level: it has no notion of a task, keeps its memory in a free wiki, and hands the work to `retro`, `to-spec`, `to-tickets`, and `implement-spec`. Divisions of work would have to be settled before it could run beside `execute-all`.
  A: "我觉得算了，execute-all已经基本具备了这些功能（尤其分配给subagent）。暂时不加入？" Chief of staff was dropped.

### Round 3

- Q: Handoff and wait-what both need aligning before they can be copied: neither carries `argument-hint`, `agents/openai.yaml`, or a user-invoked flag here, the body is written as instruction rather than as the person's utterance, and wait-what's ASD-STE100 standard is an English word list that cannot govern a reply in Chinese.
  A: "wait-what咱们简化吧，就写成"停下，看看现状，用表格或者更有逻辑的形式输出现状，要简洁，有逻辑"。" Wait-what is rewritten, not ported.

### Round 4

- Q: As written, that sentence leaves "the current state" undefined, and a reader can take it as a summary of the conversation rather than the state of the tickets. Fix the source to the tickets and fix the table's columns, so two reports can be compared.
  A: "可以。" The source is the tickets, and the columns are fixed.

## Split plan

Two tasks, one per skill, each writing a `SKILL.md` and a `usage.md`:

- Write the handoff skill: compact the session into a document outside the workspace, cite the tickets instead of restating them, and name the skills the next agent loads.
- Write the wait-what skill: stop the work, read the state off the tickets, and report it in one short table with fixed columns.
