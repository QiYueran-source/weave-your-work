---
schema: 1
id: wm-gz1jnb8avygb
title: Setup skill design discussion
category: testimony
status: open
owner: frank
creator: frank
created_at: 2026-11-09T15:30:29Z
updated_at: 2026-11-10T00:44:24Z
---
## Question tree

- [x] How does setup split into flows?
  - [x] Three flows: first-time initialization, joining a clone, the daily startup check.
  - [x] Designed one at a time, starting with first-time initialization.
  - [x] The daily check is a rule; setup covers the two initialization flows.
- [ ] First-time initialization
  - [x] Assumes the skill set is installed; nothing else exists.
  - [x] May run `git init`; creates no remote; does not commit.
  - [x] The flow document is called `start-a-project`; no `usage.md`.
  - [x] The checklist's fifteen items in five groups; no remote marks two as not applicable.
  - [x] The rule set is `rules-git` and `rules-checklist`; no language rule.
  - [ ] How the missing `usage.md` squares with the bundle convention.
  - [ ] Where the fifteen checks live.
- [ ] The daily startup check
  - [x] It is a rule, not a skill.
  - [x] It runs at session start and when a feature turns out to be unavailable.
  - [ ] What it checks on each run, and how it avoids drifting from the checklist.
- [ ] Joining a clone
  - [x] Its document is called `join-a-project`.
  - [ ] Its steps and conflicts; deferred until initialization is settled.

## Discussion

### Round 1

- Q1 Form: manual, bundle, no script.
  A: "说明书 + 部分初始化规则（也放bundle），不需要脚本". Setup keeps a bundle for part of the initialization rules.
- Q2 Invocation: user-invoked?
  A: "另外一个对话中确定不设置这个选项". Read as not writing `disable-model-invocation`.
- Q3 Who installs the skills: setup or the person?
  A: "不用，setup不是负责装技能的，而是装依赖，配auth的，如gh，node，waymark这些". Setup installs dependencies and configures auth.
- Q4 The list: all bundles, or optional ones?
  A: "都必须装，不设置可选，只列出来哪些skill有bundle需要额外安装，不用说明具体怎么装". All four bundles, no optional subset; setup only names them.
- Q5 Which dependencies and what happens when one is missing?
  A: "搞个checklist". The dependency step is a checklist.
- Q6 Waymark initialization values?
  A: "可以". Fixed storage root, categories, fields; operator asked; never `--force`.
- Q7 AGENTS.md prompt and placement?
  A: "对". The proposed wording at the top, three-state handling.
- Q8 Re-run, conflict report, commit?
  A: "这是啥". Not understood; re-asked in round 2.
- Q9 Where does setup stop?
  A: "checklist过了就结束呗". Ends when the checklist passes.
- Added by the person: "应该分为 init 项目，和已经有项目可以clone，这俩的方式不一样。" Two flows, a new project and a clone, with different steps.

### Round 2

- Q10 Confirm model-invocable and the trigger.
  A: "可以". Model-invocable; the description names the unconfigured states.
- Q11 What the bundle carries.
  A: "setup AGENTS.md 增加提示 这个步骤应该放在一个类似SOP的文档。可以放setup的bundle rules很多，比如github仓库默认分支需要保护，需要在自己的git分支上工作这些。" The AGENTS.md step belongs in an SOP document; the bundle can carry many rules, starting with branch protection and working on your own branch.
- Q12/Q13 How the checklist is scoped.
  A: "要搞一个checklist，如gh是否配置，git是否配置，是否用远程仓库，是否配置本地listener，术语mcp是否配置，很多东西吧" and "同12". The checklist covers configuration state across the whole setup.
- Q14 Re-run, conflicts, commit.
  A: no answer.

### Round 3

- Q15-Q19 were put aside by the person before they were answered: "所谓sop就是初始化的全流程。我建议我们还是分一下首次初始化，clone已有的项目 和 日常启动检查 3个类型，分开讨论。而且首次初始化的工作确认后，其他的部分也有抓手"
- Effect: the design order is first-time initialization, then joining a clone, then the daily startup check. The SOP is the whole initialization flow, not only one step of it.
- Q20 Is the three flows one skill or more?
  A: "日常检查搞个rules吧，初始化就放两类". The daily check becomes a rule; the skill covers the two initialization flows.
- Q21 Where the SOP document lives.
  A: "从头初始化文档叫 start-a-project（相应的已有项目的叫join-a-project）". The flow documents are named `start-a-project` and `join-a-project`; the usage.md question is still open.
- Q22 What first-time initialization assumes and does.
  A: "可以，假定技能已经装好，其他的都没有". The skill set is installed; nothing else exists.
- Q23 The rule set.
  A: "多几个，包括rules-git，rules-checklist等". More than one rule file; `rules-git` and `rules-checklist` are named.
- Q24 The checklist items.
  A: "可以". The fifteen items in five groups are confirmed.

### Round 4

- Q25 Whether `usage.md` stays.
  A: "没有tools就不用usage". No `usage.md`; `SKILL.md` points at the two flow documents.
- Q26 The rule set.
  A: "语言不要，按项目来". No language rule; the project's own convention applies. The set is `rules-git` and `rules-checklist`.
- Q27 What the daily rule checks and when.
  A: "如果某个功能不可用时就整体查一下". Besides the session-start run, a feature that turns out to be unavailable triggers the whole check.
