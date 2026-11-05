---
title: "上下文工程：CLAUDE.md 与会话管理"
category: "04-AI-Agent/VibeCoding高效能秘籍"
tags:
  - ai-agent
  - claude-code
  - codex
  - context-engineering
publish:
  home: false
  docs: true
---

# 上下文工程：CLAUDE.md 与会话管理

> 对应课程第二章。两个战场：跨会话的记忆（CLAUDE.md）和单次会话内的上下文质量（六种操作）。

## 1. CLAUDE.md：投入产出比最高的文件

Agent 每次会话启动都是失忆的。CLAUDE.md / AGENTS.md 是唯一能让它每次开工就"记住"你的东西，已是行业标准（OpenAI 把 AGENTS.md 捐给 Linux Foundation 旗下 AAIF，与 MCP 同基金会；Codex、Cursor、Copilot、Gemini CLI 全部原生支持）。

### 巨型指令文件为什么崩坏（OpenAI Harness Engineering 的教训）

他们用 Codex 从零搭了百万行、零行人写的内部产品，初期把所有规则塞进一个巨大 AGENTS.md，结果 "it failed in predictable ways"：

1. **注意力被稀释**：前沿模型只能可靠遵循 150~200 条指令，Claude Code 系统提示已占约 50 条。超限后是**所有规则**的遵循质量一起下降。经验红线：300 行以内。
2. **上下文腐烂（Context Rot）**：代码天天变、文件没人更新，三周后从资产变负债。

### 解法：目录，不是百科全书（渐进式披露）

OpenAI 把 AGENTS.md 砍到约 100 行，只告诉 Agent"你需要的东西在哪"，真知识放结构化的 `docs/` 目录按需读取。Karpathy 的 LLM Wiki（2500 字符索引 + 一行摘要/页 + grep）、Claude Code 的 Skills 加载（先只加载名字和一句话描述）、工具按需加载——四个独立系统殊途同归。

**判断标准：这个信息是每次会话都需要，还是只有特定任务需要？后者就该放目录里按需读取。**

### 落地要点

四层位置：`~/.claude/CLAUDE.md`（全局个人偏好）→ 项目根 `./CLAUDE.md`（团队共享，提交 git）→ 子目录 CLAUDE.md（monorepo 分模块，自带渐进式披露）→ `CLAUDE.local.md`（个人私有，进 gitignore）。

内容框架 WHAT / WHY / HOW（HumanLayer）：

```markdown
# 项目名：一句话说清楚这是什么

Next.js 14 项目，App Router + TypeScript。

## 常用命令
- `pnpm dev`：启动开发服务器
- `pnpm test src/xxx.test.ts`：跑单个测试文件，不要跑全量
- `pnpm typecheck`：改完代码必须跑一次

## 项目结构
- `/app` - 页面和路由
- `/lib` - 工具函数（跨模块共享的逻辑都在这，别重复造）

## 重要约定
- 不要用 --force 推送，用 --force-with-lease
- 认证相关的改动，先读 @docs/auth-patterns.md
```

经验细则：

- **命令写精确语法**，Agent 猜不到 pnpm 还是 npm。
- **只写它猜不到的**：语法不用教、linter 能管的不写（交给 Prettier）；写只存在于你脑子里的东西——为什么这个目录不能碰、哪段"冗余"逻辑是兼容老用户的。
- **每个"不要"跟一个"应该"**：`不要 --force，用 --force-with-lease`。
- **详细文档用条件指引，不要直接 @ 内嵌**：`@` 会在启动时把整个文件灌进上下文。写"涉及打点的改动，先读 docs/tracking.md"。作者把几万字打点文档 @ 进去，每个会话白白常驻近 10K token，是他买过最贵的教训。
- 规则文件支持 frontmatter `paths` glob 限定生效范围（`.claude/rules/`）。
- 个别老不遵守的规则加 `IMPORTANT:` / `YOU MUST:` 加权，但要克制。
- 可指定压缩时必须保留什么（改动文件列表、测试结果、当前计划）。
- 多工具团队：规则全放 AGENTS.md，各工具配置文件里写一行 `Include: @./AGENTS.md`。

### 案例：从"写了不遵守"到生效

