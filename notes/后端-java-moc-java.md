---
title: Java 知识体系
category: 后端
---
# Java 知识体系

> Java 服务端开发完整知识体系
>
> **学习路径**：
> - 📖 **入门**：Java 基础、语法特性
> - 🚀 **进阶**：面向对象、高级特性
> - 💡 **高级**：Spring 生态、企业架构

---

## 📚 知识体系

### 1. 基础入门（Foundation）

Java 的基础概念和语法。

#### Java 基础
- [Java 简介与特点](01-基础入门/Java-简介与特点.md)
- [安装与环境配置](01-基础入门/安装与环境配置.md)
- [基础语法](01-基础入门/基础语法.md)
- [数据类型与变量](01-基础入门/数据类型与变量.md)
- [控制结构](01-基础入门/控制结构.md)
- [函数与方法](01-基础入门/函数与方法.md)
- [数组与字符串](01-基础入门/数组与字符串.md)
- [异常处理](01-基础入门/异常处理.md)
- [IO 流](01-基础入门/IO流.md)

---

### 2. 面向对象（Object-Oriented）

Java 的面向对象编程特性。

#### OOP 核心
- [类与对象](02-面向对象/类与对象.md)
- [继承与多态](02-面向对象/继承与多态.md)
- [接口与抽象类](02-面向对象/接口与抽象类.md)
- [内部类](02-面向对象/内部类.md)
- [枚举](02-面向对象/枚举.md)
- [包与访问控制](02-面向对象/包与访问控制.md)

---

### 3. 高级特性（Advanced Features）

Java 的高级编程特性。

#### 集合框架
- [List 集合](03-高级特性/集合-List.md)
- [Set 集合](03-高级特性/集合-Set.md)
- [Map 集合](03-高级特性/集合-Map.md)
- [Collections 工具类](03-高级特性/集合-工具类.md)

#### 新特性（Java 8+）
- [Lambda 表达式](03-高级特性/Lambda表达式.md)
- [Stream API](03-高级特性/Stream-API.md)
- [Optional 类](03-高级特性/Optional类.md)
- [函数式接口](03-高级特性/函数式接口.md)

#### 元编程
- [反射](03-高级特性/反射.md)
- [注解](03-高级特性/注解.md)
- [泛型](03-高级特性/泛型.md)

---

### 4. Spring 核心（Spring Core）

Spring 框架的核心概念。

#### IoC 容器
- [IoC 控制反转](04-Spring核心/IoC控制反转.md)
- [依赖注入](04-Spring核心/依赖注入.md)
- [Bean 配置](04-Spring核心/Bean配置.md)
- [Bean 生命周期](04-Spring核心/Bean生命周期.md)
- [作用域](04-Spring核心/作用域.md)

#### AOP
- [AOP 面向切面](04-Spring核心/AOP面向切面.md)
- [切面定义](04-Spring核心/切面定义.md)
- [通知类型](04-Spring核心/通知类型.md)
- [切入点表达式](04-Spring核心/切入点表达式.md)

---

### 5. Spring Boot（Spring Boot）

Spring Boot 快速开发框架。

#### 快速开始
- [项目创建](05-Spring Boot/项目创建.md)
- [配置管理](05-Spring Boot/配置管理.md)
- [自动配置原理](05-Spring Boot/自动配置原理.md)
- [条件装配](05-Spring Boot/条件装配.md)

#### 核心功能
- [Profiles 环境配置](05-Spring Boot/Profiles环境配置.md)
- [配置绑定](05-Spring Boot/配置绑定.md)
- [日志配置](05-Spring Boot/日志配置.md)
- [自定义 Starter](05-Spring Boot/自定义Starter.md)

---

### 6. Spring MVC（Spring MVC）

Web 开发框架。

#### Web 基础
- [Controller 开发](06-Spring MVC/Controller开发.md)
- [请求映射](06-Spring MVC/请求映射.md)
- [参数绑定](06-Spring MVC/参数绑定.md)
- [返回值处理](06-Spring MVC/返回值处理.md)

