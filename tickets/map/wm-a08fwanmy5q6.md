---
schema: 1
id: wm-a08fwanmy5q6
title: 环境类技能：setup 初始化与检查
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T09:24:08Z
updated_at: 2026-11-06T09:24:08Z
custom_fields:
  phase: exploring
---
## Destination

完成 setup 技能的设计：检查依赖配置、初始化 waymark 项目（config、categories、fields、user.toml）、初始化 rules（AGENTS.md、GLOSSARY.md 等），让团队从零开始能跑通。借鉴 setup-matt-pocock-skills 和 wizard。

## Notes

- 类别：环境类。回答"项目准备好了吗、怎么初始化"。
- 触发：用户触发，项目开始时用一次，之后按需。
- 交付位置：weave-your-work/setup/（用户已建目录）。
- 借鉴来源：.inbox/skills 的 setup-matt-pocock-skills（探查先行、只问真正分叉的选择、答案落固定路径）、wizard（可重入、每步清屏只留当前一步）。

## Decisions so far

- setup 的范围：检查依赖配置、初始化项目、初始化 rules（用户确认）。

## Not yet specified

- 检查哪些依赖（waymark binary、git、其他工具链）。
- 初始化哪些配置（config.toml 的 categories/fields、user.toml 的 operator/timezone）。
- rules 文件指什么（AGENTS.md、GLOSSARY.md、CLAUDE.md）。
- 运行方式：一次性命令还是可重入脚本。
- 初始化后的项目如何进入推进类流程。

## Out of scope

- 软件开发专属配置（构建工具、CI 等）。
- 外部系统连接器。
