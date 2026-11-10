# Explore redesign — why the old design was replaced

Date: 2026-11-07
Operator: frank

## What happened

The explore skill (ticket `wm-8m5cckpf4tc2`) had a full design: five fog classes (judgment, fact, decision, goal, action), two routes (conversation, probe task), landing rules, an interface with ask-me, and worked example. During review, the user decided the positioning was wrong and asked to restart from a clean slate.

## The new positioning

Explore's only responsibility is to clear a map's fog: take the `Not yet specified` items and resolve them until the section is empty. Everything else (classification details, routes, landing mechanics, interface with ask-me) restarts from that.

## What was discarded

- Five fog classes with the action fog exception.
- The two-route split (conversation / probe task) and "fact fog is researched directly".
- The landing rules tied to those classes.
- The interface decision with ask-me.
- The worked example.

The earlier decisions are not lost; they are the raw material for the new design. Any part may be re-adopted if it still fits "clear the fog" as the only job.
