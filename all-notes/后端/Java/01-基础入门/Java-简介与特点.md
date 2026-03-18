# Java 简介与特点

## Java 概述

Java 是一种广泛使用的面向对象编程语言，由 Sun Microsystems（现 Oracle）于 1995 年发布。它具有"一次编写，到处运行"的特性。

### Java 发展历程

| 版本 | 发布时间 | 重要特性 |
|------|----------|----------|
| Java 1.0 | 1996 | 初始版本 |
| Java 5 | 2004 | 泛型、枚举、注解 |
| Java 8 | 2014 | Lambda、Stream API |
| Java 11 | 2018 | LTS 版本，模块化 |
| Java 17 | 2021 | LTS 版本，记录类 |
| Java 21 | 2023 | LTS 版本，虚拟线程 |

## Java 核心特点

### 1. 跨平台性

```java
// 一次编写，到处运行
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

Java 源代码（.java） → 编译器 → 字节码（.class） → JVM → 各平台机器码

### 2. 面向对象

```java
// 类、继承、封装、多态
public class Animal {
    protected String name;

    public Animal(String name) {
        this.name = name;
    }

    public void makeSound() {
        System.out.println("动物发出声音");
    }
}

public class Dog extends Animal {
    public Dog(String name) {
        super(name);
    }

    @Override
    public void makeSound() {
        System.out.println(name + " 汪汪叫");
    }
}
```

### 3. 自动内存管理

```java
// 无需手动管理内存，GC 自动回收
public class MemoryDemo {
    public static void main(String[] args) {
        // 创建对象，GC 会自动回收不再使用的对象
        List<String> list = new ArrayList<>();
        for (int i = 0; i < 10000; i++) {
            list.add("Item " + i);
        }
        // 方法结束后，list 对象会被 GC 回收
    }
}
```

### 4. 多线程支持

```java
// 内置多线程支持
public class ThreadDemo {
    public static void main(String[] args) {
        Thread thread = new Thread(() -> {
            for (int i = 0; i < 5; i++) {
                System.out.println("子线程: " + i);
            }
        });

        thread.start(); // 启动线程

        for (int i = 0; i < 5; i++) {
            System.out.println("主线程: " + i);
        }
    }
}
```

### 5. 强大的生态系统

```
Java 生态系统
├── Spring Framework  — 企业级开发框架
├── Hibernate/JPA     — ORM 持久层
├── Netty             — 高性能网络框架
├── Maven/Gradle      — 构建工具
├── JUnit/TestNG      — 测试框架
├── Log4j/SLF4J       — 日志框架
└── Elasticsearch     — 搜索引擎
```

## Java vs 其他语言

| 特性 | Java | Go | Python |
|------|------|-----|--------|
| 类型系统 | 强类型 | 强类型 | 动态类型 |
| 编译方式 | 编译+解释 | 编译 | 解释 |
| 运行速度 | 较快 | 最快 | 较慢 |
| 学习曲线 | 中等 | 简单 | 最简单 |
| 生态成熟度 | 最成熟 | 发展中 | 成熟 |
| 并发模型 | 线程模型 | 协程模型 | 多线程 |
| 适用场景 | 企业级应用 | 云原生/微服务 | 数据科学/AI |

## Java 应用领域

```
企业应用后端
├── Web 应用（电商、社交）
├── 微服务架构
├── 大数据处理（Hadoop、Spark）
├── 移动开发（Android，已转向 Kotlin）
├── 物联网（IoT）
└── 金融科技
```

## Java 版本选择建议

### 推荐使用 LTS 版本

| 场景 | 推荐版本 | 理由 |
|------|----------|------|
| 新项目 | Java 17 或 21 | 长期支持，性能优秀 |
| 企业生产 | Java 8 或 11 | 稳定成熟，生态完整 |
| 学习 | Java 17 | 现代特性全面 |

## Hello World 示例

```java
/**
 * Java Hello World 示例
 */
public class HelloWorld {
    /**
     * 程序入口方法
     * @param args 命令行参数
     */
    public static void main(String[] args) {
        // 输出 Hello World
        System.out.println("Hello, World!");

        // 输出带变量的消息
        String name = "Java 开发者";
        System.out.printf("你好，%s！\n", name);
    }
}
```

编译和运行：

```bash
# 编译
javac HelloWorld.java

# 运行
java HelloWorld

# 输出
Hello, World!
你好，Java 开发者！
```

## 前端开发者的学习优势

作为前端开发者，学习 Java 有以下优势：

1. **JavaScript 经验可复用**
   - 变量、函数、循环、条件语句
   - 异步编程（Promise vs Future/CompletableFuture）

2. **面向对象概念相通**
   - 类、继承、多态
   - ES6 Class 与 Java Class 对比

3. **模块化思想相通**
   - ES6 Modules vs Java Packages
   - npm vs Maven/Gradle

4. **TypeScript 类型系统有帮助**
   - 强类型编程思维
   - 泛型概念理解

---

## 下一篇

[安装与环境配置](./安装与环境配置.md)
