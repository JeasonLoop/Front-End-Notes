---
title: "Apple Intelligence 与 Use Model"
category: "04-AI-Agent/iOS快捷指令AI开发/02-App-Intents"
tags:
  - apple-intelligence
  - app-intents
  - shortcuts
publish:
  home: false
  docs: true
---

# Apple Intelligence 与 Use Model

> Apple Intelligence 不替你写业务。它消费你已经暴露的实体和动作。App 侧把透镜造对，快捷指令里的「使用模型」才能把结果写回来。

官方步骤写得很短，见 [Apple Intelligence and Siri AI](https://developer.apple.com/cn/documentation/appintents/apple-intelligence-and-siri-ai)：

1. 索引实体，进 Spotlight 语义搜索
2. 选可迁移类型（`Transferable` 等），内容才能跨 App
3. 采纳 schema，Siri 按日常说法匹配
4. 把实体和屏幕 / User Activity 关联，才能说「这张照片」
5. 捐赠交互，系统才学得会「早上总是问天气」

## 1. Schema 是合同

自定义 `AppIntent` 要靠 `AppShortcutsProvider` 的短语被发现。对得上系统 domain 的动作，用 `@AppIntent(schema:)` / `@AppEntity(schema:)`，Xcode 会按模板补参数。Siri 可以不靠你写的那几句中文短语就执行。

常见域：消息、日历、照片、邮件、浏览器、日记、视觉智能、以及 `.system.searchInApp`。

约束很死：schema 规定的属性名和类型不能改。比如有的消息 schema 要求 `message` 是 `AttributedString?` 不是 `String`，`location` 是 `CLPlacemark?`。编错会得到很糊的编译错误。

更新类意图不要用「参数是不是 nil」表示清空。语音指令必须能区分「别改」和「清掉」，走 `$parameter.valueState`（set / set nil / unset）。

## 2. 快捷指令里的「使用模型」

iOS 26+ 快捷指令有 **Use Model**（标识 `is.workflow.actions.askllm`）。它把 App Entity 序列化成 JSON 丢给设备端、Private Cloud Compute 或 ChatGPT，再吐出文本、字典、布尔或你声明的实体类型。

对意图作者两件要紧的事：

**文本参数用 `AttributedString`。** 模型会吐粗体、列表、表格。`String` 会丢格式。内部要纯文本再 `String(body.characters[...])`。

```swift
@Parameter(title: "正文")
var body: AttributedString
```

**模型只能看见 `@Property` 字段**，外加类型展示名和 `displayRepresentation`。没标的字段不会进 JSON。用户指望模型「根据截止日期和优先级改写任务」时，这两个字段必须暴露。

这条路径 **不必** 先上 schema。实体形状对了，任意 `AppIntent` 都能被下游「使用模型」接到。

生成 plist 时的接法见 [Ask LLM 与执行 App Intent](../03-快捷指令文件/03-Ask-LLM与执行AppIntent.md)。

## 3. 找内容和说话

找：语义索引优先；太大或在服务端用 `IntentValueQuery`；用户只是想在你自己的搜索页里看结果，用 `.system.searchInApp`。

说：

- 返回空 `IntentResult`，让 Siri 自己组织句子
- 要人设就 `ProvidesDialog`，`IntentDialog(full:supporting:)`：`full` 给 AirPods / HomePod 朗读，必须能单独听懂；`supporting` 给有屏幕的设备
- 中途缺参数用 `$param.requestValue`，少问
- 卡片外观靠 `DisplayRepresentation`（标题 / 副标题 / 图），确认框、消歧、Spotlight 都复用它

不要 `String(format:)` 拼对话。用 `LocalizedStringResource`，复数用 Foundation 的 inflect markdown。

## 4. 捐赠

Siri / 快捷指令跑过的意图，系统自己会捐。它看不到的是用户在 **App UI 里点的同一件事**。UI 路径和 schema 意图应打到同一个 helper，只在 UI 路径 `IntentDonationManager.donate`。

做完再捐。捐太勤系统会开始忽略。实体删了，过期捐赠也要清。

## 5. Checklist

- [ ] 能对上 domain 的动作用了 schema，对不上的才手写短语
- [ ] 可能接模型输出的文本参数是 `AttributedString`
- [ ] 模型需要的字段都有 `@Property`
- [ ] 索引、屏幕标注、捐赠三条不是只做了意图 struct
