---
type: project
project: cs-rag
tags:
  - agent
  - project
---

# 企业级智能客服 RAG

周期：[[01-周计划/W7-项目一-企业智能客服-RAG|W7]]

**场景**：电商客服自动回答约 80% 重复问题：订单、物流、退款。

**简历钩子**：高并发低延迟生产监控，量化人力节省。

**技术栈**：`FastAPI` · `LangChain` · `PostgreSQL` · `Milvus` · `Redis` · `Docker` · `Prometheus`

## 验收

- [ ] FAQ 文档 + 商品/订单库双数据源
- [ ] 库表精确查询优先，未命中再文档检索
- [ ] 目标 QPS > 200，P99 < 500ms
- [ ] LangSmith + Prometheus + Grafana
- [ ] Docker Compose 一键部署

## 决策日志

<!-- AFM:USER -->
## 为什么这么选

## 指标

## 演示脚本
<!-- /AFM:USER -->
