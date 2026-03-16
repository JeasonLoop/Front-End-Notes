---
title: MyBatis 入门
category: 后端
---
# MyBatis 入门

## MyBatis 概述

MyBatis 是一款优秀的持久层框架，支持自定义 SQL、存储过程和高级映射。

```
MyBatis 架构
应用层 (Service)
    ↓
MyBatis 接口 (Mapper)
    ↓
MyBatis 核心 (SqlSession)
    ↓
JDBC
    ↓
数据库
```

## 快速开始

### 1. 添加依赖

```xml
<!-- pom.xml -->
<dependencies>
    <!-- MyBatis -->
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
        <version>3.5.13</version>
    </dependency>

    <!-- MySQL 驱动 -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.33</version>
    </dependency>

    <!-- Lombok (可选) -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.28</version>
        <scope>provided</scope>
    </dependency>
</dependencies>
```

### 2. 配置文件

```xml
<!-- resources/mybatis-config.xml -->
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <!-- 环境配置 -->
    <environments default="development">
        <environment id="development">
            <!-- 事务管理器 -->
            <transactionManager type="JDBC"/>
            <!-- 数据源 -->
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/mydb?useSSL=false&amp;serverTimezone=UTC"/>
                <property name="username" value="root"/>
                <property name="password" value="password"/>
            </dataSource>
        </environment>
    </environments>

    <!-- 映射器 -->
    <mappers>
        <mapper resource="mapper/UserMapper.xml"/>
    </mappers>
</configuration>
```

### 3. 实体类

```java
package com.example.entity;

import lombok.Data;

@Data
public class User {
    private Long id;
    private String name;
    private String email;
    private Integer age;
    private Date createTime;
}
```

### 4. Mapper 接口

```java
package com.example.mapper;

import com.example.entity.User;
import org.apache.ibatis.annotations.*;

import java.util.List;

public interface UserMapper {
    // 查询所有用户
    List<User> findAll();

    // 根据 ID 查询
    User findById(Long id);

    // 插入用户
    int insert(User user);

    // 更新用户
    int update(User user);

    // 删除用户
    int deleteById(Long id);

    // 根据姓名模糊查询
    List<User> findByNameLike(String name);
}
```

### 5. Mapper XML

```xml
<!-- resources/mapper/UserMapper.xml -->
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.example.mapper.UserMapper">

    <!-- 结果映射 -->
    <resultMap id="BaseResultMap" type="com.example.entity.User">
        <id column="id" property="id"/>
        <result column="name" property="name"/>
        <result column="email" property="email"/>
        <result column="age" property="age"/>
        <result column="create_time" property="createTime"/>
    </resultMap>

    <!-- 查询所有 -->
    <select id="findAll" resultMap="BaseResultMap">
        SELECT id, name, email, age, create_time
        FROM users
    </select>

    <!-- 根据 ID 查询 -->
    <select id="findById" resultMap="BaseResultMap">
        SELECT id, name, email, age, create_time
        FROM users
        WHERE id = #{id}
    </select>

    <!-- 插入 -->
    <insert id="insert" parameterType="com.example.entity.User"
            useGeneratedKeys="true" keyProperty="id">
        INSERT INTO users (name, email, age)
        VALUES (#{name}, #{email}, #{age})
    </insert>

    <!-- 更新 -->
    <update id="update" parameterType="com.example.entity.User">
        UPDATE users
        SET name = #{name},
            email = #{email},
            age = #{age}
        WHERE id = #{id}
    </update>

    <!-- 删除 -->
    <delete id="deleteById">
        DELETE FROM users WHERE id = #{id}
    </delete>

    <!-- 模糊查询 -->
    <select id="findByNameLike" resultMap="BaseResultMap">
        SELECT id, name, email, age, create_time
        FROM users
        WHERE name LIKE CONCAT('%', #{name}, '%')
    </select>

</mapper>
```

### 6. 使用示例

```java
package com.example;

import com.example.entity.User;
import com.example.mapper.UserMapper;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.List;

public class MyBatisDemo {
    public static void main(String[] args) throws IOException {
        // 1. 读取配置
        InputStream is = Resources.getResourceAsStream("mybatis-config.xml");

        // 2. 创建 SqlSessionFactory
        SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(is);

        // 3. 获取 SqlSession
        try (SqlSession session = factory.openSession()) {

            // 4. 获取 Mapper
            UserMapper mapper = session.getMapper(UserMapper.class);

            // 5. 查询所有用户
            List<User> users = mapper.findAll();
            System.out.println("所有用户:");
            users.forEach(System.out::println);

            // 6. 根据 ID 查询
            User user = mapper.findById(1L);
            System.out.println("\n用户 ID=1: " + user);

            // 7. 插入用户
            User newUser = new User();
            newUser.setName("新用户");
            newUser.setEmail("new@example.com");
            newUser.setAge(25);
            newUser.setCreateTime(new Date());

            mapper.insert(newUser);
            session.commit();  // 提交事务
            System.out.println("\n插入后 ID: " + newUser.getId());

            // 8. 更新用户
            newUser.setAge(30);
            mapper.update(newUser);
            session.commit();
            System.out.println("更新后: " + newUser);

            // 9. 模糊查询
            List<User> result = mapper.findByNameLike("新");
            System.out.println("\n包含'新'的用户:");
            result.forEach(System.out::println);

            // 10. 删除用户
            mapper.deleteById(newUser.getId());
            session.commit();
            System.out.println("已删除用户 ID: " + newUser.getId());
        }
    }
}
```

