# Weave Your Work

[English](README.md)

Weave Your Work 是一组供 AI 智能体使用的技能，帮助团队组织和完成工作。它借鉴了 [Matt Pocock 的软件工程技能集](https://github.com/mattpocock/skills)，将其中的思路用于软件开发之外的各类项目。

项目致力于探索 AI Native 的工作方式：你用自然语言描述目标，与智能体一起工作；智能体使用 waymark 记录目标和任务，用 Git 跟踪改动，通过 GitHub CLI 沟通。决策和验收由人负责，工作记录保留在项目中。

在多人协作中，每个 waymark 工作项都有一名负责人，由负责人推进和验收。团队成员通过 GitHub issue 交换请求和结果，issue 监听器将消息发送给指定接收人。负责人制度是协作约定，不是访问权限控制。

## 安装

安装 Node.js 22.20 或更新版本及 npm，然后在任意目录运行一次：

```sh
npx skills add qiyueran-source/weave-your-work -g
```

按照提示选择要安装的技能和智能体环境。要按下文的步骤开始使用，建议选中整套技能；至少选中 `setup`、`ask-me`，以及记录参考 `waymark`、`map`、`task`。命令从仓库的默认分支安装，不依赖 npm 包发布。去掉 `-g` 则改为安装到当前项目。

## 开始使用

让智能体为你的项目运行 `setup` 技能。它会引导你安装和配置 Git、waymark、Node.js 和 GitHub CLI，初始化项目或加入已有项目，并安装所需的规则和工具。GitHub 登录等步骤需要由你完成。

完成设置后，可以让智能体使用 `ask-me`，找到当前工作的起点。整套技能分成两层：记录格式只在各记录技能的 `res/` 下定义一次，动作的顺序由 `mainline` 技能写下。每条规则都是断言，并写明由哪项检查判定；索引在 [ASSERTIONS.md](weave-your-work/ASSERTIONS.md)。

## 技能集里有什么

七个动作按顺序把一个项目从"目标已定"送到关闭，这个顺序写在 `mainline` 技能里：`open-map` 写一张图，`split` 把一层切成子图或任务，`open-map` 和 `open-task` 写下它切出来的记录，`advance-task` 把一项任务做到写出结果，`task-review` 评判它，`map-review` 评判整张图。挡路还没清的雾先交给 `fog-explore`。除 `map-review` 外都由模型调用，所以这条线不用人重启；关图仍然由人决定。

其余动作改一条记录，但不往线上加步：`update` 改动别人已经依赖的记录，`grill` 和人把一件事讨论清楚，`adr` 和 `glossary` 记下某一步定下来的东西，`issue` 和 `handoff` 把工作交给另一个持有者或下一个 session，`resplit` 重新切分本该是子图却被切成任务的那一层，`whole-review` 在人要求时把一张图的子记录合起来读。还有三个只看不改：`wait-what` 说工作现在到哪了，`stop-and-wait` 报告项目哪里自相矛盾，`salvage-and-restart` 根据那份报告把说不清现状的树重启。`feedback-me-please` 把技能的问题报给上游，`use-weave-your-work-examples` 走完两个完整例子，`setup` 负责把项目配置起来。

## 现在的评审方式

一项任务或一张图按两个轴评审，每个轴各自给出判定：**目标**轴看验收信号或验收方向是否达成，**规范**轴看工作是否按规则完成。两个轴都通过，记录才能关闭，并且两个判定都保留在记录里。`whole-review` 是唯一没人自动调用的检查：人觉得一张图的子记录值得合起来读时才跑，互相矛盾的两条会被报出来，而不是各自通过；有没有这一段，`map-review` 都照常判图。

记录里的决策、评审和不做的事不会原地改写：新事实在原条目旁边补一条，不再成立的条目划掉，写上 `Superseded on <date>`，替代内容写在下面。

## 许可证

[Apache License 2.0](LICENSE)。
