---
schema: 1
id: wm-bhxcbv4j8fyd
title: 'Entry skill: what ask-me is and how it routes'
category: testimony
status: open
owner: frank
creator: frank
created_at: 2026-11-10T07:11:39Z
updated_at: 2026-11-10T07:35:20Z
soft_links:
  - wm-8wzzh4hp5evp
---
## Question tree

- [x] What is ask-me shaped after?
- [x] Who opens it, and what do they get back?
- [x] Does ask-me invoke a skill, or only name the one to open?
- [x] How does ask-me relate to the four family entries?
- [x] Is the guidance a document, a conversation, or a command?
- [x] What is the main route through the set?
- [x] Which branch points sit beside it?
- [x] Does ask-me read the project's tickets while routing?
- [ ] Which file holds the route, and what does `usage.md` hold?

### Round 1

- Q: ask-me 是什么形状？纯路由表、全流程地图、还是不做？
  A: 参考 ask-matt。
- Q: 人打开 ask-me 的时候，手上通常是什么？
  A: 不知道当前要用哪个技能的时候用。

Settled: ask-me follows `ask-matt`'s shape — one main flow with the branch points beside it, not a flat table. The trigger is not knowing which skill fits now, and the answer is the next skill to open.

### Round 2

- Q: ask-me 和 grill 谁提问？
  A: ask-me 只负责根据情况路由到对应技能吧。
- Q: map、task、setup、issue 已经是各自家族的入口，ask-me 再做一个总入口，边界怎么划？
  A: ask-me 只负责索引其他技能，导航到入口，不直接调用其他技能。
- Q: "下一步该开哪个技能"这个指引写成什么？
  A: 一份 SKILL.md，主线加岔路，跟 ask-matt 一样。

Settled: ask-me routes and stops there. It indexes the other skills, names the entry to open, and invokes nothing itself. It is one `SKILL.md` with a main flow and the branch points beside it.

### Round 3

- Q: 主线按什么顺序串？
  A: grill 任何阶段都可能使用，map → task 倒是可以。
- Q: 主线旁边写哪些岔路？
  A: setup / fog-explore / split / update / handoff。
- Q: 路由时要不要先读项目票据？
  A: 不读，只看人说的话。

Settled: the main route is `map` then `task`; `grill` is not a step on it but reachable from every step. The branch points are `setup`, `fog-explore`, `split`, `update`, and `handoff`. Routing reads what the person said, never the ticket store.
