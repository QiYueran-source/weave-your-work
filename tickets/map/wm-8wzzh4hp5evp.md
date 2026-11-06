---
schema: 1
id: wm-8wzzh4hp5evp
title: 入口类技能：ask-me 问答与路由
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T09:24:07Z
updated_at: 2026-11-06T09:24:07Z
custom_fields:
  phase: exploring
---
## Destination

完成 ask-me 技能的设计：用户问"现在该怎么做、该用哪个技能、完整流程是什么"时，ask-me 给出路由和下一步指引；需要深入时走问答协议，把决策和术语落到 waymark。借鉴 matt 的 ask-matt（路由）、grilling（问答协议）、domain-modeling（术语表）、add（决策记录）。

## Notes

- 类别：入口类。回答"现在该做什么"。
- 触发：用户触发。
- 交付位置：weave-your-work/ask-me/（用户已建目录）。
- 借鉴来源：.inbox/skills 的 ask-matt、grilling、domain-modeling、to-spec（决策记录相关）。

## Decisions so far

- ask-me 是一个整体技能，不属于辅助类，单独一个地图（用户确认）。
- 问答协议借鉴 matt 的 add（决策记录）和术语表（domain-modeling）（用户确认）。

## Not yet specified

- 路由规则：什么请求进哪个技能，如何转述（ask-matt 的做法）。
- 问答协议细节：设计树取前沿、一轮问完、每题附推荐答案、事实自己查决策留给人。
- 术语表（GLOSSARY）和决策记录如何落到 waymark 项目。
- 完整工作流程指引的形式：文档、对话式还是命令。
- ask-me 与推进类、沟通类技能的关系（路由到 map/task/issue）。

## Out of scope

- 软件开发专属流程（TDD、代码评审等）。
- issue 分诊状态机（归沟通类，本期不做）。