"注意测试的执行效率，避免不必要的全量测试"——没用。问题：埋在两百行文件中部 + "避免不必要的"没有可执行性。改成：

```markdown
## 测试
- 跑测试用 `pnpm test <文件路径>`，只跑改动相关的文件
- 全量测试很慢（4 分钟+），只在我明确要求时才跑
```

当天生效。**Agent 不听话时，先审查规则本身，再怀疑模型。**

### 当活文档养：错题本模式

Claude Code 创始人 Boris Cherny 的 CLAUDE.md 只有 2.5k token，每次 Claude 犯了他没拦住的错就加一条——持续进化的错题本。反向也要定期做减法：对每行问"删掉这行，Agent 会不会犯错？不会就删。"

## 2. 会话内上下文管理：Agent 越用越傻的真相

不是模型降智，是**上下文变脏了**（Context Rot）。上下文窗口分七层：系统指令、工具定义、环境信息、MCP/Skills 目录、CLAUDE.md/Memory、对话消息。前五层相对固定，失控的是逐轮增长的对话消息（失败的尝试、读完就没的文件、大段错误日志）。Anthropic 实测约 300k-400k token 后表现明显下降，任务越复杂劣化越早。

用 `/context`（Claude Code）看分布；Codex 用 `/status` 或让模型估算各层占用。

### 六种操作与决策卡片

| 场景 | 选择 |
| --- | --- |
| 同一任务，上下文还有用 | Continue |
| Agent 走错了路 | **Rewind**（双击 Esc，最被低估） |
| 会话很长但还要继续 | /compact（主动压，别等 autocompact） |
| 要开始新任务 | /clear（清之前先写 HANDOFF.md） |
| 上下文很好，想多开一条线 | /branch |
| 下一步会产生大量中间输出 | Subagent（只要结论不要过程） |

- **Rewind 进阶**：Summarize from here（总结"后面要丢的"教训，带回退点）；Summarize up to here（总结"前面太长的"给前半段瘦身）。
- **Bad Compact**：compact 发生在 context rot 最严重的时候，模型按"主线叙事"决定保留什么，偏离主线的附带发现大概率被丢。对策：主动 compact、给 compact 指明保留方向、熟练后关掉 autocompact（`"autoCompactEnabled": false`）。
- Codex 对应：双击 Esc 编辑上一条并 fork ≈ rewind；`/fork` ≈ branch；多一个 `/side`（轻量探索，用完即弃）。

### 最可靠的桥接：HANDOFF.md

别求 compact 帮你记，把状态落进文件：

```markdown
# 认证重构 - 交接

## 已完成
- JWT 签发逻辑迁移到 auth/jwt.service.ts，登录接口已切新逻辑，测试通过

## 待办
- refresh token 还没迁移，逻辑在 auth/legacy.ts:120
- bar.ts 有个 unused import warning，顺手修掉

## 已知的坑
- 别动 auth/session.ts 的 Redis key 格式，线上有老数据依赖
- 方案 A（中间件验签）试过，不行：中间件拿不到 user context
```

/clear 后新会话第一句"读一下 HANDOFF.md，我们继续"。比 compact 可靠：不丢、在模型清醒时写、**记得住负面知识**（"方案 A 试过不行"这类 compact 几乎必丢的教训）。

### 三条心法

1. **上下文是预算，不是仓库**：让它读大文件、跑大输出命令前，先问"我需要完整内容还是只要一个结论？"只要结论 → subagent。
2. **在模型还清醒时做决策**：40%-50% 就写交接文档，觉得长就主动 compact，换任务立刻 clear/branch。等它提醒就晚了。
3. **关键信息落文件，不落上下文**：CLAUDE.md 管跨会话信息质量，HANDOFF.md 管单次会话的临时状态，一体两面。

## Checklist

- [ ] CLAUDE.md ≤ 300 行，是目录不是百科全书
- [ ] 每条"不要"都配了"应该"，模糊形容词换成了精确命令
- [ ] 长文档用条件指引而不是 @ 内嵌
- [ ] 错题本在持续增加，也定期做过减法
- [ ] 换任务前写过 HANDOFF.md 或主动 /compact，没有依赖 autocompact
