---
schema: 1
id: wm-rp9b0hzjhyp4
title: Project root resolver task split
category: testimony
status: open
owner: frank
creator: frank
created_at: 2026-11-10T10:51:08Z
updated_at: 2026-11-10T10:51:08Z
---
## Discussion

The owner confirmed that the root contract includes a Node module, a command-line entry, and automated tests; downstream maps integrate the result.

## Split plan

One delivery task: provide and test the project-root resolver together with the installation rule that states its contract. The downstream bundle-copy mechanism and integration remain for their owning maps.
