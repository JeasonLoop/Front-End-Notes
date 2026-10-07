---
title: "自用高频 Skill"
category: "04-AI-Agent/skill推荐"
tags:
  - ai-agent
  - skills
  - ponytail
  - codegraph
publish:
  home: true
  docs: true
---

# 自用高频 Skill 

Skill 装多了没意义。Agent 一次塞十份说明书，上下文被占满，写出来的东西还互相打架。

我真正高频在用的就下面这几个。每个都说清楚：它是干什么的、我为什么还留着、用下来感觉怎么样。

## CodeGraph

开源：[colbymchenry/codegraph](https://github.com/colbymchenry/codegraph)

代码图谱。问「这个函数在哪定义的」「谁调用它」「改了会波及哪里」，它比满仓库 grep 靠谱。

推荐原因很简单：AI 最容易犯的错不是语法，是改错地方。Grep 能搜到字，搜不到调用关系。项目稍微大一点，你让它「先搜一遍再改」，它经常读到一半就开始动手。

效果：找定义、跟调用链，明显比瞎翻文件快。索引是旧的时候会指错地方，改完代码记得同步一下图谱。注释、文案、奇怪字符串还是用搜索，别什么都丢给它。

## ponytail

开源：[DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail)

翻译过来就是「能懒则懒」。默认让 AI 走最短能跑的路：先问这需求要不要存在，再看仓库里有没有现成的，再看标准库，最后才写新代码。

我留它是因为 AI 默认会过度设计。一个同步脚本能搞定的事，它能给你抽三层抽象、加一张映射表、再整一个配置中心。这个知识库吃过亏：slug 本来就是路径拼出来的，再加映射表就是给自己挖坑。

效果：diff 明显变短，废话少。有时候会懒过了头，该补的边界没补，所以复杂需求还是要自己盯一眼。日常改功能、修 bug、重构，这个我几乎每次都开。同家族还有 review / audit，那是另一回事，别六个一起开。

## ponytail-review

开源：和 ponytail 同一个仓库，[DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail)

专门审「能删什么」的 review，不管对不对，只管是不是写复杂了。

普通 review 会跟你说边界、命名、测试。这个只会盯着：手写了一遍标准库、为了以后可能用到的扩展、没人调用的抽象。我改完一串文件，觉得 AI 又开始表演了，就丢给它看 diff。

效果：输出很冲，一行一个位置，告诉你删什么、用什么顶上。当正确性检查会漏，它本来就不是干这个的。偶尔想扫整个仓库的臃肿，用 `ponytail-audit`，别当日常。

## vercel-react-best-practices

开源：[vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices)（仓库里叫 `react-best-practices`）

Vercel 那套 React 性能规矩：请求瀑布、包体积、重渲染、数据获取怎么写。

这个站点就是 React。AI 写组件很爱把请求串起来、随便加 memo、或者在渲染路径里干重活。改 `src/` 的性能和数据流时开它，比口头说「注意性能」有用。

效果：改列表、详情、请求链路时，能拦住一批典型坏写法。改一篇 Markdown、改 sync 脚本开它纯浪费。它偏 Next 的部分，这个纯 Vite 站直接忽略就行。

## frontend-design

开源：[anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/frontend-design)

让界面有记忆点的那套，专门克制「AI 审美」：紫渐变、Inter、中规中矩的卡片墙。

这个站吃的就是 CRT 扫描线和霓虹，本来就不该长成通用后台。真要动视觉、加一页、重做氛围，才开它。

效果：舍得下手的时候，页面不会那么模板。副作用也明显：它自己有一套「大胆审美」，你不把 CRT 方向说死，它可能给你换皮。小改间距、修个按钮，别开。

## ui-ux-pro-max

开源：[nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)

更偏产品和体验：信息架构、空态/错态/加载态、间距字体、无障碍。`frontend-design` 管好不好看，这个管好不好用。

做完整一页、重新梳导航、把交互状态补齐时有用。改两行 CSS 开它，会得到一篇设计文档，然后你还得自己落到代码。

两者别叠着开。要风格开 design，要结构和状态开这个。

## vue-best-practices

开源：[vuejs-ai/skills](https://github.com/vuejs-ai/skills/blob/main/skills/vue-best-practices/SKILL.md)

写 Vue 3 的默认姿势：Composition API、`<script setup>`、状态往下传事件往上抛。

前端笔记里有 Vue 章节，写示例、讲组件怎么拆的时候用得上。这个仓库的网站源码是 React，套 Vue 工作流会写歪。

效果：Vue 示例会规整很多。只在碰 `.vue` 或 Vue 笔记时开，不要当这个站的默认 skill。

## brainstorming / writing-plans / executing-plans

开源：[obra/superpowers](https://github.com/obra/superpowers) 里的 [brainstorming](https://github.com/obra/superpowers/tree/main/skills/brainstorming)、[writing-plans](https://github.com/obra/superpowers/tree/main/skills/writing-plans)、[executing-plans](https://github.com/obra/superpowers/tree/main/skills/executing-plans)

三个是一套。先把需求问清楚，再拆成能执行的步骤，再分批落地。

适合「给站点加搜索、加标签」这种会动好几个文件、决策还没想明白的活。AI 一上来就写，写到一半发现方向错了，这套就是用来少返工的。

效果：大需求会稳一点。小活开它纯折磨——改一篇笔记、修个 slug、改一句文案，还走「先问十个问题再写计划」，两边都烦。计划写短点就行，这个仓库没必要为每个功能存一份长计划。

## debug-pro

开源：没找到单独仓库。这套流程和 [obra/superpowers 的 systematic-debugging](https://github.com/obra/superpowers/tree/main/skills/systematic-debugging) 几乎一样，看原文去那个目录。

稳定复现的 bug，按「复现 → 缩小范围 → 假设 → 打点 → 验证 → 再改」走，不让 AI 连猜带改。

报错扔回去它经常改症状不改病因，东补一个 if 西加一个 catch。这个 skill 会逼它先说清楚假设。

效果：真难缠的问题有用。页面上立刻能看出来的小问题，走完七步太重。

## security-auditor

开源：正文写改编自 Dave Poon 的 buildwithclaude（MIT），我没对上仍在更新的独立仓库。

安全向的审查：XSS、密钥、危险 HTML。这个站用了 `rehype-raw`，笔记里的 HTML 会进页面，审渲染链路时值得开一下。

效果：能提醒「这段 HTML 不要原样灌进去」。日常改文案、改样式开它会很吵，真正碰用户内容和渲染时再开。

## 不常开、但偶尔有用

`find-skills`：想起来「有没有现成 skill 能干这事」再开，别每次写代码先搜一遍。[vercel-labs/skills](https://github.com/vercel-labs/skills/tree/main/skills/find-skills)

`git-essentials`：分支、暂存、协作命令突然卡壳时翻一下。日常 commit 没必要加载整份。没找到独立 GitHub 仓库，文档在 [git-scm.com](https://git-scm.com/)。

飞书、浏览器自动化、搜图、股票、论文，那是日常助手，跟这个知识库怎么写代码没关系。

## 我实际怎么用

日常改这个站，默认就两样：**CodeGraph 找地方，ponytail 少写。**

改 React 性能再加 vercel 那套。动视觉再加 design 或 UX，而且先把 CRT 风说死。大功能才走 brainstorming 那条链。觉得 AI 又在堆架构，把 diff 丢给 ponytail-review。

Skill 不是越多越聪明。选几个真能改行为的，比把工具箱全倒进对话里有用。