#### 进阶功能
- [拦截器](06-Spring MVC/拦截器.md)
- [过滤器](06-Spring MVC/过滤器.md)
- [全局异常处理](06-Spring MVC/全局异常处理.md)
- [参数校验](06-Spring MVC/参数校验.md)
- [文件上传下载](06-Spring MVC/文件上传下载.md)
- [CORS 跨域配置](06-Spring MVC/CORS跨域配置.md)

---

### 7. 数据库操作（Database）

数据库访问技术。

#### JDBC
- [JDBC 基础](07-数据库操作/JDBC基础.md)
- [连接池](07-数据库操作/连接池.md)

#### MyBatis
- [MyBatis 入门](07-数据库操作/MyBatis入门.md)
- [Mapper 开发](07-数据库操作/Mapper开发.md)
- [动态 SQL](07-数据库操作/动态SQL.md)
- [MyBatis-Plus](07-数据库操作/MyBatis-Plus.md)

#### JPA
- [Spring Data JPA](07-数据库操作/Spring-Data-JPA.md)
- [实体映射](07-数据库操作/实体映射.md)
- [查询方法](07-数据库操作/查询方法.md)

#### 事务与缓存
- [事务管理](07-数据库操作/事务管理.md)
- [Redis 集成](07-数据库操作/Redis集成.md)
- [缓存注解](07-数据库操作/缓存注解.md)

---

### 8. 安全认证（Security）

安全与认证授权。

#### Spring Security
- [Spring Security 入门](08-安全认证/Spring-Security入门.md)
- [认证流程](08-安全认证/认证流程.md)
- [授权配置](08-安全认证/授权配置.md)

#### JWT
- [JWT 认证](08-安全认证/JWT认证.md)
- [JWT 工具类](08-安全认证/JWT工具类.md)

#### 权限模型
- [RBAC 权限模型](08-安全认证/RBAC权限模型.md)
- [OAuth2](08-安全认证/OAuth2.md)

---

### 9. 微服务与进阶（Microservices）

微服务架构与进阶技术。

#### Spring Cloud
- [服务注册与发现](09-微服务与进阶/服务注册与发现.md)
- [服务调用](09-微服务与进阶/服务调用.md)
- [网关](09-微服务与进阶/网关.md)
- [配置中心](09-微服务与进阶/配置中心.md)
- [熔断降级](09-微服务与进阶/熔断降级.md)

#### 消息队列
- [RabbitMQ 集成](09-微服务与进阶/RabbitMQ集成.md)
- [Kafka 集成](09-微服务与进阶/Kafka集成.md)

---

### 10. 实践项目（Practice Projects）

实战项目示例。

#### 基础项目
- [第一个 Spring Boot 项目](10-实践项目/第一个-Spring-Boot-项目.md)
- [RESTful API 实现](10-实践项目/RESTful-API实现.md)
- [用户认证服务](10-实践项目/用户认证服务.md)

#### 完整项目
- [博客系统](10-实践项目/博客系统.md)
- [任务管理系统](10-实践项目/任务管理系统.md)

---

## 🎯 学习路径

### 阶段一：Java 基础（1-2周）

1. Java 安装与环境配置
2. 基础语法与数据类型
3. 面向对象编程
4. 集合框架
5. 异常处理与 IO

### 阶段二：Java 高级（1-2周）

1. Lambda 表达式
2. Stream API
3. 泛型与反射
4. 注解

### 阶段三：Spring 核心（1-2周）

1. IoC 容器
2. 依赖注入
3. AOP 面向切面

### 阶段四：Spring Boot（1-2周）

1. 项目创建与配置
2. Spring MVC 开发
3. 数据库操作
4. 实战项目

### 阶段五：企业应用（持续学习）

1. 安全认证
2. 微服务架构
3. 消息队列
4. 性能优化

---

## 🔗 相关链接

### 前置知识
- [服务端知识体系](../服务端/README.md) — 服务端完整知识体系

### 进阶学习
- [Go 知识体系](../Go/!MOC-Go.md) — Go 语言完整体系
- [Nest.js 教程](../../Nest/README.md) — Nest.js 框架教程

### 官方资源
- [Java 官方文档](https://docs.oracle.com/en/java/)
- [Spring 官方文档](https://spring.io/projects/spring-framework)
- [Spring Boot 官方文档](https://spring.io/projects/spring-boot)

---

#java #服务端语言 #spring #springboot #backend
