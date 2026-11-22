![Weave Your Work：深色背景上的蓝色编织立方体标志](assets/weave-your-work-banner-1280x400.jpg)

# Weave Your Work

[English](README.md)

Weave Your Work 是一组供 AI 智能体使用的技能，帮团队把工作推进到底：先把要定的事讨论清楚，写成 spec，切成票，做出来，再读结果。它是从 [Matt Pocock 的软件工程技能集](https://github.com/mattpocock/skills) 改编的；他那套是给代码写的，这一套面向各类办公室工作，所以评审读的是记录而不是 diff，票也可能是由人来做的。

记录留在仓库里：waymark 管 spec 和票，Git 管改动，GitHub CLI 在负责人之间传消息。决策和验收由人负责，智能体干活，并把发现的情况写下来。

多人协作时，每条记录只有一个负责人，由他推进并判定是否通过。团队成员用 GitHub issue 发送请求和结果，issue 监听器把收到的消息排进下一次会话。负责人制度是协作约定，不是访问权限控制。

## 安装

每台机器跑一次，然后在项目里让智能体运行 `setup`：

```sh
npx skills add qiyueran-source/weave-your-work -g
```

命令、依赖和装完怎么检查，都写在 [INSTALL.md](INSTALL.md) 里。

## 主线

这套技能承诺的主线有四步，每一步是一个技能，下一步读上一步写下的东西。

| 步骤 | 技能 | 做什么 |
|---|---|---|
| 1. 写 spec | `to-spec` | 把对话整理成 spec 并发到 tracker：问题、方案、交付什么、读者怎么判断已交付 |
| 2. 切票 | `to-tickets` | 把 spec 切成整件事，每张票只由一个执行者做，并写明被哪些票阻塞 |
| 3. 做 | `implement`；整个 spec 用 `implement-spec` | `implement` 做一张票，遇到人的票就停；`implement-spec` 按 frontier 分批做，做完整批再一起关 |
| 4. 读结果 | `review` | 两个轴分别判：每张票的结果是否达到它自己的验收，以及这批工作是否回答了 spec 里的问题 |

会产出 spec 的那场讨论发生在第 1 步之前，由 `grilling` 和 `grill-with-docs` 来跑。进主线的入口是 spec；还没定下来的目标，先在对话里定清楚，然后才有 spec。

不知道自己在主线的哪一步时，用 `ask-me`：你描述处境，它说出该用哪个技能、按什么顺序。

由人来做的那张票，做完之后走 `hand-back`：人说清做了什么，结果写进票里，票关闭。

## 技能集里有什么

一共十四个技能。`setup` 负责配置项目；主线是上表那四个；其余的是它们的支撑：

| 技能 | 做什么 |
|---|---|
| `ask-me` | 你描述处境，它说出该用哪个技能、按什么顺序，然后停下 |
| `grilling` | 一轮一轮地追问，直到把方案问清楚；每一轮当场写进 testimony |
| `grill-with-docs` | 跑 `grilling`，然后把定下来的术语交给 `glossary`、通过三道关的决策交给 `adr` |
| `glossary` | 给项目维护一套用词；每人只写自己的源文件，视图从所有源文件生成 |
| `adr` | 记录一条难撤销、脱离上下文会让人意外、并且是真实取舍的结果的决策 |
| `hand-back` | 记录一个人做完的自己的票，关掉它，并说出下一张票 |
| `communicate-with-issue` | 把一个负责人的消息作为 GitHub issue 发出，并在同一个 thread 里回复 |
| `feed-me-back` | 把技能的问题或好评发到技能集的仓库，等你确认文字之后才发 |

## 评审是怎么做的

一张票的结果按两个轴读，各自给判定：是否达到它自己的验收，以及这批工作是否回答了 spec 里说的问题。`review` 什么都不改，只报发现；每条发现都写明是哪张票、谁做的、该谁来改。

结果如果读者没法核对，算一条发现，不算通过。票关了却没有写下结果，也是一条发现。

## 和 Matt 那套不一样的地方

名字相同的技能取自他的文件再改，取自哪个 commit 记在 `weave-your-work/UPSTREAM.md`。不一样的地方和原因：

- **读记录，不读 diff。** 他的 `code-review` 拿 diff 跟一个固定点比。这里的 `review` 读 spec 的票，因为就地改过的文档没有固定点可比。
- **票可能是人做的。** 他的流程假定由智能体独立做完。这里的每张票只有一个执行者，人或智能体，人的票靠 `hand-back` 回来。
- **tracker 在仓库里。** 他那套让你选 issue tracker，把票写到那儿去。这里把 spec 和票作为记录放在 `tickets/` 下，由 waymark 写入，clone 下来就带着。
- **消息就是 issue。** `communicate-with-issue` 用 GitHub issue 取代了人与人之间的一次性交接，请求和答复留在同一个 thread 里。

## 在这个仓库里工作

这个仓库是技能集的源头，不是使用它的项目。

```sh
npm test                      # 工具运行时的测试
node scripts/check-references.mjs .
node scripts/check-records.mjs . --baseline scripts/check-records-baseline.json
```

这些检查也会在每个 pull request 上跑（`.github/workflows/verify.yml`）；CI 会像陌生人一样装一遍技能集，再检查装出来的东西。

## 许可证

[Apache License 2.0](LICENSE)。
