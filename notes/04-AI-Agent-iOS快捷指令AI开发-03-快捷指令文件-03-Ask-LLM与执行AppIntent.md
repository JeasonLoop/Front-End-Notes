---
title: "Ask LLM 与执行 App Intent"
category: "04-AI-Agent/iOS快捷指令AI开发/03-快捷指令文件"
tags:
  - shortcuts
  - apple-intelligence
  - app-intents
publish:
  home: false
  docs: true
---

# Ask LLM 与执行 App Intent

> 快捷指令里的「AI」通常就两步：用模型把文本变一下，再把结果交给某个 App Intent。两步的接线都在魔法变量上，不在 prompt 文案上。

App 侧该暴露什么字段，见 [Apple Intelligence 与 Use Model](../02-App-Intents/03-Apple-Intelligence与Use-Model.md)。

## 1. 使用模型

标识：`is.workflow.actions.askllm`。常见参数：

- `WFLLMPrompt`：`WFTextTokenString`，里面嵌上一步输出
- `WFLLMModel`：例如 `Apple Intelligence`
- `WFGenerativeResultType`：常见 `Text`

输出名按英文模板是 `Response`；中文系统以界面为准，生成后用 dump 对一下，不要猜。

Prompt 里插入变量时，`attachmentsByRange` 的起点是 **占位符在最终字符串里的位置**。先写「把这段翻成中文：」再插变量，range 就不是 `{0, 1}`。

最小链：询问输入 → 使用模型 → 显示结果。问天气那种，先把天气对象收成文本再喂模型，模型吃的是字符串或实体 JSON，不是你以为的任意对象。

## 2. 执行 App Intent

系统级动作（开设置页、创建系统闹钟、开关低电量）走：

```xml
<key>WFWorkflowActionIdentifier</key>
<string>is.workflow.actions.appintentexecution</string>
```

`AppIntentDescriptor` 要齐：`BundleIdentifier`、`AppIntentIdentifier`、`Name`，系统 App 的 Team 常常是 `0000000000`。

例子：

- 时钟：`com.apple.clock` + `CreateAlarmIntent` / `ToggleAlarmIntent`
- 提醒：`com.apple.reminders`
- 设置：`com.apple.Preferences` 或无障碍那套 bundle

这和你自己 App 里的 `AppIntent` 不是自动同一条路径。你的意图出现在快捷指令动作列表里，是因为 App 安装后系统扫到了 `AppShortcutsProvider` / 可发现意图。生成 plist 时硬编码一个不存在的 `AppIntentIdentifier`，手机会直接没这个动作。

## 3. 和 AlarmKit 的分工

快捷指令里创建的是 **系统时钟闹钟**。它不会：

- 出现在你 App 的 `AlarmManager.alarms`
- 触发 `alarmUpdates`
- 用你的 Live Activity / 着色 / 自定义按钮

你的 App 要自己的响铃体验，用 AlarmKit 调度，必要时再暴露「安排一个专注闹钟」之类的 `AppIntent` 给快捷指令调用。不要在 plist 里假装能配 `AlarmConfiguration`。

## 4. 模型输出接下一步

下游意图如果接正文，App 侧参数用 `AttributedString`。快捷指令里把 `Response` 直接喂给「添加到笔记 / 发送信息」通常可以；喂给要结构化字段的意图前，先让模型按你暴露的 `@Property` 吐实体，或自己拆字典。

多轮对话是「使用模型」动作自己的能力，不要用 Repeat + 剪贴板模拟聊天历史，除非你明确要离线拼接。

## 5. Checklist

- [ ] `askllm` 的 prompt 占位符 range 和字符串一致
- [ ] `appintentexecution` 的 bundle / identifier 来自真机或官方目录，不是编的
- [ ] 系统闹钟和 App 内 AlarmKit 没有当成同一个对象
