---
type: moc
cssclasses:
  - agent-map
tags:
  - agent
  - map
---

# Agent Field Manual

融合 [AgentGuide 8 周工程路线](https://github.com/adongwanai/AgentGuide/blob/main/docs/05-roadmaps/learning-roadmap-development.md) 与 [渡一 AI 全栈学习地图](https://ai-study-map.pages.dev/) 的个人作战手册。

进度由学习站写入 `06-系统/progress.json`，也可在每日笔记勾选任务后点「从库读回」。

## 能力阶梯

- [[00-地图/阶段-1-Agent-应用开发|1. Agent 应用开发]] — 从工具使用者变成应用开发者
- [[00-地图/阶段-2-后端与服务化|2. 后端与服务化]] — 把 Demo 变成可调用的服务
- [[00-地图/阶段-3-运维-观测与交付|3. 运维、观测与交付]] — 能定位线上问题才算生产级
- [[00-地图/阶段-4-高效-AI-编程|4. 高效 AI 编程]] — 用 Agent 加速自己的工程闭环
- [[00-地图/阶段-5-企业级项目|5. 企业级项目]] — 两个能写进简历的系统
- [[00-地图/阶段-6-就业与作品包装|6. 就业与作品包装]] — 把工程经历量化成故事

## 8 周冲刺

- [[01-周计划/W1-大模型应用基础-Naive-RAG|W1 大模型应用基础 + Naive RAG]] — 用 FastAPI + LCEL 跑通文档问答，并 Docker 打包。
- [[01-周计划/W2-Advanced-RAG-生产向量库|W2 Advanced RAG + 生产向量库]] — 混合检索、Rerank、RAGAs 评估、Milvus。
- [[01-周计划/W3-Agent-与-Tool-Calling|W3 Agent 与 Tool Calling]] — ReAct、自定义工具、SQL Agent、Memory、错误处理。
- [[01-周计划/W4-系统性能优化|W4 系统性能优化]] — 缓存、异步、批处理、vLLM，用压测量化。
- [[01-周计划/W5-监控-可观测性与部署|W5 监控、可观测性与部署]] — 链路追踪 + 指标 + 容器编排，能排障。
- [[01-周计划/W6-Multi-Agent-系统|W6 Multi-Agent 系统]] — 对比 AutoGen / CrewAI / LangGraph，各做一个协作系统。
- [[01-周计划/W7-项目一-企业智能客服-RAG|W7 项目一：企业智能客服 RAG]] — FAQ + 订单库混合检索，冲 QPS 与延迟指标。
- [[01-周计划/W8-项目二-投研-Agent-面试|W8 项目二：投研 Agent + 面试]] — Multi-Agent 研报流水线，量化简历，Mock 系统设计。

## 项目

- [[04-项目/enterprise-cs-rag|企业级智能客服 RAG]]
- [[04-项目/research-multi-agent|Agent 驱动的自动化投研]]

## Dataview

```dataview
TABLE week, status, goal
FROM "02-每日"
SORT day ASC
```

## 用法

1. 用学习站连接本库（浏览器授权目录）。
2. 每天打开对应 `02-每日` 笔记，只在 USER 区块写自己的话。
3. 概念页用 wikilink 双向生长，不要复制课程原文。
