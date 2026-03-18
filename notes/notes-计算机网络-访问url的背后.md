
基本流程：

![](https://cdn.nlark.com/yuque/0/2023/png/32650608/1679020217801-61ba9af4-b19d-4449-a138-a6c3472b5bef.png)

### ①DNS解析

🔷 **浏览器首先搜索浏览器自身缓存的DNS记录，如果浏览器缓存中没有找到需要的记录或记录已经过期，则搜索hosts文件和操作系统缓存。**

**PS**：

在Windows操作系统中，可以通过 ipconfig /displaydns 命令查看本机当前的缓存。

通过hosts文件，你可以手动指定一个域名和其对应的IP解析结果，并且该结果一旦被使用，同样会被缓存到操作系统缓存中。

Windows系统的hosts文件在%systemroot%\system32\drivers\etc下，linux系统的hosts文件在/etc/hosts下。

🔷 **如果在hosts文件和操作系统缓存中没有找到需要的记录或记录已经过期，则向** [域名解析](https://so.csdn.net/so/search?q=%E5%9F%9F%E5%90%8D%E8%A7%A3%E6%9E%90&spm=1001.2101.3001.7020) **服务器发送解析请求。**

其实第一台被访问的域名解析服务器就是我们平时在设置中填写的DNS服务器一项，当操作系统缓存中也没有命中的时候，系统会向DNS服务器正式发出解析请求。这里是真正意义上开始解析一个未知的域名。

一般一台域名解析服务器会被地理位置临近的大量用户使用（特别是ISP的DNS），一般常见的网站域名解析都能在这里命中。

🔷 **如果域名解析服务器也没有该域名的记录，则开始递归+迭代解析。**

解析域名：

![](https://cdn.nlark.com/yuque/0/2023/png/32650608/1679020241278-13053e83-d4d9-4884-ae55-91c9e7ed7ce7.png)

根域服务器告诉我们com域服务器的IP。

接着我们的域名解析服务器会向com域服务器发出请求。根域服务器并没有mail.google.com的IP，但是却有google.com域服务器的IP。

接着我们的域名解析服务器会向google.com域服务器发出请求，如此重复，直到获得mail.google.com的IP地址

获取对应域名的IP后，一步一步向上返回，知道返回给浏览器

### ②发起TCP请求

浏览器会选择一个大于1024的本机端口向目标IP地址的80端口发起TCP连接请求。经过标准的TCP握手流程，建立TCP连接。

![](https://cdn.nlark.com/yuque/0/2023/png/32650608/1679020252895-2aae1e5b-c572-47d8-9ac0-7fdfaf6c5455.png)

完整Link

[https://blog.csdn.net/g291976422/article/details/88984859](https://blog.csdn.net/g291976422/article/details/88984859)