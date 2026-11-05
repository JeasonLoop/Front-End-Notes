---
title: "调度与 alarmUpdates"
category: "04-AI-Agent/iOS快捷指令AI开发/04-AlarmKit"
tags:
  - alarmkit
  - app-intents
  - live-activity
publish:
  home: false
  docs: true
---

# 调度与 alarmUpdates

> 你点过来的文档页是这个属性：[AlarmManager.alarmUpdates](https://developer.apple.com/cn/documentation/alarmkit/alarmmanager/alarmupdates-swift.property)。它不是「闹钟 API 全集」，只是闹钟集合变化时的异步序列。真正干活的是授权、`AlarmConfiguration`、Widget Extension。

框架总览：[AlarmKit](https://developer.apple.com/cn/documentation/alarmkit)。配套示例：[Scheduling an alarm with AlarmKit](https://developer.apple.com/cn/documentation/alarmkit/scheduling-an-alarm-with-alarmkit)（WWDC25 session 230）。

## 1. 它解决什么

AlarmKit 用来安排 **能盖过专注模式和静音** 的闹钟 / 倒计时。支持一次性、按周重复、立刻开始的 timer，可选贪睡。UI 可以走系统模板，也可以用小组件做 Live Activity（灵动岛、锁屏、待机）。

这和快捷指令里的 `CreateAlarmIntent`（系统时钟）不是同一个商店。

## 2. 授权

Info.plist 必须有 `NSAlarmKitUsageDescription`，而且不能是空字符串，否则 **无法调度**。文案会出现在系统授权框。

可以主动 `AlarmManager.shared.requestAuthorization()`。用户加第一只闹钟时，系统也会代为请求。没授权就 `schedule`，闹钟不会响。

授权变化另有 `authorizationUpdates` / `authorizationState`。

## 3. 调度

`Alarm` 描述一只闹钟：倒计时时长、日程、状态。`AlarmManager.AlarmConfiguration` 把日程或倒计时、展示属性、可选自定义铃声、可选二次按钮 Intent 打成一包，交给：

```swift
try await AlarmManager.shared.schedule(id: alarmID, configuration: configuration)
```

用自己的 UUID 追踪。按钮的停止 / 倒计时由系统按按钮类型处理；额外动作用二次 Intent。文档写明：二次 Intent **首次解锁之后** 才可用。

三种展示：alert（必做）、countdown / paused（可选）。只有 alert 的闹钟可以不做后两种。着色用 tint，用来和别的 App 的闹钟区分，系统也会把 alert 转到配对的 Apple Watch。

**只要你做了 countdown 展示，就必须有 Widget Extension。** 官方警告：没有的话系统可能直接解散闹钟，到点不响。Extension 收到的就是你 schedule 时那份 attributes / metadata。

## 4. alarmUpdates 怎么用

签名：

```swift
var alarmUpdates: some AsyncSequence<[Alarm], Never> { get }
```

平台：iOS / iPadOS / Mac Catalyst。文档说明：闹钟响、贪睡、关掉时用它收通知。

实践上，在管理器初始化时订阅，App 没在前台时状态变了，回来也能对齐。

配套还有：

- `alarms`：向 daemon 拉 **当前属于你这个 client** 的闹钟。**一次性闹钟响完并 stop 后会从 daemon 存储里删掉。** 要知道「响过没有」，自己持久化一份，再和 `alarms` 做差集。缺的那些就是已经响过的。
- 状态操作：`cancel` / `countdown` / `pause` / `resume` / `stop`

不在 `alarmUpdates` 序列里出现的 id，视为不再被 AlarmKit 调度。

不要用轮询 `alarms` 代替这个序列。`alarms` 适合启动时对账和判断 one-shot 是否已经响完。

## 5. 和 Siri / 快捷指令接上

创建 configuration 时带上实体的 `appEntityIdentifier`（真 `AppEntity`，不要 `TransientAppEntity`）。响铃时用户才能说「贪睡它」「关掉这个」。

若还想让快捷指令 / Siri 安排你 App 里的闹钟，再包一层自己的 `AppIntent` 去调 `AlarmManager.schedule`。不要让 Agent 去改系统时钟闹钟的 plist 来「集成 AlarmKit」。

## 6. Checklist

- [ ] `NSAlarmKitUsageDescription` 非空，授权过
- [ ] countdown 展示配了 Widget Extension
- [ ] 启动订阅 `alarmUpdates`，one-shot 另有本地账本
- [ ] 闹钟实体 id 写进 `AlarmConfiguration`
- [ ] 没把系统时钟快捷指令当成 AlarmKit
