---
title: "plist 结构与控制流"
category: "04-AI-Agent/iOS快捷指令AI开发/03-快捷指令文件"
tags:
  - shortcuts
  - plist
publish:
  home: false
  docs: true
---

# plist 结构与控制流

> 快捷指令文件不是「一串自然语言步骤」，是一份带 UUID 和魔法变量的二进制 plist。Agent 漏一个 GroupingIdentifier，If 在手机上看就是空条件。

## 1. 文件长什么样

根字典最少要有动作数组、版本、图标。XML 可以拿来给人看，交到 iPhone 前通常还是写成二进制 plist。

关键字段：

- `WFWorkflowActions`：动作列表，顺序就是执行顺序
- `WFWorkflowName`：显示名
- `WFWorkflowClientVersion` / `WFWorkflowMinimumClientVersion`
- `WFWorkflowInputContentItemClasses`：能接什么输入（字符串、URL、App 内容…）
- `WFWorkflowTypes`：Watch、Action Extension 等表面

每个动作：

```xml
<dict>
    <key>WFWorkflowActionIdentifier</key>
    <string>is.workflow.actions.gettext</string>
    <key>WFWorkflowActionParameters</key>
    <dict>
        <key>UUID</key>
        <string>A1B2C3D4-E5F6-7890-ABCD-EF1234567890</string>
        <key>WFTextActionText</key>
        <string>Hello</string>
    </dict>
</dict>
```

UUID 用大写。后面要引用输出的动作必须带 UUID。

## 2. 魔法变量

引用上一步输出，不是把字符串拼进去，而是：

1. 源动作有 UUID
2. 目标字段是 `WFTextTokenString`
3. 字符串里用 U+FFFC（`￼`）占位
4. `attachmentsByRange` 的 key 是 `{起点, 长度}`，比如 `{0, 1}`

中文系统上，输出名要跟界面一致：「文本」「匹配」「重复项」。英文机是 `Text` / `Repeat Item`。对不准，快捷指令 App 里会显示空芯片。

If 的输入不能是裸的 `WFTextTokenAttachment`。必须包一层：

```python
"WFInput": {"Type": "Variable", "Variable": input_token}
"WFCondition": 100  # 有任何值
```

iOS 18 还要同步写 `WFConditions`（`WFContentPredicateTableTemplate`）。缺这层，界面上「条件」是空的，运行时可能直接走空分支，看起来像没执行。

## 3. 控制流

If / Repeat / 菜单靠两样东西绑在一起：

- `GroupingIdentifier`：同一段逻辑共用
- `WFControlFlowMode`：**必须是 integer**，0 开始、1 中间（否则 / case）、2 结束

对每个重复时，「重复项」指向 **Repeat 开始动作的 UUID**，不是 GroupingIdentifier。

匹配出多项时，用 Repeat Each 包消费方。不要把多个匹配结果拼成一个提醒标题，除非你就是要一条。

## 4. 两套动作标识

老动作：`is.workflow.actions.showresult`、`ask`、`askllm`、`downloadurl`…

系统 App Intent：包在 `is.workflow.actions.appintentexecution` 里，参数是 `AppIntentDescriptor`（BundleId + AppIntentIdentifier + 显示名）。例如时钟的 `CreateAlarmIntent` 走 `com.apple.clock`，不是 AlarmKit。

删照片这类动作参数名不规则（有的不叫 `WFInput`）。不要靠「所有动作都有 WFInput」去猜。

## 5. Checklist

- [ ] UUID 大写，输出动作都有 UUID
- [ ] `WFControlFlowMode` 是 `<integer>`
- [ ] If 的输入包了 `Type: Variable`
- [ ] 中文机魔法变量用中文输出名
- [ ] 编辑已签名文件时，优先在手机里改，避免拆开 AEA1
