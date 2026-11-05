---
title: "从电脑交到 iPhone"
category: "04-AI-Agent/iOS快捷指令AI开发/03-快捷指令文件"
tags:
  - shortcuts
  - signing
  - automation
publish:
  home: false
  docs: true
---

# 从电脑交到 iPhone

> 在电脑上把 plist 调通，只完成了一半。现网 iOS 不收未签名快捷指令；个人自动化的输入也不会因为你「匹配过正则」就自动接上。

## 1. 读别人的分享

iCloud 分享页的 HTML 里没有动作。正确路径：

1. 从 URL 抽出 32 位 hex id
2. `GET https://www.icloud.com/shortcuts/api/records/<id>`
3. 下 `fields.shortcut`（未签名，通常 `bplist00`）
4. 需要安装包再下 `fields.signedShortcut`（AEA1）

只 dump 未签名那份。AEA1 是加密归档，当 plist 打开会失败。

## 2. 签名

官方命令只在 **装了快捷指令、且登录了 iCloud 的 Mac** 上：

```bash
shortcuts sign --mode anyone --input in.shortcut --output signed.shortcut
```

签完的文件以 `AEA1` 开头，带证书链。不要改已签名文件再拿去用，签名罩的是整包。

没有 Mac 时，社区有把 XML plist POST 到 RoutineHub HubSign 的做法。这是第三方，不是 Apple 官方：

- 快捷指令 XML 会离开你的机器。**token、短信原文、cookie 不要送去签**
- 服务可能 403 / 410 / 挂掉
- iPhone 仍可能要：设置 → 快捷指令 → 允许不受信任的快捷指令

用户已经有一份能跑的签名版、只改一小处时，优先在手机里改，保住 Apple 签名。

导入：隔空投送 / 文件 / 邮件发 `*.signed.shortcut`。未签名 plist 不要再当安装路径讲一遍。

## 3. 设备绑定

提醒事项列表的 `WFCalendarDescriptor.Identifier` 是 **这台机** 的 UUID。不要从另一部 iPhone 拷。默认列表就省略这个字段。指定列表让用户在「添加新提醒」里自己选一次，导入问答成功不等于运行时绑上了。只写 `{"Title": "取货码"}` 也不够。

日历、相册、App 同理。导入后要真的跑一遍，看记录有没有写进去。

## 4. 短信个人自动化

这是最多假进度的场景。

- 触发器「收到信息」+ 过滤「包含某某」只决定跑不跑，**不会**自动填快捷指令输入
- 自动化里「运行快捷指令」必须带上蓝色的「输入快捷指令的信息」
- 被调用的快捷指令第一个真正动作应是「获取文本」，输入是 `ExtensionInput`。界面应显示「从 输入快捷指令的信息 获取文本」
- 不要用剪贴板或写死样例顶替触发输入，除非用户明确要手动模式，且两条分支都在真机测过
- 一份 `.shortcut` **装不上、也改不了** 个人自动化

真机分步验：

1. 发一条真短信，确认自动化跑了且内容传进来
2. 看「获取文本」结果
3. 看匹配和每个重复项
4. 看「添加新提醒」是否一条码一个标题、写到对的列表

手动粘贴成功只证明匹配和写提醒，不证明自动化输入。Python 正则通过更不能当运行时证据。权限没给提醒事项，导入成功也会静默失败。

后台跑就不要「打开提醒事项」「返回主屏幕」。停快捷指令足够结束。

## 5. Checklist

- [ ] 交给手机的文件以 `AEA1` 开头
- [ ] 含密钥的 plist 没有走第三方签名
- [ ] 提醒列表在这台 iPhone 上重绑并写出过一条
- [ ] 短信路径用真短信验过，不是只验了粘贴
