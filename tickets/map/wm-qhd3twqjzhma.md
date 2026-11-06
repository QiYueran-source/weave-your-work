---
schema: 1
id: wm-qhd3twqjzhma
title: 推进类技能：map 与 task 协作推进
category: map
status: open
owner: frank
creator: frank
created_at: 2026-11-06T09:24:09Z
updated_at: 2026-11-06T09:45:34Z
custom_fields:
  phase: exploring
---
## Destination

完成 map 和 task 技能的设计：团队用 waymark 作为唯一 tracker，从目标地图到任务推进到验收的完整协作链路，属人清晰（一张票一个 owner，owner 负责推进），适合任何领域。这是核心类别。

## Notes

- 类别：推进类。回答"工作在推进吗、谁负责、卡在哪"。
- 交付位置：weave-your-work/ 下 map/ 与 task/ 两个技能目录（待建）。
- 术语表：GLOSSARY.md（已建，goal/map/task/目标树/依赖边/细化/推进/认领/交付型/探针型/可逆性/验收信号/前沿 已定义）。
- 设计资料：.inbox/work-methods/domain-and-conventions.md、general-methods.md、reference-skills-comparison.md。
- 参考结论：把不确定显式命名、把判断从执行者手里挪走、把结论外化成制品；原语是问答协议；三个缺口要补（不可逆性、决策权落点、问不清的事要探针）。

## Decisions so far

- 语义模型：目标树逐层细化，一个节点是一个目标，父子关系是细化不是先后；先后用依赖边表达，不用节点链。树管结构，边管顺序。叶子（task）是细化链条的末端：从根（goal）一路细化到可执行，叶子之间是平行的细化分支，不是推进顺序；先后只由依赖边表达（用户确认，已记 GLOSSARY）。
- map 的功能目标：map 回答"我想要什么"，声明目标、为什么值得、边界、验收方向，并挂一个或多个 task。goal 回答"我们到底要达成什么"，是无 parent 的根 map。task 回答"我要做什么"，是最细一层，同时声明动作和它的可验证结果（用户确认）。
- 层级模型：goal（根 map）→ map（方向）→ task（叶子），三层封顶；map 不嵌套 map，方向太大就提升为独立 goal；小目标允许 goal 直接挂 task（用户确认）。
- 属人模型：一张票只有一个 owner，owner 负责推进和验收；不设 executor 字段（用户确认）。
- 任务类型：分交付型（失败是事故）和探针型（失败是正常结果）两种，带可逆性标记；具体规则参考 skills-ref 细化（用户确认）。
- 验收：结果由非执行者按事先约定的可观察信号检查，区分已完成/未完成/无法判断；细节待细化（用户确认方向）。

## Not yet specified

- 阶段划分：exploring/planned/delivering/reviewing 是否沿用。
- 谁能推进的边界：owner 推进哪些操作、谁可以读、agent 代理规则。
- 认领方式：无 executor 字段，认领是否等于 start（open 到 in_progress）。
- 并发与移交：非 owner 如何参与、换人规则。
- task_kind 字段与可逆性标记的具体规则。
- 验收环节的具体规则（独立来源、预演、小批量、第三方复核如何落地）。
- Git 协作流程：分支、同步、冲突处理、认领可见时机。
- 本地 comment category 是否保留。
- 交付型/探针型的完整规则（参考 skills-ref 细化）。

## Out of scope

- 软件开发专属流程（TDD、代码评审等）。
- GitHub/Gitee issue 分诊（归沟通类）。
