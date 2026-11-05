---
title: "常见翻车"
category: "04-AI-Agent/iOS快捷指令AI开发/02-App-Intents"
tags:
  - app-intents
  - anti-patterns
publish:
  home: false
  docs: true
---

# 常见翻车

> App Intents 从 iOS 16 改到现在，训练数据里大量还是 SiriKit。Agent 默认写法经常能编过，一编译或一上 Siri 就裂。

下面只收会反复踩的。完整对照社区 skill 的 anti-patterns：[n0an/App-Intents-Agent-Skill](https://github.com/n0an/App-Intents-Agent-Skill)。

## 1. 数据层

**`@Model` 当 `AppEntity`。** Swift 6 下 `AppEntity` 要 `Sendable`，模型类不是。影子 struct。

**意图里用 SwiftUI `@Query`。** `@Query` 只在 `View` 里有意义，意图里永远是空数组。用 `FetchDescriptor` 或注入的 data controller。

**在 `perform()` 里 `new` 数据库、网络栈、鉴权。** 冷启动、小组件进程、主 App 会各 new 一份。`App.init()` 里 `AppDependencyManager.shared.add`，意图用 `@Dependency`。

**跨进程写同一份存储。** 小组件时间线在 extension，按钮意图常在 App 进程。状态走 App Group 的 `UserDefaults(suiteName:)` 或共享 `ModelContainer` URL，不要 `UserDefaults.standard`。

## 2. 发现性

**写了意图不注册。** 没进 `AppShortcutsProvider` 的，对快捷指令库、Siri 建议、操作按钮都是隐身。小组件配置意图例外，别注册。

**短语没 `\(.applicationName)`。** 直接编不过。

**只有参数化短语。** 没跑过 App 的用户在 Spotlight 里看不见。留一条无参数短语。

**实体改了不 `updateAppShortcutParameters()`。** Siri 还在建议已删文件夹。

**辅助意图可被发现。** 小组件 / Snippet 按钮会污染用户库。`isDiscoverable = false`。

## 3. 运行时

**返回类型随手写。** `IntentResult` 的关联类型不对，编译器不一定拦住，运行会崩。有返回值就 `ReturnsValue`，要开口就 `ProvidesDialog`，要卡片就 `ShowsSnippetView` / `ShowsSnippetIntent`。

**`SnippetIntent.perform()` 里改数据或打网络。** Snippet 会在展示、按钮、外观变化、`reload()` 时被多次调用。这里只读状态拼 View。

**卡片高于约 340pt。** 一瞥层会乱滚。深内容链回 App。

**超 30 秒还不报进度。** 新系统的长任务要包在 `performBackgroundTask` 里，并且持续写 `progress`。一静默，系统当卡死，收回延时。

**更新意图用 nil 当「清空」。** 语音没法清字段。用 `valueState`。

## 4. 屏幕和闹钟

**标注了 id 但实体不能导出。** 「把这个发给…」需要 `Transferable`，识别不等于能搬走。

**闹钟 / 通知 / 正在播放用了 `TransientAppEntity`。** 没有持久 id，挂不上。

**闹钟 Live Activity 没做 Widget Extension。** AlarmKit 若支持倒计时展示却没有对应 widget，系统可能直接把闹钟干掉，到点不响。见 [调度与 alarmUpdates](../04-AlarmKit/01-调度与alarmUpdates.md)。

## 5. 和快捷指令文件的边界

App Intent 解决不了「短信个人自动化把输入传进来」。那是快捷指令运行时的 `ExtensionInput`，见 [从电脑交到 iPhone](../03-快捷指令文件/02-从电脑交到iPhone.md)。

也解决不了「给没装你 App 的人一份可导入工作流」。那是签名后的 `.shortcut`。
