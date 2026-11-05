---
title: "意图与快捷指令入口"
category: "04-AI-Agent/iOS快捷指令AI开发/02-App-Intents"
tags:
  - app-intents
  - siri
  - shortcuts
publish:
  home: false
  docs: true
---

# 意图与快捷指令入口

> 写了 `AppIntent` 不等于 Siri 听得见。系统是通过 `AppShortcutsProvider` 发现你的，不是扫一遍工程里的 struct。

## 1. 最小意图

官方要求每个意图至少做到：有 `perform()`、返回结果或错误、声明参数、给人看的标题。起步文档：[Getting started](https://developer.apple.com/cn/documentation/appintents/getting-started-with-the-app-intents-framework)。

```swift
import AppIntents

struct RefreshFeedIntent: AppIntent {
    static let title: LocalizedStringResource = "刷新信息流"
    static let description = IntentDescription(
        "拉取订阅源的最新文章。",
        categoryName: "阅读",
        searchKeywords: ["刷新", "同步"],
        resultValueName: "文章"
    )

    func perform() async throws -> some IntentResult {
        .result()
    }
}
```

几个容易混的开关：

- `isDiscoverable = false`：给小组件按钮、Snippet 按钮、内部调用用。不进用户的快捷指令库。
- `openAppWhenRun`：跑完把 App 拉起来。真正「打开某一条内容」优先用 `OpenIntent`。
- 标题 `title` 出现在快捷指令动作列表；`AppShortcut.shortTitle` 出现在主页磁贴和 Siri 的「我能在这做什么」。

`perform()` 默认不在主线程。要碰 UI / SwiftData 上下文，自己标 `@MainActor`，或把活丢给注入进来的数据层。

## 2. 必须注册 App Shortcut

```swift
struct ReaderShortcuts: AppShortcutsProvider {
    static let shortcutTileColor: ShortcutTileColor = .blue

    static var appShortcuts: [AppShortcut] {
        AppShortcut(
            intent: RefreshFeedIntent(),
            phrases: [
                "在 \(.applicationName) 刷新信息流",
                "用 \(.applicationName) 拉取新文章"
            ],
            shortTitle: "刷新信息流",
            systemImageName: "arrow.clockwise"
        )
    }
}
```

规则：

- **一个 App 只能有一个 `AppShortcutsProvider`。** 编译期扫出来的。
- **每条短语都要带 `\(.applicationName)`。** 宏会拦：没有 App 名就会和系统指令撞车。「五分钟后提醒我」属于时钟，不是你的 App。
- 不要手写 App 名字符串，改名会裂。
- 数组第一条短语是主短语：快捷指令主页磁贴、Siri 回答「用某某能做什么」都用它。
- 上限大约 **10 条 App Shortcut**、**1000 条展开后的短语**。`"打开 \(\.$folder) 于 \(.applicationName)"` 有 20 个文件夹，就算 20 条。
- 至少留一条 **不带参数** 的短语。带实体参数的短语要等 App 跑过一次、`updateAppShortcutParameters()` 填了缓存，才进 Spotlight。

实体增删改名之后要刷新缓存：

```swift
@main
struct ReaderApp: App {
    init() {
        ReaderShortcuts.updateAppShortcutParameters()
        // 同时在这里注册 AppDependencyManager，不要放到 .onAppear
    }
}
```

iOS 17+ 用专门的 AppShortcuts String Catalog 做本地化，不同语言条数可以不一样。Xcode 里用 **Product > App Shortcuts Preview** 调短语，比对着模拟器喊快。

更多：[App Shortcuts](https://developer.apple.com/cn/documentation/appintents/app-shortcuts)。

## 3. 选哪种子协议

| 需求 | 协议 |
| --- | --- |
| 普通动作 | `AppIntent` |
| 打开某一条内容 | `OpenIntent`（iOS 上常再加 `TargetContentProvidingIntent`） |
| 只渲染摘要卡片 | `SnippetIntent` |
| 跑到一半必须出 UI | iOS 26+ 用 `supportedModes` + `continueInForeground`；老系统用 `ForegroundContinuableIntent` |
| 超过约 30 秒 | 新系统文档里的 `LongRunningIntent` + `performBackgroundTask`，进度必须持续上报 |
| 小组件配置 | `WidgetConfigurationIntent`（不要注册进 App Shortcuts） |
| 控制中心 | `ControlConfigurationIntent` |
| 已有万能链接 | `URLRepresentableIntent` + `URLRepresentableEntity`，系统走现有链接，不必再写 `perform()` |

系统表面触发的意图大约 **30 秒** 预算（macOS 没有同样的硬限制）。超时就被杀掉。不要用裸 `Task {}` 续命，后台扩展罩不住脱离管理的任务。

Intent 的 `App` 初始化在意图跑起来时就会执行，哪怕 UI 没出来。`ModelContainer`、依赖注入、日志，都放 `init()`，别放 `.task` / `.onAppear`。

## 4. 设计习惯

同一件用户动作，只暴露一个意图，用参数区分对象。官方例子：不要「播放歌曲」和「播放专辑」两个意图，做一个「播放」再带参数。

能对上系统 domain schema 的，优先 `@AppIntent(schema:)`，少写短语、Siri 更好认。对不上再写自定义意图。

小组件按钮、Snippet 刷新、应用内 `Button(intent:)` 都该打到同一条 `perform()`。这是「意图当动作层」，不是框架强制，但改一次处处生效。改了数据还要 `WidgetCenter.shared.reloadAllTimelines()`。

## 5. Checklist
- [ ] 用户能喊到的动作，已经进唯一的 `AppShortcutsProvider`
- [ ] 短语带 `\(.applicationName)`，第一条是人话
- [ ] 内部按钮意图 `isDiscoverable = false`
- [ ] 冷启动时 `App.init()` 里依赖和 `updateAppShortcutParameters()` 都就绪
