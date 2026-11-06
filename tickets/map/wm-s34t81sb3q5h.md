---
schema: 1
id: wm-s34t81sb3q5h
title: Work-weave 通用团队协作技能
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-05T06:53:41Z
updated_at: 2026-11-05T15:12:34Z
custom_fields:
  phase: exploring
archived_at: 2026-11-06T09:12:32Z
archive_reason: 用户决定退役并重新设计：旧地图正文结构与 wayfinder 地图格式不一致，由新设计地图取代
---
## Objective
设计一个面向通用团队协作的 work-weave 技能集合。它不限定软件开发场景，帮助团队定义目标、拆解工作，并判断哪些工作可以交给 agent、哪些决定需要人确认。

## Investment
由 map owner 逐步审核设计。先完成 map，再拆分 Waymark task，逐项设计与实现，最后评审技能草案和代表性场景测试。技能配置方式参考 `.inbox/skills` 中 Matt 技能的配置，具体配置可以按使用者环境选择。

## Outcome
在项目根目录形成一个可供他人安装的 work-weave 项目，包含若干子技能。第一阶段聚焦通用团队协作，软件开发专属流程与 GitHub/Gitee issue triage 留待后续设计。目录结构、安装功能和发布方式由后续 task 设计，不在当前 map 中预设。

## Acceptance
- 明确 map、task、owner、creator、迷雾和阶段的含义及操作边界。
- 明确人和 agent 的责任边界，以及 owner 推进工作项的规则。
- 明确团队在个人分支上修改 Waymark 文件、同步默认分支和合并回工作分支的协作流程。
- 子技能草案覆盖已确认的协作规则，引用必要的 Waymark 操作能力。
- 代表性场景检查目标拆解、owner 权限、迷雾处理和 Git 同步行为，不越过需要人确认的决定。
- 具体目录、安装和发布方案由 task 提出并经 map owner 确认。

## Fog
- 子技能的职责边界、数量、名称和触发方式。
- 技能配置参考 Matt 技能中的哪些机制，哪些应当做成可选项。
- map 和 task 的字段模板，以及任务完成标准。
- 认领何时对全队可见：快速合入，还是等常规合并流程。
- 任务是否分成"交付型"和"探针型"两种，是否需要显式的"不可逆点"标记。
- 本地 `comment` category 是否保留。
- 验收场景和 eval prompts 的数量与通过判定方式。

## 设计资料
- `.inbox/work-methods/domain-and-conventions.md`：领域模型与协作约定草案，覆盖前三条验收。
- `.inbox/work-methods/general-methods.md`：39 个软件技能的可迁移机理提取，作为规则出处。
