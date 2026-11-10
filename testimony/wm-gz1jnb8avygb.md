---
schema: 1
id: wm-gz1jnb8avygb
title: Setup skill design discussion
category: testimony
status: open
owner: frank
creator: frank
created_at: 2026-11-09T15:30:29Z
updated_at: 2026-11-10T01:26:34Z
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
  - [x] The checklist's items in five groups; no remote marks two as not applicable. The count settled at seventeen.
  - [x] The rule set is `rules-git` and `rules-checklist`; no language rule.
  - [x] `.agents/rules/rules-bundles.md` is amended for usage documents.
  - [x] The checks live only in `rules-checklist.md`, starred for the daily run.
  - [x] The tool floors after the dependency audit: Node 22.20 for the install, 20.18 for the bundle tools.
  - [x] The seventeen checks, each with a command and a passing result.
  - [x] `.gitignore` is written in the SOP, not checked only.
- [ ] The daily startup check
  - [x] It is a rule, not a skill.
  - [x] It runs at session start and when a feature turns out to be unavailable.
  - [x] The checks are the starred ones; the unavailable-feature run covers all of them.
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
  A: "从头初始化文档叫 start-a-project（相应的已有项目的叫join-a-project）". The flow documents are named `start-a-project` and `join-a-project`.
- Q22 What first-time initialization assumes and does.
  A: "可以，假定技能已经装好，其他的都没有". The skill set is installed; nothing else exists.
- Q23 The rule set.
  A: "多几个，包括rules-git，rules-checklist等". More than one rule file; `rules-git` and `rules-checklist` are named.
- Q24 The checklist items.
  A: "可以". The items in five groups are confirmed; the exact count settled later at seventeen.

### Round 4

- Q25 Whether `usage.md` stays.
  A: "没有tools就不用usage". No `usage.md`; `SKILL.md` points at the two flow documents.
- Q26 The rule set.
  A: "语言不要，按项目来". No language rule; the project's own convention applies. The set is `rules-git` and `rules-checklist`.
- Q27 What the daily rule checks and when.
  A: "如果某个功能不可用时就整体查一下". Besides the session-start run, a feature that turns out to be unavailable triggers the whole check.
- Q28 The usage document convention.
  A: "那改现在的bundle规则。你看task的bundle就没有usage". Amend `.agents/rules/rules-bundles.md`.
- Q29 Where the checks live.
  A: "对". All the checks in `rules-checklist.md`, starred for the daily run.

### Round 5: the gitignore and the checklist

- Q30 Where `.gitignore` is created.
  A: "可以". The person accepted the proposal: in `start-a-project.md`, before the bundle setups, not in the checklist.
- Q31 Whether `curl` becomes a check.
  A: "curl加". Seventeen checks.
- Q32 Whether the checks are written for a new project or for this repository.
  A: "B，新项目". A new project, where the five skill directories and all bundle rules are present.
- Q33 How the rules check names its targets.
  A: "检查skills中的bundle是否都注册完了，不用详细的说，要检查哪些，不然到时候加减bundle后面也要改setup". Discovery, not a list: walk `.agents/skills/*/bundle/rules/` and compare each against `.agents/rules/`.
- Q34 What a 404 on the webhook read means.
  A: "如果404，看看自己是不是管理员后再决定，不作为必然失败". Read `permissions.admin` first; only an admin's 404 is a failure.
- Q35 Whether the issue bundle's unguarded append gets its own task.
  A: "不用". Report it, do not track it.

### Dependency audit (agent, 2026-11-10)

The person asked whether the dependency set is sufficient and whether cargo or Python is needed. Facts established by running the commands on this machine, all against waymark 0.1.2 and `skills` 1.7.6.

- **Python: not needed.** No file under `weave-your-work/` mentions Python and there is no `.py` there. Python appears only in two installed third-party skills, `talk-like-a-human/scripts/check_terms.py` and `skill-creator/scripts/*.py`. `__pycache__/` in the root `.gitignore` is a leftover, not a dependency.
- **cargo: not needed for the four supported platforms.** Waymark publishes prebuilt archives for linux-x86_64, macos-aarch64, macos-x86_64, and windows-x86_64, each with a `.sha256`; a prebuilt needs no Rust toolchain. `cargo install waymark-cli` is an alternative, not a requirement.
- **cargo is the only path on linux-aarch64.** The v0.1.2 release has no `linux-aarch64` archive; on that platform the checklist cannot pass by download, and the SOP has no documented fallback.
- **Node floor is 22.20, not 20.18.** The `skills` package that installs the set declares `engines: { node: ">=22.20.0" }`. The bundle tools accept 20.18 (`smee-client` declares `^20.18 || >=22`, `undici` `>=20.18.1`, the glossary MCP SDK `>=18`), but the install step that precedes setup needs 22.20.
- **`jq` is not required.** `gh api --jq` works with `jq` removed from `PATH`; `gh` carries its own filter.
- **The protection check must read `.protected`, not `/protection`.** `gh api repos/<owner>/<repo>/branches/<default>` returns `protected: true` for a non-admin member and exits 0; `gh api repos/<owner>/<repo>/branches/<default>/protection` returns 404 for the same account.
- **`waymark init` takes one `--category`.** A second `--category` is a usage error, so the SOP adds the other two with `waymark config add category <key> <path>`.
- **Re-running `waymark init` without `--force` is safe.** It reuses the existing configuration and exits 0. With `--force` it rewrites the file: storage root changed and all six custom fields disappeared, so the "never `--force`" decision is load-bearing.
- **`config add` on an existing key exits 3.** Both `config add field` and `config add category` fail with `already declared` / `already exists`, so the SOP checks `waymark config show` before adding, or treats exit 3 as already done.
- **A fresh init writes generation 1.8, not this repository's 1.9.** The generation is waymark's to write; the checklist must not pin it.
- **The install source must be the subdirectory.** `add QiYueran-source/weave-your-work --list` finds 39 skills, including unrelated ones outside `weave-your-work/`; `add QiYueran-source/weave-your-work/weave-your-work --list` finds the 15 that belong to the set.
- **The default install writes four copies.** Without `-a`, the CLI installs to `.claude/skills`, `.agents/skills`, `.kiro/skills`, and `.trae/skills`. `-a codex` writes only `.agents/skills`, which is the directory the checklist reads.
- **The listener step is Linux-only as written.** `issue/bundle/setup.md` uses `systemctl --user` and `loginctl`; there is no macOS or Windows equivalent in the bundle, so item 14 cannot pass there as documented.
