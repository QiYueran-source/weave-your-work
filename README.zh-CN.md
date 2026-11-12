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

完成设置后，可以让智能体使用 `ask-me`，找到当前工作的起点。整套技能分成两层：记录格式只在各记录技能的 `res/` 下定义一次，动作按 [MAINLINE.md](weave-your-work/MAINLINE.md) 的主线组织。每条规则都是断言，并写明由哪项检查判定；索引在 [ASSERTIONS.md](weave-your-work/ASSERTIONS.md)。

## 现在的评审方式

一项任务或一张图按两个轴评审，每个轴各自给出判定：**目标**轴看验收信号或验收方向是否达成，**规范**轴看工作是否按规则完成。两个轴都通过，记录才能关闭，并且两个判定都保留在记录里。图的子记录由 `whole-review` 在评审图之前整组读一遍，互相矛盾的两条会被报出来，而不是各自通过。

记录里的决策、评审和不做的事不会原地改写：新事实在原条目旁边补一条，不再成立的条目划掉，写上 `Superseded on <date>`，替代内容写在下面。

## 许可证

[Apache License 2.0](LICENSE)。
