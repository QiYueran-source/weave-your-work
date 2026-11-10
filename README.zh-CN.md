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

按照提示选择要安装的技能和智能体环境。要按下文的步骤开始使用，请选中 `setup` 和 `ask-me`。命令从仓库的默认分支安装，不依赖 npm 包发布。去掉 `-g` 则改为安装到当前项目。

## 开始使用

让智能体为你的项目运行 `setup` 技能。它会引导你安装和配置 Git、waymark、Node.js 和 GitHub CLI，初始化项目或加入已有项目，并安装所需的规则和工具。GitHub 登录等步骤需要由你完成。

完成设置后，可以让智能体使用 `ask-me`，找到当前工作的起点。技能列表及其说明见 [weave-your-work/](weave-your-work/)。

## 许可证

[Apache License 2.0](LICENSE)。
