---
title: 安装与环境配置
category: 后端
---
# 安装与环境配置

## JDK 下载与安装

### 1. 选择 JDK 版本

| 类型 | 说明 | 推荐度 |
|------|------|--------|
| Oracle JDK | 官方版本，商业使用需授权 | ⭐⭐⭐ |
| OpenJDK | 开源版本，免费 | ⭐⭐⭐⭐⭐ |
| Amazon Corretto | Amazon 维护的 OpenJDK | ⭐⭐⭐⭐⭐ |
| Microsoft Build of OpenJDK | Microsoft 维护 | ⭐⭐⭐⭐ |
| Eclipse Temurin | Eclipse 基金会维护 | ⭐⭐⭐⭐⭐ |

**推荐**：Eclipse Temurin（AdoptOpenJDK 继任者）或 Amazon Corretto

### 2. Windows 安装

#### 下载

```bash
# 访问官网下载
https://adoptium.net/temurin/releases/

# 选择 Java 17 LTS 版本
# 下载 .msi 安装包
```

#### 安装步骤

```
1. 运行下载的 .msi 文件
2. 勾选 "Set JAVA_HOME environment variable"
3. 勾选 "Add to PATH"
4. 点击 Install 完成安装
```

#### 验证安装

```bash
# 检查 Java 版本
java -version

# 输出示例
java version "17.0.8" 2023-07-18 LTS
Java(TM) SE Runtime Environment (build 17.0.8+9-LTS-198)
Java HotSpot(TM) 64-Bit Server VM (build 17.0.8+9-LTS-198, mixed mode, sharing)

# 检查编译器
javac -version

# 输出示例
javac 17.0.8
```

### 3. macOS 安装

```bash
# 使用 Homebrew 安装
brew install openjdk@17

# 创建软链接
sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk

# 设置 JAVA_HOME
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 17)' >> ~/.zshrc
source ~/.zshrc

# 验证
java -version
```

### 4. Linux 安装

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install openjdk-17-jdk

# CentOS/RHEL
sudo yum install java-17-openjdk-devel

# 验证
java -version
javac -version
```

## 环境变量配置

### Windows 环境变量

```bash
# 1. 右键"此电脑" → 属性 → 高级系统设置 → 环境变量

# 2. 新建系统变量 JAVA_HOME
变量名: JAVA_HOME
变量值: C:\Program Files\Eclipse Adoptium\jdk-17.0.8.101-hotspot\

# 3. 编辑 Path 变量，添加
%JAVA_HOME%\bin
```

### macOS/Linux 环境变量

```bash
# 编辑配置文件 ~/.zshrc 或 ~/.bashrc
nano ~/.zshrc

# 添加以下内容
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH=$JAVA_HOME/bin:$PATH

# 使配置生效
source ~/.zshrc
```

### 验证配置

```bash
# Windows
echo %JAVA_HOME%

# macOS/Linux
echo $JAVA_HOME

# 输出示例
/Library/Java/JavaVirtualMachines/openjdk-17.jdk/Contents/Home
```

## 开发工具安装

### 1. IntelliJ IDEA（推荐）

```
Community Edition（免费）
├── 支持 Java/Kotlin 开发
├── 基础功能完整
└── 适合学习和小项目

Ultimate Edition（收费）
├── 包含 Community 所有功能
├── Spring Boot 支持
├── 数据库工具
└── Web 开发支持
```

下载：https://www.jetbrains.com/idea/

### 2. VS Code + 插件

```bash
# 安装推荐插件
- Extension Pack for Java
- Spring Boot Extension Pack
- Maven for Java
- Gradle for Java
```

### 3. 构建工具

```bash
# Maven
# 下载：https://maven.apache.org/download.cgi
# 解压后配置环境变量 MAVEN_HOME

# Gradle
# 使用 SDKMAN 安装（Linux/macOS）
curl -s "https://get.sdkman.io" | bash
sdk install gradle 8.3

# Windows 使用 Chocolatey
choco install gradle
```

## Java 程序结构

```
MyProject/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── example/
│       │           ├── Main.java
│       │           └── model/
│       │               └── User.java
│       └── resources/
│           └── application.properties
└── pom.xml  (Maven) 或 build.gradle (Gradle)
```

## 第一个 Java 程序

### 命令行方式

```java
// HelloWorld.java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
```

```bash
# 编译
javac HelloWorld.java

# 运行
java HelloWorld

# 输出
Hello, Java!
```

### Maven 项目方式

**pom.xml**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>my-java-app</artifactId>
    <version>1.0.0</version>
</project>
```

```bash
# 创建项目结构
mkdir -p src/main/java/com/example

# 编译
mvn compile

# 运行
mvn exec:java -Dexec.mainClass="com.example.HelloWorld"
```

## 常见问题

### Q1: java 与 javac 命令找不到？

```bash
# 检查 JAVA_HOME 是否配置正确
echo $JAVA_HOME  # macOS/Linux
echo %JAVA_HOME% # Windows

# 检查 PATH 是否包含 Java bin
echo $PATH
```

### Q2: 多个 JDK 版本如何切换？

```bash
# macOS/Linux 使用 jenv
brew install jenv
jenv add /Library/Java/JavaVirtualMachines/openjdk-17.jdk/Contents/Home
jenv add /Library/Java/JavaVirtualMachines/openjdk-11.jdk/Contents/Home
jenv global 17

# Windows 使用 setx 命令切换
setx JAVA_HOME "C:\Program Files\Eclipse Adoptium\jdk-17.0.8.101-hotspot\"
```

### Q3: IDEA 无法识别 JDK？

```
File → Project Structure → Project Settings → Project SDK
→ Add JDK → 选择 JDK 安装目录
```

## 参考资源

- [Eclipse Temurin 官网](https://adoptium.net/)
- [IntelliJ IDEA 官网](https://www.jetbrains.com/idea/)
- [Maven 官方文档](https://maven.apache.org/)
- [Gradle 官方文档](https://docs.gradle.org/)

---

## 下一篇

[基础语法](./基础语法.md)
