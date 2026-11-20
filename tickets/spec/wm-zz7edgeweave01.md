---
schema: 1
id: wm-zz7edgeweave01
title: Build the initial Weave edge-agent prototype
author: frank
category: spec
status: open
owner: frank
creator: frank
created_at: 2026-11-20T03:22:00Z
updated_at: 2026-11-20T03:22:00Z
---

## Problem Statement

The repository contains interactive `weave-your-work` skills, but no separate prototype for running those work methods as a persistent, composable fast-agent workflow in an edge-like environment.

## Solution

Create a new `work-weaver/` project at the repository root. The first prototype will define a small fast-agent workflow with fixed skill-based agent instructions, structured proposal output, a bounded proposer-and-grill loop, and a placeholder human-request state. It will use an in-memory store and a minimal bread-oven input example.

## Decisions so far

- `work-weaver/` is a separate prototype project; existing `weave-your-work/` files are out of scope.
- The first slice focuses on `observe`, `propose`, and `grill` roles and their workflow boundary.
- The first slice does not implement persistent Spec/Ticket storage, HTTP, MCP, real device control, Docker simulation, or autonomous code changes.
- The first slice uses a bread-oven-shaped example only to validate the workflow contract.

## Acceptance

A reader can enter `work-weaver/`, understand the intended project boundary, install the declared Python dependencies, and find the initial workflow and test layout. No existing file outside the new project and its own tracker records is changed.

## Out of Scope

- Changes to `weave-your-work/`.
- A production runtime or deployed edge device.
- Real model credentials or live hardware.
- HTTP and MCP adapters.
- Full self-evolution, memory eviction, and device capability policy.
