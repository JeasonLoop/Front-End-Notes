---
title: "三层能力怎么选"
category: "04-AI-Agent/iOS快捷指令AI开发/01-地图与选型"
tags:
  - ios
  - shortcuts
  - app-intents
  - alarmkit
publish:
  home: false
  docs: true
---

# 三层能力怎么选

> 同一句「帮我设个闹钟 / 跑个自动化」，在 iOS 上可能落在三个完全不同的 API 上。选错层，后面全是假进度。

## 1. 场景

你跟 Agent 说「做个 iOS 快捷指令，用 AI 处理短信，到点提醒我」。它可能同时给你：

- 一段 `AppIntent` Swift
- 一份 XML plist
- 一个 `UNUserNotificationCenter` 本地通知
- 再加一个时钟 App 的 `CreateAlarmIntent`

四样都能编译或能生成文件，但只有一层是你真正要的。

## 2. 三层分别干什么

| 层 | 谁在用 | 产物 | 典型入口 |
| --- | --- | --- | --- |
| App Intents | 你的 App | Swift 类型 | [App Intents](https://developer.apple.com/cn/documentation/appintents) |
| 快捷指令文件 | 用户的「快捷指令」App | `.shortcut` / `.wflow` | 系统快捷指令 + 个人自动化 |
| AlarmKit | 你的 App 里的闹钟 / 倒计时 | `AlarmManager` | [AlarmKit](https://developer.apple.com/cn/documentation/alarmkit) |

**App Intents** 把 App 里的动作和数据交给系统：Siri、Spotlight、快捷指令库、小组件、控制中心、Apple Intelligence。官方原话是：让内容和动作可被 Apple Intelligence 发现，并支撑 Siri、Spotlight、Shortcuts、widgets。见 [Getting started with the App Intents framework](https://developer.apple.com/cn/documentation/appintents/getting-started-with-the-app-intents-framework)。

**快捷指令文件** 是用户侧工作流。动作标识大多是 `is.workflow.actions.*`，新系统动作经常再包一层 `appintentexecution`。它不替代你的 App，只是把系统 App 和你暴露出去的 Intent 串起来。

**AlarmKit** 是「能盖过专注模式和静音」的闹钟 / 计时器框架，不是快捷指令里那个「创建闹钟」动作。状态变化走 `AlarmManager.alarmUpdates`。文档：[alarmUpdates](https://developer.apple.com/cn/documentation/alarmkit/alarmmanager/alarmupdates-swift.property)。

Apple Intelligence 不是第四层实现，它是前两层的消费方：实体要能被索引、动作要有 schema 或至少能进快捷指令的「使用模型」。见 [Apple Intelligence and Siri AI](https://developer.apple.com/cn/documentation/appintents/apple-intelligence-and-siri-ai)。

## 3. 怎么选

要 **Siri 一句话跑你 App 里的动作**，写 `AppIntent`，再用 `AppShortcutsProvider` 注册短语。不要先生成一份快捷指令再让用户手动点。

要 **把「刷新信息流 / 打开某篇文章」挂到操作按钮、Spotlight、快捷指令主页**，还是 App Shortcuts。官方说明：[App Shortcuts](https://developer.apple.com/cn/documentation/appintents/app-shortcuts)。硬限制：每个 App 大约 10 条 App Shortcut，短语总量按展开后计，大概 1000 条量级。

要 **用户自己拼：剪贴板 → 用模型 → 发消息**，生成快捷指令文件。模型动作是 `is.workflow.actions.askllm`（界面名「使用模型」）。

要 **响铃、贪睡、倒计时 Live Activity**，AlarmKit。快捷指令里的 `CreateAlarmIntent` 调的是系统时钟 App，改不了你自己的闹钟 UI，也听不到 `alarmUpdates`。

要 **短信来了抽出取件码写进提醒事项**，这是个人自动化 + 快捷指令，不是 App Intent。自动化的输入必须接到「输入快捷指令的信息」，在快捷指令里用「获取文本」吃 `ExtensionInput`。一份 `.shortcut` 装不了自动化本身。

## 4. 常见配错

- 用本地通知冒充闹钟。通知会被专注模式挡住；AlarmKit 的 alert 按设计可以盖过去。
- 把 SwiftData 的 `@Model` 直接当成 `AppEntity`。`AppEntity` 要 `Sendable`，模型类过不了 Swift 6。
- 在 Windows 上写出一份未签名 plist，丢给 iPhone。现网 iOS 会拒。
- 让 Agent 用 SiriKit / `NSUserActivity` 当主路径。现在主路径是 App Intents；`NSUserActivity` 只适合「当前屏幕这一项」的兼容标注。

## 5. Checklist

- [ ] 这句话是「App 对外的动作」还是「用户工作流」还是「系统级闹钟」？
- [ ] 需要盖过静音 / 专注吗？需要就 AlarmKit。
- [ ] 需要装完 App 就能对 Siri 说吗？需要就 App Shortcuts，不要依赖用户自己装快捷指令。
- [ ] 需要模型处理富文本再写回 App 吗？Intent 参数用 `AttributedString`，实体字段要标 `@Property`。
