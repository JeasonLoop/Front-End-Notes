---
title: "怎么让 AI 写对"
category: "04-AI-Agent/iOS快捷指令AI开发/05-Agent工作流"
tags:
  - ai-agent
  - skills
  - shortcuts
  - app-intents
publish:
  home: false
  docs: true
---

# 怎么让 AI 写对

> Skill 是给模型的说明书，不是 SDK。一次只开和当前层匹配的那份，否则它会在 Swift 意图、plist、闹钟框架之间来回编。

## 1. 先定层再开 skill

对照 [三层能力怎么选](../01-地图与选型/三层能力怎么选.md)。

| 你要的 | 让 Agent 读什么 | 不要让它做 |
| --- | --- | --- |
| App 对 Siri / 快捷指令暴露动作 | [n0an/App-Intents-Agent-Skill](https://github.com/n0an/App-Intents-Agent-Skill) + [App Intents 文档](https://developer.apple.com/cn/documentation/appintents) | 生成 `.shortcut` 冒充 App 入口 |
| 用户工作流文件 | 快捷指令生成 / 检查 plist 的 skill（动作表、控制流、签名） | 发明未签名就能装的安装路径 |
| App 内闹钟 | [AlarmKit](https://developer.apple.com/cn/documentation/alarmkit) + 本目录闹钟章 | 用通知或 `CreateAlarmIntent` 顶替 |

App Intents skill 自己也是按任务拆 reference 的：先写意图只读 fundamentals + shortcuts-and-siri；接模型再读 assistant-schemas；屏幕指认读 onscreen-awareness。别整包塞进上下文。

官方总入口：[developer.apple.com/cn/documentation](https://developer.apple.com/cn/documentation)。中文站和英文站同一套 doc 标识，链接用 `/cn/documentation/...` 即可。

## 2. 提示词里写死的约束

给 Agent 的第一段就写清楚平台和验收，避免它默认 macOS `shortcuts sign` 或 SiriKit：

```
目标：iOS App Intents（不是 SiriKit，不是手搓快捷指令 plist）。
短语必须含 \(.applicationName)。
实体用影子 struct，不要让 SwiftData @Model conform AppEntity。
依赖在 App.init 注入。
内部按钮意图 isDiscoverable = false。
```

生成快捷指令时改成：

```
目标：未签名 plist + 可导入的 AEA1 签名文件。
If 的 WFInput 必须包 Type=Variable。
WFControlFlowMode 用 integer。
中文系统输出名用「文本」「重复项」。
不要把短信自动化输入改成剪贴板。
含隐私内容不要走第三方签名。
```

闹钟：

```
目标：AlarmKit，不是时钟 App。
Info.plist 写 NSAlarmKitUsageDescription。
countdown 必须带 Widget Extension。
状态听 alarmUpdates；one-shot 响完会从 daemon 消失，本地自己记账。
```

## 3. 验收不要只看「能生成」

**App Intent：** Xcode 能编过；App Shortcuts Preview 能匹配短语；真机 Siri 喊主短语；冷启动（杀进程）再跑意图，数据层还在。

**快捷指令：** 文件头是 `AEA1`；导入后 If 条件不是空芯片；魔法变量点得开；自动化场景必须用真触发源，不要用粘贴代替。

**AlarmKit：** 授权框文案对；专注模式开启时仍能响；有 countdown 时锁屏 / 灵动岛有 Live Activity；`alarmUpdates` 在 App 回前台后能跟上。

## 4. 版本实话

社区 skill 会写到「27 releases / WWDC 2026」一类 API（长任务意图、EntityCollection、AppIntentsTesting…）。那是给跟新系统的 Agent 用的检查清单。你当前最低版本到不了，就明确告诉它 target OS，让它走 iOS 16–18 那套：`AppIntent` + `AppShortcutsProvider` + `IndexedEntity` + `ForegroundContinuableIntent`，不要硬上只有更新系统才有的协议。

AlarmKit 本身是较新的闹钟框架，以你点的这份文档和 WWDC25 session 230 为准，不要用 UserNotifications 知识去补全。

## 5. Checklist

- [ ] 任务只落在一层，skill 没有三份一起开
- [ ] 提示词写了「不要 SiriKit / 不要未签名安装 / 不要通知冒充闹钟」里对应的那条
- [ ] 验收包含真机或至少 App Shortcuts Preview / 签名文件头，而不是只看仓库 diff