## 注解方式

```java
package com.example.mapper;

import com.example.entity.User;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface UserMapper {

    // 查询所有
    @Select("SELECT * FROM users")
    List<User> findAll();

    // 根据 ID 查询
    @Select("SELECT * FROM users WHERE id = #{id}")
    User findById(@Param("id") Long id);

    // 插入
    @Insert("INSERT INTO users (name, email, age) VALUES (#{name}, #{email}, #{age})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(User user);

    // 更新
    @Update("UPDATE users SET name = #{name}, email = #{email}, age = #{age} WHERE id = #{id}")
    int update(User user);

    // 删除
    @Delete("DELETE FROM users WHERE id = #{id}")
    int deleteById(@Param("id") Long id);

    // 动态 SQL（使用 Provider）
    @SelectProvider(type = UserSqlProvider.class, method = "findDynamic")
    List<User> findDynamic(@Param("name") String name, @Param("minAge") Integer minAge);
}

// SQL 提供者
class UserSqlProvider {
    public String findDynamic(@Param("name") String name, @Param("minAge") Integer minAge) {
        return new SQL() {{
            SELECT("*");
            FROM("users");
            if (name != null) {
                WHERE("name LIKE CONCAT('%', #{name}, '%')");
            }
            if (minAge != null) {
                WHERE("age >= #{minAge}");
            }
        }}.toString();
    }
}
```

## 动态 SQL

```xml
<!-- UserMapper.xml -->
<mapper namespace="com.example.mapper.UserMapper">

    <!-- if 条件 -->
    <select id="findUsers" resultType="com.example.entity.User">
        SELECT * FROM users
        WHERE 1=1
        <if test="name != null and name != ''">
            AND name LIKE CONCAT('%', #{name}, '%')
        </if>
        <if test="minAge != null">
            AND age >= #{minAge}
        </if>
        <if test="maxAge != null">
            AND age <= #{maxAge}
        </if>
    </select>

    <!-- choose (switch) -->
    <select id="findUsersByCondition" resultType="com.example.entity.User">
        SELECT * FROM users
        <where>
            <choose>
                <when test="id != null">
                    id = #{id}
                </when>
                <when test="name != null and name != ''">
                    name LIKE CONCAT('%', #{name}, '%')
                </when>
                <otherwise>
                    age > 18
                </otherwise>
            </choose>
        </where>
    </select>

    <!-- where (自动处理 AND/OR) -->
    <select id="findUsersWhere" resultType="com.example.entity.User">
        SELECT * FROM users
        <where>
            <if test="name != null">
                AND name = #{name}
            </if>
            <if test="email != null">
                AND email = #{email}
            </if>
        </where>
    </select>

    <!-- set (自动处理逗号) -->
    <update id="updateSelective" parameterType="com.example.entity.User">
        UPDATE users
        <set>
            <if test="name != null">
                name = #{name},
            </if>
            <if test="email != null">
                email = #{email},
            </if>
            <if test="age != null">
                age = #{age},
            </if>
        </set>
        WHERE id = #{id}
    </update>

    <!-- foreach (批量操作) -->
    <select id="findByIds" resultType="com.example.entity.User">
        SELECT * FROM users
        WHERE id IN
        <foreach collection="ids" item="id" open="(" close=")" separator=",">
            #{id}
        </foreach>
    </select>

    <!-- 批量插入 -->
    <insert id="batchInsert">
        INSERT INTO users (name, email, age) VALUES
        <foreach collection="users" item="user" separator=",">
            (#{user.name}, #{user.email}, #{user.age})
        </foreach>
    </insert>

</mapper>
```

## 关联查询

```xml
<!-- 一对一关联 -->
<resultMap id="UserWithOrderMap" type="com.example.entity.User">
    <id column="user_id" property="id"/>
    <result column="user_name" property="name"/>
    <!-- association 关联一个对象 -->
    <association property="order" javaType="com.example.entity.Order">
        <id column="order_id" property="id"/>
        <result column="order_no" property="orderNo"/>
    </association>
</resultMap>

<select id="findUserWithOrder" resultMap="UserWithOrderMap">
    SELECT u.id as user_id, u.name as user_name,
           o.id as order_id, o.order_no as order_no
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    WHERE u.id = #{id}
</select>

<!-- 一对多关联 -->
<resultMap id="UserWithOrdersMap" type="com.example.entity.User">
    <id column="user_id" property="id"/>
    <result column="user_name" property="name"/>
    <!-- collection 关联集合 -->
    <collection property="orders" ofType="com.example.entity.Order">
        <id column="order_id" property="id"/>
        <result column="order_no" property="orderNo"/>
    </collection>
</resultMap>

<select id="findUserWithOrders" resultMap="UserWithOrdersMap">
    SELECT u.id as user_id, u.name as user_name,
           o.id as order_id, o.order_no as order_no
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    WHERE u.id = #{id}
</select>
```

---

## 下一篇

[动态SQL](./动态SQL.md)
