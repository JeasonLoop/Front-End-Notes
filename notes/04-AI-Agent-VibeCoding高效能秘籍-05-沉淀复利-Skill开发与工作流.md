---
title: "沉淀复利：Skill 开发与工作流"
category: "04-AI-Agent/VibeCoding高效能秘籍"
tags:
  - ai-agent
  - skills
  - workflow
publish:
  home: false
  docs: true
---

# 沉淀复利：Skill 开发与工作流

> 对应课程第五章。单个 Skill 怎么写好（省、准、稳），以及整个工作流怎么一步步长出来。

## 1. Skill 是给 AI 的操作手册

SKILL.md 已开放为跨工具标准（Anthropic 开放、Codex 官宣支持、VS Code / Cursor / OpenCode 跟进）——和 AGENTS.md 同一个故事：练出来的功夫不绑定工具。反过来，垃圾 Skill 也有代价：元数据挤上下文、模糊描述误触发、臃肿正文带偏注意力。

基本构成：目录 + 唯一必需的 `SKILL.md`（frontmatter 的 name + description，正文是操作手册）+ 三类可选资源 `references/`（按需读的参考）、`scripts/`（直接执行的脚本）、`assets/`（产物素材）。放 `~/.claude/skills/`（全局）或项目 `.claude/skills/`。

写好一个 Skill 回答四个问题：怎么被触发、怎么不吃垮上下文、怎么让模型做对、怎么保证每次都一样好——归结为三个字：**省、准、稳**。

### 省：上下文是公共资源

- SKILL.md 红线 **500 行**（Anthropic 官方最佳实践），超的拆到 references/，正文只写一句 "Load references/xxx.md"，按领域分文件、只嵌套一层。
- 三类资源待遇不同：references 按需读、scripts 只调用不读进上下文、assets 从头到尾不需要被读。
- 该思路推到极致 = **CLI + Skill 替代 MCP**（agent-browser 上下文消耗比 Playwright MCP 低一个数量级）。给 AI 加能力，先想能不能写成 CLI 工具加 Skill。

### 准：理解模型的脾气

1. **它不缺知识，缺注意力引导**：指令写成"该问的问题"而不是"该找的答案"——❌"检查是否违反单一职责" → ✅"问自己：这个模块有几个不同的修改理由？超过一个就可能违反"。
2. **默认模式改不掉，逐条点名禁令**（反面教材清单，Impeccable 的绝对禁令是教科书实践）。
3. **压力下走捷径，立铁律 + Red Flag**（systematic-debugging skill）：

```
Iron Law: NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
Red Flags (return to Phase 1):
- "I think the problem might be..."（你在猜，不是在分析）
- Making changes without understanding root cause
- Fix works but you can't explain why
```

铁律定"什么不许做"，Red Flag 定"怎么发现你正在做"——自动刹车。

### 稳：把流程立稳

- **工作流清单边执行边打勾**：`⛔ BLOCKING`（不完成不许往下走）/ `⚠️ REQUIRED`（不能跳过）。
- **决策点设确认节点**：生成、修改类有后果的操作强制停下问用户。
- **Pre-Delivery Checklist 具体到可检查**：❌"确保可访问性好" → ✅"所有图片有 alt text、所有表单输入有 label"。
- 分析类 Skill 配优先级分级（P0 阻止合并 … P3 可选优化）。
- 参数系统：`$ARGUMENTS` + argument-hint，不用每次跑全流程。

让 AI 帮你写 Skill，你负责把关——前面每条规范从操作指南变成验收标准。注意 AI 写的 Skill 天然臃肿，写完问"哪些可以去掉"，不是"哪些可以加"。

## 2. 工作流沉淀：先小闭环，再自动化

**最大的坑是想太多做太少**：看到别人的完整系统搬回家，结果解决的全是别人的问题。正确顺序是反过来的——没有痛点撑不起系统。参照马斯克五步法：质疑每个需求 → 删掉所有能删的（最后没把 10% 加回来说明删得不够狠）→ 简化优化 → 加速迭代 → **自动化（永远最后一步）**。

完整路径（不能跳级）：

```
手动跑通（最土但能 work 的小闭环）
  → 固化成 Skill
  → 半自动（关键节点留人确认）
  → 全自动（定时/触发式）
```

- 不手动跑过，就不知道筛选标准；没固化跑几轮，就不知道哪些节点必须留人。
- **什么值得固化**：重复次数 × 单次耗时 × 流程稳定度，三者都高才做；判断"什么不值得固化"同样重要（作者放弃把数据库大版本迁移做成 Skill：一年两次、每次流程完全不同）。
- Skill 里值钱的不是脚本和 SQL，是**被实践校准过的判断标准**（"采样不超过 15 条""超过 5 个 session 取最近 5 个 + 第一个"——全是手动阶段试出来的数字）。
- 固化后立刻做减法："这里面哪些可以去掉？"只留每次真正会走的路径。
- 错题本长在 Skill 里：每次翻车变成一行规则（"必须先查已联系表防重复骚扰""不要用 ON CONFLICT DO UPDATE 加额度，新用户额度会算两遍"）。**一个从没积累过翻车教训的流程，不配全自动。**

## 3. 复利从哪来

每个小闭环沉淀的东西（prompt、规则、Skill、hook、错题本）都在给下一个闭环降成本：user-profile 打磨好的分析逻辑直接复用到 win-back，再复用到 debug-session。单次性 prompt 是消耗品，沉淀下来的是资产——不会过期、不会遗忘、可复用。

## Checklist

- [ ] SKILL.md ≤ 500 行，description 是触发关键词网
- [ ] 指令多写成"该问的问题"，反面模式逐条点名，关键流程有铁律 + Red Flag
- [ ] 有打勾清单和确认节点，交付清单具体可检查
- [ ] 新流程都是手动先跑通，重复够多才固化
- [ ] 每次翻车都变成了流程里的一行规则
