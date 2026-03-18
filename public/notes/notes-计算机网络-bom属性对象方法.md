## BOM是什么

→ 简单来说，就是个浏览器对象

## 常见的BOM属性

① location Object

**location.href** -- 返回或设置当前文档的 URL

**location.search** -- 返回 URL 中的查询字符串部分。例 如 [http://www.dreamdu.com/dreamdu.php?id=5&name=dreamdu](http://www.dreamdu.com/dreamdu.php?id=5&name=dreamdu) 返回包括(?)后面的 内容?id=5&name=dreamdu

**location.hash** -- 返回 URL#后面的内容，如果没有#，返回空

**location.host** -- 返回 URL 中的域名部分，例如 www.dreamdu.com

**location.hostname** -- 返回 URL 中的主域名部分，例如 dreamdu.com

**location.pathname** -- 返回 URL 的域名后的部分。例 如 [http://www.dreamdu.com/xhtml/](http://www.dreamdu.com/xhtml/) 返回/xhtml/

**location.port** -- 返回 URL 中的端口部分。例 如 [http://www.dreamdu.com:8080/xhtml/](http://www.dreamdu.com:8080/xhtml/) 返回 8080

**location.protocol** -- 返回 URL 中的协议部分。例 如 [http://www.dreamdu.com:8080/xhtml/](http://www.dreamdu.com:8080/xhtml/) 返回(//)前面的内容 http:

**location.assign** -- 设置当前文档的 URL location.replace() -- 设置当前文档的 URL，并且在 history 对象的地址列表中移除 这个 URL location.replace(url);

**location.reload()** -- 重载当前页面

## ②history 对象

**history.go()/ history.go(num);**  -- 前进或后退指定的页面数

**history.back()** -- 后退一页

**history.forward()** -- 前进一页

## ③Navigator 对象

**navigator.userAgent** -- 返回用户代理头的字符串表示(就是包括浏览器版本信息等 的字符串)

**navigator.cookieEnabled** -- 返回浏览器是否支持(启用)cookie