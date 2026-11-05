---
title: "实体、查询与屏幕上下文"
category: "04-AI-Agent/iOS快捷指令AI开发/02-App-Intents"
tags:
  - app-intents
  - app-entity
  - alarmkit
  - siri
publish:
  home: false
  docs: true
---

# 实体、查询与屏幕上下文

> Siri 要能说「打开这篇」「贪睡这个闹钟」，你得先告诉系统：东西叫什么、怎么查、屏幕上正在看哪一个。实体是透镜，不是第二套数据库。

官方：[App entities](https://developer.apple.com/cn/documentation/appintents/app-entities)，屏幕与跨 App 内容：[Apple Intelligence and Siri AI](https://developer.apple.com/cn/documentation/appintents/apple-intelligence-and-siri-ai)。

## 1. 选实体类型

| 数据形态 | 用什么 |
| --- | --- |
| 编译期固定几个值 | `AppEnum` |
| 有稳定 id 的业务对象 | `AppEntity` |
| 还要进 Spotlight / 语义索引 | 再加 `IndexedEntity` |
| 东西本身就是文件 | `FileEntity` |
| 临时汇总、没有稳定 id | `TransientAppEntity` |
| 要给别的 App 用 | 再加 `Transferable` |

**不要让 SwiftData `@Model` 自己 conform `AppEntity`。** 影子 struct 映射字段，查询边界上再转换。`ModelContext` 不能跨 actor 传，传 `ModelContainer`，到了目标 actor 再新建 context。

用户能筛、能排序、能出现在参数摘要里的字段，必须 `@Property` 或 `@ComputedProperty`。普通存储属性对 App Intents 是隐形的，快捷指令「使用模型」也看不到。

贵的计算（网络、推理）用 `@DeferredProperty`，系统问到再算。

## 2. 查询怎么配

每个实体查询都要实现 `entities(for identifiers:)`。缺了这个，快捷指令里选中的参数解析会坏。

- 集合很小：`EnumerableEntityQuery`，顺便得到基础 Find
- 量大、按名字搜：`EntityQuery` + `EntityStringQuery`
- 用户要自己拼条件：`EntityPropertyQuery`（系统生成带比较符的 Find）
- 只按 id 取：`UniqueIDEntityQuery`
- 数据在服务端或易变、没法预索引：`IntentValueQuery`，可配合 `@UnionValue` 返回多种类型
- 视觉智能 / 圈选识物：`IntentValueQuery` + `SemanticContentDescriptor`

Siri 找内容的三条路（可混用）：

1. **语义索引（首选）**：`IndexedEntity` + `indexAppEntities`。创建时索引，展示字段变了再索引，删了要删索引。
2. **结构化搜索**：`IntentValueQuery`。
3. **App 内搜索 UI**：`@AppIntent(schema: .system.searchInApp)` + `ShowInAppSearchResultsIntent`。

跨设备对话里要被指认的实体，考虑 `SyncableEntity`（稳定 id，比如服务端 UUID / CloudKit）。别人能看到的内容再加 `OwnershipProvidingEntity`，否则 Siri 默认当私有，可能跳过确认。

大批量参数不要传 `[Entity]` 去解析全对象，用 `EntityCollection` 只带 id，`perform()` 里需要全对象再 `resolvedEntities()`。

## 3. 屏幕上的「这个」

系统能 OCR 屏幕上的字，但不知道哪块 UI 是哪条实体。要标注。

按形态选 API：

1. **一屏一件事**（详情页）：`.userActivity(_:element:)`，写上 `appEntityIdentifier`。也是旧系统的兼容路径。
2. **少量卡片**：每个子视图 `.appEntityIdentifier(_:)`。
3. **长列表**：标容器 `.appEntityIdentifier(forSelectionType:)`，懒加载 id，滚出屏幕的选中项还能指认。
4. **Canvas / CALayer**：`.appEntityUIElements`，按可见矩形 / 选中返回 `AppEntityUIElement`。

列表场景给查询补 `displayRepresentations(for:requestedComponents:)`。Siri 说「第三个」往往只要标题，别每次走完整 `entities(for:)` 再查库加载封面。

只标注不够。要「把这个发给某某」「导航到这里」，实体还得 `Transferable`。文件用 `FileRepresentation`；坐标、联系人这种没有文件格式的，用 `IntentValueRepresentation` 接到 `PlaceDescriptor` / `IntentPerson`。

## 4. 通知、正在播放、闹钟

同一套 `EntityIdentifier` 还可以挂到系统表面：

- 通知：`UNMutableNotificationContent.appEntityIdentifier`
- 正在播放：`MPNowPlayingInfoPropertyAppEntityIdentifiers`，**从最具体到最宽**（歌 → 艺人 → 播放列表）
- **AlarmKit**：创建闹钟时把实体 id 放进 `AlarmConfiguration`，响铃时才能说「贪睡它」

这几处 **不能用 `TransientAppEntity`**，它们靠持久 id。自己给系统类型加 `AppEntityAnnotatable` 也没用，只有 Apple 接好的那些类型会送上下文。

闹钟调度细节见 [调度与 alarmUpdates](../04-AlarmKit/01-调度与alarmUpdates.md)。

## 5. Checklist

- [ ] 实体是影子 struct，不是 `@Model`
- [ ] 查询实现了 `entities(for:)`
- [ ] 模型该看见的字段都有 `@Property`
- [ ] 详情 / 列表 / 画布用了对应的屏幕标注
- [ ] 闹钟、通知、正在播放挂的是真 `AppEntity` id
