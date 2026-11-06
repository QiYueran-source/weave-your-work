---
schema: 1
id: wm-wjwa9081hse1
title: work-weave 通用团队协作技能集
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T09:12:59Z
updated_at: 2026-11-06T09:25:06Z
custom_fields:
  phase: exploring
---
## Destination

在 weave-your-work 下形成一个可供团队安装的通用协作技能集，帮团队用 waymark 作为唯一 tracker，把目标、任务、认领、验收这一条协作链路走通，属人清晰（一张票一个 owner），适合任何领域，不限定软件开发。

## Notes

- 类别划分（已定）：入口类（ask-me）、环境类（setup）、推进类（map、task）、沟通类（issue）。每类可容纳多个技能，本期各类先开一个或多个地图。
- 每类一个地图，见下方"子地图"段。设计决策分别记在各子地图里，本图只做索引，不重复正文。
- 参考来源：matt 技能集（.inbox/skills）、参考技能（.inbox/skills-ref）、设计资料（.inbox/work-methods/）。
- 关键结论（general-methods.md）：把不确定显式命名、把判断从执行者手里挪走、把结论外化成制品；原语是问答协议；三个缺口要补（不可逆性、决策权落点、问不清的事要探针）。

## 子地图

- [入口类技能：ask-me 问答与路由](tickets/map/wm-8wzzh4hp5evp.md)
- [环境类技能：setup 初始化与检查](tickets/map/wm-a08fwanmy5q6.md)
- [推进类技能：map 与 task 协作推进](tickets/map/wm-qhd3twqjzhma.md)
- [沟通类技能：issue 远程交流](tickets/map/wm-25b3q7mg88c7.md)

## Decisions so far

- 交付形态：weave-your-work 下的技能集合，按类别分地图（用户确认）。
- 类别划分：入口/环境/推进/沟通，每类一个地图（用户确认）。
- 属人模型：一张票一个 owner，owner 负责推进和验收；不设 executor 字段（用户确认）。
- 任务分交付型/探针型，带可逆性标记；细则参考 skills-ref 后补（用户确认）。
- 验收由非执行者按事先约定的可观察信号判，区分已完成/未完成/无法判断；细则后补（用户确认）。
- ask-me 是一个整体技能，含问答协议、决策记录、术语表（用户确认）。

## Not yet specified（跨类别协调问题）

- 技能之间的依赖关系：ask-me 如何路由到推进类、沟通类技能。
- 公共术语表（GLOSSARY）归哪个地图维护、放哪个文件。
- 安装与发布方式：参考 matt 技能的配置机制，做成可选项。
- 验收场景与 eval prompts 的数量与通过判定方式。
- 本地 comment category 是否保留。
- 每类后续可能新增的技能（复盘、交接等），本期不做。

## Out of scope

- 软件开发专属流程（TDD、代码评审等）。
- 完整 issue 分诊状态机（如要做，归沟通类后续设计）。
- 外部系统连接器、自动同步。
