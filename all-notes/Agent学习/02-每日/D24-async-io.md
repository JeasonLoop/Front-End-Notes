---
type: daily-lesson
day: 24
week: 4
slug: async-io
status: todo
goal: 把阻塞调用改成 async。
tags:
  - agent
  - week/4
  - daily
---

# D24 异步改造（上）

[[02-每日/D23-redis-cache|← D23]] · [[01-周计划/W4-系统性能优化|W4]] · [[02-每日/D25-async-agent|D25 →]]

**目标**：把阻塞调用改成 async。

**技能**：[[03-概念/asyncio|asyncio]]

## 任务

- [ ] 找出阻塞点 <!-- task:d24-t1 -->
- [ ] 改一处 HTTP 调用 <!-- task:d24-t2 -->
- [ ] 确认 event loop 未堵 <!-- task:d24-t3 -->

## 资源

- [FastAPI Async](https://fastapi.tiangolo.com/async/) `doc`

## 笔记

<!-- AFM:USER -->
> 在此写下你的理解、踩坑、命令和链接。站点同步时会保留这一段。
<!-- /AFM:USER -->

## 收工检查

- [ ] 代码或命令可复现
- [ ] 概念页补了双向链接
- [ ] 明天的前置依赖清楚
