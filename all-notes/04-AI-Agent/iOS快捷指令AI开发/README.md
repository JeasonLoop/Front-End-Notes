---
title: "iOS 快捷指令 AI 开发"
category: "04-AI-Agent/iOS快捷指令AI开发"
tags:
  - ios
  - shortcuts
  - app-intents
  - alarmkit
  - apple-intelligence
publish:
  home: true
  docs: true
---

# iOS 快捷指令 AI 开发

用 AI 写 iOS 自动化，容易把三件事揉成一团：用户在「快捷指令」App 里拖的工作流、App 用 Swift 暴露给系统的 App Intents、以及闹钟这种必须走系统框架的能力。揉在一起，Agent 就会发明不存在的 API，或者给你一份签不了名的 plist。

这组笔记按这条线拆开写：

1. 先选层：什么该写 App Intent，什么该生成 `.shortcut`，什么必须走 AlarmKit。
2. 再写 App 侧：动作、实体、Siri / Apple Intelligence、常见翻车。
3. 然后才是快捷指令文件：plist、变量、签名、自动化输入。
4. 闹钟单独一章：`AlarmManager.alarmUpdates` 这类东西和 Shortcuts 里的「创建闹钟」不是一回事。
5. 最后才是 Agent 工作流：该加载哪类 skill、怎么验收。

官方入口：[Apple 文档中文站](https://developer.apple.com/cn/documentation)。App Intents：[App Intents](https://developer.apple.com/cn/documentation/appintents)。闹钟：[AlarmKit](https://developer.apple.com/cn/documentation/alarmkit)。

社区 skill（给 Agent 看的说明书，不是官方 SDK）：[n0an/App-Intents-Agent-Skill](https://github.com/n0an/App-Intents-Agent-Skill)。

## 目录

### 01 地图与选型
- [三层能力怎么选](./01-地图与选型/三层能力怎么选.md)

### 02 App Intents
- [意图与快捷指令入口](./02-App-Intents/01-意图与快捷指令入口.md)
- [实体、查询与屏幕上下文](./02-App-Intents/02-实体查询与屏幕上下文.md)
- [Apple Intelligence 与 Use Model](./02-App-Intents/03-Apple-Intelligence与Use-Model.md)
- [常见翻车](./02-App-Intents/04-常见翻车.md)

### 03 快捷指令文件
- [plist 结构与控制流](./03-快捷指令文件/01-plist结构与控制流.md)
- [从电脑交到 iPhone](./03-快捷指令文件/02-从电脑交到iPhone.md)
- [Ask LLM 与执行 App Intent](./03-快捷指令文件/03-Ask-LLM与执行AppIntent.md)

### 04 AlarmKit
- [调度与 alarmUpdates](./04-AlarmKit/01-调度与alarmUpdates.md)

### 05 Agent 工作流
- [怎么让 AI 写对](./05-Agent工作流/01-怎么让AI写对.md)

## 先记住的三条

- **写 Swift 动作，不要手搓 Shortcuts plist。** 用户装完 App 就要能对 Siri 说、能在快捷指令库里看到，走 `AppIntent` + `AppShortcutsProvider`。
- **写给自己用的工作流，再生成 `.shortcut`。** 那是二进制 plist，现网 iOS 不收未签名文件。
- **要响铃盖过静音 / 专注模式，走 AlarmKit，不要指望通知或普通快捷指令。** 状态用 `alarmUpdates` 听，不要轮询完事当真相。
