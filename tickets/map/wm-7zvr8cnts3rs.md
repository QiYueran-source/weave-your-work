---
schema: 1
id: wm-7zvr8cnts3rs
title: 'Grill skill: discuss and clarify'
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T16:48:15Z
updated_at: 2026-11-06T16:48:15Z
parent: wm-qhd3twqjzhma
---
## Target

Design the grill skill: discuss an idea, question or proposal with the owner until it is clear, and land every outcome as it happens (map decisions, a new task, glossary terms, an ADR). Modeled on matt's grill-with-docs.

Why: new ideas and open questions do not arrive as fog; without a discussion skill they either stall or get lost.

## Acceptance direction

The SKILL.md exists under `weave-your-work/grill/`; a sample discussion produces at least one landed decision and one landed term.

## Children

(none yet)

## Decisions so far

- grill is a peer skill under Execution, level with map/task/glossary (user confirmed).
- ask-me only routes; grill owns the discussion (user confirmed).
- grill is both a low-level conversation ability called by explore/split/review and a standalone entry (user confirmed).
- grill lands outcomes while discussing: map decisions, task creation, glossary terms, and ADRs (user confirmed, following matt's grill-with-docs).

## Not yet specified

- The discussion protocol: what to ask and in what order.
- Where each outcome lands exactly (map body, new task, glossary, ADR).
- Its interface with explore: grill produces fog, explore resolves it.

## Out of scope

- explore's fog resolution.
- split's child creation.
