# Work-weave Domain

Work-weave 是面向通用团队协作的技能集，以 waymark 作为唯一 tracker，帮团队把目标、任务、认领、验收这一条链路走通。术语表记录本项目的核心概念；waymark 自身的领域词汇（owner、dependency、parent 等）以 waymark 项目的 GLOSSARY.md 为准，这里只记 work-weave 层新增或改动的概念。

## Language

**goal（根目标）**：
一个目标节点，是整棵目标树的根。回答"我们到底要达成什么"。在 waymark 里是一个无 parent 的 map 节点。
_Avoid_: 目标（当指的是任何一层的目标时）、project、initiative

**map（方向目标）**：
目标树里的中间层或叶子层目标节点，是 goal 的细化。回答"我想要什么"。每个 map 声明目标、为什么值得、边界、验收方向，并挂一个或多个 task。小目标可以跳过 map 层，goal 直接挂 task。
_Avoid_: 阶段、milestone（当暗示固定时间点时）、plan

**task（执行目标）**：
目标树的最细一层，是细化到可以执行的目标：同时声明动作和它的可验证结果。回答"我要做什么"。
_Avoid_: ticket（当含义宽于本项目的工作单元）、action item（当只指动作不含结果）

**目标树（goal tree）**：
goal 到 task 的逐层细化结构。一个节点是一个目标，父子关系是"部分-整体"（细化），不是先后。树管结构，边管顺序。叶子（task）是细化链条的末端：从根一路细化到可执行的目标，叶子之间是平行的细化分支，不是推进顺序；先后只由依赖边表达。
_Avoid_: 甘特图、流程图、目标链

**依赖边（dependency edge）**：
挂在节点之间、表达"谁等谁完成"的关系。负责目标的先后顺序。顺序不是节点链，是边；增删一条边不动树结构。waymark 的 dependency 机制表达。
_Avoid_: 阻塞（当指状态而非关系）、前置（当不指明方向）

**细化（refinement）**：
父子目标之间的关系：子目标是父目标的更具体声明。与顺序无关。
_Avoid_: 拆解（当暗示一次切碎成执行件时）

**推进（advance）**：
owner 对自己负责的 work item 做出的操作：改标题/正文/字段/状态、加删依赖、关闭、重开、归档、换 owner。只有 owner 能做。
_Avoid_: 更新、修改（当不指明谁有权时）

**认领（claim）**：
把一张开放的任务变为有人正在推进的状态，用 waymark 的 start（open → in_progress）表达。一张票同时只有一个 in_progress。认领不等于改 owner：owner 是责任归属，认领是当前推进状态。
_Avoid_: 指派（当暗示改 owner 时）、assign

**交付型任务（delivery task）**：
按已承诺的产出推进，失败是事故。执行前明确验收信号和可逆性。
_Avoid_: 正式任务（当和探针对比时）

**探针型任务（probe task）**：
用最小可逆动作换信息，失败是正常结果。回答"这个方向到底通不通"。
_Avoid_: 探索（当指没有明确动作的模糊阶段时）

**可逆性（reversibility）**：
一个任务做错之后的回退成本。单向门（one-way door）退不回来，动手前要格外确认；双向门（two-way door）可退，放心做。
_Avoid_: 风险（当指概率而非回退成本时）

**验收信号（acceptance signal）**：
事先写好的、可观察的判断标准，用来区分任务"已完成、未完成、无法判断"。由非执行者按信号检查。
_Avoid_: 验收标准（当只指清单时）、definition of done

**前沿（frontier）**：
所有未完成依赖的节点里，当前可以开工的集合。waymark 的 ready 查询给出。
_Avoid_: 待办、next actions（当指个人清单时）
