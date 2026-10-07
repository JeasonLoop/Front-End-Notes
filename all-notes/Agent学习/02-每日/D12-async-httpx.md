---
type: daily-lesson
day: 12
week: 2
slug: async-httpx
status: todo
goal: 理解 await 不是 Promise.then 的语法糖那么简单。
tags:
  - agent
  - week/2
  - daily
---

# D12 asyncio 与 httpx

[[all-notes/Agent学习/02-每日/D11-db-in-api|← D11]] · [[all-notes/Agent学习/01-周计划/W2-后端基础-HTTP-FastAPI-SQL|W2]] · [[all-notes/Agent学习/02-每日/D13-env-auth-docker|D13 →]]

**目标**：理解 await 不是 Promise.then 的语法糖那么简单。

**技能**：[[all-notes/Agent学习/03-概念/asyncio|asyncio]]

## 任务

- [ ] 写 async def 并发请求 5 个 URL <!-- task:d12-t1 -->
- [ ] 对比 time.sleep 与 asyncio.sleep <!-- task:d12-t2 -->
- [ ] 笔记：事件循环 vs JS 微任务队列 <!-- task:d12-t3 -->

## 资源

- [asyncio 任务](https://docs.python.org/zh-cn/3/library/asyncio-task.html) `doc`
- [httpx](https://www.python-httpx.org/) `doc`

## 笔记

<!-- AFM:USER -->
> 在此写下你的理解、踩坑、命令和链接。站点同步时会保留这一段。
<!-- /AFM:USER -->

## 收工检查

- [ ] 代码或命令可复现
- [ ] 概念页补了双向链接
- [ ] 明天的前置依赖清楚
